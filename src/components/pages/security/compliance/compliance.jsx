import Container from 'components/shared/container/container';
import LINKS from 'constants/links';
import ISOLogo from 'images/pages/security/iso-logo.png';
import SOC2Logo from 'images/pages/security/soc2-logo.png';

import Cards from '../cards';

const CARDS = [
  {
    title: 'SOC 2 Type II',
    description: `Neon undergoes annual SOC 2 Type II audits performed by accredited independent third party auditors. The SOC 3 report, a public summary of our SOC 2 compliance, is available without an NDA in the <a href=${LINKS.trust} target="_blank">Trust Center</a>.`,
    logo: {
      src: SOC2Logo,
      width: 108,
      height: 108,
      className: 'mt-1',
    },
    borderClassName:
      'border-image-[radial-gradient(35%_50%_at_0_0,rgba(65,82,139,0.8),transparent),linear-gradient(0deg,#242628,#242628)]',
    highlightClassName: 'bg-[#4C72EC]/40',
  },
  {
    title: 'ISO/IEC 27001:2022 & ISO/IEC&nbsp;27701:2019',
    description:
      'Neon undergoes annual ISO/IEC 27001:2022 and ISO/IEC 27701:2019 audits for its security and privacy management systems. These certifications validate our commitment to global standards.',
    logo: {
      src: ISOLogo,
      width: 96,
      height: 107,
      className: 'mt-1 -ml-1',
    },
    borderClassName:
      'border-image-[radial-gradient(35%_50%_at_0_0,rgba(56,118,103,0.8),transparent),linear-gradient(0deg,#242628,#242628)]',
    highlightClassName: 'bg-[#00E599]/20',
  },
];

const Compliance = () => (
  <section className="compliance safe-paddings relative pt-28 xl:pt-[104px] lg:pt-20 md:pt-16">
    <Container className="relative z-10" size="960">
      <h2 className="text-center font-title text-[44px] font-medium leading-[0.9] tracking-extra-tight xl:text-4xl lg:text-[36px] md:text-[28px]">
        Compliance Frameworks
      </h2>
      <Cards data={CARDS} isPriority />
    </Container>
  </section>
);

export default Compliance;
