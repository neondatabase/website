import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import { BRANCHING_BASE_PATH } from 'constants/branching';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';

const Contents = ({ contents }) => (
  <section className="safe-paddings table-of-contents w-full pb-[220px] pt-[180px] xl:pt-[136px] lg:pt-[88px] md:pb-[80px] md:pt-20">
    <Container className="w-full text-left" size="branching">
      <h2 className="mb-14 font-sans text-5xl font-normal leading-dense tracking-tighter xl:text-[36px] lg:mb-11 md:mb-9 md:text-[28px]">
        Branching Workflows
      </h2>
      <ul className="w-full">
        {contents.map(({ section, id, items }) => (
          <li
            className="flex flex-col gap-8 py-8 first:pt-0 last:pb-0 lg:gap-6 lg:py-7 md:gap-5"
            key={id}
            id={id}
          >
            <h3 className="font-mono text-xs font-medium uppercase leading-3 text-gray-new-60 md:text-[10px] md:leading-none">
              {section}
            </h3>
            <ol className="flex flex-col">
              {items.map(({ title, description, slug }) => (
                <li
                  className="-mt-px border-t border-gray-new-20 py-6 last:pb-0 lg:py-[18px] md:py-[14px]"
                  key={slug}
                >
                  <Link
                    className="group flex w-full items-center gap-x-16 font-sans text-base"
                    to={`${BRANCHING_BASE_PATH}${slug}`}
                  >
                    <span className="flex flex-row items-center gap-x-16 lg:flex-col lg:items-baseline lg:gap-y-1">
                      <span className="w-[448px] shrink-0 leading-snug tracking-tight text-gray-new-80 transition-colors duration-200 group-hover:text-white xl:w-[256px] lg:w-auto">
                        {title}
                      </span>

                      <span className="font-normal leading-snug tracking-tight text-gray-new-50 md:hidden">
                        {description}
                      </span>
                    </span>

                    <span className="ml-auto inline-flex shrink-0 items-center gap-2 font-medium leading-none tracking-[-0.02em]">
                      <span className="lg:hidden">Learn more</span>
                      <ArrowRightIcon
                        aria-hidden="true"
                        focusable="false"
                        className="-mb-px shrink-0 text-gray-new-70 transition-transform duration-200 group-hover:translate-x-[3px]"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

Contents.propTypes = {
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      section: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string,
          slug: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Contents;
