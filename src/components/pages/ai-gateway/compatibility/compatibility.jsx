import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import { aiGatewayPageContent } from 'constants/backend-platform-page-content';
import { cn } from 'utils/cn';

const { compatibility } = aiGatewayPageContent;

const Compatibility = () => (
  <section className="сompatibility bg-black-pure pt-20 safe-paddings pb-40 xl:pt-16 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-10 md:pb-20">
    <Container
      className="grid grid-cols-2 gap-x-32 xl:gap-x-16 lg:grid-cols-1 lg:gap-y-12"
      size="1344"
    >
      <div className="flex flex-col">
        <SectionLabel className="mb-5" theme="white">
          {compatibility.label}
        </SectionLabel>
        <h2 className="max-w-162.5 text-[3rem] leading-dense tracking-tighter text-pretty xl:text-[2.5rem] lg:text-[2rem]">
          {compatibility.title}
        </h2>
        <p className="mt-auto max-w-165 text-[1.25rem] leading-normal tracking-extra-tight text-pretty text-gray-new-60 lg:mt-6 lg:text-[1.125rem] md:mt-5">
          {compatibility.description}
        </p>
      </div>

      <ul>
        {compatibility.items.map(({ title, description }, index) => (
          <li
            className={cn(
              index === 0 && 'pt-8.5 xl:pt-6.5 lg:pt-0',
              index < compatibility.items.length - 1 && 'border-b border-gray-new-20 py-8 xl:py-6',
              index === compatibility.items.length - 1 && 'pt-8 xl:pt-6'
            )}
            key={title}
          >
            <p className="text-[1.5rem] leading-snug tracking-extra-tight text-pretty text-gray-new-60 xl:text-[1.25rem] lg:text-[1.125rem]">
              <strong className="font-normal text-white">{title}</strong> {description}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Compatibility;
