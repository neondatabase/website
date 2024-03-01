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

To install the Neon CLI with [Homebrew](https://formulae.brew.sh/formula/neonctl):

```bash
brew install neonctl
```

</TabItem>

<TabItem>

To install a [binary](https://github.com/neondatabase/neonctl/releases):

- **macOS**

    Download the macOS binary:

    ```bash shouldWrap
    curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-macos -o neonctl
    ```

    No installation is required. Run the Neon CLI as follows:

    ```bash
    neonctl <command> [options]
    ```

- **Linux**

    Download the Linux binary:

    ```bash shouldWrap
    curl -sL https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-linux -o neonctl
    ```

    No installation is required. Run the Neon CLI as follows:

    ```bash
    neonctl <command> [options]
    ```

- **Windows**

    Download the Windows binary:

    ```bash shouldWrap
    curl -sL -O https://github.com/neondatabase/neonctl/releases/latest/download/neonctl-win.exe
    ```

    No installation is required. Run the Neon CLI as follows:

    ```bash
    neonctl-win.exe <command> [options]
    ```

</TabItem>

</Tabs>
