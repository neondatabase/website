#!/bin/bash
# Configure package manager proxies from environment variables.
# If a proxy var is set, configure the corresponding package manager.
# If not set, package managers use their default public registries.

# npm
if [ -n "$NPM_REGISTRY" ]; then
  npm config set registry "$NPM_REGISTRY"
fi

# pip
if [ -n "$PIP_INDEX_URL" ]; then
  mkdir -p /etc/pip
  TRUSTED=$(echo "$PIP_INDEX_URL" | sed 's|https://||;s|http://||;s|/.*||')
  printf "[global]\nindex-url = %s\ntrusted-host = %s\n" "$PIP_INDEX_URL" "$TRUSTED" \
    > /etc/pip/pip.conf
fi

# Go modules
if [ -n "$GOPROXY" ]; then
  export GOPROXY
fi

# Maven
if [ -n "$MAVEN_MIRROR_URL" ]; then
  mkdir -p /root/.m2
  echo "<settings><profiles><profile><id>mirror</id><repositories><repository><id>central</id><url>${MAVEN_MIRROR_URL}</url></repository></repositories><pluginRepositories><pluginRepository><id>central</id><url>${MAVEN_MIRROR_URL}</url></pluginRepository></pluginRepositories></profile></profiles><activeProfiles><activeProfile>mirror</activeProfile></activeProfiles></settings>" \
    > /root/.m2/settings.xml
fi

# Cargo (crates.io)
if [ -n "$CARGO_REGISTRY_URL" ]; then
  mkdir -p /root/.cargo
  printf '[net]\ngit-fetch-with-cli = true\nretry = 5\n\n[http]\ntimeout = 120\n\n[source.crates-io]\nreplace-with = "proxy"\n\n[source.proxy]\nregistry = "sparse+%s"\n' "$CARGO_REGISTRY_URL" \
    > /root/.cargo/config.toml
fi

# Execute the original command
exec "$@"
