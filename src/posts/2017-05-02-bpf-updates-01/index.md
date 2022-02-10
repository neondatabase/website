---
title: 'BPF Updates 01'
description: 'In this 45-minute interview with Lee Robinson, hear Rich Harris, the creator of Svelte, talk about his plans for the future of the framework. Other topics include funding open source, SvelteKit 1.0, the Edge-first future, and more.'
author: 'Stas Kelvich'
draft: true
---

This is the start of a regular newsletter around BPF written by Alexander Alemayhu. It will summarize ongoing development, presentations, videos and other information related to BPF and XDP. It will be released roughly once a week.

---

Recently some interesting developments in the BPF space occurred and the highlights are

- SPARC gained support for eBPF in [7a12b5031c6b (sparc64: Add eBPF JIT., 2017-04-17)](https://git.kernel.org/pub/scm/linux/kernel/git/davem/net-next.git/commit/?id=7a12b5031c6b).
- A generic XDP implementation landed in [b5cdae3291f7 (net: Generic XDP, 2017-04-18)](https://git.kernel.org/pub/scm/linux/kernel/git/davem/net-next.git/commit/?id=b5cdae3291f7).
- BPF support for binutils is [in the works](https://www.spinics.net/lists/netdev/msg433108.html).
- XDP support for ixgbe [got added](https://www.spinics.net/lists/netdev/msg433035.html).

The ixgbe patches were ready earlier but some lost in transit cleanup and build errors required a v2\. Hopefully the binutils effort will lead to BPF support in GCC. While LLVM and clang is available on most distributions, the opportunity to use the familiar GCC will make it even easier for newbies to get started.

Being a XDP newbie is getting more pleasant by the day. Thanks to all of the nice investments being made by kernel developers. The infrastructure and tooling around BPF is improving. You can test your programs with the new `BPF_PROG_TEST_RUN` command and with the generic implementation of XDP you no longer need a special network card. The excuses for not trying out XDP are getting shorter ;->

## Videos

### [Cilium: Network and Application Security with BPF and XDP](https://www.youtube.com/watch?v=ilKlmTDdFgk)

Your friends have probably heard about BPF, Cilium and XDP by now. If not they can watch this great talk on how containers can leverage the true superpowers of BPF.

### [Netdev 2.1 - Keynote By David S. Miller](https://www.youtube.com/watch?v=8Cxg7mpVIWw&feature=youtu.be)

Without spoiling the talk the last parallels drawn at the end is really important to understand where XDP effort is headed next.

### [Netdev 2.1 - Droplet: DDoS countermeasures powered by BPF + XDP](https://www.youtube.com/watch?v=YEU2ClcGqts&feature=youtu.be)

Nice talk on how Facebook is leveraging BPF and XDP in production.

### [Netdev 2.1 - XDP in practice: integrating XDP in our DDoS mitigation pipeline](https://www.youtube.com/watch?v=7OuOukmuivg)

This talk shows some of CloudFlare current DDoS mitigation strategies / tools. The whole talk is good, but the sections where what is preventing adoption and other disadvantages of XDP is interesting.

## In case you missed it

### [eBPF, part 1: Past, Present, and Future](https://ferrisellis.com/posts/ebpf_past_present_future/)

Good walk through on the differences between BPF and eBPF. The historical context makes this a nice read for newbies.

### [Cilium - BPF and XDP Reference Guide](http://docs.cilium.io/en/stable/bpf/)

This documentation section is targeted at developers and users who want to understand BPF and XDP in great technical depth.

### [XDP Newbies Mailing List](https://www.mail-archive.com/netdev@vger.kernel.org/msg162375.html)

Which is a place where people can talk about getting up to speed with setting up an XDP build environment and writing XDP programs.

You can subscribe by sending a email to `majordomo@vger.kernel.org`, with a message body containing `subscribe xdp-newbies`. No subject is needed, but you can of course add one if you like.

## [Random cool note](https://twitter.com/davem_dokebi/status/855595121424859138)

> The JSET cBPF instruction is for parsing DECNET packet headers. See Acknowledgements section of: [http://www.tcpdump.org/papers/bpf-usenix93.pdf](http://www.tcpdump.org/papers/bpf-usenix93.pdf)

## Patches

- Alexei Starovoitov, [[net-next] bpf: `map_get_next_key` to return first key on NULL](https://www.spinics.net/lists/netdev/msg431959.html)
- Alexei Starovoitov, [[PATCH net-next] bpf: enhance verifier to understand stack pointer arithmetic](https://patchwork.ozlabs.org/patch/756817/)
- Daniel Borkmann, [[PATCH net-next] bpf: make `bpf_xdp_adjust_head` support mandatory](https://www.spinics.net/lists/netdev/msg431901.html)
- Daniel Borkmann, [[PATCH net-next 0/5] Misc BPF updates](https://www.spinics.net/lists/netdev/msg432526.html)
  - [[PATCH net-next 1/5] bpf, x86_64/arm64: remove old ldimm64 artifacts from jits](https://www.spinics.net/lists/netdev/msg432522.html)
  - [[PATCH net-next 2/5] bpf: add various test cases to verifier selftests](https://www.spinics.net/lists/netdev/msg432527.html)
  - [[PATCH net-next 3/5] bpf: bpf_lock on kallsysms doesn't need to be irqsave](https://www.spinics.net/lists/netdev/msg432528.html)
  - [[PATCH net-next 4/5] bpf: fix `_htons` occurences in `test_progs`](https://www.spinics.net/lists/netdev/msg432523.html)
  - [[PATCH net-next 5/5] bpf: provide a generic macro for percpu values for selftests](https://www.spinics.net/lists/netdev/msg432524.html)
- Daniel Borkmann, [[PATCH iproute2 net-next v2] bpf: add support for generic xdp](https://www.mail-archive.com/netdev@vger.kernel.org/msg166054.html)
- Daniel Borkmann, [[PATCH net-next] bpf, arm64: implement jiting of BPF_XADD](https://patchwork.ozlabs.org/patch/756977/)
- David Miller, [[PATCH net-next v2] sparc64: Improve 64-bit constant loading in eBPF JIT.](https://www.spinics.net/lists/netdev/msg431967.html)
- David Miller, [[PATCH] sparc64: Fix BPF JIT wrt. branches and ldimm64 instructions.](https://patchwork.ozlabs.org/patch/757381/)
- David Ahern, [[PATCH net-next] samples/bpf: Add support for `SKB_MODE` to xdp1 and `xdp_tx_iptunnel`](https://www.spinics.net/lists/netdev/msg432665.html)
- Eric Dumazet, [[PATCH net-next] net: move xdp_prog field in RX cache lines](https://www.spinics.net/lists/netdev/msg432237.html)
- Eric Dumazet, [[PATCH net-next] bpf: restore skb->sk before pskb_trim() call](https://www.mail-archive.com/netdev@vger.kernel.org/msg165642.html)
- John Fastabend, [[PATCH 0/2] ixgbe updates](https://www.spinics.net/lists/netdev/msg431699.html)
  - [[PATCH 1/2] ixgbe: add XDP support for pass and drop actions](https://www.spinics.net/lists/netdev/msg431700.html)
  - [[PATCH 2/2] ixgbe: add support for XDP_TX action](https://www.spinics.net/lists/netdev/msg431701.html)
- Martin KaFai Lau, [[RFC net-next 0/2] Introduce bpf_prog ID and iteration](https://www.spinics.net/lists/netdev/msg432550.html)
  - [[RFC net-next 1/2] bpf: Introduce bpf_prog ID](https://www.spinics.net/lists/netdev/msg432552.html)
  - [[RFC net-next 2/2] bpf: Test for `bpf_prog` ID and `BPF_PROG_GET_NEXT_ID`](https://www.spinics.net/lists/netdev/msg432551.html)
- Jakub Kicinski, [[PATCH net-next 0/6] nfp: optimize XDP TX and small fixes](https://www.mail-archive.com/netdev@vger.kernel.org/msg165967.html)
  - [[PATCH net-next 1/6] nfp: replace -ENOTSUPP with -EOPNOTSUPP](https://www.mail-archive.com/netdev@vger.kernel.org/msg165971.html)
  - [[PATCH net-next 2/6] nfp: drop rx_ring param from buffer allocation](https://www.mail-archive.com/netdev@vger.kernel.org/msg165972.html)
  - [[PATCH net-next 3/6] nfp: do simple XDP TX buffer recycling](https://www.mail-archive.com/netdev@vger.kernel.org/msg165968.html)
  - [[PATCH net-next 4/6] nfp: avoid reading TX queue indexes from the device](https://www.mail-archive.com/netdev@vger.kernel.org/msg165973.html)
  - [[PATCH net-next 5/6] nfp: don't completely refuse to work with old flashes](https://www.mail-archive.com/netdev@vger.kernel.org/msg165970.html)
  - [[PATCH net-next 6/6] nfp: provide 256 bytes of XDP headroom in all configurations](https://www.mail-archive.com/netdev@vger.kernel.org/msg165969.html)
- Jakub Kicinski, [[PATCH net-next 0/4] xdp: use netlink extended ACK reporting](https://www.mail-archive.com/netdev@vger.kernel.org/msg166365.html)
  - [[PATCH net-next 1/4] netlink: add NULL-friendly helper for setting extended ACK message](https://www.mail-archive.com/netdev@vger.kernel.org/msg166364.html)
  - [[PATCH net-next 2/4] xdp: propagate extended ack to XDP setup](https://www.mail-archive.com/netdev@vger.kernel.org/msg166367.html)
  - [[PATCH net-next 3/4] nfp: make use of extended ack message reporting](https://www.mail-archive.com/netdev@vger.kernel.org/msg166368.html)
  - [[PATCH net-next 4/4] virtio_net: make use of extended ack message reporting](https://www.mail-archive.com/netdev@vger.kernel.org/msg166366.html)
- Jesper Dangaard Brouer, [[net-next PATCH V1] samples/bpf: bpf_load.c detect and abort if ELF maps section size is wrong](https://www.spinics.net/lists/netdev/msg432861.html)
- Jesper Dangaard Brouer, [[net-next PATCH 0/2] samples/bpf: two bug fixes to `XDP_FLAGS_SKB_MODE` attaching](https://www.mail-archive.com/netdev@vger.kernel.org/msg166370.html)
  - [[net-next PATCH 1/2] samples/bpf: fix SKB_MODE flag to be a 32-bit unsigned int](https://www.mail-archive.com/netdev@vger.kernel.org/msg166371.html)
  - [[net-next PATCH 2/2] samples/bpf: fix `XDP_FLAGS_SKB_MODE` detach for `xdp_tx_iptunnel`](https://www.mail-archive.com/netdev@vger.kernel.org/msg166372.html)

Please note that netdev receives a lot of patches and the list above is not meant to be complete.
