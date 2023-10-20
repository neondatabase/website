---
title: Neon CLI commands — completion
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-10-19T23:10:12.850Z'
---

## Before you begin

Before running the `completion` command, ensure that you have [installed the Neon CLI](/docs/reference/neon-cli#install-the-neon-cli).

## The `completion` command

This command generates a completion script for the `neonctl` command-line interface (CLI). The completion script, when installed, helps you type `neonctl` commands faster and more accurately. It does this by presenting the possible commands and options when you press the tab key after typing or partially typing a command or option.

### Usage

```bash
neonctl completion
```

The command outputs the following completion script with installation instructions:

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

Install this script as instructed in the script header by running:

```bash
neonctl completion >> ~/.bashrc
```

or on OSX:

```bash
neonctl completion >> ~/.bash_profile
```

Remember, changes made to `~/.bashrc` or `~/.bash_profile` won't affect existing shell sessions — only new ones. You need to either source the file in the existing session or start a new shell session after adding the script to `~/.bashrc` or `~/.bash_profile`. To source the file, run:

```bash
source ~/.bashrc
```

or on OSX:

```bash
source ~/.bash_profile
```

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
