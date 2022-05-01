### Getting Started with Rust

```rust
use postgres::{Client, NoTls};

fn main() {
 let mut client = Client::connect("user=<user name> dbname=<db name> host=pg.neon.tech password=<password>", NoTls).expect("connection error");

 for row in client.query("select version()", &[]).expect("query error") {
     let version: &str = row.get(0);
     println!("version: {}", version);
 }
}
```

[On rust-lang playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=0d9daa9cde3c74d2916c8f05b24707a3)
