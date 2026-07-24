---
title: Adding PostgreSQL 15 support to Neon Storage using Rust
description: Integrate Rust with multiple versions of C code
excerpt: >-
  A few weeks ago, we added support for PostgreSQL 15. You can choose the
  version of PostgreSQL you want to use (PostgreSQL v14 or v15) when you create
  a Neon project. This post describes how we add support for multiple PostgreSQL
  versions in our Rust code, which might be helpful f...
date: '2022-11-09T16:11:47'
updatedOn: '2023-08-21T13:36:16'
category: engineering
categories:
  - engineering
authors:
  - anastasia-lubennikova
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-we-added-support-for-postgresql-v15-in-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Adding PostgreSQL 15 support to Neon Storage using Rust - Neon
  description: Integrate Rust with multiple versions of C code
  keywords: []
  noindex: false
  ogTitle: Adding PostgreSQL 15 support to Neon Storage using Rust - Neon
  ogDescription: >-
    A few weeks ago, we added support for PostgreSQL 15. You can choose the
    version of PostgreSQL you want to use (PostgreSQL v14 or v15) when you
    create a Neon project. This post describes how we add support for multiple
    PostgreSQL versions in our Rust code, which might be helpful for other Rust
    projects that […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-we-added-support-for-postgresql-v15-in-neon/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-we-added-support-for-postgresql-v15-in-neon/neon-how-we-added-support-1024x538-d0676d99.jpg)

