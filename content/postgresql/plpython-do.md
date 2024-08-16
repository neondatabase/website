[#id](#PLPYTHON-DO)

## 46.4. Anonymous Code Blocks [#](#PLPYTHON-DO)

PL/Python also supports anonymous code blocks called with the [DO](sql-do) statement:

```
DO $$
    # PL/Python code
$$ LANGUAGE plpython3u;
```

An anonymous code block receives no arguments, and whatever value it might return is discarded. Otherwise it behaves just like a function.
