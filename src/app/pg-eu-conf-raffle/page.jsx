import RaffleHero from 'components/pages/pg-eu-conf-raffle/hero';
import Layout from 'components/shared/layout';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata({
  title: 'Databricks / Neon raffle at PGConf EU - Neon',
  description:
    'Enter the Databricks / Neon raffle at PGConf EU for a chance to win a $400 LEGO gift card.',
  pathname: '/pg-eu-conf-raffle',
  robotsNoindex: 'noindex',
});

const RafflePage = () => (
  <Layout headerClassName="absolute! bg-transparent!">
    <RaffleHero />
  </Layout>
);

export default RafflePage;
