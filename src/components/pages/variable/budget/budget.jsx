import { PropTypes } from 'prop-types';

import Example from 'components/shared/compute-calculator';

import Section from '../section';

const Budget = ({ title }) => (
  <Section className="budget" title={title}>
    <Example />
  </Section>
);

Budget.propTypes = {
  title: PropTypes.shape({}),
};

export default Budget;
