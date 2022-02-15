mkdir bin
curl -sSL https://github.com/rust-lang/mdBook/releases/download/v0.4.15/mdbook-v0.4.15-x86_64-unknown-linux-gnu.tar.gz | tar -xz --directory=bin
cd docs
../bin/mdbook build
cp -R ./book ../public/docs
