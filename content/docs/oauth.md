---
title: Configuring Neon OAuth for 3rd party Neon API access
enableTableOfContents: true
---
This topic explains how to configure Neon OAuth to enable third-party services to access Neon's API on behalf of its users.

The following instructions assume familiarity with:

- OAuth concepts:
    - [Login flow](https://www.ory.sh/docs/hydra)
    - [Consent flow](https://www.ory.sh/docs/hydra/concepts/consent)
- The [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)
- The Ory Hydra command-line tool. For installation instructions, see [Ory Hydra Installation](https://www.ory.sh/docs/hydra/install)

## Install an Ory Hydra server

This configuration requires a locally installed Ory Hydra server. For installation instructions, see [Ory Hydra Installation](https://www.ory.sh/docs/hydra/install).

## Configure port forwarding for client access to the Ory Hydra API

Configure port forwarding to allow clients to access the Ory Hydra API. For example:

```terminal
kubectl port-forward svc/zenith-console-hydra-admin 4445:4445
```

## Create a client

The following command creates an OAuth client named "neonclitest3", with a callback of  http://127.0.0.1:5555/callback, that can refresh its token.


```terminal
$ export HYDRA_URL="http://localhost:4445"

$ hydra clients --fake-tls-termination create \
    --name "Neon CLI" \
    --id neoncli \
    --callbacks http://127.0.0.1/callback \
    --grant-types authorization_code,refresh_token \
    --scope "openid offline offline_access urn:neoncloud:projects:create urn:neoncloud:projects:read urn:neoncloud:projects:update urn:neoncloud:projects:delete" \
    --token-endpoint-auth-method "none"
You should not provide secrets using command line flags, the secret might leak to bash history and similar systems
OAuth 2.0 Client ID: neonclitest3

$ hydra clients --fake-tls-termination list
|  CLIENT ID   |      NAME       | RESPONSE TYPES |     SCOPE      |         REDIRECT URIS          |           GRANT TYPES            | TOKEN ENDPOINT AUTH METHOD |
|--------------|-----------------|----------------|----------------|--------------------------------|----------------------------------|----------------------------|
| neonclitest3 | Neon CLI test 3 | code           | openid offline | http://127.0.0.1:5555/callback | authorization_code,refresh_token | none                       |
```

Notes:

- The `--token-endpoint-auth-method "none"` setting allows the client to access the API without providing a client secret, which is provided as part of the OAuth 2.0 Dynamic Client Registration Protocol. This is a valid option for a command-line client. If the client is a backend application, require `client_secret_post` or `client_secret_basic`.
- Pay attention to `--token-endpoint-auth-method "none"`. This is useful only for CLI and other applications that are unable to store secrets. For backend applications, use `client_secret_post` or `client_secret_basic`. Add `--secret app-secret key` and pass `app-secret` to the developers of a third-party app. Do not store these secrets. In your shell, prefix the command with space to avoid the secret being stored in your shell's command history.
- The `openid offline offline_access` technical scopes are required but a user does not see them during consent. Choose other scopes wisely so as to not expose more technical scopes to an application than is necessary.

## Updating the client configuration

When updating the client configuration, specify all of the parameters included in the command below. Parameters should be omitted.

```terminal
$ hydra clients --fake-tls-termination update neonclitest3 --token-endpoint-auth-method "none" --grant-types "authorization_code,refresh_token" --scope "openid offline" --response-types "code" --name "Neon CLI test 3" --callbacks "http://127.0.0.1:5555/callback"
neonclitest3 OAuth 2.0 Client updated.
```