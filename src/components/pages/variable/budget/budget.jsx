import Container from 'components/shared/container/container';

import Cta from '../shared/cta';
import List from '../shared/list';

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

const Budget = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[72px] xl:pt-16 lg:pt-14 md:pt-11">
    <Container size="xxs">
      <h2 className="mb-7 text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:text-[32px] lg:mb-5 lg:text-[28px] md:mb-4 md:text-2xl">
        How much budget are you wasting on unused compute?
      </h2>
      <div className="space-y-7 text-lg tracking-extra-tight text-gray-new-70 xl:space-y-6 lg:space-y-5 sm:space-y-4 sm:text-base [&_span]:text-green-45 [&_strong]:font-medium [&_strong]:text-white">
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
        <p>
          If you wanted to <strong>avoid this wasted budget</strong>, you would have to regularly
          resize and restart your instances. In practice, this is a manual process that not only
          takes time from your engineers but in many cases, it also causes downtime for your
          end-users.
        </p>
        <Cta
          text="Want a price estimation for your particular use case?"
          button={{ title: 'Reach out to us', url: '#' }}
        />
      </div>
    </Container>
  </section>
);

export default Budget;
