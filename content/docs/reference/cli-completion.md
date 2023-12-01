---
title: Neon CLI commands — completion
subtitle: Use the Neon CLI to manage Neon directly from the terminal
enableTableOfContents: true
updatedOn: '2023-12-01T19:05:09.473Z'
---

## Before you begin

Before running the `completion` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).

## The `completion` command

This command generates a completion script for the `neonctl` command-line interface (CLI). The completion script, when installed, helps you type `neonctl` commands faster and more accurately. It does this by presenting the possible commands and options when you press the **tab** key after typing or partially typing a command or option.

### Usage

```bash
neonctl completion
```

The command outputs the following completion script similar to the following with installation instructions. **Use the completeion scription that is output to your terminal or command window**, as the script may differ depending on your operating environment. 

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

Use the commands provided below to install the completion script to your shell configuration file, which is typically located in your `home` directory. Your shell configuration file may differ by platform. For example, on Ubuntu, you should have a `.bashrc` file, and on macOS, you might have `bash_profile` or `.zshrc`. The `source` command causes the changes to your shell configuration file to take effect immediately in the current shell session. 

<Tabs labels={["bashrc", "bash_profile", "profile", "zshrc"]}>

<TabItem>

```bash
neonctl completion >> ~/.bashrc
source ~/.bashrc
```

</TabItem>

<TabItem>

```bash
neonctl completion >> ~/.bash_profile
source ~/.bash_profile
```

</TabItem>

<TabItem>

```bash
neonctl completion >> ~/.profile
source ~/.profile
```

</TabItem>

<TabItem>

```bash
neonctl completion >> ~/.zshrc
source ~/.zshrc
```

</TabItem>

</Tabs>

<NeedHelp/>
