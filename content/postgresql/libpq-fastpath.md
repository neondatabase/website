[#id](#LIBPQ-FASTPATH)

## 34.8. The Fast-Path Interface [#](#LIBPQ-FASTPATH)

PostgreSQL provides a fast-path interface to send simple function calls to the server.

### Tip

This interface is somewhat obsolete, as one can achieve similar performance and greater functionality by setting up a prepared statement to define the function call. Then, executing the statement with binary transmission of parameters and results substitutes for a fast-path function call.

The function `PQfn` requests execution of a server function via the fast-path interface:

```
PGresult *PQfn(PGconn *conn,
               int fnid,
               int *result_buf,
               int *result_len,
               int result_is_int,
               const PQArgBlock *args,
               int nargs);

typedef struct
{
    int len;
    int isint;
    union
    {
        int *ptr;
        int integer;
    } u;
} PQArgBlock;
```

The `fnid` argument is the OID of the function to be executed. `args` and `nargs` define the parameters to be passed to the function; they must match the declared function argument list. When the `isint` field of a parameter structure is true, the `u.integer` value is sent to the server as an integer of the indicated length (this must be 2 or 4 bytes); proper byte-swapping occurs. When `isint` is false, the indicated number of bytes at *`*u.ptr`* are sent with no processing; the data must be in the format expected by the server for binary transmission of the function's argument data type. (The declaration of *`u.ptr`* as being of type `int `is historical; it would be better to consider it`void `.) *`result_buf`* points to the buffer in which to place the function's return value. The caller must have allocated sufficient space to store the return value. (There is no check!) The actual result length in bytes will be returned in the integer pointed to by *`result_len`*. If a 2- or 4-byte integer result is expected, set *`result_is_int`* to 1, otherwise set it to 0. Setting *`result_is_int`* to 1 causes libpq to byte-swap the value if necessary, so that it is delivered as a proper `int` value for the client machine; note that a 4-byte integer is delivered into *`result_buf`for either allowed result size. When`result_is_int`is 0, the binary-format byte string sent by the server is returned unmodified. (In this case it's better to consider`result_buf`as being of type `void`.)

`PQfn` always returns a valid `PGresult` pointer, with status `PGRES_COMMAND_OK` for success or `PGRES_FATAL_ERROR` if some problem was encountered. The result status should be checked before the result is used. The caller is responsible for freeing the `PGresult` with [`PQclear`](libpq-exec#LIBPQ-PQCLEAR) when it is no longer needed.

To pass a NULL argument to the function, set the `len` field of that parameter structure to `-1`; the `isint` and `u` fields are then irrelevant.

If the function returns NULL, *`*result_len`* is set to `-1`, and *`result_buf` is not modified.

Note that it is not possible to handle set-valued results when using this interface. Also, the function must be a plain function, not an aggregate, window function, or procedure.
