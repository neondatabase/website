import MarkdownSnippet from 'components/shared/markdown-snippet';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  title: 'Markdown Snippet Example',
  description: 'Example of using the MarkdownSnippet component',
});

const MarkdownSnippetExamplePage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="mb-6 text-3xl font-bold">Markdown Snippet Examples</h1>

    <h2 className="mb-4 mt-8 text-2xl font-semibold">Client-side Rendering Example</h2>
    <p className="mb-4">This example loads the Markdown on the client side:</p>
    <MarkdownSnippet
      url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md"
      title="Neon README"
    />

    <h2 className="mb-4 mt-8 text-2xl font-semibold">Error Handling Example</h2>
    <p className="mb-4">This example shows how errors are handled:</p>
    <MarkdownSnippet
      url="https://raw.githubusercontent.com/neondatabase/non-existent-repo/main/README.md"
      fallback="This repository or file doesn't exist"
      title="Non-existent Repository"
    />
  </div>
);

export default MarkdownSnippetExamplePage;
