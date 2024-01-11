import DemoList from 'components/pages/demo/demo-list';
import Hero from 'components/pages/demo/hero';
import Layout from 'components/shared/layout';

const branching = {
  name: 'Branching',
  items: [
    {
      title: 'Neon Twitter Application',
      description:
        "Microblogging application designed to demonstrate the database branching capability of Neon Serverless Postgres with Neon's GitHub Actions.",
      sourceLink: '/',
      demoLink: '/',
    },
    {
      title: 'Preview Branches',
      description:
        'This is an example project that shows how you can create a branch for every preview deployment on Vercel. If you want to use this project as a playground, you can you can set it up locally.',
      sourceLink: '/',
      demoLink: '/',
    },
    {
      title: 'Neon Discord bot',
      description:
        "This is the companion repository for the Neon's Branching Tutorial, which you should definitely read before diving in here.",
      sourceLink: '/',
      demoLink: '/',
    },
    {
      title: 'Full-stack preview environments using Neon and Qovery',
      description:
        'This example shows how to execute a bash script and pass environment variables to other services within the same environment with Qovery Lifecycle Job.',
      sourceLink: '/',
      demoLink: '/',
    },
  ],
};

const DemoPage = () => (
  <Layout
    className="bg-black-new text-white"
    headerTheme="black-new"
    footerTheme="black-new"
    footerWithTopBorder
  >
    <Hero />
    <DemoList category={branching.name} items={branching.items} categoryTextColor="text-pink-90" />
  </Layout>
);

export default DemoPage;
