---
title: 'Neon CLI command: completion'
subtitle: Generate shell completion scripts for neon commands and options
summary: >-
  The `neon completion` command generates a yargs-based shell tab-completion
  script for `neon` that surfaces available commands and options when you
  press Tab. Use this page when you want to enable autocomplete for the Neon
  CLI in your terminal, so you can stop typing full command names from memory.
  Installation targets include `.bashrc`, `.bash_profile`, `.profile`, and
  `.zshrc` on Linux and macOS.
enableTableOfContents: true
updatedOn: '2026-07-01T13:41:48.668Z'
redirectFrom:
  - /docs/reference/cli-completion
---

The `completion` command generates a shell completion script for `neon`. Once installed, the script presents the possible commands and options when you press the **tab** key after typing or partially typing a command or option.

## Usage

```bash
neon completion
```

<Admonition type="important">
Generate the completion script in your own terminal, as the script may differ depending on your operating environment.
</Admonition>

<details>
<summary>Show output</summary>

```text filename="Output"
###-begin-neon-completions-###
#
# yargs command completion script
#
# Installation: neon completion >> ~/.bashrc
#    or neon completion >> ~/.bash_profile on OSX.
#
_neon_yargs_completions()
{
    local cur_word args type_list

    cur_word="${COMP_WORDS[COMP_CWORD]}"
    args=("${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$(neon --get-yargs-completions "${args[@]}")

    COMPREPLY=( $(compgen -W "${type_list}" -- ${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ ${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o bashdefault -o default -F _neon_yargs_completions neon
###-end-neon-completions-###
```

</details>

## Examples

Add the completion script to your shell configuration file in your home directory. The file differs by platform: Ubuntu typically uses `.bashrc`, while macOS uses `.bash_profile` or `.zshrc`. The `source` command applies the change to the current shell session.

Add the completion script to `.bashrc`:

```bash
neon completion >> ~/.bashrc
source ~/.bashrc
```

Add the completion script to `.bash_profile`:

```bash
neon completion >> ~/.bash_profile
source ~/.bash_profile
```

Add the completion script to `.profile`:

```bash
neon completion >> ~/.profile
source ~/.profile
```

Add the completion script to `.zshrc`:

```bash
neon completion >> ~/.zshrc
source ~/.zshrc
```
