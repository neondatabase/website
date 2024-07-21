import LINKS from 'constants/links';
import autoscaleIcon from 'icons/variable/autoscale.svg';
import costIcon from 'icons/variable/cost.svg';
import databaseIcon from 'icons/variable/database.svg';
import openSourceIcon from 'icons/variable/open-source.svg';
import performanceIcon from 'icons/variable/performance.svg';
import resizeIcon from 'icons/variable/resize.svg';
import pieralbertoColonboAvatar from 'images/pages/variable/testimonials/pieralberto-colonbo.jpg';

import List from '../shared/list';
import Section from '../shared/section';
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
  <Section
    className="efficiency"
    title="Maximize efficiency and cut costs with Serverless Postgres"
  >
    <p>
      Neon solves this inefficiency via a serverless architecture. By{' '}
      <span>natively separating storage and compute</span>, Neon implements two features that allows
      you to pay only for the compute you use without investing any manual work:{' '}
      <span>autoscaling</span> and <span>scale to zero</span>.
    </p>
    <List items={items} />
    <Testimonial
      text="When we were using MySQL in Azure, we had to manually upgrade the database during the days of peak traffic and downgrade later in the day, which caused a couple of minutes of downtime and a huge waste of time for the team."
      author={{
        name: 'Pieralberto Colombo',
        company: 'Recrowd',
        avatar: pieralbertoColonboAvatar,
      }}
      url={`${LINKS.blog}/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand`}
    />
  </Section>
);

export default Efficiency;
