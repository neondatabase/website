---
title: Restrict access to the production branch
description: >-
  You can now protect your critical Neon branches (e.g. production) so they
  can’t be accessed by unauthorized devs or deleted by accident.
excerpt: >-
  Via database branching workflows, developers can quickly experiment and ship
  updates—this is why we often hear how Neon accelerates development for teams.
  But it can be nerve-wracking to think that you might accidentally delete the
  production branch or project. To give you peace...
date: "2024-07-26T17:30:44"
updatedOn: "2024-07-26T17:30:45"
category: company
categories:
  - company
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-the-production-branch/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Restrict access to the production branch - Neon
  description: >-
    You can now protect your critical Neon branches (e.g. production) so they
    can’t be accessed by unauthorized devs or deleted by accident.
  keywords: []
  noindex: false
  ogTitle: Restrict access to the production branch - Neon
  ogDescription: >-
    You can now protect your critical Neon branches (e.g. production) so they
    can’t be accessed by unauthorized devs or deleted by accident.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-the-production-branch/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-the-production-branch/neon-protect-1-1024x576-9b03a7ab.jpg)

Via [database branching workflows](https://neon.tech/flow), developers can quickly experiment and ship updates—this is why we often hear [how Neon accelerates development for teams](https://neon.tech/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle). But it can be nerve-wracking to think that you might accidentally delete the production branch or project.

**To give you peace of mind, we’ve implemented** [**protected branches**](https://neon.tech/docs/guides/protected-branches) **in Neon.** By designating a branch as protected, you’ll enforce specific restrictions regarding access and usability, preventing any accidents and limiting access to allowlisted IP lists and networks.

![Image](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-the-production-branch/ad4nxfi4p8hwx7amuwe1vs-j5yrajz3pfnuqiaj123yxwcfhaeilwq-mnbhf-ll99plsoyjd2s15qyx34ixguxevklpar1u-fbek5r-aauapvuk5i9jglzdt8elp3zcmgbqufoqlww5ui8je2xowsde5qse-70fd1953.png)

## How protected branches are different from regular branches

Once you set a branch to protected, you’ll enforce a set of rules regarding access control and operational restrictions:

- **Protected branches cannot be deleted or reset.** This safeguards critical data from potential accidents. Similarly, projects containing protected branches cannot be deleted, nor can compute endpoints associated with protected branches.
- **Only authorized IP addresses can connect to protected branches.** Access to these branches can be limited to the specific IP addresses defined in the project’s [IP allowlist](https://neon.tech/docs/introduction/ip-allow). This ensures that only connections from your protected, e.g. production networks can be established to these branches.

<blockquote>
<p><strong>Coming soon:</strong> We’ll enhance protected branches by ensuring the production branch credentials aren’t reused in dev and testing branches. Sign up for our <a href="https://neon.tech/early-access-program">Early Access list</a> if you’d like to test it first.</p>
</blockquote>

## When to protect your branch

**It’s good practice to enable branch protection for all your production branches, as well as any other branches critical to the workflow (e.g., staging).**

Here are some reasons why you might want to do this:

### Preventing accidental deletions or resets

When things are moving fast in the development process, there’s always a risk of accidental deletions or resets of important branches. By protecting your branch, you eliminate this possibility, giving you peace of mind against accidents with major consequences.

### Maintaining compliance

Some data regulations enforce access controls and audit trails—you might want to ensure that only allowed sources from internal networks have access to customer data in production.

### Safeguarding staging environments

Protecting the staging branch is also a good idea. This ensures that only trusted team members can access and modify this environment, preventing changes that could lead to inconsistencies between staging and production.

## How to protect a branch in Neon

First, select which branches within the project will have the protected status:

- Navigate to the `Branches` page.
- Choose the branch to protect, click the `Actions` drop-down menu, and select `Set as protected`.

![Image](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-the-production-branch/ad4nxdv0pmwyvzphgwum1ykjv866l1znxzxaatvq8p9h4nqdxmw5cvnme-1qv4txibw5xuqjcedhtlo81yxrctkova3vxjpwgcegmrm3p7bkuiyuhsxgn2himpmfgq3uuwjijp78el68o48q7mvyo2fga4eo-e35dcc15.png)

This will make it so it’s not possible to delete this branch. Then, optionally, you can configure IP Allow for your project, if you also want to restrict access to specific IP addresses:

- In the Neon console, go to Project settings.
- Select IP Allow, and specify the IP addresses to permit.
- Save changes.

![Image](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-the-production-branch/ad4nxdlrdgephdn92idmf4dgc0wi2lxdnq6btfp2-ugxdfce9up2idg6lue760bpohmht9vkirb4nxfvninyhh68rxgruyghux0fqz0f1usdtomjkczu7pealg6s2jb9gv0o0lx8jccpwgqhoistef4yo-035a83d0.png)

Done. Your branch will show as protected; only clients from allowlisted IP addresses and networks will be able to connect to it, and you won’t be able to delete or reset it unless the protected status is first revoked.

![Image](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-the-production-branch/ad4nxd0l4v487lwigv8pslhjetlzgfvav-7159a1otdadhlv0fxaxwmyqu2v1j4ado1o6bwe-aketmrdgub2krekqtjnglujr5oc92ruodnaeswfittbtud1mll8u9rfqbgo7bistlndsvym04gin41fbsmd4a-fb58de36.png)

Visit [our docs](https://neon.tech/docs/guides/protected-branches) for detailed instructions.

## Now available in the Scale plan

Branch protection is a feature available [in the Neon Scale plan](https://neon.tech/pricing), which offers full platform access for scaling production workloads, with priority support and up to 500 branches per project. If you don’t yet have a Neon account, [you can also get started with our Free tier](https://console.neon.tech/signup).
