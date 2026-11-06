import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import highlight from 'lib/shiki';
import { cn } from 'utils/cn';

const Configuration = async ({ content: configuration, id, className, figmaNodeId }) => {
  const highlightedCode = await highlight(configuration.code, 'typescript');

  return (
    <section
      className={cn(
        'configuration pt-30 safe-paddings pb-40 text-white xl:pt-16 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-10 md:pb-20',
        className
      )}
      id={id}
      aria-labelledby={`${id}-heading`}
      data-figma-node-id={figmaNodeId}
    >
      <Container size="1344">
        <SectionLabel theme="white">{configuration.label}</SectionLabel>
        <h2
          className="mt-5 max-w-256 text-[3.25rem] leading-none tracking-tighter xl:text-[2.75rem] lg:text-4xl md:text-[2rem]"
          id={`${id}-heading`}
        >
          {configuration.title}
        </h2>

        <div className="mt-12 grid grid-cols-[minmax(0,7fr)_minmax(0,6fr)] items-end gap-x-24 border-t border-gray-new-15 pt-8 xl:gap-x-12 lg:grid-cols-1 lg:gap-y-10 lg:border-t-0 lg:pt-0 md:mt-8">
          <div className="min-w-0 bg-gray-new-8 px-10 py-8 xl:px-6 md:p-4">
            <CodeBlockWrapper
              className="overflow-hidden border border-gray-new-20 bg-black-new [--shiki-color-text:#fff] [--shiki-foreground:#fff] [--shiki-token-constant:#fff] [--shiki-token-function:#f99d51] [--shiki-token-keyword:#34d59a] [--shiki-token-string-expression:#648dff] [&_[data-line]]:mx-8 md:[&_[data-line]]:mx-4 [&_code]:font-mono [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:py-8 [&_pre]:text-base [&_pre]:leading-normal [&_pre]:tracking-tighter md:[&_pre]:text-sm"
              copyCode={configuration.code}
              copyButtonClassName="visible top-16 focus-visible:opacity-100"
            >
              <figcaption className="relative flex h-12 items-center justify-center border-b border-gray-new-20 bg-gray-new-10 px-5 text-base leading-dense tracking-tight text-gray-new-98">
                <div className="absolute left-4.5 flex gap-3 xl:gap-2" aria-hidden="true">
                  <div className="size-3 rounded-full bg-[#FF5A48] xl:size-2.5" />
                  <div className="size-3 rounded-full bg-gray-new-20 xl:size-2.5" />
                  <div className="size-3 rounded-full bg-[#39A57D] xl:size-2.5" />
                </div>
                {configuration.filename}
              </figcaption>
              {parse(highlightedCode)}
            </CodeBlockWrapper>
          </div>

          <ul className="divide-y divide-gray-new-15">
            {configuration.items.map(({ title, description }) => (
              <li
                className="grid grid-cols-[minmax(0,3fr)_minmax(0,5.5fr)] gap-x-8 py-6 first:pt-0 last:pb-0 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-x-6 lg:grid-cols-[12rem_minmax(0,1fr)] md:grid-cols-1 md:gap-y-3"
                key={title}
              >
                <h3 className="text-lg leading-snug font-medium tracking-tight">{title}</h3>
                <p className="pt-0.5 text-base leading-snug tracking-extra-tight text-gray-new-60 [&_code]:rounded [&_code]:border [&_code]:border-gray-new-30 [&_code]:bg-black-new [&_code]:px-1 [&_code]:py-0.25 [&_code]:font-mono [&_code]:text-sm [&_code]:leading-[1.2] [&_code]:whitespace-nowrap [&_code]:text-white">
                  {parse(description)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};

Configuration.propTypes = {
  content: PropTypes.shape({
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  figmaNodeId: PropTypes.string,
};

export default Configuration;
