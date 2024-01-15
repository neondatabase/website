import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link/link';
import ArrowIcon from 'icons/arrow-sm.inline.svg';
import highlight from 'lib/shiki';

const snippet = {
  title: 'pgvector',
  code: `CREATE EXTENSION vector;
CREATE TABLE items (id BIGSERIAL PRIMARY KEY, embedding VECTOR(3));
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 1;`,
  text: 'Store embeddings and perform vector similarity search in Postgres with pgvector.',
  linkUrl: '/docs/extensions/pgvector',
};

const Integration = async () => {
  const codeSnippet = await highlight(snippet.code, 'sql');
  return (
    <section className="integration safe-paddings mt-48 xl:mt-[124px] lg:mt-28 md:mt-20">
      <Container className="flex flex-col items-center" size="medium">
        <GradientLabel>Get Started</GradientLabel>
        <h2 className="flat-breaks sm:flat-none mt-5 text-center text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:mt-3 md:text-[32px]">
          Simple to use,
          <br /> scales automatically
        </h2>
        <p className="mt-3 text-center text-lg font-light leading-snug xl:text-base md:max-w-xs">
          Store vector embeddings and perform similarity search
        </p>
        <CodeBlockWrapper className="show-linenumbers highlighted-code dark mt-11 w-full max-w-[716px] rounded-md border border-gray-new-15 text-[15px] xl:mt-10 sm:mt-8">
          <div dangerouslySetInnerHTML={{ __html: codeSnippet }} />
        </CodeBlockWrapper>
        <p className="mt-2 text-sm font-light leading-dense tracking-extra-tight text-gray-new-60">
          <span className="mr-1.5" dangerouslySetInnerHTML={{ __html: snippet.text }} />
          <Link
            className="inline-flex items-baseline tracking-extra-tight"
            theme="green"
            to={snippet.linkUrl}
          >
            Learn more
            <ArrowIcon className="ml-1" />
            <span className="sr-only">about {snippet.title}</span>
          </Link>
        </p>
      </Container>
    </section>
  );
};

export default Integration;
