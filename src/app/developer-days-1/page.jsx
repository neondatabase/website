import Image from 'next/image';

import Branching from 'components/pages/developer-days/branching';
import CTA from 'components/pages/developer-days/cta';
import Hero from 'components/pages/developer-days/hero';
import Partners from 'components/pages/developer-days/partners';
// import Register from 'components/pages/developer-days/register';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.developerDays1);

const DeveloperDays1Page = () => (
  <Layout headerTheme="black" footerTheme="black" footerWithTopBorder>
    <div className="relative overflow-hidden bg-black text-white">
      <Image
        className="absolute left-1/2 top-0 h-auto w-[1440px] -translate-x-1/2 xl:hidden"
        src="/images/pages/developer-days/background.svg"
        width={1440}
        height={4815}
        alt=""
        aria-hidden
      />
      <Image
        className="absolute left-1/2 top-0 hidden h-auto w-full -translate-x-1/2 px-[70px] xl:block lg:hidden"
        src="/images/pages/developer-days/background-xl.svg"
        width={884}
        height={3780}
        alt=""
        aria-hidden
      />
      <Image
        className="absolute left-1/2 top-0 hidden h-auto w-full -translate-x-1/2 px-11 lg:block xs:hidden"
        src="/images/pages/developer-days/background-lg.svg"
        width={680}
        height={3196}
        alt=""
        aria-hidden
      />
      <Image
        className="absolute left-1/2 top-0 hidden h-auto w-full -translate-x-1/2 px-9 xs:block"
        src="/images/pages/developer-days/background-md.svg"
        width={340}
        height={3330}
        alt=""
        aria-hidden
      />
      <Hero />
      <Branching />
      <Partners />
      <CTA />
      {/* <Register type="day1" /> */}
    </div>
  </Layout>
);

export default DeveloperDays1Page;

export const revalidate = 60;
