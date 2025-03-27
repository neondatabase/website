import CodeSnippet from 'components/shared/code-snippet';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  title: 'Code Snippet Example',
  description: 'Example of using the CodeSnippet component',
});

const CodeSnippetExamplePage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="mb-6 text-3xl font-bold">Code Snippet Examples</h1>

    <h2 className="mb-4 mt-8 text-2xl font-semibold">Markdown File Example</h2>
    <p className="mb-4">This example loads a Markdown file as raw text:</p>
    <CodeSnippet
      url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md"
      title="Neon README"
    />

    <h2 className="mb-4 mt-8 text-2xl font-semibold">TypeScript File Example</h2>
    <p className="mb-4">This example loads a TypeScript file:</p>
    <CodeSnippet
      url="https://raw.githubusercontent.com/neondatabase/serverless/main/index.ts"
      title="Neon Serverless Driver"
    />

    <h2 className="mb-4 mt-8 text-2xl font-semibold">Error Handling Example</h2>
    <p className="mb-4">This example shows how errors are handled:</p>
    <CodeSnippet
      url="https://raw.githubusercontent.com/neondatabase/non-existent-repo/main/file.txt"
      fallback="This repository or file doesn't exist"
      title="Non-existent Repository"
    />

    <h2 className="mb-4 mt-8 text-2xl font-semibold">Component in Markdown Example</h2>
    <p className="mb-4">This example shows how to use CodeSnippet directly in Markdown files:</p>
    <div className="mb-8 rounded bg-gray-new-98 p-4 dark:bg-gray-new-10">
      &lt;CodeSnippet url="https://raw.githubusercontent.com/neondatabase/serverless/main/index.ts"
      title="Neon Serverless Driver" /&gt;
    </div>
  </div>
);

export default CodeSnippetExamplePage;
