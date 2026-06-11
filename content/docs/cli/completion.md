---
title: 'Neon CLI command: completion'
subtitle: Generate shell completion scripts for neonctl commands and options
summary: >-
  The `neonctl completion` command generates a yargs-based shell tab-completion
  script for `neonctl` that surfaces available commands and options when you
  press Tab. Use this page when you want to enable autocomplete for the Neon
  CLI in your terminal, so you can stop typing full command names from memory.
  Installation targets include `.bashrc`, `.bash_profile`, `.profile`, and
  `.zshrc` on Linux and macOS.
enableTableOfContents: true
updatedOn: '2026-06-11T23:50:21.258Z'
redirectFrom:
  - /docs/reference/cli-completion
---

The `completion` command generates a shell completion script for `neonctl`. Once installed, the script presents the possible commands and options when you press the **tab** key after typing or partially typing a command or option.

## Usage

```bash
neonctl completion
```

<Admonition type="important">
Generate the completion script in your own terminal, as the script may differ depending on your operating environment.
</Admonition>

<details>
<summary>Show output</summary>

```text
###-begin-neonctl-completions-###
#
# yargs command completion script
#
# Installation: neonctl completion >> ~/.bashrc
#    or neonctl completion >> ~/.bash_profile on OSX.
#
_neonctl_yargs_completions()
{
    local cur_word args type_list

    cur_word="${COMP_WORDS[COMP_CWORD]}"
    args=("${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$(neonctl --get-yargs-completions "${args[@]}")

    COMPREPLY=( $(compgen -W "${type_list}" -- ${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ ${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o bashdefault -o default -F _neonctl_yargs_completions neonctl
###-end-neonctl-completions-###
```

</details>

## Examples

Add the completion script to your shell configuration file in your home directory. The file differs by platform: Ubuntu typically uses `.bashrc`, while macOS uses `.bash_profile` or `.zshrc`. The `source` command applies the change to the current shell session.

- Add the completion script to `.bashrc`:

  ```bash
  neonctl completion >> ~/.bashrc
  source ~/.bashrc
  ```

- Add the completion script to `.bash_profile`:

  ```bash
  neonctl completion >> ~/.bash_profile
  source ~/.bash_profile
  ```

- Add the completion script to `.profile`:

  ```bash
  neonctl completion >> ~/.profile
  source ~/.profile
  ```

- Add the completion script to `.zshrc`:

  ```bash
  neonctl completion >> ~/.zshrc
  source ~/.zshrc
  ```
