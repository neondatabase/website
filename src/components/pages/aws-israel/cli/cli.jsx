import parse from 'html-react-parser';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import highlight from 'lib/shiki';

const code = `> neonctl connection-string

postgres://[user]:[password]@ep-cool-darkness-123456.il-central-1.aws.neon.tech/neondb
`;

const Cli = async () => {
  const highlightedCode = await highlight(code, 'sql');
  return (
    <section className="cli safe-paddings mt-48 xl:mt-[124px] lg:mt-28 md:mt-20">
      <Container className="dark flex flex-col items-center" size="medium">
        <GradientLabel>Neon CLI</GradientLabel>
        <h2 className="mt-5 max-w-2xl text-center font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:max-w-lg lg:text-4xl md:mt-3 md:max-w-sm md:text-[32px]">
          Neon reduces database complexity to a URL
        </h2>
        <p className="mt-3 text-center text-lg font-light leading-snug xl:text-base md:max-w-xs">
          Postgres is available at your fingertips with advanced Neon CLI features.
        </p>

        <CodeBlockWrapper className="highlighted-code mt-11 w-full max-w-[716px] rounded-md border border-gray-new-15 text-[15px] lg:mt-8">
          {parse(highlightedCode)}
        </CodeBlockWrapper>
      </Container>
    </section>
  );
};

export default Cli;
