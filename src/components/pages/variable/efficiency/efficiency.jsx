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
    text: 'Neon is serverless Postgres. Instead of provisioning a fixed CPU/memory, you specify an autoscaling range. ',
  },
  {
    icon: performanceIcon,
    text: 'Your database will autoscale up and down automatically between those limits, matching your app’s traffic.',
  },
  {
    icon: resizeIcon,
    text: 'Autoscaling is nearly instantaneous, without downtime. Read about [our autoscaling algorithm](https://neon.tech/docs/guides/autoscaling-algorithm) and [how it compares to Aurora’s](https://neon.tech/blog/postgres-autoscaling-aurora-serverless-v2-vs-neon).',
  },
];

const Efficiency = ({ title }) => (
  <Section className="efficiency" title={title}>
    <div className="prose-variable">
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
