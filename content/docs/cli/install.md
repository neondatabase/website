---
title: 'Neon CLI: Install and connect'
subtitle: Install the Neon CLI and connect with web auth or API key
summary: >-
  Install the Neon CLI (neonctl) on macOS, Windows, or Linux via Homebrew, npm,
  bun, or standalone binary, with no-install options via npx or bunx. After
  installing, connect by running `neonctl auth` for browser-based authentication,
  or set the NEON_API_KEY environment variable or pass --api-key per command.
  Vercel-Managed Integration users must use an API key because web auth requires
  a Neon-registered account.
enableTableOfContents: true
updatedOn: '2026-06-11T23:50:21.258Z'
redirectFrom:
  - /docs/reference/cli-install
---

## Install

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
curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-macos-x64 -o neonctl
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
curl -sL -O https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-win-x64.exe
```

Run the CLI from the download directory:

```bash
neonctl-win-x64.exe <command> [options]
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
You can run the Neon CLI without installing it using **npx** or the `bun` equivalent, **bunx**:

```shell
# npx
npx neonctl <command>

# bunx
bunx neonctl <command>
```

</Admonition>

### Upgrade

Upgrade using the method that matches how you installed the CLI. To check for the latest version, see the **Releases** page on the [Neon CLI GitHub repository](https://github.com/neondatabase/neonctl). To check your installed version, run:

```bash
neonctl --version
```

<Tabs labels={["npm", "Homebrew", "Binary"]}>

<TabItem>

```shell
npm update -g neonctl
```

</TabItem>

<TabItem>

```bash
brew upgrade neonctl
```

</TabItem>

<TabItem>

To upgrade a [binary](https://github.com/neondatabase/neonctl/releases) version, download the `latest` binary as described in the install instructions above, and replace your old binary with the new one.

</TabItem>

</Tabs>

In CI/CD tools like GitHub Actions, you can safely pin the Neon CLI to `latest`, as we prioritize stability for CI/CD processes.

<Tabs labels={["npm", "Homebrew", "Binary"]}>

<TabItem>

In your GitHub Actions workflow, use the `latest` tag with `npm`:

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

If you're downloading a binary, reference the latest release from the [Releases page](https://github.com/neondatabase/neonctl/releases) using `curl` or `wget` in your workflow:

```yaml
- name: Install Neon CLI
  run: |
    curl -L https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux-x64 -o /usr/local/bin/neonctl
    chmod +x /usr/local/bin/neonctl
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

The [neonctl auth](/docs/cli/auth) command launches a browser window where you can authorize the Neon CLI to access your Neon account. If you haven't authenticated previously, running any Neon CLI command launches the web authentication process automatically unless you've specified an API key.

<Admonition type="note">
If you use Neon through the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration), you must authenticate connections from the CLI client using a Neon API key (see below). The `neonctl auth` command requires an account registered through Neon rather than Vercel.
</Admonition>

### API key

To authenticate with a Neon API key, specify the `--api-key` option when running a Neon CLI command:

```bash
neonctl projects list --api-key <neon_api_key>
```

To avoid including `--api-key` with each command, export your API key to the `NEON_API_KEY` environment variable.

```bash
export NEON_API_KEY=<neon_api_key>
```

For information about obtaining a Neon API key, see [Creating API keys](/docs/manage/api-keys#creating-api-keys).

## Configure autocompletion

The Neon CLI supports autocompletion. See [Neon CLI commands: completion](/docs/cli/completion) to set it up.
