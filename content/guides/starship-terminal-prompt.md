---
title: 'Customize your terminal prompt with Starship and Neon'
subtitle: 'Learn how to set up Starship, a cross-shell prompt, and add a custom module to display your active Neon database branch.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-07-12T00:00:00.000Z'
updatedOn: '2026-07-13T09:46:56.488Z'
---

Traditional shell prompt customization means wrestling with complex, shell-specific syntax: Zsh has its own prompt expansion rules, Bash uses the cryptic `PS1` escape sequences, and PowerShell relies on a completely different `prompt` function. Each shell requires a different approach, and moving between them often means rewriting everything from scratch.

[Starship](https://starship.rs) solves this by standardizing prompt configuration across every shell through a single, friendly TOML file. Written in Rust, it runs on Zsh, Bash, Fish, PowerShell, and more, using the same config everywhere. Instead of a fixed prompt, Starship is built from small, independent modules: each module displays a piece of context only when it's relevant to the current directory. For example, the Git module shows your branch when you're inside a repository, and language modules show runtime versions when they detect matching project files like `package.json` or `requirements.txt`. You can enable, disable, reorder, and restyle these modules to build a prompt that fits your workflow.

Beyond the built-in modules, Starship lets you define custom modules that run an arbitrary command and render its output. That makes it straightforward to surface information that isn't covered by default. When you work with Git branches and Neon database branches in the same terminal, it helps to see at a glance which Neon branch your local development is connected to, so you don't accidentally run commands against the wrong environment. By configuring a custom Starship module, you can query the Neon CLI to show the active database branch alongside the Git branch.

In this guide, you'll set up Starship and build a custom module that detects and displays your active Neon branch using the Neon CLI. You'll cover:

- Installing Starship and wiring it into Zsh, Bash, Fish, or PowerShell
- Customizing your prompt layout and configuring modules
- Building a custom Starship module that reads your active Neon branch

## Prerequisites

To follow along with this guide, you will need:

- **Neon account and project:** Sign up for a free [Neon account](https://console.neon.tech/signup) if you don't have one.
- **Neon CLI (neon):** Version `2.28.0` or higher installed globally:
  ```bash
  npm install -g neon@latest
  ```
  Checkout the [Neon CLI documentation](/docs/cli/install) for installation instructions using other package managers and OS distributions (Homebrew, Windows etc.).
- **A Nerd Font:** Starship uses special glyphs and icons that require a patched developer font. Install a font like [FiraCode Nerd Font](https://www.nerdfonts.com/font-downloads) or [Hack Nerd Font](https://www.nerdfonts.com/font-downloads) and configure your terminal to use it.

Follow the steps below to install Starship, configure it for your shell, and set up a custom module that displays your active Neon branch in the terminal prompt.

<Steps>

## Install Starship

Install the Starship binary using your operating system's package manager.

<Tabs labels={["macOS", "Linux", "Windows"]}>

<TabItem>

Install Starship using Homebrew:

```bash
brew install starship
```

Alternatively, use the official install script:

```bash
curl -sS https://starship.rs/install.sh | sh
```

</TabItem>

<TabItem>

Install the latest version using the official install script:

```bash
curl -sS https://starship.rs/install.sh | sh
```

Or use your distribution's package manager:

```bash
# Arch Linux
pacman -S starship

# Debian / Ubuntu
apt install starship

# Alpine Linux
apk add starship
```

</TabItem>

<TabItem>

Install Starship using one of the following Windows package managers:

```powershell
# winget
winget install --id Starship.Starship

# Scoop
scoop install starship

# Chocolatey
choco install starship
```

</TabItem>

</Tabs>

Follow the [official Starship installation guide](https://starship.rs/guide/#step-1-install-starship) for additional installation options.

Verify the installation succeeded by checking the version:

```bash
starship --version
```

## Initialize Starship in your shell

Add the Starship initialization script to your shell's configuration file so it loads automatically on every new session.

<Tabs labels={["Zsh", "Bash", "Fish", "PowerShell"]}>

<TabItem>

Append the following line to `~/.zshrc`:

```bash
eval "$(starship init zsh)"
```

</TabItem>

<TabItem>

Append the following line to `~/.bashrc`:

```bash
eval "$(starship init bash)"
```

</TabItem>

<TabItem>

Append the following line to `~/.config/fish/config.fish`:

```fish
starship init fish | source
```

</TabItem>

<TabItem>

Append the following line to your PowerShell profile (find the path by running `$PROFILE`):

```powershell
Invoke-Expression (&starship init powershell)
```

</TabItem>

</Tabs>

Check the [official Starship shell integration guide](https://starship.rs/guide/#step-2-set-up-your-shell-to-use-starship) for additional shell options.

After updating your configuration, reload the shell environment to see Starship in action. If you have AWS CLI or Git repositories in your current directory, you should see the corresponding modules appear in your prompt.
![Starship demo](https://raw.githubusercontent.com/starship/starship/main/media/demo.gif)

## Customize the Starship configuration

All Starship configuration lives in a single TOML file: `~/.config/starship.toml`. If it doesn't exist yet, create it:

```bash
mkdir -p ~/.config && touch ~/.config/starship.toml
```

Starship uses **modules** (like `git_branch`, `nodejs`, `python`) that only appear when their context is detected. For example, language modules only render when corresponding project files (like `package.json` or `requirements.txt`) exist in the current directory.

The following example configuration shows how to customize the prompt symbol, directory display, Git branch and status indicators, and command execution time. You can copy this into your `~/.config/starship.toml` file and modify it to your liking.

```toml
"$schema" = 'https://starship.rs/config-schema.json'

# Don't print a new line at the start of the prompt
add_newline = false

# Customize the prompt symbol
[character]
success_symbol = "[➜](bold green)"
error_symbol = "[✗](bold red)"

# Customize directory display
[directory]
truncation_length = 3        # Show only the last 3 directories
truncate_to_repo = true      # Truncate to the root of the Git repo

# Customize Git branch display
[git_branch]
symbol = "🌱 "
format = "on [$symbol$branch]($style) "
style = "bold purple"

# Show Git status indicators
[git_status]
format = '([\[$all_status$ahead_behind\]]($style) )'
style = "bold red"

# Show command execution time for long-running commands
[cmd_duration]
min_time = 2_000             # Show only if command took > 2 seconds
format = "took [$duration]($style) "
```

Alternatively, you can use one of the prebuilt Starship presets to quickly configure your prompt. The following table lists some popular presets, whether they require a Nerd Font, and the command to apply them:

| Preset                | Requires Nerd Font | Command                                                        |
| :-------------------- | :----------------- | :------------------------------------------------------------- |
| **Pastel Powerline**  | ✅ Yes             | `starship preset pastel-powerline -o ~/.config/starship.toml`  |
| **Tokyo Night**       | ✅ Yes             | `starship preset tokyo-night -o ~/.config/starship.toml`       |
| **Gruvbox Rainbow**   | ✅ Yes             | `starship preset gruvbox-rainbow -o ~/.config/starship.toml`   |
| **Nerd Font Symbols** | ✅ Yes             | `starship preset nerd-font-symbols -o ~/.config/starship.toml` |
| **No Nerd Font**      | ❌ No              | `starship preset no-nerd-font -o ~/.config/starship.toml`      |

You can browse all presets visually on the [Starship Presets page](https://starship.rs/presets/). For example, the Gruvbox Rainbow preset looks like this:

![Gruvbox Rainbow preset](https://starship.rs/presets/img/gruvbox-rainbow.png)

## Define the custom Neon branch module

If you use [Neon database branching](/docs/introduction/branching) to create isolated database environments for development and testing, you will frequently switch branches.

By using Starship's [custom commands](https://starship.rs/config/#custom-commands), you can run a shell command and display its output dynamically. You can query the Neon CLI's `neon status --current-branch` command to render the active database branch.

Append the following configuration block to your `~/.config/starship.toml`:

```toml filename="~/.config/starship.toml"
# other Starship configuration ...

[custom.neon]
description = "Current Neon branch"
command = "neon status --current-branch"   # reads the branch pinned in .neon
when = "neon status --current-branch"       # only shows the segment if a branch is active
symbol = "🌿 "
style = "bold green"
format = "[$symbol$output]($style) "
```

<Admonition type="note" title="How this works">
The `command` field runs `neon status --current-branch`, which reads the local `.neon` file in your directory to find the pinned branch name. Because it checks local files, it makes **no network requests**. The `when` field uses the same command as a check: if the command exits non-zero (indicating no branch is pinned or you are outside a linked project), the module remains hidden.
</Admonition>

If you have a custom top-level `format` string defined in your `starship.toml`, make sure to add `${custom.neon}` where you want the branch indicator to appear (e.g., right after `$git_branch`). If no custom `format` is defined, Starship renders custom modules automatically at the end of the prompt.

## Optimize the module with a tree-walk condition

The `when` check defined above invokes the Neon CLI on every single prompt render (~25ms execution time). Although fast, you can optimize this overhead to absolute zero outside of Neon projects by using a pure-shell script.

Replace the `[custom.neon]` block in your `~/.config/starship.toml` with this optimized version:

```toml filename="~/.config/starship.toml"
# other Starship configuration ...

[custom.neon]
description = "Current Neon branch"
command = "neon status --current-branch"
symbol = "🌿 "
style = "bold green"
format = "[$symbol$output]($style) "
shell = ["sh"]
when = '''
d="$PWD"
while [ "$d" != "$HOME" ] && [ "$d" != / ]; do
  if [ -e "$d/.neon" ]; then
    neon status --current-branch >/dev/null 2>&1
    exit $?
  fi
  d=$(dirname "$d")
done
exit 1
'''
```

This configuration walks up the directory tree looking for a `.neon` file. It only runs the Neon CLI if it finds one, ensuring prompt rendering remains instantaneous in non-Neon projects.

## Link your project and verify

To verify the integration, navigate to a project linked to a Neon database.

1. Navigate to your local project directory:
   ```bash
   cd /path/to/your-neon-project
   ```
2. Link the directory to your Neon project and checkout a branch:
   > Create a new Neon project or link an existing one when prompted
   ```bash
   neon link
   neon checkout dev/feature-auth
   ```
3. Look at your terminal prompt. You should see the active branch indicator next to your Git details:
   ```text
   on 🌱 main 🌿 dev/feature-auth ➜
   ```
4. Navigate out of the project directory. The Neon segment should disappear instantly:
   ```bash
   cd ~
   ```

</Steps>

## Troubleshooting

If your custom Neon prompt isn't rendering correctly, check these common troubleshooting steps:

- **Symbols display as boxes or `?`**: Your terminal font is missing the required glyphs. Make sure you have installed a [Nerd Font](https://www.nerdfonts.com/) **and** updated your terminal emulator's font setting to use it. Open the settings for your specific terminal (VS Code: `terminal.integrated.fontFamily`, iTerm2: Profiles > Text > Font, Windows Terminal: `fontFace` in your profile) and set it to the Nerd Font you installed. Alternatively, use the `no-nerd-font` preset:
  ```bash
  starship preset no-nerd-font -o ~/.config/starship.toml
  ```
- **Prompt feels slow inside projects**: Ensure you have installed Neon CLI version `2.28.0` or higher, which includes a fast path for checking branch status. Ensure you are using the [tree-walk optimization script](#optimize-the-module-with-a-tree-walk-condition).
- **The Neon branch segment does not appear**: Confirm that your project directory is correctly linked by checking for a `.neon` file. Run `neon status --current-branch` manually to verify the CLI returns your active branch.
- **`neon: command not found`**: Ensure that the Neon CLI is installed globally (`npm install -g neon@latest`) and that your global npm binary directory is included in your system's `PATH`.
- **Bare branch icon with no branch name**: Make sure the `when` condition is properly configured. If the `when` line is missing, the module may render even when the CLI returns an empty value.

## Summary

Terminal prompts don’t have to be static or limited. With Starship and Neon, you can build a responsive, context‑aware development environment that adapts to your workflow. By adding a custom module that queries the Neon CLI, your active database branch appears directly alongside your Git branch reducing the risk of running commands against the wrong environment and keeping critical context visible at all times.

Displaying your Git branch and Neon database branch side‑by‑side minimizes context switching, eliminates repetitive status checks, and creates a safer, more efficient setup for database‑backed development.

## Resources

- [Starship Official Documentation](https://starship.rs/guide/)
- [Starship Configuration Reference](https://starship.rs/config/)
- [Starship Presets Gallery](https://starship.rs/presets/)
- [Nerd Fonts Directory](https://www.nerdfonts.com/)
- [Neon CLI Documentation](/docs/cli)
- [Neon Database Branching](/docs/introduction/branching)

<NeedHelp />
