[#id](#ECPG-CPP)

## 36.13. C++ Applications [#](#ECPG-CPP)

- [36.13.1. Scope for Host Variables](ecpg-cpp#ECPG-CPP-SCOPE)
- [36.13.2. C++ Application Development with External C Module](ecpg-cpp#ECPG-CPP-AND-C)

ECPG has some limited support for C++ applications. This section describes some caveats.

The `ecpg` preprocessor takes an input file written in C (or something like C) and embedded SQL commands, converts the embedded SQL commands into C language chunks, and finally generates a `.c` file. The header file declarations of the library functions used by the C language chunks that `ecpg` generates are wrapped in `extern "C" { ... }` blocks when used under C++, so they should work seamlessly in C++.

In general, however, the `ecpg` preprocessor only understands C; it does not handle the special syntax and reserved words of the C++ language. So, some embedded SQL code written in C++ application code that uses complicated features specific to C++ might fail to be preprocessed correctly or might not work as expected.

A safe way to use the embedded SQL code in a C++ application is hiding the ECPG calls in a C module, which the C++ application code calls into to access the database, and linking that together with the rest of the C++ code. See [Section 36.13.2](ecpg-cpp#ECPG-CPP-AND-C) about that.

[#id](#ECPG-CPP-SCOPE)

### 36.13.1. Scope for Host Variables [#](#ECPG-CPP-SCOPE)

The `ecpg` preprocessor understands the scope of variables in C. In the C language, this is rather simple because the scopes of variables is based on their code blocks. In C++, however, the class member variables are referenced in a different code block from the declared position, so the `ecpg` preprocessor will not understand the scope of the class member variables.

For example, in the following case, the `ecpg` preprocessor cannot find any declaration for the variable `dbname` in the `test` method, so an error will occur.

```

class TestCpp
{
    EXEC SQL BEGIN DECLARE SECTION;
    char dbname[1024];
    EXEC SQL END DECLARE SECTION;

  public:
    TestCpp();
    void test();
    ~TestCpp();
};

TestCpp::TestCpp()
{
    EXEC SQL CONNECT TO testdb1;
    EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;
}

void Test::test()
{
    EXEC SQL SELECT current_database() INTO :dbname;
    printf("current_database = %s\n", dbname);
}

TestCpp::~TestCpp()
{
    EXEC SQL DISCONNECT ALL;
}
```

This code will result in an error like this:

```

ecpg test_cpp.pgc
test_cpp.pgc:28: ERROR: variable "dbname" is not declared
```

To avoid this scope issue, the `test` method could be modified to use a local variable as intermediate storage. But this approach is only a poor workaround, because it uglifies the code and reduces performance.

```

void TestCpp::test()
{
    EXEC SQL BEGIN DECLARE SECTION;
    char tmp[1024];
    EXEC SQL END DECLARE SECTION;

    EXEC SQL SELECT current_database() INTO :tmp;
    strlcpy(dbname, tmp, sizeof(tmp));

    printf("current_database = %s\n", dbname);
}
```

[#id](#ECPG-CPP-AND-C)

### 36.13.2. C++ Application Development with External C Module [#](#ECPG-CPP-AND-C)

If you understand these technical limitations of the `ecpg` preprocessor in C++, you might come to the conclusion that linking C objects and C++ objects at the link stage to enable C++ applications to use ECPG features could be better than writing some embedded SQL commands in C++ code directly. This section describes a way to separate some embedded SQL commands from C++ application code with a simple example. In this example, the application is implemented in C++, while C and ECPG is used to connect to the PostgreSQL server.

Three kinds of files have to be created: a C file (`*.pgc`), a header file, and a C++ file:

- `test_mod.pgc` [#](#ECPG-CPP-AND-C-TEST-MOD-PGC)

  A sub-routine module to execute SQL commands embedded in C. It is going to be converted into `test_mod.c` by the preprocessor.

  ```

  #include "test_mod.h"
  #include <stdio.h>

  void
  db_connect()
  {
      EXEC SQL CONNECT TO testdb1;
      EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;
  }

  void
  db_test()
  {
      EXEC SQL BEGIN DECLARE SECTION;
      char dbname[1024];
      EXEC SQL END DECLARE SECTION;

      EXEC SQL SELECT current_database() INTO :dbname;
      printf("current_database = %s\n", dbname);
  }

  void
  db_disconnect()
  {
      EXEC SQL DISCONNECT ALL;
  }
  ```

- `test_mod.h` [#](#ECPG-CPP-AND-C-TEST-MOD-H)

  A header file with declarations of the functions in the C module (`test_mod.pgc`). It is included by `test_cpp.cpp`. This file has to have an `extern "C"` block around the declarations, because it will be linked from the C++ module.

  ```

  #ifdef __cplusplus
  extern "C" {
  #endif

  void db_connect();
  void db_test();
  void db_disconnect();

  #ifdef __cplusplus
  }
  #endif
  ```

- `test_cpp.cpp` [#](#ECPG-CPP-AND-C-TEST-CPP-CPP)

  The main code for the application, including the `main` routine, and in this example a C++ class.

  ```

  #include "test_mod.h"

  class TestCpp
  {
    public:
      TestCpp();
      void test();
      ~TestCpp();
  };

  TestCpp::TestCpp()
  {
      db_connect();
  }

  void
  TestCpp::test()
  {
      db_test();
  }

  TestCpp::~TestCpp()
  {
      db_disconnect();
  }

  int
  main(void)
  {
      TestCpp *t = new TestCpp();

      t->test();
      return 0;
  }
  ```

To build the application, proceed as follows. Convert `test_mod.pgc` into `test_mod.c` by running `ecpg`, and generate `test_mod.o` by compiling `test_mod.c` with the C compiler:

```

ecpg -o test_mod.c test_mod.pgc
cc -c test_mod.c -o test_mod.o
```

Next, generate `test_cpp.o` by compiling `test_cpp.cpp` with the C++ compiler:

```

c++ -c test_cpp.cpp -o test_cpp.o
```

Finally, link these object files, `test_cpp.o` and `test_mod.o`, into one executable, using the C++ compiler driver:

```

c++ test_cpp.o test_mod.o -lecpg -o test_cpp
```
