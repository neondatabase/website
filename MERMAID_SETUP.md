# Mermaid Diagram Support - Implementation Summary

This document summarizes the Mermaid diagram integration added to the Neon documentation website.

## What Was Added

### 1. Dependencies Installed

- `mermaid` (v11.12.2) - Core Mermaid library for client-side diagram rendering

### 2. Files Created

#### `/src/components/shared/mermaid/mermaid.jsx`

Client-side React component for rendering Mermaid diagrams with Neon-branded colors:

**Key Features:**

- **Client-side rendering**: Uses `'use client'` directive for Next.js compatibility
- **Dynamic theme support**: Automatically detects and responds to light/dark mode changes
- **Neon color scheme**: Built-in configuration with Neon brand colors
- **Error handling**: Displays helpful error messages when diagrams fail to render
- **Responsive design**: Diagrams scale appropriately on all screen sizes

**Key Color Mappings:**

- **Primary Color**: `#00E599` (Neon green)
- **Primary Border**: `#2272b4` (Blue)
- **Secondary**: `#bbdefb` / `#494B50` (Light/Dark)
- **Text Colors**: Dynamically set based on theme
- **Git Branch Colors**: Uses Neon's full color palette

The component includes:

- Automatic theme detection and re-rendering on theme changes
- Light and dark mode color configurations
- Flowchart, sequence, gantt, and other diagram-specific settings
- SVG rendering with proper styling

### 3. Files Modified

#### `/src/components/shared/content/content.jsx`

Updated MDX rendering to include Mermaid support:

- Added `Mermaid` component import
- Modified the `pre` component handler to detect mermaid code blocks
- Renders Mermaid diagrams using the custom client component

**Changes:**

```javascript
// Added import
import Mermaid from 'components/shared/mermaid';

// Updated pre component to handle mermaid blocks
pre: (props) => {
  const code = props?.children?.props?.children;
  const className = props?.children?.props?.className || '';
  const isMermaid = className.includes('language-mermaid');

  if (isMermaid && typeof code === 'string') {
    return <Mermaid chart={code.trim()} />;
  }

  return <CodeBlock {...props} />;
}
```

#### `/src/styles/doc-content.css`

Added comprehensive styling for Mermaid diagrams:

- Container styling with borders and backgrounds
- Dark mode support
- Responsive design for mobile devices
- Text and node styling overrides
- Proper spacing and layout

### 4. Example Documentation

Created `/content/docs/introduction/mermaid-diagrams-example.md` with examples of:

- Flowcharts
- Sequence diagrams
- Git graphs
- Entity relationship diagrams
- State diagrams
- Class diagrams
- Pie charts
- Journey diagrams
- Gantt charts

## Technical Implementation

### Client-Side Rendering Approach

We use a **client-side rendering** approach instead of server-side rendering because:

1. **Next.js RSC Compatibility**: The `next-mdx-remote/rsc` package runs in React Server Components, which don't have access to Node.js APIs that build-time plugins like `rehype-mermaid` require
2. **Dynamic Theme Support**: Client-side rendering allows diagrams to automatically update when users toggle between light and dark modes
3. **Better Performance**: Diagrams are rendered on-demand in the browser
4. **Error Handling**: Client-side rendering provides better error feedback to users

### How It Works

1. Markdown files contain mermaid code blocks with the `mermaid` language tag
2. The MDX parser processes the markdown and creates a `pre` element with the code
3. Our custom `pre` handler in `content.jsx` detects mermaid code blocks by checking for the `language-mermaid` class
4. Instead of rendering a code block, it passes the mermaid code to the `<Mermaid>` component
5. The Mermaid component dynamically imports the mermaid library (only when needed)
6. It configures mermaid with Neon colors based on the current theme
7. The diagram is rendered to SVG and displayed
8. A MutationObserver watches for theme changes and triggers re-rendering when needed

## How to Use Mermaid Diagrams

### Basic Syntax

In any markdown documentation file, use a code block with the `mermaid` language tag:

