[#id](#GIT)

## I.1. Getting the Source via Git [#](#GIT)

With Git you will make a copy of the entire code repository on your local machine, so you will have access to all history and branches offline. This is the fastest and most flexible way to develop or test patches.

[#id](#id-1.11.10.5.3)

**Git**

1. You will need an installed version of Git, which you can get from [https://git-scm.com](https://git-scm.com). Many systems already have a recent version of Git installed by default, or available in their package distribution system.

2. To begin using the Git repository, make a clone of the official mirror:

   ```

   git clone https://git.postgresql.org/git/postgresql.git
   ```

   This will copy the full repository to your local machine, so it may take a while to complete, especially if you have a slow Internet connection. The files will be placed in a new subdirectory `postgresql` of your current directory.

   The Git mirror can also be reached via the Git protocol. Just change the URL prefix to `git`, as in:

   ```

   git clone git://git.postgresql.org/git/postgresql.git
   ```

3. Whenever you want to get the latest updates in the system, `cd` into the repository, and run:

   ```

   git fetch
   ```

Git can do a lot more things than just fetch the source. For more information, consult the Git man pages, or see the website at [https://git-scm.com](https://git-scm.com).
