import Container from 'components/shared/container/container';
import CCPALogo from 'images/pages/security/ccpa-logo.png';
import GDPRLogo from 'images/pages/security/gdpr-logo.png';
import HIPAALogo from 'images/pages/security/hipaa-logo.png';

import Cards from '../cards';

const CARDS = [
  {
    title: 'California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA)',
    description:
      'Neon complies with CCPA and CPRA, ensuring data privacy and transparency. We don’t sell, share, or retain personal data beyond contractual obligations, allowing users to manage their preferences.',
    logo: {
      src: CCPALogo,
      width: 98,
      height: 108,
      className: 'mt-px -ml-[5px]',
    },
    borderClassName:
      'border-image-[radial-gradient(35%_50%_at_0_0,rgba(56,118,103,0.6),transparent),linear-gradient(0deg,#242628,#242628)]',
    highlightClassName: 'bg-[#4CECB7]/20',
  },
  {
    title: 'European General Data Protection Regulation (GDPR)',
    description:
      'Neon follows the GDPR framework, ensuring user rights, data minimization, and lawful processing. We offer Data Processing Agreements (DPA) and support compliant cross-border data transfers.',
    logo: {
      src: GDPRLogo,
      width: 108,
      height: 108,
    },
    borderClassName:
      'border-image-[radial-gradient(35%_50%_at_0_0,rgba(65,82,139,0.8),transparent),linear-gradient(0deg,#242628,#242628)]',
    highlightClassName: 'bg-[#4C72EC]/40',
  },
  {
    title:
      'United States Health Insurance Portability and Accountability&nbsp;Act of&nbsp;1996 (HIPAA)',
    description:
      'Neon has achieved HIPAA compliance to support customers handling protected health information (PHI). Our security measures include encryption of electronic PHI, least-privilege access control, security monitoring for unauthorized data access, and comprehensive audit logging.',
    banner: {
      src: HIPAALogo,
      width: 399,
      height: 267,
    },
    borderClassName: '',
    highlightClassName: 'hidden',
  },
];

const Privacy = () => (
  <section className="compliance safe-paddings relative pt-40 xl:pt-[136px] lg:pt-[120px] md:pt-[104px]">
    <Container className="relative z-10" size="960">
      <h2 className="text-center font-title text-[44px] font-medium leading-[0.9] tracking-extra-tight xl:text-4xl lg:text-[36px] md:text-[28px]">
        Privacy & Regulations
      </h2>
      <Cards data={CARDS} />
    </Container>
  </section>
);

export default Privacy;
