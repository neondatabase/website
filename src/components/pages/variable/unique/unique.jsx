import LINKS from 'constants/links';
import andreaLevingeAvatar from 'images/pages/variable/testimonials/andrea-levinge.jpg';

import List from '../shared/list';
import Section from '../shared/section';
import Testimonial from '../shared/testimonial';

const items = [
  {
    text: 'Neon compute costs are <span>up to 75% cheaper</span> vs Aurora Serverless v2.',
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
    text: 'Neon supports <strong>database branching with data and schema via copy-on-write,</strong> <span>improving development workflows.</span>',
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
    <p>The Neon architecture is inspired in Amazon&nbsp;Aurora, but with some key differences:</p>
    <List items={items} />
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
