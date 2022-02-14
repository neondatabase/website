---
title: 'Cilium 1.2.7: DNS Security Policies, EKS Support, ClusterMesh, kube-router integration'
description: 'In this 45-minute interview with Lee Robinson, hear Rich Harris, the creator of Svelte, talk about his plans for the future of the framework. Other topics include funding open source, SvelteKit 1.0, the Edge-first future, and more.'
author: 'Stas Kelvich'
---

![Cilium Kubernetes](k8s_ship.png)

We are excited to announce the Cilium 1.2 release. The release introduces
several new features addressing the top asks from Cilium users and community
members. One of the most exciting features is the introduction of security
policies based on DNS names to secure access to external services outside of
the cluster. Another top ask was to introduce the ability to connect and secure
multiple Kubernetes clusters. We are introducing ClusterMesh as an alpha level
feature to address this ask. It allows to connect and secure pods running in
different Kubernetes clusters. Equally important is the Kube-router integration
with Cilium. The effort led by the team from DigitalOcean enables to combine
BGP networking provided by kube-router with BPF based security and
load-balancing from Cilium. As usual, a big shout out to the entire community
of Cilium developers. The total number of contributors has grown to 85 and 579
commits have been contributed in the time period between 1.1 and 1.2.

## What is Cilium?

Cilium is open source software for transparently providing and securing the
network and API connectivity between application services deployed using Linux
container management platforms like Kubernetes, Docker, and Mesos.

| Syntax    | Description | Syntax    | Description | Syntax    | Description |
| --------- | ----------- | --------- | ----------- | --------- | ----------- |
| Header    | Title       | Header    | Title       | Header    | Title       |
| Paragraph | Text        | Paragraph | Text        | Paragraph | Text        |

At the foundation of Cilium is a new Linux kernel technology called BPF, which
enables the dynamic insertion of powerful security, visibility, and networking
control logic within Linux itself. Besides providing traditional network level
security, the flexibility of BPF enables security on API and process
level to secure communication within a container or pod. Because BPF runs
inside the Linux kernel, Cilium security policies can be applied and updated
without any changes to the application code or container configuration.

<iframe width="1046" height="588" src="https://www.youtube.com/embed/J1BJScem0l4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

