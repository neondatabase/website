import Autoscaling from 'components/pages/serverless-apps/autoscaling';
import Features from 'components/pages/serverless-apps/features';
import Hero from 'components/pages/serverless-apps/hero';
import CTANew from 'components/shared/cta-new';
import Layout from 'components/shared/layout';
import TestimonialNew from 'components/shared/testimonial-new';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import authorCodyJenkins from 'images/authors/cody-jenkins.jpg';
import authorJulianBenegas from 'images/authors/julian-benegas.jpg';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.serverlessApps);

const ServerlessAppsPage = () => (
  <Layout isHeaderSticky>
    <Hero />
    <Autoscaling />
    <TestimonialNew
      className="pt-40 xl:pt-[136px] lg:pt-[104px] md:pt-20"
      quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora v2. On top of that, it costs us 1/6 of what we were paying with AWS."
      author={{
        name: 'Cody Jenkins',
        position: 'Head of Engineering at Invenco',
        avatar: authorCodyJenkins,
      }}
    />
    <Features />
    <TestimonialNew
      className="pt-40 xl:pt-[136px] lg:pt-[104px] md:pt-20"
      quote="Instead of having to overprovision our servers to handle peak loads, which leads to inefficiencies and higher costs, Neon’s autoscaling handles it. We get more performance when we need it."
      author={{
        name: 'Julian Benegas',
        position: 'CEO of BaseHub',
        avatar: authorJulianBenegas,
      }}
    />
    <CTANew
      title="Sign up and<br> get $100 credits"
      description="Start saving with Neon."
      buttonText="Sign up"
      buttonUrl={LINKS.signupCredits}
    />
  </Layout>
);

export default ServerlessAppsPage;
