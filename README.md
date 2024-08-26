# Neon Next.js

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Learn more](#learn-more)
  - [Build the website](#deploy-on-vercel)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [VS Code](#vs-code)
- [Docs](#docs)

## Getting Started

1. Clone this repository

```bash
git clone git@github.com:neondatabase/website.git
```
*This also works for other respitories (But change the url).
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
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `src/app/page.jsx`. The page auto-updates as you edit the file.

### Build the website

```bash
npm run build
```

### Run the built website

```bash
npm run start
```

### Checks broken links

```bash
npm run check:broken-links -- https://neon.tech
```

_The command may take time, be patient. You can also specify which part of the website you want to check by passing a specific URL, for example `https://neon.tech/docs` for checking the Docs_

> N.B. The automatic check is done every Monday at midnight by GitHub CI. You can find the reports on the "Actions" tab

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Project Structure

```text
├── content — Documentation sources in `mdbook` format, see [Documentation](#docs) section
├── public
├── src
│   ├── app
│   ├── components
│   │  ├── pages — React components that are being used specifically on a certain page
│   │  └── shared — React components that are being used across the whole website
│   ├── hooks
│   ├── icons
│   ├── images
│   ├── lib
│   ├── scripts
│   ├── styles
│   ├── utils
├── next.config.js — Main configuration file for a Next.js site. Read more about it [here](https://nextjs.org/docs/api-reference/next.config.js/introduction)
├── postcss.config.js — Main configuration file of PostCSS. [Read more about it here](https://tailwindcss.com/docs/configuration#generating-a-post-css-configuration-file)
└── tailwind.config.js — Main configuration file for Tailwind CSS [Read more about it here](https://tailwindcss.com/docs/configuration)
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

## Docs

Documentation for docs is described in [content/docs/README.md](./content/docs/README.md)
