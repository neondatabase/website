import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

const StartupSection = ({ className }) => (
  <section className={clsx('startup-section px-safe', className)}>
    <Container size="medium" className="w-full">
      <div className="rounded-lg border border-gray-new-15 p-8 text-center lg:p-6 md:p-5">
        <h2 className="mb-4 text-2xl font-bold text-white md:text-xl">
          Special Plans for Startups
        </h2>
        <p className="mb-6 text-lg text-gray-new-70 md:text-base">
          Startups are <em>hard</em>. Let us help you focus on scaling your business, not your
          infrastructure bill.
        </p>
        <Link
          to="https://neon.tech/startups"
          className="font-bold text-primary-1 transition-colors duration-200 hover:text-[#00e5bf]"
        >
          Neon for Startups
        </Link>
      </div>
    </Container>
  </section>
);

StartupSection.propTypes = {
  className: PropTypes.string,
};

export default StartupSection;
