# Shipping native binaries with a Function

The default deploy bundles `source` into a single `index.mjs` with esbuild. A compiled binary cannot be inlined into that file, so it has to ship as a separate file in the deploy archive. There are three ways to put it there. Pick by what the binary is:

| The binary is                                                                              | Use                                                            |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| An npm package backed by a Node-API addon (`sharp`, most `@napi-rs/*` packages)             | [`externalPackages`](#externalpackages-npm-packages-with-a-node-addon) |
| A file your own build step produces: a `.node` addon, a `.so`, a `.wasm`, model weights    | [`bundler: "none"`](#bundler-none-ship-a-prebuilt-directory) or a [custom `bundler`](#custom-bundler-return-the-file-map) |
| A standalone executable you spawn (`ffmpeg`, a Go or Rust CLI)                              | A custom `bundler` or `"none"`, plus [a copy to `/run` at startup](#standalone-executables) |

The examples use top-level `functions`, which needs `neon` CLI 4.20 or newer and `@neon/config` 1.6 or newer.

## The runtime a binary lands on

- **linux, arm64, glibc**, Node.js 24. A binary built for macOS or x64 cannot load there.
- The archive is extracted to `/opt/function`, a read-only filesystem. `import.meta.url` in the root `index.mjs` points there, so `new URL("./bin/tool", import.meta.url)` resolves to `/opt/function/bin/tool`.
- **Every file arrives with mode `644`.** Unix permission bits in the zip are dropped on extraction, and `chmod` in place fails with `EROFS`. A `.node` or `.so` loads fine (it is `dlopen`ed, not executed). Spawning a file from `/opt/function` fails with `EACCES`.
- `/tmp` is writable and mounted `noexec`: a copied binary still fails with `EACCES` after `chmod 755`.
- `/run` is a writable tmpfs that allows exec (about 990 MiB, backed by the function's 2048 MiB of memory).

The filesystem layout is observed behavior, not documented by Neon. Re-check it if spawning starts failing.

## `externalPackages`: npm packages with a Node addon

```typescript
// neon.ts
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    resize: {
      name: "Resize",
      source: "./src/resize.ts",
      externalPackages: ["sharp"],
    },
  },
});
```

esbuild leaves `import sharp from "sharp"` unresolved. At deploy, the CLI installs the version of `sharp` from your project with `npm install --cpu=arm64 --os=linux --libc=glibc --ignore-scripts` into a temp directory, traces the files it reaches with `@vercel/nft`, and copies them into the archive under `node_modules/` with the tree layout intact. Only the installed version is read from your `node_modules`; the shipped files come from the temp install, and your `node_modules` is not modified.

The deploy fails with a named error when:

- the package is not installed in your project (no version to pin)
- the declared package itself does not install for linux-arm64 glibc (`EBADPLATFORM`)
- a staged `.node` or `.so` is not an AArch64 ELF binary
- `npm` is not on `PATH`
- the archive exceeds the [size limits](#size-limits)

It does not fail when a platform-specific optional dependency is silently skipped, or when a package that compiles from source at install time ships no binary (the staging install runs with `--ignore-scripts`). Those deploy and then fail at invoke. Use packages that publish a linux-arm64 glibc prebuild (`sharp` does), and invoke the deployed function once to confirm the addon loads.

A deploy and `neon dev` print an advisory warning for any bundled package that carries native code and is not declared. A package with a working JavaScript fallback (`ws` with `bufferutil`) triggers it too and needs no change. Do not silence it with `{ name, includeFiles: false }`: that externalizes the package and ships nothing, so a reached import throws `Cannot find module` on every invoke. `includeFiles: false` is only for an import the function never evaluates.

Under `neon dev`, the package is only kept out of the bundle and resolves from your own `node_modules` for your host.

Pros: one line in `neon.ts`; the target-platform install, file tracing, arch check, and size check are automatic; local dev uses your host build.

Cons: only for npm packages that publish a linux-arm64 glibc prebuild; transitive pins, overrides, and patches from your lockfile are not carried into the staged install; esbuild bundler only (`externalPackages` with `bundler: "none"` or a function fails validation).

## `bundler: "none"`: ship a prebuilt directory

Run your own build, then point `source` at its output. The directory root must contain `index.mjs` or `index.js`. Everything else in the directory ships as-is:

```text
dist/fn/
  index.mjs        # built by your step, reads ./native/addon.node
  native/addon.node
```

```typescript
// neon.ts
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    api: { name: "API", source: "./dist/fn", bundler: "none" },
  },
});
```

```bash
npm run build:fn && neon deploy --env .env.local
neon functions deploy api --src dist/fn --no-bundle   # same thing, without neon.ts
```

`neon deploy` does not run your build step. Run it first, or use a [custom `bundler`](#custom-bundler-return-the-file-map) to keep the build inside `neon deploy`.

Pros: works with any build tool or framework output (`.mastra/output` is the common one); full control over the archive layout.

Cons: no architecture check, so a binary built for your laptop deploys and then fails at invoke; the build step is yours to keep in sync with `neon deploy`; TypeScript cannot ship unbundled.

## Custom `bundler`: return the file map

An inline function in `neon.ts` returns archive paths mapped to bytes. `neon deploy` zips the map, and `neon dev` serves the same map locally:

```typescript
// neon.ts
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    transcode: {
      name: "Transcode",
      source: "./src/transcode.ts",
      bundler: async (fn) => {
        const out = await build({
          entryPoints: [fn.source],
          bundle: true,
          platform: "node",
          format: "esm",
          write: false,
          outfile: "index.mjs",
          // CommonJS dependencies call require(); ESM output has none in scope.
          banner: {
            js: "import{createRequire}from'module';const require=createRequire(import.meta.url);",
          },
        });
        return {
          "index.mjs": out.outputFiles[0].contents,
          "bin/ffmpeg": new Uint8Array(
            await readFile(new URL("./vendor/linux-arm64/ffmpeg", import.meta.url)),
          ),
        };
      },
    },
  },
});
```

`esbuild` must be a dependency of your project. The map needs `index.mjs` or `index.js` at the root.

Pros: the build lives in `neon.ts`, so `neon deploy` and `neon dev` always build the same thing; any file from anywhere can go in the archive.

Cons: no architecture check; `externalPackages` cannot be combined with it, so an npm addon has to be copied into the map by hand, with its `node_modules/` layout.

## Standalone executables

Ship the executable with a custom `bundler` or `bundler: "none"`, then copy it to `/run` and mark it executable once per isolate:

```typescript
// src/transcode.ts
import { execFile } from "node:child_process";
import { chmod, copyFile, mkdir } from "node:fs/promises";
import { promisify } from "node:util";

const run = promisify(execFile);

let ffmpeg: Promise<string> | undefined;
function ffmpegPath(): Promise<string> {
  if (process.env.FFMPEG_PATH) return Promise.resolve(process.env.FFMPEG_PATH);
  ffmpeg ??= (async () => {
    await mkdir("/run/bin", { recursive: true });
    await copyFile(new URL("./bin/ffmpeg", import.meta.url), "/run/bin/ffmpeg");
    await chmod("/run/bin/ffmpeg", 0o755);
    return "/run/bin/ffmpeg";
  })();
  return ffmpeg;
}

export default {
  async fetch() {
    const { stdout } = await run(await ffmpegPath(), ["-version"]);
    return new Response(stdout);
  },
};
```

`neon dev` runs this code on your machine, where `/run` may not exist and a linux-arm64 binary cannot execute. Point it at a host install from the shell, and leave `FFMPEG_PATH` out of the function's deployed `env`:

```bash
FFMPEG_PATH="$(command -v ffmpeg)" neon dev
```

The binary must be statically linked, or its shared libraries must exist in the runtime image. The copy costs memory: `/run` is RAM-backed and counts against the function's 2048 MiB.

## Size limits

`bundler: "none"`, a custom `bundler`, and `externalPackages` staging check the archive before upload:

| Limit                    | Value   |
| ------------------------ | ------- |
| Compressed zip           | 10 MiB  |
| Total uncompressed bytes | 64 MiB  |
| Files in the archive     | 4,096   |

Exceeding one fails the deploy. The byte-limit errors list the four largest files. Check an executable's size before building around it: a single static binary can use most of the 64 MiB.