See the section **[Introduction to Cilium](http://docs.cilium.io/en/v1.1/intro/)**
for a more detailed general introduction to Cilium.

## 1.2 Release Highlights

- **DNS/FQDN based security policies**
  - Define network security rules based on FQDN/DNS names to express
    allowed connectivity to external services, e.g. allow to foo.com. (Beta)
- **AWS EKS Support**
  - New integrated etcd operator tailored to managed Kubernetes to remove the
    dependency on requiring an external kvstore. (Beta)
- **Clustermesh (Inter-cluster connectivity)**
  - Pod to pod networking across multiple Kubernetes clusters (Alpha)
  - Label based network security policy enforcement across clusters,
    e.g. allow pod foo in cluster1 to talk to pod bar in cluster2 (Alpha)
- **Kube-router integration for BGP support**
  - Co-operative mode to run alongside kube-router to enable BGP networking
- **KVstore based Node Discovery**
  - Enables automatic node discovery on non-Kubernetes environments
- **Load balancing**
  - Support for consistent backend selection as service backends scale
  - Support for service label/name based policy in combination with L4 rules
- **Efficiency & Scale**
  - Increased security identity space from 16 to 24 bits for large and multi
    cluster scale environments
  - First implementation of BPF based datapath notification aggregation
  - Continued progress on more efficient CPU utilization
  - Automatically detect MTU of underlying network
  - Use of local service ID allocation when DSR is disabled for improved load
    balancing scalability
- **Documentation**
  - New AWS EKS installation guide
  - Reference to kubespray installation guide
  - New simplified installation and upgrade instructions

## DNS Based Security Policies

Services running in a Kubernetes cluster often interact with a range of
services that are external to the cluster. Common examples include SaaS
services such as S3, RDS, DynamoDB, etc., API based services such as Google
maps, Salesforce APIs, Twilio, etc. or self-hosted services such as Oracle
database clusters, Windows based applications, etc. Until now, Cilium supported
CIDR based policies for interacting with such external services. However, CIDR
based policies are difficult to define and maintain since the IP-addresses for
the services can change frequently. Cilium 1.2 now supports specifying policies
based on DNS names. The current implementation supports the core use case of
white-listing external services based on their FQDNs. Considering the
complexities around DNS resolutions (e.g. TTLs, CNAMEs, etc. ) and associated
policy requirements (e.g. wildcard based specification such as \*.google.com),
there is more work coming in subsequent releases for comprehensive DNS based
policies.

1. Increased security identity space from 16 to 24 bits for large and multi
   cluster scale environments
2. First implementation of BPF based datapath notification aggregation
3. Continued progress on more efficient CPU utilization
4. Automatically detect MTU of underlying network
5. Use of local service ID allocation when DSR is disabled for improved load
   balancing scalability

> Thank you for the swag, [@GatsbyJS](https://twitter.com/GatsbyJS?ref_src=twsrc%5Etfw)! Probably I should start bringing it to meetings with customers, so people could know what will be used for the website development from the first glance. [pic.twitter.com/bBacuseEu7](https://t.co/bBacuseEu7)
>
> — Alex Barashkov (@alex_barashkov) [February 10, 2022](https://twitter.com/alex_barashkov/status/1491753625768665091?ref_src=twsrc%5Etfw)

### Example: Allow to my-remote-service.com

The following simple example demonstrates how to define a network security
policy that allows all pods with the label app=test-app to resolve DNS names
via kube-dns and make external requests to the service my-remote-service.com:

```text
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: "to-fqdn-example"
spec:
  endpointSelector:
    matchLabels:
      app: test-app
  egress:
    - toFQDNs:
        - matchName: "my-remote-service.com"
    - toEndpoints:
      - matchLabels:
          "k8s:io.cilium.k8s.policy.serviceaccount": kube-dns
          "k8s:io.kubernetes.pod.namespace": kube-system
          "k8s:k8s-app": kube-dns
      toPorts:
      - ports:
        - port: "53"
          protocol: UDP
```

```yaml
apiVersion: 'cilium.io/v2'
kind: CiliumNetworkPolicy
metadata:
  name: 'to-fqdn-example'
spec:
  endpointSelector:
    matchLabels:
      app: test-app
  egress:
    - toFQDNs:
        - matchName: 'my-remote-service.com'
    - toEndpoints:
        - matchLabels:
            'k8s:io.cilium.k8s.policy.serviceaccount.k8s.policy.serviceaccount.k8s.policy.serviceaccount.k8s.policy.serviceaccount.k8s.policy.serviceaccount': kube-dns
            # 'k8s:io.kubernetes.pod.namespace': kube-system
            'k8s:k8s-app': kube-dns
      toPorts:
        - ports:
            - port: '53'
              protocol: true
```

```swift
Purchases.shared.purchasePackage(package) { (transaction, purchaserInfo, error, userCancelled) in
  if purchaserInfo.entitlements["your_entitlement_id"]?.isActive == true {
    // Unlock that great "pro" content
  }
}
```

Cilium will automatically maintain the respective CIDR based rules to allow all
pods to talk to all IP addresses that are being returned for that DNS name.

## AWS EKS Support

Follow the new guide [Installation on AWS EKS using etcd
operator](http://docs.cilium.io/en/v1.2/kubernetes/install/eks/) to install
Cilium on AWS EKS managed Kubernetes clusters.

The installation guide features the brand new integrated etcd operator for
Cilium to manage its own etcd cluster. Cilium requires a key-value store such
as etcd to store security identities. In many cases the etcd used by Kubernetes
isn’t accessible for use by Cilium. For example, in managed Kubernetes such as
EKS, GKE, AKS, etc. there is limited access to the Kubernetes etcd service. In
Cilium 1.2, we are using an etcd operator which will install and manage a
highly available etcd cluster for use by Cilium. This will make the
installation and use of Cilium much easier without any dependencies on
Kubernetes etcd and without requiring an out-of-band management of etcd
clusters.

We are actively working on AKS integration and guides on how to run on GKE will
be published in the next couple of weeks. Talk to us on [Slack] if you have
questions or need help.

## ClusterMesh: Networking and Security across Multiple Kubernetes Clusters

Running multiple Kubernetes clusters is becoming common. Major use cases high
availability of services running in different Availability Zones or Regions;
point-of-presence services running in multiple clusters serving different
geo-locations; organizational reasons such as separating PCI vs non-PCI
compliant services; or simple separation of dev, test and prod workloads.

One of the fundamental requirements for multiple Kubernetes clusters is how to
connect the services and how to establish east-west network security for the
cross-cluster interactions. In Cilium 1.2, we are introducing the ability to
connect pods in different clusters without requiring any ingress controllers or
load balancers. Since pods are able to interact directly, Cilium is able to
preserve their identity and enforce complete L3/L4 and L7 access controls for
the east-west traffic.

`video: https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm`

![ClusterMesh Architecture](clustermesh.png)

Rather than using a single centralized etcd for all clusters, Cilium uses a
decentralized approach for creating the cluster-mesh and establishing pod
identities. In this approach, each cluster is able to independently manage
identities for their pods. Each cluster is assigned a unique identifier, which
also serves as an identity namespace. So the pod identity becomes a combination
of cluster identity + pod identity. This approach is easy to manage and scale
rather than coordinating the identities across all clusters. The approach also
aligns well with the high-availability goals for multi-cluster deployments in
that each cluster lifecycle is independent of others. Check out the
[multi-cluster install guide](https://cilium.readthedocs.io/en/stable/kubernetes/install/clustermesh/#clustermesh)
to try the Cilium cluster-mesh.

## BGP Support: Kube-router + Cilium

![Kube-router](kube-router.png)

Kube-router is a cloudnativelabs initiative to address a variety of Kubernetes
networking requirements and deliver a unified solution. From a data-forwarding
perspective, Kube-router uses BGP to broadcast and manage the routes for all
pods in a cluster. Using BGP peering with external routers, Kube-router can
make it easy to establish connectivity between Kubernetes pods and services
running outside the cluster. Also, Kube-router advertises the cluster IP when
service is created which means that a service can be accessed from outside the
cluster using single cluster IP and standard ports.

As a result of the community effort led by the DigitalOcean team, Cilium is
now integrated with Kube-router combining the benefits of BPF with BGP based
routing.

Check out the guide [Using kube-router to run
BGP](http://docs.cilium.io/en/v1.2/kubernetes/install/kube-router/) to learn
how to run kube-router and Cilium side by side to run BGP networking with
Cilium L3-L7 policy enforcement and load-balancing.

## Istio 1.0 Support

![Istio Logo](istio.png)

Istio 1.0 was released recently. Cilium is already well integrated with Istio
providing efficient data forwarding as well as L3/L4 and L7 security for
servicemesh architectures. We have blogged about this in details in the
post [Istio 1.0: How Cilium enhances Istio with socket-aware BPF
programs](blog/2018/08/07/istio-10-cilium). Cilium 1.2 includes several
improvements in the integration with Istio 1.0.

## Scalability & Efficiency

As usual, a large effort continues for improving the already good scalability
and becoming more CPU efficient by extensively profiling Cilium in various environment
and by optimizing the operation of connection tracking and other crucial data structures.
Ping us on [Slack] if you would like to learn more.

## Upgrade Instructions

As usual, follow the [upgrade
guide](https://cilium.readthedocs.io/en/v1.2/install/upgrade/#upgrading-minor-versions)
to upgrade your Cilium deployment. Feel free to ping us on
[Slack].

## Release

- Container image: `docker.io/cilium/cilium:v1.2.0`

[slack]: http://cilium.io/slack
