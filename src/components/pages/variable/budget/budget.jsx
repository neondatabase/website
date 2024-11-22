import { PropTypes } from 'prop-types';

import Example from 'components/shared/compute-calculator';
import CtaBlock from 'components/shared/cta-block';
import LINKS from 'constants/links';
import Section from '../section';

const Budget = ({ title }) => (
  <Section className="budget" title={title}>
    <Example />
    <CtaBlock
      title="Get a price estimation"
      buttonText="Contact us"
      buttonUrl={LINKS.contactSales}
    />
  </Section>
);

Budget.propTypes = {
  title: PropTypes.shape({}),
};

export default Budget;
