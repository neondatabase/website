import Container from 'components/shared/container/container';
import LINKS from 'constants/links';
import andreaLevingeAvatar from 'images/pages/variable/testimonials/andrea-levinge.jpg';

import List from '../shared/list';
import Testimonial from '../shared/testimonial';

const items = [
  {
    text: 'Neon compute costs are <span>up to 75% cheaper</span> vs Aurora Serverless v2.',
  },
  {
    text: 'Neon <strong>scales to zero</strong>, Aurora Serverless does not.',
  },
  {
    text: 'Neon <strong>provisions instances in < 1 s</strong>, compared to Aurora&apos;s up to 20 min.',
  },
  {
    text: 'Neon uses <strong>transparent compute units</strong>, vs the ACU abstraction in Aurora Serverless.',
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
  <section className="hero safe-paddings relative overflow-hidden pt-[72px] xl:pt-16 lg:pt-14 md:pt-11">
    <Container size="xxs">
      <h2 className="mb-7 text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:text-[32px] lg:mb-5 lg:text-[28px] md:mb-4 md:text-2xl">
        What makes Neon unique vs others?
      </h2>
      <div className="space-y-7 text-lg tracking-extra-tight text-gray-new-70 xl:space-y-6 lg:space-y-5 sm:space-y-4 sm:text-base [&_span]:text-green-45 [&_strong]:font-medium [&_strong]:text-white">
        <p>The Neon architecture is inspired in Amazon Aurora, but with some key differences:</p>
        <List items={items} />
      </div>
      <Testimonial
        text="Before choosing Neon, we also considered Aurora, but the opacity of the pricing model did not convince us and costs seemed to rise quickly."
        author={{
          name: 'Andrea Levinge',
          company: 'White Widget',
          avatar: andreaLevingeAvatar,
        }}
        url={`${LINKS.blog}/white-widgets-secret-to-scalable-postgres-neon`}
      />
    </Container>
  </section>
);

export default Unique;
