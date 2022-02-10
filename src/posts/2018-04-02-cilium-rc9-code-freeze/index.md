---
title: 'Cilium 1.0.0-rc9 - Feature Freeze for 1.0!'
description: 'In this 45-minute interview with Lee Robinson, hear Rich Harris, the creator of Svelte, talk about his plans for the future of the framework. Other topics include funding open source, SvelteKit 1.0, the Edge-first future, and more.'
author: 'Stas Kelvich'
---

We are excited to announce [Cilium
1.0.0-rc9](https://github.com/cilium/cilium/releases/tag/v1.0.0-rc9) with many,
many bugfixes and the delivery of the final feature we were waiting on prior for
1.0: Egress policy enforcement support. It is therefore only logical that we
announce full feature freeze with rc9. This means that we will only merge
critical bugfixes and release 1.0 as soon as we have resolved all release
blockers. More on this below. We are thrilled to have come this far and
appreciate all of the efforts by the wide range of contributors that have
helped to get us here.

## Upgrade Instructions

No special upgrade instructions are required for this release. Please follow
out [simple upgrade guide](http://docs.cilium.io/en/stable/install/upgrade/)
for the generic instructions on how to upgrade.

## Highlights

As usual, the full release notes are attached at the end of the blog but can be
found on the [1.0.0-rc9 release
page](https://github.com/cilium/cilium/releases/tag/v1.0.0-rc9). The vast
majority of the work in this release has been around bugfixes and testing. Here
is a list of some highlights:

## Egress Policy Enforcement capability

Cilium uses an identity based policy enforcement mechanism as its standard
enforcement mechanism and only falls back to IP/CIDR based enforcement when
absolutely required. The identity based model implies that we encode the
identity of the sending endpoint with all packets and then enforce on the
receiving side whether that identity is allowed to communicate with the
respective peer. Cilium only falls back to an IP/CIDR based enforcement mode if
we are not in control of the sender.

With this release, we are now completing the egress policy enforcement by
adding labels and entities based enforcement on top of the existing IP/CIDR
egress enforcement that existed before.

### A few simple egress examples

The following example is tailored for Kubernetes and shows how to enable
default deny at egress for all `role=frontend` pods and then explicitly
whitelist the connection to `role=backend` on port TCP/80:

```yaml
apiVersion: 'cilium.io/v2'
kind: CiliumNetworkPolicy
description: 'Allow egress TCP/80 from frontend to backend'
metadata:
  name: 'egress-rule'
spec:
  endpointSelector:
    matchLabels:
      role: frontend
  egress:
    - toEndpoints:
        - matchLabels:
          role: backend
      toPorts:
        - ports:
            - port: '80'
              protocol: TCP
```

This obviously also applies to L7 aware policies. Here is another example which
shows how to whitelist `POST /metric` on port TCP/8080 from pods with the
label `app=myService` to their respective local host.

```yaml
apiVersion: 'cilium.io/v2'
kind: CiliumNetworkPolicy
description: 'Allow HTTP POST /metric from myService to local host'
metadata:
  name: 'rule1'
spec:
  endpointSelector:
    matchLabels:
      app: myService
  egress:
    - toEntities:
        - host
      toPorts:
        - ports:
            - port: '8080'
              protocol: TCP
          rules:
            http:
              - method: 'POST'
                path: '/metric$'
```

## Configurable 403 HTTP access denied messages

The ability to specify the text as returned with 403 HTTP responses is
obviously a critical enterprise grade feature as explained in this separate
blog post:

- [Cilium Enterprise Edition 4.0: Repelling Attacks with Emojis, Rickrolling, and More!](/blog/2018/4/1/cilium-enterprise-edition)

No further explanation required.

## Scale Improvements

We have done a series of scale and stress tests which lead to tweaking of
default limits and improvements that affect scalability:

- Several upper limits for BPF maps covering connection state have been
  increased. We will likely make this adjustable and improve defaults to be
  based on available system memory to take a good guess at expected network
  load.

- A new expedited garbage collector mode has been introduced which
  identifies connections that have never been established (no complete SYN-ACK
  handshake observed). Such incomplete connections are removed from state
  tables much more aggressively. This finds a good balance to keep long lived
  TCP connections in state tables for days without seeing any traffic while
  aggressively removing connections created by connection attempt floods or
  services such as Cassandra which perform retries _very_ aggressively.

- We have started enabling TCP keepalive for all proxied connections to gain
  a better understanding of the health of long lived connections with minimal
  traffic such as TCP connections used for health checking.

## Known issues before 1.0

We have a couple of issues that are we tracking and fixing before releasing
1.0. If you are running into any issues, check the list of [1.0 blocker bugs]
(<https://github.com/cilium/cilium/issues?q=is%3Aopen+is%3Aissue+label%3Apriority%2F1.0-blocker>r>r>r>r>r>r>)
first.

## Release Notes

### Major Changes

- envoy: Make 403 message configurable. ([3430](https://github.com/cilium/cilium/pull/3430), @jrajahalme)
- Add support label-dependent L4 egress policy ([3372](https://github.com/cilium/cilium/pull/3372), @ianvernon)

### Bugfixes Changes

- Fix entity dependent L4 enforcement ([3451](https://github.com/cilium/cilium/pull/3451), @tgraf)
- cli: Fix cilium bpf policy get ([3446](https://github.com/cilium/cilium/pull/3446), @tgraf)
- Fix CIDR ingress lookup ([3406](https://github.com/cilium/cilium/pull/3406), @joestringer)
- xds: Handle NACKs of initial versions of resources ([3405](https://github.com/cilium/cilium/pull/3405), @rlenglet)
- datapath: fix egress to world entity traffic, add e2e test ([3386](https://github.com/cilium/cilium/pull/3386), @ianvernon)
- bug: Fix panic in health server logs if /healthz didn't respond before checking status ([3378](https://github.com/cilium/cilium/pull/3378), @nebril)
- pkg/policy: remove fromEntities and toEntities from rule type ([3375](https://github.com/cilium/cilium/pull/3375), @ianvernon)
- Fix IPv4 CIDR lookup on older kernels ([3366](https://github.com/cilium/cilium/pull/3366), @joestringer)
- Fix egress CIDR policy enforcement ([3348](https://github.com/cilium/cilium/pull/3348), @tgraf)
- envoy: Fix concurrency issues in Cilium xDS server ([3341](https://github.com/cilium/cilium/pull/3341), @rlenglet)
- Fix bug where policies associated with stale identities remain in BPF policy maps, which could lead to "Argument list too long" errors while regenerating endpoints ([3321](https://github.com/cilium/cilium/pull/3321), @joestringer)
- Update CI and docs : kafka zookeeper connection timeout to 20 sec ([3308](https://github.com/cilium/cilium/pull/3308), @manalibhutiyani)
- Reject CiliumNetworkPolicy rules which do not have EndpointSelector field ([3275](https://github.com/cilium/cilium/pull/3275), @ianvernon)
- Envoy: delete proxymap on connection close ([3271](https://github.com/cilium/cilium/pull/3271), @jrajahalme)
- Fix nested cmdref links in documentation ([3265](https://github.com/cilium/cilium/pull/3265), @joestringer)
- completion: Fix race condition that can cause panic ([3256](https://github.com/cilium/cilium/pull/3256), @rlenglet)
- Additional NetworkPolicy tests and egress wildcard fix ([3246](https://github.com/cilium/cilium/pull/3246), @tgraf)
- Add timeout for getting etcd session ([3228](https://github.com/cilium/cilium/pull/3228), @nebril)
- conntrack: Cleanup egress entries and distinguish redirects per endpoint ([3221](https://github.com/cilium/cilium/pull/3221), @rlenglet)
- Silence warnings during endpoint restore ([3216](https://github.com/cilium/cilium/pull/3216), @tgraf)
- Fix MTU connectivity issue with external services ([3205](https://github.com/cilium/cilium/pull/3205), @joestringer)
- endpoint: Don't fail with fatal on l4 policy application ([3199](https://github.com/cilium/cilium/pull/3199), @tgraf)
- Add new Kafka Role to the docs ([3186](https://github.com/cilium/cilium/pull/3186), @manalibhutiyani)
- Fix log records for Kafka responses ([3127](https://github.com/cilium/cilium/pull/3127), @tgraf)

### Other Changes

- Refactor /endpoint/{id}/config for API 1.0 stability ([3448](https://github.com/cilium/cilium/pull/3448), @tgraf)
- envoy: Add host identity ([nphds) gRPC client (3407](https://github.com/cilium/cilium/pull/nphds) gRPC client (3407), @jrajahalme)
- Increase capacity of BPF maps ([3391](https://github.com/cilium/cilium/pull/3391), @tgraf)
- daemon: Merge Envoy logs with cilium logs by default. ([3364](https://github.com/cilium/cilium/pull/3364), @jrajahalme)
- docs: Fix the Kafka policy to use the new role in the GSG ([3350](https://github.com/cilium/cilium/pull/3350), @manalibhutiyani)
- CI / GSG : make Kafka service headless ([3320](https://github.com/cilium/cilium/pull/3320), @manalibhutiyani)
- Use alpine as base image for Docs container ([3301](https://github.com/cilium/cilium/pull/3301), @iamShantanu101)
- Update kafka zookeeper session timeout to 20 sec in CI tests and docs ([3298](https://github.com/cilium/cilium/pull/3298), @manalibhutiyani)
- Support access log from sidecar and per-endpoint redirect stats ([3278](https://github.com/cilium/cilium/pull/3278), @rlenglet)
- Improve sanity checking in endpoint PATCH API ([3274](https://github.com/cilium/cilium/pull/3274), @joestringer)
- Update Kafka GSG policy and docs to use the new "roles" ([3269](https://github.com/cilium/cilium/pull/3269), @manalibhutiyani)
- maps: allow for migration when map properties change ([3267](https://github.com/cilium/cilium/pull/3267), @borkmann)
- bpf: Retire CT entries quickly for unreplied connections ([3238](https://github.com/cilium/cilium/pull/3238), @joestringer)
- CMD: Add json output on endpoint config ([3234](https://github.com/cilium/cilium/pull/3234), @eloycoto)
- Plumb the contents of the ip-identity cache to a BPF map for lookup in the datapath. ([3037](https://github.com/cilium/cilium/pull/3037), @ianvernon)

## Release binaries

- [cilium-agent-x86_64](http://releases.cilium.io/v1.0.0-rc9/cilium-agent-x86_64) ([45085a62027fa2b30858](http://releases.cilium.io/v1.0.0-rc9/cilium-agent-x86_64.sha256sum))
- [cilium-bugtool-x86_64](http://releases.cilium.io/v1.0.0-rc9/cilium-bugtool-x86_64) ([f1d14a36f7c804d60c92](http://releases.cilium.io/v1.0.0-rc9/cilium-bugtool-x86_64.sha256sum))
- [cilium-health-x86_64](http://releases.cilium.io/v1.0.0-rc9/cilium-health-x86_64) ([f6f1b21fe7e45417109c](http://releases.cilium.io/v1.0.0-rc9/cilium-health-x86_64.sha256sum))
- [cilium-node-monitor-x86_64](http://releases.cilium.io/v1.0.0-rc9/cilium-node-monitor-x86_64) ([31cf402a44e32104ed4a](http://releases.cilium.io/v1.0.0-rc9/cilium-node-monitor-x86_64.sha256sum))
- [cilium-x86_64](http://releases.cilium.io/v1.0.0-rc9/cilium-x86_64) ([d9eb0c42c8b0a4a2ea17](http://releases.cilium.io/v1.0.0-rc9/cilium-x86_64.sha256sum))
- [v1.0.0-rc9.tar.gz](http://releases.cilium.io/v1.0.0-rc9/v1.0.0-rc9.tar.gz) ([30cebb959aa508d04814](http://releases.cilium.io/v1.0.0-rc9/v1.0.0-rc9.tar.gz.sha256sum))
- [v1.0.0-rc9.zip](http://releases.cilium.io/v1.0.0-rc9/v1.0.0-rc9.zip) ([8b5752cf20d6cb5cbc92](http://releases.cilium.io/v1.0.0-rc9/v1.0.0-rc9.zip.sha256sum))

As usual, let us know on [Slack](http://cilium.io/slack) if you have any questions.
