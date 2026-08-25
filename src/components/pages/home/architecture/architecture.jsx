import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Animation from './animation';

const Highlight = ({ children }) => (
  <mark className="-mr-[0.15em] -ml-[0.1em] bg-transparent bg-[linear-gradient(to_bottom,transparent_0.15em,rgba(57,165,125,0.6)_0.15em)] box-decoration-clone pr-[0.15em] pl-[0.1em]">
    {children}
  </mark>
);

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
};

const Architecture = () => (
  <section
    className="architecture scroll-mt-16 overflow-hidden bg-[#E4F1EB] py-40 safe-paddings xl:pt-34 xl:pb-38 lg:scroll-mt-0 lg:pt-20 lg:pb-26 md:pt-16 md:pb-20"
    id="architecture"
  >
    <Container className="md:px-5!" size="1600">
      <h2 className="max-w-320 indent-24 text-[3.5rem] leading-dense font-normal tracking-tighter text-black-pure xl:max-w-240 xl:indent-16 xl:text-5xl lg:max-w-180 lg:text-[2.25rem] md:max-w-full md:indent-0 md:text-[2rem] sm:text-[1.625rem]">
        The way we build software is changing, but the fundamentals remain the same:{' '}
        <Highlight>powerful databases,</Highlight> <Highlight>reliable infrastructure,</Highlight>{' '}
        and <Highlight>seamless scalability.</Highlight>
      </h2>

      <div className="mt-16 border-t border-gray-new-50 pt-26.5 xl:mt-12 xl:pt-16 lg:mt-10 lg:pt-12 md:mt-8 md:pt-8">
        <div className="grid grid-cols-[14rem_minmax(0,1fr)] gap-x-32 xl:grid-cols-1">
          <div aria-hidden="true" className="xl:hidden" />
          <div className="min-w-0">
            <Animation />

            <p className="mt-9 max-w-248 text-4xl leading-dense tracking-tighter text-gray-new-40 xl:text-[2rem] lg:text-[1.75rem] md:text-[1.375rem] sm:text-xl">
              <span className="text-black-new">Postgres without compromise </span>gives developers
              the database ecosystem they trust with the flexibility and speed needed for modern
              applications.
            </p>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Architecture;
