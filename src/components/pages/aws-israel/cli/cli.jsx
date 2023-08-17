import CodeBlock from 'components/shared/code-block/code-block';
import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';

const code = `  > neonctl connection-string <branch> --project-id=<your-project-id>

Connection Uri
postgres://<user>:<password>@epl-792025.us-east-2.aws.neon.tech/neondb
`;

const Cli = () => (
  <section className="cli safe-paddings mt-48">
    <Container className="dark flex flex-col items-center" size="medium">
      <GradientLabel>Neon CLI</GradientLabel>
      <h2 className="mt-5 max-w-2xl text-center text-5xl font-medium leading-none tracking-extra-tight">
        Neon reduces database complexity to a URL
      </h2>
      <p className="mt-3 text-center text-lg font-light leading-snug">
        Postgres is available at your fingertips with advanced Neon CLI features.
      </p>
      <div className="mt-11 w-full max-w-[716px] rounded-md border border-gray-new-15 px-5 py-[22px]">
        <CodeBlock
          className="code-block text-[15px]"
          language="bash"
          copyButtonClassName="!right-0 !-top-1"
        >
          {code}
        </CodeBlock>
      </div>
    </Container>
  </section>
);

export default Cli;
