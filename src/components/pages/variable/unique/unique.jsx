import { PropTypes } from 'prop-types';

import Testimonial from 'components/pages/use-case/testimonial';
import LINKS from 'constants/links';

import List from '../list';
import Section from '../section';

const items = [
  {
    text: 'Neon compute costs are up to 80% cheaper vs other serverless databases.',
  },
  {
    text: 'Neon provisions instances in < 1 s, compared to other serverless databases which can take up to&nbsp;20&nbsp;min.',
  },
  {
    text: 'Neon uses transparent compute units, vs abstractions used in other serverless databases.',
  },
  {
    text: 'Neon supports database branching with data and schema via copy-on-write, improving development workflows.',
  },
  {
    text: 'Neon&apos;s read replicas don&apos;t require storage redundancy, differently than other serverless databases.',
  },
  {
    text: 'Connection pooling is built-in in Neon, unlike some other serverless databases that require separate proxies.',
  },
];

const Unique = ({ title }) => (
  <Section className="unique" title={title}>
    <div className="prose-variable">
      <p>The Neon architecture is unique in the following ways:</p>
      <List items={items} />
    </div>
    <Testimonial
      text="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS."
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
