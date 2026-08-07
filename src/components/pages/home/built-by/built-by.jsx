import Image from 'next/image';

import Container from 'components/shared/container';
import databricksIcon from 'icons/home/databricks.svg';
import { cn } from 'utils/cn';

const STATS = [
  {
    title: 'Databricks',
    description: 'Neon has been part of the Databricks Platform since May 2025.',
    icon: databricksIcon,
    className: 'col-span-1',
    descriptionClassName: 'max-w-69.5',
    hasIcon: true,
  },
  {
    title: '12M+',
    description: 'Databases provisioned daily - built for scale and reliability.',
    className: 'col-span-1',
    descriptionClassName: 'max-w-54',
  },
  {
    title: '40K+',
    description: 'Databases provisioned daily by developers worldwide.',
    className: 'col-span-1',
    descriptionClassName: 'max-w-64',
  },
];

const BuiltBy = () => (
  <section
    className="built-by relative overflow-hidden bg-gray-new-10 safe-paddings pb-40 text-white xl:pb-32 lg:pb-20 md:pb-14"
    id="built-by"
  >
    <Container
      className="relative grid grid-cols-[14rem_1fr] gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:px-8! md:px-5!"
      size="1600"
    >
      <div className="min-w-0 border-t border-gray-new-20 pt-16 xl:pt-14 lg:pt-10 md:pt-8">
        <h2
          className={cn(
            'max-w-272 indent-24 text-4xl leading-dense tracking-tighter text-pretty text-gray-new-50',
            'xl:max-w-200 xl:text-[2.25rem] lg:indent-16 lg:text-[1.75rem] md:indent-0 md:text-2xl'
          )}
        >
          <strong className="font-normal text-white">Trusted Postgres. Backed by Giants.</strong>{' '}
          Neon was founded by Postgres committers, bringing decades of expertise. In 2025, Neon
          became part of the Databricks Platform.
        </h2>

        <ul className="mt-24.5 grid max-w-296 min-w-0 grid-cols-[2fr_1fr_.9fr] xl:mt-20 lg:mt-16 md:mt-12 md:grid-cols-1 md:gap-y-10">
          {STATS.map(({ title, description, icon, className, descriptionClassName, hasIcon }) => (
            <li
              className={cn(
                'relative flex min-h-84.25 min-w-0 flex-col border-l border-gray-new-30 px-4 pb-2',
                'md:min-h-52 md:pb-0',
                className
              )}
              key={title}
            >
              <p
                className={cn(
                  'text-base leading-normal tracking-extra-tight text-gray-new-80 md:text-[0.9375rem]',
                  descriptionClassName
                )}
              >
                {description}
              </p>
              <div className="mt-auto flex min-w-0 items-center gap-5">
                {hasIcon && (
                  <Image
                    className="size-18 shrink-0 lg:size-14 md:size-12"
                    src={icon}
                    width={72}
                    height={72}
                    alt=""
                  />
                )}
                <span className="min-w-0 text-7xl leading-none tracking-tighter 2xl:text-6xl lg:text-[3.25rem] md:text-[2.75rem]">
                  {title}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default BuiltBy;
