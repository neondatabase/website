---
title: Neon CLI — Install and connect
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-11-08T18:42:10.264Z'
---

This section describes how to install the Neon CLI and connect via web authentication or API key.

<Tabs labels={["npm", "Homebrew", "Binary"]}>

<TabItem>

To install the Neon CLI via [npm](https://www.npmjs.com/package/neonctl):

```shell
npm i -g neonctl
```

Requires [Node.js 18.0](https://nodejs.org/en/download/) or higher.


</TabItem>

<TabItem>

To install the Neon CLI with [Homebrew](https://formulae.brew.sh/formula/neonctl)

```bash
brew install neonctl
```

</TabItem>

<TabItem>

To install a binary:

- **macOS**

    Download the macOS binary: 

    ```bash
    curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-macos -o neonctl
    ```

    No installation is required. Run the Neon CLI as follows:

    ```bash
    neonctl <command> [options]
    ```

- **Linux**

    Download the Linux binary: 

    ```bash
    curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux -o neonctl
    ```

    No installation is required. Run the Neon CLI as follows:

    ```bash
    neonctl <command> [options]
    ```

- **Windows**

    Download the Windows binary:

    ```bash
    curl -sL -O https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-win.exe
    ```

    No installation is required. Run the Neon CLI as follows:

    ```bash
    neonctl-win.exe <command> [options]
    ```

</TabItem>

</Tabs>


### Upgrade

When a new version is released, you can update your Neon CLI using the same installation methods described above. To check the latest version, refer to the **Releases** information on the [Neon CLI GitHub repository](https://github.com/neondatabase/neonctl) page. To check your installed Neon CLI version, run the folliowing command:

```bash
neonctl --version
```

## Connect

The Neon CLI supports connecting via web authentication or API key.

### Web authentication

Run the following command to connect to Neon via web authentication:

```bash
neonctl auth
```

The [neonctl auth](/docs/reference/cli-auth) command launches a browser window where you can authorize the Neon CLI to access your Neon account. If you have not authenticated previously, running a Neon CLI command automatically launches the web authentication process unless you have specified an API key.

### API key

To authenticate with a Neon API key, you can specify the `--api-key` option when running a Neon CLI command. For example, the following `neonctl projects list` command authenticates to Neon using the `--api-key` option:

```bash
neonctl projects list --api-key <neon_api_key>
```

To avoid including the `--api-key` option with each CLI command, you can export your API key to the `NEON_API_KEY` environment variable.

```bash
export NEON_API_KEY=<neon_api_key>
```

For information about obtaining an Neon API key, see [Create an API key](https://neon.tech/docs/manage/api-keys#create-an-api-key).

## Configure autocompletion

The Neon CLI supports autocompletion, which you can configure in a few easy steps. See [Neon CLI commands — completion](/docs/reference/cli-completion) for instructions.
