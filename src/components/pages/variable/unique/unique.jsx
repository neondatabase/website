import { PropTypes } from 'prop-types';

import LINKS from 'constants/links';
import andreaLevingeAvatar from 'images/pages/variable-load/testimonials/andrea-levinge.jpg';

import List from '../list';
import Section from '../section';
import Testimonial from '../testimonial';

const items = [
  {
    text: 'Neon compute costs are <a href="https://www.outerbase.com/blog/the-evolution-of-serverless-postgres/" target="_blank" rel="noopener noreferrer">up to 75% cheaper</a> vs Aurora&nbsp;Serverless&nbsp;v2.',
  },
  {
    text: 'Neon scales to zero, Aurora Serverless does not.',
  },
  {
    text: 'Neon provisions instances in < 1 s, compared to Aurora&apos;s up to&nbsp;20&nbsp;min.',
  },
  {
    text: 'Neon uses transparent compute units, vs the ACU abstraction in&nbsp;Aurora&nbsp;Serverless.',
  },
  {
    text: 'Neon supports database branching with data and schema via copy-on-write, <a href="/content/development-velocity">improving development workflows.</a>',
  },
  {
    text: 'Neon&apos;s read replicas don&apos;t require storage redundancy, differently than Aurora&apos;s.',
  },
  {
    text: 'Connection pooling is built-in in Neon, vs Aurora&apos;s RDS Proxy.',
  },
];

const Unique = ({ title }) => (
  <Section className="unique" title={title}>
    <Testimonial
      text="Before choosing Neon, we also considered Aurora, but the opacity of&nbsp;the pricing model did not convince us and costs seemed to&nbsp;rise&nbsp;quickly."
      author={{
        name: 'Andrea Levinge',
        company: 'White Widget',
        avatar: andreaLevingeAvatar,
      }}
      url={`${LINKS.blog}/white-widgets-secret-to-scalable-postgres-neon`}
    />
    <div className="prose-variable">
      <p>The Neon architecture is inspired in Amazon&nbsp;Aurora, but with some key differences:</p>
      <List items={items} />
    </div>
  </Section>
);

Unique.propTypes = {
  title: PropTypes.shape({}),
};

export default Unique;
