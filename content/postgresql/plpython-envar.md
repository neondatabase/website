[#id](#PLPYTHON-ENVAR)

## 46.11. Environment Variables [#](#PLPYTHON-ENVAR)

Some of the environment variables that are accepted by the Python interpreter can also be used to affect PL/Python behavior. They would need to be set in the environment of the main PostgreSQL server process, for example in a start script. The available environment variables depend on the version of Python; see the Python documentation for details. At the time of this writing, the following environment variables have an affect on PL/Python, assuming an adequate Python version:

- `PYTHONHOME`

- `PYTHONPATH`

- `PYTHONY2K`

- `PYTHONOPTIMIZE`

- `PYTHONDEBUG`

- `PYTHONVERBOSE`

- `PYTHONCASEOK`

- `PYTHONDONTWRITEBYTECODE`

- `PYTHONIOENCODING`

- `PYTHONUSERBASE`

- `PYTHONHASHSEED`

(It appears to be a Python implementation detail beyond the control of PL/Python that some of the environment variables listed on the `python` man page are only effective in a command-line interpreter and not an embedded Python interpreter.)
