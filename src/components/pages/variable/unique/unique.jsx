import LINKS from 'constants/links';
import andreaLevingeAvatar from 'images/pages/variable-load/testimonials/andrea-levinge.jpg';

import List from '../list';
import Section from '../section';
import Testimonial from '../testimonial';

const items = [
  {
    text: 'Neon compute costs are <a href="https://www.outerbase.com/blog/the-evolution-of-serverless-postgres/" target="_blank" rel="noopener noreferrer">up to 75% cheaper</a> vs Aurora Serverless v2.',
  },
  {
    text: 'Neon <strong>scales to zero</strong>, Aurora Serverless does not.',
  },
  {
    text: 'Neon <strong>provisions instances in < 1 s</strong>, compared to Aurora&apos;s up to&nbsp;20&nbsp;min.',
  },
  {
    text: 'Neon uses <strong>transparent compute units</strong>, vs the ACU abstraction in&nbsp;Aurora&nbsp;Serverless.',
  },
  {
    text: 'Neon supports <strong>database branching with data and schema via copy-on-write,</strong> <a href="/flow">improving development workflows.</a>',
  },
  {
    text: 'Neon&apos;s <strong>read replicas don&apos;t require storage redundancy</strong>, differently than Aurora&apos;s.',
  },
  {
    text: '<strong>Connection pooling is built-in in Neon,</strong> vs Aurora&apos;s RDS Proxy.',
  },
];

const Unique = () => (
  <Section className="unique" title="What makes Neon unique vs&nbsp;others?">
    <div className="prose-variable">
      <p>The Neon architecture is inspired in Amazon&nbsp;Aurora, but with some key differences:</p>
      <List items={items} />
    </div>
    <Testimonial
      text="Before choosing Neon, we also considered Aurora, but the opacity of&nbsp;the pricing model did not convince us and costs seemed to&nbsp;rise&nbsp;quickly."
      author={{
        name: 'Andrea Levinge',
        company: 'White Widget',
        avatar: andreaLevingeAvatar,
      }}
      url={`${LINKS.blog}/white-widgets-secret-to-scalable-postgres-neon`}
    />
  </Section>
);

export default Unique;
