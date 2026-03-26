import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import { BRANCHING_BASE_PATH } from 'constants/branching';
import ArrowRightIcon from 'icons/arrow-right.inline.svg';

const Contents = ({ contents }) => (
  <section className="table-of-contents w-full pt-[180px] safe-paddings pb-[220px] xl:pt-[136px] lg:pt-[88px] md:pt-20 md:pb-20">
    <Container className="w-full text-left" size="branching">
      <h2 className="mb-14 font-sans text-5xl leading-dense font-normal tracking-tighter xl:text-[36px] lg:mb-11 md:mb-9 md:text-[28px]">
        Branching Workflows
      </h2>
      <ul className="flex w-full flex-col gap-y-10">
        {contents.map(({ section, id, items }) => (
          <li className="flex flex-col gap-8 lg:gap-6 md:gap-5" key={id} id={id}>
            <h3 className="font-mono text-xs leading-3 font-medium text-gray-new-60 uppercase md:text-[10px] md:leading-none">
              {section}
            </h3>
            <ol className="flex flex-col">
              {items.map(({ title, description, slug }) => (
                <li className="group/item -mt-px border-t border-gray-new-20" key={slug}>
                  <Link
                    className="group flex w-full items-center gap-x-16 py-6 font-sans text-base lg:py-[18px] md:py-[14px]"
                    to={`${BRANCHING_BASE_PATH}${slug}`}
                  >
                    <span className="flex flex-row items-center gap-x-16 lg:flex-col lg:items-baseline lg:gap-y-1">
                      <span className="w-[448px] shrink-0 leading-snug tracking-tight text-gray-new-80 transition-colors duration-200 group-hover:text-white xl:w-64 lg:w-auto">
                        {title}
                      </span>

                      <span className="leading-snug font-normal tracking-tight text-gray-new-50 md:hidden">
                        {description}
                      </span>
                    </span>

                    <span className="ml-auto inline-flex shrink-0 items-center gap-2 leading-none font-medium tracking-extra-tight">
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
