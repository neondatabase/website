---
title: Neon CLI — Install and connect
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.077Z'
---

This section describes how to install the Neon CLI and connect via web authentication or API key.

<Tabs labels={["macOS", "Windows", "Linux"]}>

<TabItem>

**Install with [Homebrew](https://formulae.brew.sh/formula/neonctl)**

```bash
brew install neonctl
```

**Install via [npm](https://www.npmjs.com/package/neonctl)**

```shell
npm i -g neonctl
```

Requires [Node.js 18.0](https://nodejs.org/en/download/) or higher.

**Install with bun**

```bash
bun install -g neonctl
```

**macOS binary**

Download the binary. No installation required.

```bash shouldWrap
curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-macos -o neonctl
```

Run the CLI from the download directory:

```bash
neonctl <command> [options]
```

</TabItem>

<TabItem>

**Install via [npm](https://www.npmjs.com/package/neonctl)**

```shell
npm i -g neonctl
```

Requires [Node.js 18.0](https://nodejs.org/en/download/) or higher.

**Install with bun**

```bash
bun install -g neonctl
```

**Windows binary**

Download the binary. No installation required.

```bash shouldWrap
curl -sL -O https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-win.exe
```

Run the CLI from the download directory:

```bash
neonctl-win.exe <command> [options]
```

</TabItem>

<TabItem>

**Install via [npm](https://www.npmjs.com/package/neonctl)**

```shell
npm i -g neonctl
```

**Install with bun**

```bash
bun install -g neonctl
```

**Linux binary**

Download the x64 or ARM64 binary, depending on your processor type. No installation required.

x64:

```bash shouldWrap
curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux-x64 -o neonctl
```

ARM64:

```bash shouldWrap
 curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux-arm64 -o neonctl
```

Run the CLI from the download directory:

```bash
neonctl <command> [options]
```

</TabItem>

</Tabs>

<Admonition title="Use the Neon CLI without installing" type="note">
You can run the Neon CLI without installing it using **npx** (Node Package eXecute) or the `bun` equivalent, **bunx**. For example:

```shell
# npx
npx neonctl <command>

# bunx
bunx neonctl <command>
```

</Admonition>

### Upgrade

When a new version is released, you can update your Neon CLI using the methods described below, depending on how you installed the CLI initially. To check for the latest version, refer to the **Releases** information on the [Neon CLI GitHub repository](https://github.com/neondatabase/neonctl) page. To check your installed version of the Neon CLI, run the following command:

```bash
neon --version
```

<Tabs labels={["npm", "Homebrew", "Binary"]}>

<TabItem>

To upgrade the Neon CLI via [npm](https://www.npmjs.com/package/neonctl):

```shell
npm update -g neonctl
```

</TabItem>

<TabItem>

To upgrade the Neon CLI with [Homebrew](https://formulae.brew.sh/formula/neonctl):

```bash
brew upgrade neonctl
```

</TabItem>

<TabItem>

To upgrade a [binary](https://github.com/neondatabase/neonctl/releases) version, download the `latest` binary as described in the install instructions above, and replace your old binary with the new one.

</TabItem>

</Tabs>

If you're using the Neon CLI in CI/CD tools like GitHub Actions, you can safely pin the Neon CLI to `latest`, as we prioritize stability for CI/CD processes. 

<Tabs labels={["npm", "Homebrew", "Binary"]}>

<TabItem>

In your GitHub Actions workflow, you can use the `latest` tag with `npm`:

```yaml
- name: Install Neon CLI
  run: npm install -g neonctl@latest
```

</TabItem>

<TabItem>

Homebrew automatically fetches the latest version when running the `install` or `upgrade` command. You can include the following in your workflow:

```yaml
- name: Install Neon CLI
  run: brew install neonctl || brew upgrade neonctl
```

</TabItem>

<TabItem>

If you're downloading a binary, reference the latest release from the [Releases page](https://github.com/neondatabase/neonctl/releases). For example, you can use `curl` or `wget` in your workflow:

```yaml
- name: Install Neon CLI
  run: |
    curl -L https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux-amd64 -o /usr/local/bin/neon
    chmod +x /usr/local/bin/neon
```

</TabItem>

</Tabs>

## Connect

The Neon CLI supports connecting via web authentication or API key.

### Web authentication

Run the following command to connect to Neon via web authentication:

```bash
neonctl auth
```

The [neonctl auth](/docs/reference/cli-auth) command launches a browser window where you can authorize the Neon CLI to access your Neon account. If you have not authenticated previously, running a Neon CLI command automatically launches the web authentication process unless you have specified an API key.

### API key

To authenticate with a Neon API key, you can specify the `--api-key` option when running a Neon CLI command. For example, the following `neon projects list` command authenticates to Neon using the `--api-key` option:

```bash
neon projects list --api-key <neon_api_key>
```

To avoid including the `--api-key` option with each CLI command, you can export your API key to the `NEON_API_KEY` environment variable.

```bash
export NEON_API_KEY=<neon_api_key>
```

For information about obtaining an Neon API key, see [Create an API key](/docs/manage/api-keys#create-an-api-key).

## Configure autocompletion

The Neon CLI supports autocompletion, which you can configure in a few easy steps. See [Neon CLI commands — completion](/docs/reference/cli-completion) for instructions.
