# Documentation

Welcome to Neon documentation! This folder contains the source code of the [Neon documentation](https://neon.tech/docs/)

## Basic rules

1. Every single Markdown file in this folder will be turned into a documentation page
2. `slug` is generated based on the folder structure and file names inside `docs` folder. For example, [About Neon page](./cloud/about.md) will have [cloud/about] slug
3. There is no need to add `h1` to the page since it will be displayed automatically with the value from `title` field

## Fields

Right now Markdown files accept 2 fields:

1. `title` — title of the page (required)
2. `isDraft` — flag that says the page is not ready yet. It won't appear in production but will appear in the development mode

> ⚠️ Please note that project won't build if one of Markdown files doesn't have even a single required field

## Sidebar

Sidebar data is stored in [sidebar.yaml](./sidebar.yaml) file

### How to add a new category

In order to add a new category to the sidebar, add a new item to the top level array with keys `title` and `items`

### How to add a new page

In order to add a new page, add a new item to `items` array with keys `title` and `slug` under specific category:

- `title` in the sidebar may differ from `title` in Markdown file
- `slug` should always match page's slug

## Code blocks

All available languages for code blocks can be found [here](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/HEAD/AVAILABLE_LANGUAGES_PRISM.MD)

## Contributing

For small changes and spelling fixes, we recommend using the GitHub UI because the markdown files are relatively easy to edit.

For larger contributions, consider running the project locally to see how the changes look like before making a pull request.
