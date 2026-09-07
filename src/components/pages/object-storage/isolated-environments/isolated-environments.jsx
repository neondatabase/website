import Container from 'components/shared/container';
import { objectStoragePageContent } from 'constants/object-storage-page-content';

const { isolatedEnvironments } = objectStoragePageContent;

const IsolatedEnvironments = () => (
  <section
    className="isolated-environments pt-30 safe-paddings pb-20 text-white xl:py-16 lg:py-12 md:py-10"
    aria-labelledby="object-storage-isolated-environments-heading"
    data-figma-node-id="2070:6669"
  >
    <Container size="1344">
      <h2
        className="max-w-216 text-[2.75rem] leading-dense font-normal tracking-tighter xl:text-4xl lg:max-w-3xl lg:text-3xl md:text-[1.75rem]"
        id="object-storage-isolated-environments-heading"
      >
        {isolatedEnvironments.title}{' '}
        <span className="text-gray-new-50">{isolatedEnvironments.highlightedTitle}</span>
      </h2>

      <ol className="mt-24 grid grid-cols-3 gap-x-21 xl:mt-20 xl:gap-x-10 lg:mt-16 lg:gap-x-6 md:mt-10 md:grid-cols-1 md:gap-y-8">
        {isolatedEnvironments.items.map(({ id, title, description }, index) => (
          <li
            className="relative min-w-0 border-l border-gray-new-20 pl-6 lg:pl-5 md:border-none md:pl-0"
            key={id}
          >
            <span
              className="font-mono text-lg leading-normal tracking-extra-tight lg:text-base"
              aria-hidden
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-40 text-[1.75rem] leading-tight font-normal tracking-extra-tight text-pretty xl:mt-32 xl:text-2xl lg:mt-24 lg:text-xl md:mt-5 md:text-2xl">
              {title}
            </h3>
            <p className="mt-3 text-lg leading-normal tracking-extra-tight text-pretty text-gray-new-70 lg:text-base">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </Container>
  </section>
);

export default IsolatedEnvironments;
