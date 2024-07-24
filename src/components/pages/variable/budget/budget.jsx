import { PropTypes } from 'prop-types';

import LINKS from 'constants/links';

import Cta from '../cta';
import Example from '../example';
import List from '../list';
import Section from '../section';

const items = [
  {
    text: 'You&apos;ll need at least <strong>one production database</strong>, but also separate instances for development, testing, and staging.',
  },
  {
    text: 'Your <strong>production database will run 24/7</strong>, but only run <strong>at peak capacity</strong> when you reach peak load.',
  },
  {
    text: 'Your <strong>non-prod databases</strong> will only run a few hours per day.',
  },
  {
    text: 'But for each one of these databases, <strong>you&apos;ll be paying for peak compute</strong>, 100% of the time - even if you don&apos;t use it.',
  },
];

const Budget = ({ title }) => (
  <Section className="budget" title={title}>
    <div className="prose-variable">
      <p>
        <strong>Provisioning for peak load is highly inefficient cost-wise,</strong> especially
        taking into consideration that you will most likely be running not only one database
        instance but many.
      </p>
      <List items={items} />
      <p>
        To grasp how much money is typically wasted on unused compute resources,{' '}
        <strong>play with the calculator below using Amazon RDS prices.</strong>
      </p>
    </div>
    <Example />
    <div className="prose-variable">
      <p>
        If you wanted to <strong>avoid this wasted budget</strong>, you would have to regularly
        resize and restart your instances. In practice, this is a manual process that not only takes
        time from your engineers but in many cases, it also causes downtime for your end-users.
      </p>
    </div>
    <Cta
      text="Want a price estimation for your particular use case?"
      button={{ title: 'Reach out to us', url: LINKS.contactSales }}
    />
  </Section>
);

Budget.propTypes = {
  title: PropTypes.shape({}),
};

export default Budget;
