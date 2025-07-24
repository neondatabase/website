---
title: Neon Documentation MDX Components - Architecture Guide
subtitle: Technical implementation details for developers and maintainers
enableTableOfContents: true
updatedOn: '2025-07-11T20:37:11.989Z'
---

A technical reference for developers and maintainers who need to understand, modify, or extend the Neon documentation component system. This guide covers the architecture, file structure, and implementation details.

<InfoBlock>
<DocsList title="What you will learn:">
<p>How MDX components are structured and organized</p>
<p>Technical implementation details for each component type</p>
<p>Development workflows for adding and modifying components</p>
<p>File organization and build process details</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/community/component-guide">Component Guide</a>
<a href="/docs/community/component-specialized">Component Specialized Guide</a>
<a href="/docs/community/component-icon-guide">Component Icon Guide</a>
<a href="/docs/community/contribution-guide">Documentation Contribution Guide</a>
</DocsList>
</InfoBlock>

## Quick navigation

- [Component architecture](#component-architecture) - How MDX components are integrated
- [File structure](#file-structure) - Directory organization and component locations
- [Component registration](#component-registration) - How components are registered in MDX
- [Icon systems](#icon-systems) - Technical implementation of icon loading
- [Shared content](#shared-content) - How shared templates work
- [Development workflow](#development-workflow) - How to add, modify, or debug components
- [Build process](#build-process) - How components are processed during build
- [Troubleshooting](#troubleshooting) - Common issues and debugging techniques

---

## Component architecture

### MDX integration

Neon documentation uses MDX (Markdown + JSX) to enable React components within markdown content. The component system is built on top of this foundation.

### Component hierarchy

```
MDX Content
  ↓
Component Registry (sharedMdxComponents)
  ↓
React Components (src/components/pages/doc/)
  ↓
Rendered HTML
```

### Key files

- `sharedMdxComponents.js` - Main component registry
- `src/components/pages/doc/` - Component implementations
- `content/docs/` - MDX content files
- `content/docs/shared-content/` - Shared template content

---

## File structure

### Component directory organization

Most MDX components follow a consistent pattern in the Neon website repository:

```
src/components/pages/doc/
├── {component-name}/
│   ├── {component-name}.jsx          # Main component implementation
│   ├── index.js                      # Export file
│   └── images/                       # Component-specific assets
│       └── {icons}.inline.svg        # Inline SVG icons
├── shared/                           # Shared components
│   ├── request-form/
│   └── ...
└── ...
```

### Example: DocsList component

Let's explore the DocsList component as an example:

```
src/components/pages/doc/docs-list/
├── docs-list.jsx                     # Main component implementation
├── index.js                          # Export: export { default } from './docs-list'
└── images/                           # Component-specific images
    ├── docs.inline.svg
    └── repo.inline.svg
```

### Key files to check

When exploring a component, look for these files:

- **Component Definition** (`{component-name}.jsx`)
  - Contains the React component code
  - Defines props and their types
  - Implements the rendering logic
  - May include styled components or CSS modules

- **Index File** (`index.js`)
  - Usually a simple export: `export { default } from './component-name';`
  - Makes the component importable from the directory

- **Images Directory** (`images/`)
  - Contains SVGs, icons, or other assets used by the component
  - For icon-based components, this is where you'll find available icons

---

## Component registration

### Registration process

Components are registered in `sharedMdxComponents.js` to make them available in MDX files:

```js
// sharedMdxComponents.js
import DocsList from '../src/components/pages/doc/docs-list';
import TechCards from '../src/components/pages/doc/tech-cards';
// ... other imports

export const sharedMdxComponents = {
  DocsList,
  TechCards,
  // ... other components
};
```

### MDX Integration

The `sharedMdxComponents` object is passed to the MDX processor, making all registered components available in markdown files:

```jsx
// In MDX files
<DocsList title="Related documentation">
  <a href="/docs/guides/node">Node.js Guide</a>
</DocsList>
```

### Component availability

- **Global**: Components registered in `sharedMdxComponents` are available in all MDX files
- **Local**: Some components may be registered locally for specific pages
- **Conditional**: Components may be conditionally available based on page context

---

## Icon systems

### TechCards icon loading

TechCards icons are loaded dynamically from the public directory:

```js
// TechCards component implementation
const ICONS_PATH = '/images/technology-logos';
const iconPath = `${ICONS_PATH}/${icon}.svg`;
const iconPathDark = `${ICONS_PATH}/${icon}-dark.svg`;

// If the file exists, it will render. If not, the image will be broken/missing.
```

**File Requirements:**

- Icons must exist in `/public/images/technology-logos/`
- Format: `{icon-name}.svg` and `{icon-name}-dark.svg`
- Case-sensitive naming

### DetailIconCards icon loading

DetailIconCards icons are statically imported and mapped:

```js
// DetailIconCards component implementation
import Prisma from './images/prisma.inline.svg';
import NodeJs from './images/node-js.inline.svg';
// ... other imports

const icons = {
  prisma: Prisma,
  'node-js': NodeJs,
  // ... other mappings
};

const Icon = icons[icon];
```

**File Requirements:**

- Icons must be imported as inline SVGs
- Must be explicitly mapped in the component code
- Case-sensitive naming

### Icon system differences

| Aspect          | TechCards                          | DetailIconCards              |
| --------------- | ---------------------------------- | ---------------------------- |
| **Loading**     | Dynamic file loading               | Static imports               |
| **Location**    | `/public/images/technology-logos/` | Component-specific `images/` |
| **Format**      | Standard SVG files                 | Inline SVG imports           |
| **Dark Mode**   | Separate `-dark.svg` files         | Single file with CSS         |
| **Flexibility** | Easy to add new icons              | Requires code changes        |

---

## Shared content

### Shared templates

Shared content components load from templates in `content/docs/shared-content/`:

```
content/docs/shared-content/
├── feature-beta.md
├── public-preview.md
├── early-access.md
└── ...
```

### Template registration

Templates are registered in `shared-content/index.js`:

```js
// shared-content/index.js
export const sharedContent = {
  'feature-beta': () => import('./feature-beta.md'),
  'public-preview': () => import('./public-preview.md'),
  // ... other templates
};
```

### Usage in components

Shared content is loaded dynamically:

```jsx
// In MDX files
<FeatureBeta />  // Loads content from feature-beta.md
<PublicPreview /> // Loads content from public-preview.md
```

### Template structure

Shared templates are standard MDX files with frontmatter:

```mdx
---
title: Feature Beta
description: Beta feature announcement
---

This feature is currently in beta...
```

---

## Development workflow

### Adding a new component

1. **Create Component Directory**

   ```bash
   mkdir src/components/pages/doc/my-component
   ```

2. **Create Component File**

   ```jsx
   // src/components/pages/doc/my-component/my-component.jsx
   import React from 'react';

   const MyComponent = ({ title, children }) => {
     return (
       <div className="my-component">
         <h3>{title}</h3>
         {children}
       </div>
     );
   };

   export default MyComponent;
   ```

3. **Create Index File**

   ```js
   // src/components/pages/doc/my-component/index.js
   export { default } from './my-component';
   ```

4. **Register Component**

   ```js
   // sharedMdxComponents.js
   import MyComponent from '../src/components/pages/doc/my-component';

   export const sharedMdxComponents = {
     // ... existing components
     MyComponent,
   };
   ```

5. **Test Component**

   ```mdx
   <!-- In any MDX file -->

   <MyComponent title="Test">This is a test of my new component.</MyComponent>
   ```

### Modifying existing components

1. **Locate Component**
   - Find the component in `src/components/pages/doc/{component-name}/`
   - Check the main `.jsx` file for implementation

2. **Make Changes**
   - Modify the component logic in the `.jsx` file
   - Update props, styling, or functionality as needed

3. **Test Changes**
   - Check that the component renders correctly
   - Verify that existing usage still works
   - Test edge cases and error conditions

### Debugging components

1. **Check Console Errors**
   - Look for JavaScript errors in browser console
   - Check for missing imports or undefined variables

2. **Verify Registration**
   - Ensure component is properly exported from `index.js`
   - Confirm component is registered in `sharedMdxComponents`

3. **Check File Paths**
   - Verify all imports resolve correctly
   - Check that asset files exist in expected locations

4. **Test in Isolation**
   - Create a simple test page with just the component
   - Remove other components to isolate issues

---

## Build process

### MDX processing

1. **Content Loading**: MDX files are loaded from `content/docs/`
2. **Component Resolution**: `sharedMdxComponents` are injected into MDX context
3. **Transformation**: MDX is transformed to React components
4. **Rendering**: Components are rendered to HTML

### Build pipeline

```
MDX Files → MDX Processor → React Components → HTML Output
     ↓              ↓              ↓              ↓
content/docs/ → sharedMdxComponents → src/components/ → public/
```

### Optimization

- **Code Splitting**: Components are code-split for performance
- **Asset Optimization**: Images and SVGs are optimized during build
- **Caching**: Static assets are cached for faster loading

---

## Troubleshooting

### Common issues

1. **Component Not Found**
   - Check that component is registered in `sharedMdxComponents`
   - Verify the component name matches exactly (case-sensitive)
   - Ensure the component is properly exported

2. **Icon Not Displaying**
   - For TechCards: Check if SVG file exists in `/public/images/technology-logos/`
   - For DetailIconCards: Check if icon is mapped in component code
   - Verify icon name spelling and case

3. **Build Errors**
   - Check for syntax errors in component files
   - Verify all imports resolve correctly
   - Ensure all required dependencies are installed

4. **Styling Issues**
   - Check CSS class names and specificity
   - Verify that styles are properly imported
   - Test in different browsers and screen sizes

### Debugging techniques

1. **Console Logging**

   ```jsx
   const MyComponent = (props) => {
     console.log('MyComponent props:', props);
     return <div>...</div>;
   };
   ```

2. **React DevTools**
   - Use React DevTools to inspect component hierarchy
   - Check props and state values
   - Verify component rendering

3. **Network Tab**
   - Check for failed asset requests
   - Verify that images and SVGs load correctly
   - Look for 404 errors

4. **Source Maps**
   - Enable source maps for better error tracking
   - Use browser dev tools to step through code

### Performance considerations

1. **Bundle Size**
   - Keep components lightweight
   - Use code splitting for large components
   - Optimize images and assets

2. **Rendering Performance**
   - Avoid expensive operations in render methods
   - Use React.memo for expensive components
   - Implement proper key props for lists

3. **Asset Loading**
   - Optimize image sizes and formats
   - Use appropriate loading strategies
   - Consider lazy loading for non-critical components

---

## Summary

This guide provides technical details for working with Neon's MDX component system. Key points:

- **Components** are organized in `src/components/pages/doc/`
- **Registration** happens in `sharedMdxComponents.js`
- **Icons** use different loading strategies for TechCards vs DetailIconCards
- **Shared content** loads from templates in `content/docs/shared-content/`
- **Development** follows standard React patterns with MDX integration

For component usage examples, see the [Component Guide](/docs/community/component-guide) and [Component Specialized Guide](/docs/community/component-specialized).
