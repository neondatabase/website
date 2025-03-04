---
title: Neon Docs Components
enableTableOfContents: true
updatedOn: '2025-03-04T11:00:00.000Z'
---

This page lists all the components that are available in the Neon Docs.

## Basic components

Basic components are reusable `jsx` components. You can find them in the [/src/components/pages/doc](https://github.com/neondatabase/website/tree/main/src/components/pages/doc) or [/src/components/shared](https://github.com/neondatabase/website/tree/main/src/components/shared) folders.

### Code Tabs

To display code tabs, wrap all pieces of code with `<CodeTabs></CodeTabs>` and write labels of code tabs in order:

````md
<CodeTabs labels={["Shell", "C++"]}>

```bash {2-4}
#!/bin/bash
STR="Hello World!"
echo $STR
```

```c++
#include <iostream>

int main() {
    std::cout << "Hello World";
    return 0;
}
```

</CodeTabs>
````

<CodeTabs labels={["Shell", "C++"]}>

```bash {2-4}
#!/bin/bash
STR="Hello World!"
echo $STR
```

```c++
#include <iostream>

int main() {
    std::cout << "Hello World";
    return 0;
}
```

</CodeTabs>

### Tabs

To display the tabs with content as image, video, code block, .etc, wrap the `TabItem` with `Tabs`

```md
<Tabs labels={["Content", "CLI"]}>

<TabItem>
In your config v3 project, head to the `/metadata/databases/databases.yaml` file and add the database configuration as below.
</TabItem>

<TabItem>
Alternatively, you can create read replicas using the Neon API or Neon CLI.
</TabItem>

</Tabs>
```

<Tabs labels={["Content", "CLI"]}>

<TabItem>
In your config v3 project, head to the `/metadata/databases/databases.yaml` file and add the database configuration as below.
</TabItem>

<TabItem>
Alternatively, you can create read replicas using the Neon API or Neon CLI.
</TabItem>

</Tabs>

## Shared MDX components

Shared MDX components are used to create reusable components with markdown content. They can use [Basic components](#basic-components) as children. You can find them in the [/content/docs/shared-content](https://github.com/neondatabase/website/tree/main/content/docs/shared-content) folder.

### Early Access

```md
<EarlyAccess />
```

<EarlyAccess />

### Need Help?

```md
<NeedHelp />
```

<NeedHelp />

### Feature Beta

```md
<FeatureBeta />
```

<FeatureBeta />

### Feature Beta With Props

To display the `FeatureBeta` with props, use `FeatureBetaProps` with `feature_name` prop.

```md
<FeatureBetaProps feature_name="Feature Name" />
```

<FeatureBetaProps feature_name="Feature Name" />
