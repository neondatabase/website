import { PropTypes } from 'prop-types';

import LINKS from 'constants/links';

import UseCaseCta from '../../use-case/use-case-cta';
import Example from '../example';
import List from '../list';
import Section from '../section';

const items = [
  {
    text: 'You&apos;ll need at least one production database, but also separate instances for development, testing, and staging.',
  },
  {
    text: 'Your production database will run 24/7, but only run at peak capacity when you reach peak load.',
  },
  {
    text: 'Your non-prod databases will only run a few hours per day.',
  },
  {
    text: 'But for each one of these databases, you&apos;ll be paying for peak compute, 100% of the time - even if you don&apos;t use it.',
  },
];

const Budget = ({ title }) => (
  <Section className="budget" title={title}>
    <Example />
    <div className="prose-variable">
      <p>
        Provisioning for peak load is highly inefficient cost-wise, especially taking into
        consideration that you will most likely be running not only one database instance,
        but&nbsp;many.
      </p>
      <List items={items} />
    </div>
    <UseCaseCta
      title="Want a price estimation for your particular use case?"
      buttonText="Reach out to us"
      buttonUrl={LINKS.contactSales}
    />
  </Section>
);

Budget.propTypes = {
  title: PropTypes.shape({}),
};

export default Budget;
