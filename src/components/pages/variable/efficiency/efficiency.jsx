import { PropTypes } from 'prop-types';

import Testimonial from 'components/pages/use-case/testimonial';
import LINKS from 'constants/links';
import autoscaleIcon from 'icons/variable/autoscale.svg';
import costIcon from 'icons/variable/cost.svg';
import databaseIcon from 'icons/variable/database.svg';
import openSourceIcon from 'icons/variable/open-source.svg';
import performanceIcon from 'icons/variable/performance.svg';
import resizeIcon from 'icons/variable/resize.svg';
import pieralbertoColonboAvatar from 'images/pages/variable-load/testimonials/pieralberto-colonbo.jpg';

import List from '../list';
import Section from '../section';

const items = [
  {
    icon: autoscaleIcon,
    text: 'Neon adjusts CPU and memory up and down automatically.',
  },
  {
    icon: costIcon,
    text: 'Costs are controlled by setting a <a href="/docs/introduction/autoscaling">max autoscaling limit</a>',
  },
  {
    icon: performanceIcon,
    text: 'You get a performance boost when you need it.',
  },
  {
    icon: resizeIcon,
    text: 'No manual resizes or downtimes. Neon scales up and down smoothly and immediately.',
  },
  {
    icon: databaseIcon,
    text: 'Non-prod databases scale to zero when inactive. Instead of paying for compute 24/7, you skim the costs of your supporting databases to a minimum.',
  },
  {
    icon: openSourceIcon,
    text: 'Transparency with open-source architecture. <a href="https://github.com/neondatabase/neon" target="_blank" rel="noopener noreferrer">Explore our code in&nbsp;GitHub</a>.',
  },
];

const Efficiency = ({ title }) => (
  <Section className="efficiency" title={title}>
    <div className="prose-variable">
      <p>
        Neon solves this inefficiency via a serverless architecture. By{' '}
        <a href="/blog/architecture-decisions-in-neon">natively separating storage and compute</a>,
        Neon implements two features that allows you to pay only for the compute you use without
        investing any manual work: <a href="/blog/scaling-serverless-postgres">autoscaling</a> and{' '}
        <a href="/docs/introduction/scale-to-zero">scale to zero</a>.
      </p>
      <List items={items} />
    </div>
    <Testimonial
      text="When we were using MySQL in&nbsp;Azure, we had to manually upgrade the database during the&nbsp;days of peak traffic and downgrade later in the day, which&nbsp;caused a couple of minutes of downtime and a huge waste of&nbsp;time for the team."
      author={{
        name: 'Pieralberto Colombo',
        company: 'Recrowd',
        avatar: pieralbertoColonboAvatar,
      }}
      url={`${LINKS.blog}/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand`}
    />
  </Section>
);

Efficiency.propTypes = {
  title: PropTypes.shape({}),
};

export default Efficiency;
