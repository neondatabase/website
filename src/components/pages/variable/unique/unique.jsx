import { PropTypes } from 'prop-types';

import Testimonial from 'components/pages/use-case/testimonial';
import LINKS from 'constants/links';

import List from '../list';
import Section from '../section';

const items = [
  {
    text: 'Neon compute costs are <a href="/blog/why-invenco-migrated-from-aurora-serverless-v2-to-neon/">up to 80% cheaper</a> vs Aurora&nbsp;Serverless&nbsp;v2.',
  },
  {
    text: 'Neon provisions instances in < 1 s, compared to Aurora&apos;s up to&nbsp;20&nbsp;min.',
  },
  {
    text: 'Neon uses transparent compute units, vs the ACU abstraction in&nbsp;Aurora&nbsp;Serverless.',
  },
  {
    text: 'Neon supports database branching with data and schema via copy-on-write, improving development workflows.',
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
    <div className="prose-variable">
      <p>The Neon architecture is inspired in Amazon&nbsp;Aurora, but with some key differences:</p>
      <List items={items} />
    </div>
    <Testimonial
      text="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS"
      author={{
        name: 'Cody Jenkins',
        company: 'Head of Engineering at Invenco',
      }}
      url={`${LINKS.blog}/why-invenco-migrated-from-aurora-serverless-v2-to-neon`}
    />
  </Section>
);

Unique.propTypes = {
  title: PropTypes.shape({}),
};

export default Unique;
