import CodeBlock from 'components/shared/code-block';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';

import CodeTabs from './code-tabs';
import { CODE_EXAMPLES, INTERFACES } from './data';

const Interfaces = () => (
  <section
    className="mt-50 safe-paddings xl:mt-40 lg:mt-32 md:mt-20"
    aria-labelledby="claimable-interfaces-title"
  >
    <Container size="1344">
      <SectionLabel theme="white">Lakebase Architecture</SectionLabel>
      <h2
        className="mt-5 max-w-272 text-[3.25rem] leading-none font-normal tracking-tighter text-white xl:text-5xl lg:text-4xl md:mt-4 md:text-[2rem]"
        id="claimable-interfaces-title"
      >
        The same scoped agent credential works through auth.md, the Neon CLI, and&nbsp;neon.ts.
      </h2>
      <div className="mt-20 grid grid-cols-2 items-start gap-x-32 xl:gap-x-12 lg:mt-14 lg:grid-cols-1 lg:gap-y-12 md:mt-10 md:gap-y-10">
        <ul className="flex flex-col gap-y-14 py-6 xl:gap-y-10 lg:py-0 md:gap-y-7">
          {INTERFACES.map(({ id, title, description }) => (
            <li
              className="flex items-start justify-between gap-x-24 xl:gap-x-8 lg:gap-x-16 md:flex-col md:gap-y-3"
              key={id}
            >
              <h3 className="w-48 shrink-0 text-lg leading-snug font-medium tracking-tight whitespace-nowrap text-white md:w-auto">
                {title}
              </h3>
              <p className="max-w-80 flex-1 text-base leading-snug tracking-extra-tight text-gray-new-60 lg:max-w-none">
                {description}
              </p>
            </li>
          ))}
        </ul>
        <CodeTabs>
          {INTERFACES.map(({ id, language }) => (
            <CodeBlock
              className="highlighted-code border-0 [&_code]:text-base [&_code]:leading-normal [&_code]:tracking-tighter md:[&_code]:text-sm [&_code_.line]:mx-5 md:[&_code_.line]:mx-4 [&>pre]:py-6"
              copyButtonClassName="visible opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-45"
              key={id}
            >
              <code className={`language-${language}`}>{CODE_EXAMPLES[id]}</code>
            </CodeBlock>
          ))}
        </CodeTabs>
      </div>
    </Container>
  </section>
);

export default Interfaces;
