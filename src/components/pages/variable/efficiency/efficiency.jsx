import Container from 'components/shared/container/container';
import LINKS from 'constants/links';
import autoscaleIcon from 'icons/variable/autoscale.svg';
import costIcon from 'icons/variable/cost.svg';
import databaseIcon from 'icons/variable/database.svg';
import openSourceIcon from 'icons/variable/open-source.svg';
import performanceIcon from 'icons/variable/performance.svg';
import resizeIcon from 'icons/variable/resize.svg';
import pieralbertoColonboAvatar from 'images/pages/variable/testimonials/pieralberto-colonbo.jpg';

import List from '../shared/list';
import Testimonial from '../shared/testimonial';

const items = [
  {
    icon: autoscaleIcon,
    text: '<strong>Neon autoscales according to traffic,</strong> dynamically adjusting CPU and memory as needed.',
  },
  {
    icon: costIcon,
    text: '<strong>Costs are controlled</strong> by setting a <span>max autoscaling limit</span>, avoiding unexpected charges.',
  },
  {
    icon: performanceIcon,
    text: '<strong>Fast performance in production without overpaying.</strong> In a typical compute bill, <span>60% of costs go towards unused resources</span>. ',
  },
  {
    icon: resizeIcon,
    text: '<strong>No manual resizes or downtimes.</strong> Neon scales up and down smoothly and immediately. ',
  },
  {
    icon: databaseIcon,
    text: '<strong>Non-prod databases scale to zero when inactive.</strong> Instead of paying for compute 24/7, you skim the costs of your supporting databases to a minimum.',
  },
  {
    icon: openSourceIcon,
    text: '<strong>Transparency with open-source architecture.</strong> <span>Explore our code in&nbsp;Github</span>.',
  },
];

const Efficiency = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[72px] xl:pt-16 lg:pt-14 md:pt-11">
    <Container size="xxs">
      <h2 className="mb-7 text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:text-[32px] lg:mb-5 lg:text-[28px] md:mb-4 md:text-2xl">
        Maximize efficiency and cut costs with Serverless Postgres
      </h2>
      <div className="space-y-7 text-lg tracking-extra-tight text-gray-new-70 xl:space-y-6 lg:space-y-5 sm:space-y-4 sm:text-base [&_span]:text-green-45 [&_strong]:font-medium [&_strong]:text-white">
        <p>
          Neon solves this inefficiency via a serverless architecture. By{' '}
          <span>natively separating storage and compute</span>, Neon implements two features that
          allows you to pay only for the compute you use without investing any manual work:{' '}
          <span>autoscaling</span> and <span>scale to zero</span>.
        </p>
        <List items={items} />
      </div>
      <Testimonial
        text="When we were using MySQL in Azure, we had to manually upgrade the database during the days of peak traffic and downgrade later in the day, which caused a couple of minutes of downtime and a huge waste of time for the team."
        author={{
          name: 'Pieralberto Colombo',
          company: 'Recrowd',
          avatar: pieralbertoColonboAvatar,
        }}
        url={`${LINKS.blog}/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand`}
      />
    </Container>
  </section>
);

export default Efficiency;