\`\`\`mermaid
flowchart TD
A[Start] --> B[Process]
B --> C[End]
\`\`\`

### Using AI to Generate Diagrams

You can use AI assistants (ChatGPT, Claude, Cursor, etc.) to generate Mermaid diagrams:

**Example prompts:**

- "Create a Mermaid flowchart showing how Neon's branching works"
- "Generate a sequence diagram for the Neon connection pooling flow"
- "Make an ER diagram for a multi-tenant SaaS database schema"
- "Create a Gantt chart for a database migration project timeline"

The AI will generate the Mermaid syntax that you can paste directly into your markdown files.

### Diagram Types Supported

All standard Mermaid diagram types are supported:

- Flowcharts (`flowchart` or `graph`)
- Sequence diagrams (`sequenceDiagram`)
- Class diagrams (`classDiagram`)
- State diagrams (`stateDiagram-v2`)
- Entity relationship (`erDiagram`)
- Gantt charts (`gantt`)
- Pie charts (`pie`)
- Git graphs (`gitGraph`)
- User journey (`journey`)
- And more...

## Styling Details

### Light Mode

- White background with subtle gray border
- Neon green (#00E599) for primary elements
- Blue (#2272b4) for connections and borders
- Dark text for readability

### Dark Mode

- Dark background (#18191B) matching Neon's design
- Neon green remains prominent
- White/light gray text for readability
- Proper contrast maintained

### Theme Switching

- The component automatically detects theme changes
- Diagrams re-render with appropriate colors when theme toggles
- No manual refresh needed

### Responsive Design

- Diagrams automatically scale on mobile devices
- Horizontal scrolling enabled for wide diagrams
- Text size adjusts for smaller screens
- Padding optimized for different viewports

## Testing

To test the implementation:

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Visit the example page:**
   Navigate to `/docs/introduction/mermaid-diagrams-example`

3. **Test different scenarios:**
   - View in light mode
   - Toggle to dark mode (diagrams should re-render automatically)
   - Test on mobile/tablet devices
   - Try different diagram types
   - Test complex diagrams

## Best Practices

1. **Keep diagrams simple**: Limit to 5-10 nodes maximum for readability
2. **Respect the 800px width limit**: Diagrams are constrained to 800px max width
3. **Use clear labels**: Make nodes and connections self-explanatory
4. **Break up complex flows**: Split large diagrams into multiple focused diagrams
5. **Test readability**: Ensure text is legible at the constrained width
6. **Combine with AI**: Let AI generate the initial code, then simplify
7. **Validate syntax**: Use [Mermaid Live Editor](https://mermaid.live/) to test before adding to docs

## Troubleshooting

### Diagram not rendering

- **Check syntax**: Verify the code block uses `mermaid` as the language tag (not `graph` or `diagram`)
- **Validate code**: Use [Mermaid Live Editor](https://mermaid.live/) to test your diagram syntax
- **Check console**: Open browser DevTools and look for JavaScript errors
- **Clear cache**: Try clearing your browser cache and rebuilding the site
- **Look for error message**: The component displays error messages in red boxes when rendering fails

### Colors look wrong

- **Theme detection**: The component automatically detects light/dark mode from the `dark` class on `document.documentElement`
- **CSS conflicts**: Check if other CSS is overriding Mermaid's styles in browser DevTools
- **Force refresh**: Theme changes should trigger automatic re-rendering; try manually refreshing if not
- **Hard reload**: Try Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows) to force a hard reload

### Layout issues on mobile

- **Test responsively**: Use Chrome DevTools device toolbar to test different screen sizes
- **Simplify diagrams**: Complex diagrams may need to be split into multiple simpler ones for mobile
- **Horizontal scroll**: The container allows horizontal scrolling for wide diagrams
- **Check padding**: The mobile styles reduce padding to maximize space

### Performance issues

- **Large diagrams**: Very complex diagrams may take longer to render (this is normal)
- **Multiple diagrams**: Pages with many diagrams may experience slower initial load
- **Dynamic import**: Mermaid is loaded on-demand, so the first diagram may take a moment
- **Solution**: Consider lazy loading diagrams or simplifying complex ones

### Theme not switching

- **Check implementation**: Ensure the `dark` class is being toggled on `document.documentElement`
- **Observer not working**: Check browser console for errors related to MutationObserver
- **Manual refresh**: If automatic switching fails, refreshing the page should work

## Resources

- [Mermaid Official Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/) - Test and preview diagrams
- [Mermaid GitHub](https://github.com/mermaid-js/mermaid)
- Documentation guide: `/content/docs/community/mermaid-diagrams.md` - Writer's guide with AI instructions
- Component file: `/src/components/shared/mermaid/mermaid.jsx`

## Future Enhancements

Potential improvements to consider:

- Add diagram export functionality (PNG/SVG download button)
- Implement diagram zoom/pan for complex diagrams
- Add more Neon-specific diagram templates
- Create custom Mermaid themes for different documentation sections
- Add lazy loading for better performance with many diagrams
- Add copy-to-clipboard for diagram source code
- Create a diagram gallery page showcasing examples