A few weeks ago, we added [support for PostgreSQL 15](https://neon.tech/blog/postgresql-15-three-features-you-can-try-with-neon/). You can choose the version of PostgreSQL you want to use (PostgreSQL v14 or v15) when you create a Neon project.

This post describes how we add support for multiple PostgreSQL versions in our Rust code, which might be helpful for other Rust projects that want to support multiple versions of the same C library simultaneously.

## Neon architecture recap

A Neon installation consists of compute nodes and a Neon storage engine.

Compute nodes are stateless PostgreSQL nodes backed by the Neon storage engine.

From a code perspective, a compute node is a patched PostgreSQL that enables the Neon API to access the storage engine.

Storage consists of several modules, but in this blog post, we will consider it as one piece of software. If you are interested in learning about the individual modules, please refer to the [Architecture decisions in Neon](https://neon.tech/blog/architecture-decisions-in-neon/) blog post.

Storage accepts Postgres write-ahead-log (WAL), durably stores it, digests it, and turns it into Postgres data pages. Storage is implemented in Rust, and to handle Postgres data and WAL file formats, it needs to use Postgres C code.<br />To do that, we use the [bindgen](https://github.com/rust-lang/rust-bindgen) crate.

## Using bindgen to generate Rust code from C headers

We use the crate bindgen to generate Rust code from C headers. It’s a very convenient tool that does all the heavy lifting. It auto-generates Rust code which is a direct translation of C code.

All of our Postgres-specific code is encapsulated in the `postgres_ffi` module. The examples below are simplified extracts from past and present Neon code with file paths relative to this module.

First, we prepare input for bindgen.

`bindgen_deps.h` includes all the PostgreSQL headers required to auto-generate Rust structs.

Then we run bindgen to generate Rust code from C headers.

in `build.rs`, we generate the bindings and store them in the intermediate file `bindings.rs`.

```javascript
let bindings = bindgen::Builder::default()
    .header("bindgen_deps.h")
    ...
    .allowlist_type("XLogPageHeaderData")
    .allowlist_type("XLOG_PAGE_MAGIC")
    // Because structs are used for serialization, tell bindgen to emit
    // explicit padding fields.
    .explicit_padding(true)
    // Provide the path to the headers
     .clang_arg(format!("-I../../tmp_install/include/server"))
    .generate()
    .context("Unable to generate bindings")?;

    // Write the bindings to the $OUT_DIR/bindings.rs file.
    bindings
            .write_to_file(out_path.join("bindings.rs"))
            .context("Couldn't write bindings")?;
    }
```

Finally, in `src/lib.rs`, we include the generated bindings.

```javascript
include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
```

From now on, we can use the generated structs and functions in our code like this:

```javascript
use postgres_ffi::XLogPageHeaderData;
```

That’s great, but how do we support multiple PostgreSQL versions?

## Using bindgen with multiple versions of Postgres

The PostgreSQL on-disk file format is subject to change in each major PostgreSQL version.

For example, between v14 and v15, the WAL page format did change. So did the `XLogPageHeaderData` structure and `XLOG_PAGE_MAGIC` version indicator.

In Neon, we parse WAL pages and extract WAL records from them, so we need to maintain a separate version of the generated code for each version.

Binding with multiple versions of the same codebase is a bit tricky. Let’s review changes to the one-version code step by step:

As before, we need to prepare the input for bindgen.

`bindgen_deps.h` hasn’t changed in our case. (If header files have changed between versions, we would have to maintain separate versions of `bindgen_deps.h` for each version.)

Next, we call bindgen for each version.

in `build.rs`

```javascript
 for pg_version in &["v14", "v15"] {

        // calculate the path to the headers
        // using `pg_config --includedir-server`
        let inc_server_path = get_includedir_server_path(pg_version)?;

        let bindings = bindgen::Builder::default()
            .header("bindgen_deps.h")
            ...
            .allowlist_type("XLogPageHeaderData")
            .allowlist_type("XLOG_PAGE_MAGIC")
            // Because structs are used for serialization, tell bindgen to emit
            // explicit padding fields.
            .explicit_padding(true)
            // Provide the path to the headers
            .clang_arg(format!("-I{inc_server_path}"))
            .generate()
            .context("Unable to generate bindings")?;

        // Write the bindings for the given Postgres version.
        let filename = format!("bindings_{pg_version}.rs");
        bindings
            .write_to_file(out_path.join(filename))
            .context("Couldn't write bindings")?;
    }
```

This produces `bindings_v14.rs` and `bindings_v15.rs` files, which we include in `lib.rs`.

```javascript
// To avoid code duplication, we use a macro
macro_rules! postgres_ffi {
    ($version:ident) => {
        #[path = "."]
        pub mod $version {
            pub mod bindings {
                // bindgen generates bindings for a lot of stuff we don't need
                #! [allow(dead_code)]

                use serde::{Deserialize, Serialize};
                include!(concat!(
                    env!("OUT_DIR"),
                    "/bindings_",
                    stringify!($version),
                    ".rs"
                ));
            }

            // These modules depend on the generated bindings, so they must
            // be included after the bindings.
            pub mod xlog_utils;
            ...
        }
    };

// Actually include the bindings for the given versions.
postgres_ffi!(v14);
postgres_ffi!(v15);
```

After this step, we have version-specific `postgres_ffi` submodules, which can be used like this:

```bash
use postgres_ffi::v14::bindings::{XLogPageHeaderData, XLOG_PAGE_MAGIC};
use postgres_ffi::v14::xlog_utils::generate_wal_segment;
```

and

```javascript
use postgres_ffi::v15::bindings::{XLogPageHeaderData, XLOG_PAGE_MAGIC};
use postgres_ffi::v15::xlog_utils::generate_wal_segment;
```

We avoid exposing the version-specific modules to the rest of the codebase, so

all such code is wrapped into functions that accept the version as a parameter.

<br />in `src/lib.rs`

```javascript
pub fn generate_wal_segment(
    segno: u64,
    system_id: u64,
    pg_version: u32,
) -> Result<Bytes, SerializeError> {
    match pg_version {
        14 => v14::xlog_utils::generate_wal_segment(segno, system_id),
        15 => v15::xlog_utils::generate_wal_segment(segno, system_id),
        _ => Err(SerializeError::BadInput),
    }
}
```

Version-independent constants and structures are explicitly re-exported in `lib.rs` and can be used just like before:

```javascript
use postgres_ffi::BlockNumber;
```

This approach allows us to support multiple versions of Postgres without code duplication and with minimal changes to the existing codebase.

## Changes to compute node code

This section is not as complicated as the previous one.

Neon requires a small set of patches to PostgreSQL code. We need to maintain those patches for each supported PostgreSQL version, but the changes are small and isolated, so they are not challenging to rebase.

This also means that we can easily support new versions of Postgres extensions. As soon as they are compatible with the latest Postgres version, we can add support for them in Neon.

## What’s next?

We will add support for more PostgreSQL extensions in future Neon releases.

What else do you want to see in Neon? Join us and share your ideas at [https://community.neon.tech](https://community.neon.tech).
