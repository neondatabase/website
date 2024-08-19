import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const OpenSource = ({ items }) => (
  <section className="open-source safe-paddings mt-[200px] xl:mt-[136px] lg:mt-[104px] md:mt-20">
    <Container
      className="flex gap-x-[116px] gap-y-12 pl-48 xl:gap-x-16 xl:pl-40 lg:gap-x-[62px] lg:pl-24 md:gap-x-10 md:!px-5 sm:flex-col"
      size="1152"
    >
      <header className="sticky top-8 h-fit max-w-[364px] grow xl:top-6 xl:max-w-[352px] lg:max-w-[290px] sm:static sm:top-auto sm:max-w-none">
        <Heading
          className="text-[68px] font-medium leading-[0.9] tracking-extra-tight xl:text-[56px] lg:max-w-[564px] lg:text-5xl md:text-[36px]"
          tag="h2"
          theme="black"
        >
          Neon is
          <br />
          open-source
        </Heading>
        <p className="mt-9 text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:mt-7 lg:mt-5 lg:text-lg md:mt-4 md:text-base sm:w-3/4 sm:min-w-[264px]">
          We chose{' '}
          <span className="text-white">the most permissive open-source license, Apache 2.0</span>,
          and invited&nbsp;the world to participate. You can&nbsp;build and run your own self-hosted
          instance of Neon.
        </p>
        <Link
          className="relative z-10 mt-5 flex w-fit items-center text-[15px] font-medium leading-none tracking-[-0.03em] lg:mt-4 md:mt-3.5"
          to={LINKS.github}
          theme="white"
          target="_blank"
          rel="noopener noreferrer"
          withArrow
        >
          Neon GitHub repository
        </Link>
      </header>
      <ul className="flex flex-col gap-y-20 xl:gap-y-[72px] lg:gap-y-14 md:gap-y-10">
        {items.map(({ label, number, isThousands, hasPlus }, index) => (
          <li className="flex flex-col" key={index}>
            <p>
              <span className={clsx('flex', hasPlus ? 'items-center' : 'items-end')}>
                <span className="bg-[linear-gradient(73deg,#7F95EB_1%,#89E0EA_33%,#EFEFEF_81%)] bg-clip-text pr-3 font-title text-[192px] font-medium leading-[.8] tracking-[-0.06em] text-transparent xl:text-[160px] lg:pr-2 lg:text-[112px]">
                  {number}
                </span>
                {(isThousands || hasPlus) && (
                  <span
                    className={clsx(
                      'bg-[linear-gradient(164deg,#FFF_53%,rgba(255,255,255,.4)_72.79%,transparent_89.16%)] bg-clip-text pr-1.5 font-title text-[100px] font-medium leading-[.96] tracking-[-0.06em] text-transparent xl:text-[88px] lg:text-6xl',
                      isThousands && '-mb-0.5'
                    )}
                  >
                    {hasPlus ? '+' : 'k'}
                  </span>
                )}
              </span>
              <span
                className={clsx(
                  'block text-xl leading-snug tracking-extra-tight text-gray-new-50 xl:text-lg lg:mt-2.5 lg:text-base',
                  isThousands ? 'mt-[11px]' : 'mt-[9px]'
                )}
              >
                {label}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

OpenSource.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default OpenSource;
