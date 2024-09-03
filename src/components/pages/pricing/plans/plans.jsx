import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import Table from './table';

const Plans = ({ className }) => (
  <section id="plans" className={clsx('plans px-safe', className)}>
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2">
        <GradientLabel className="mx-auto block w-fit">Plans</GradientLabel>
        <Heading
          className="mt-4 text-center text-[48px] font-medium leading-none tracking-tight lg:text-4xl sm:text-[36px]"
          tag="h2"
          theme="white"
        >
          Detailed plan comparison
        </Heading>
        <p className="mt-3 text-center text-lg font-light leading-snug sm:text-base">
          Find the plan that fits your needs, or{' '}
          <Link className="" theme="green" to={LINKS.contactSales}>
            reach out to us
          </Link>{' '}
          for custom Enterprise plans.
        </p>
      </div>
    </Container>
    <Table />
  </section>
);

Plans.propTypes = {
  className: PropTypes.string,
};

export default Plans;
