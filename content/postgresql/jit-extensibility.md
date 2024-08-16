[#id](#JIT-EXTENSIBILITY)

## 32.4. Extensibility [#](#JIT-EXTENSIBILITY)

- [32.4.1. Inlining Support for Extensions](jit-extensibility#JIT-EXTENSIBILITY-BITCODE)
- [32.4.2. Pluggable JIT Providers](jit-extensibility#JIT-PLUGGABLE)

[#id](#JIT-EXTENSIBILITY-BITCODE)

### 32.4.1. Inlining Support for Extensions [#](#JIT-EXTENSIBILITY-BITCODE)

PostgreSQL's JIT implementation can inline the bodies of functions of types `C` and `internal`, as well as operators based on such functions. To do so for functions in extensions, the definitions of those functions need to be made available. When using [PGXS](extend-pgxs) to build an extension against a server that has been compiled with LLVM JIT support, the relevant files will be built and installed automatically.

The relevant files have to be installed into `$pkglibdir/bitcode/$extension/` and a summary of them into `$pkglibdir/bitcode/$extension.index.bc`, where `$pkglibdir` is the directory returned by `pg_config --pkglibdir` and `$extension` is the base name of the extension's shared library.

### Note

For functions built into PostgreSQL itself, the bitcode is installed into `$pkglibdir/bitcode/postgres`.

[#id](#JIT-PLUGGABLE)

### 32.4.2. Pluggable JIT Providers [#](#JIT-PLUGGABLE)

PostgreSQL provides a JIT implementation based on LLVM. The interface to the JIT provider is pluggable and the provider can be changed without recompiling (although currently, the build process only provides inlining support data for LLVM). The active provider is chosen via the setting [jit_provider](runtime-config-client#GUC-JIT-PROVIDER).

[#id](#JIT-PLUGGABLE-PROVIDER-INTERFACE)

#### 32.4.2.1. JIT Provider Interface [#](#JIT-PLUGGABLE-PROVIDER-INTERFACE)

A JIT provider is loaded by dynamically loading the named shared library. The normal library search path is used to locate the library. To provide the required JIT provider callbacks and to indicate that the library is actually a JIT provider, it needs to provide a C function named `_PG_jit_provider_init`. This function is passed a struct that needs to be filled with the callback function pointers for individual actions:

```
struct JitProviderCallbacks
{
    JitProviderResetAfterErrorCB reset_after_error;
    JitProviderReleaseContextCB release_context;
    JitProviderCompileExprCB compile_expr;
};

extern void _PG_jit_provider_init(JitProviderCallbacks *cb);
```
