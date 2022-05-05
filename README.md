# Neon Gatsby

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Run the website](#run-the-website)
  - [Build the website](#build-the-website)
  - [Run the built website](#run-the-built-website)
  - [Clean Gatsby cache](#clean-gatsby-cache)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [VS Code](#vs-code)
- [Documentation](#docs)

## Getting Started

1. Clone this repository

```bash
git clone git@github.com:neondatabase/website.git
```

2. Install dependencies

```bash
npm install
```

3. Fill environment variables

```bash
cp .env.example .env
```

## Usage

### Run the website

```bash
npm run start
```

### Build the website

```bash
npm run build
```

### Run the built website

```bash
npm run serve
```

### Clean Gatsby cache

```bash
npm run clean
```

## Project Structure

```text
├── docs — Documentation sources in `mdbook` format, see [Documentation](#docs) section
├── src
│   ├── components
│   │  ├── pages — React components that are being used specifically on a certain page
│   │  └── shared — React components that are being used across the whole website
│   ├── hooks
│   ├── images
│   ├── pages
│   ├── styles
│   ├── templates
│   ├── utils
│   └── html.jsx — HTML template for all generated pages. Read more about it here — gatsbyjs.org/docs/custom-html
├── static
│   └── fonts
├── gatsby-browser.js — Usage of the Gatsby browser APIs. Read more about it [here](gatsbyjs.org/docs/browser-apis)
├── gatsby-config.js — Main configuration file for a Gatsby site. Read more about it [here](gatsbyjs.org/docs/gatsby-config)
├── gatsby-node.js — Usage of the Gatsby Node APIs. [Read more about it here](gatsbyjs.org/docs/node-apis)
└── gatsby-ssr.js — Usage of the Gatsby server-side rendering APIs. [Read more about it here](gatsbyjs.org/docs/ssr-apis)
```

## Component Folder Structure

### Each component includes

1. Main JavaScript File
2. Index File

### Each component optionally may include

1. Folder with images and icons
2. Folder with data

Also, each component may include another component that follows all above listed rules.

### Example structure

```bash
component
├── nested-component
│  ├── data
│  │  └── nested-component-lottie-data.json
│  ├── images
│  │  ├── nested-component-image.jpg
│  │  ├── nested-component-inline-svg.inline.svg
│  │  └── nested-component-url-svg.url.svg
│  ├── nested-component.js
│  └── index.js
├── data
│  └── component-lottie-data.json
├── images
│  ├── component-image.jpg
│  ├── component-inline-svg.inline.svg
│  └── component-url-svg.url.svg
├── component.js
└── index.js
```

## Code Style

### ESLint

[ESLint](https://eslint.org/) helps find and fix code style issues and force developers to follow same rules. Current configuration is based on [Airbnb style guide](https://github.com/airbnb/javascript).

Additional commands:

```bash
npm run lint
```

Run it to check the current status of eslint issues across project.

```bash
npm run lint:fix
```

Run it to fix all possible issues.

### Prettier

[Prettier](https://prettier.io/) helps to format code based on defined rules. [Difference between Prettier and ESLint](https://prettier.io/docs/en/comparison.html).

Additional commands:

```bash
npm run format
```

Run it to format all files across the project.

### VS Code

Following extensions required to simplify the process of keeping the same code style across the project:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

After installation enable "ESLint on save" by adding to your VS Code settings.json the following line:

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}
```

You can navigate to settings.json by using Command Pallete (CMD+Shift+P) and then type "Open settings.json".

To enable Prettier go to Preferences -> Settings -> type "Format". Then check that you have esbenp.prettier-vscode as default formatter, and also enable "Format On Save".

Reload VS Code and auto-format will work for you.

## Documentation

Documentation is in the [mdBook](https://rust-lang.github.io/mdBook/) format.
To build it locally you need `mdbook` binaries installed:

```bash
cargo install mdbook
cd docs
mdbook build
```

During the deploy documentation is automatically built by the `./build_docs.sh` script which places results into `public/docs`.
