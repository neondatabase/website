import Image from 'next/image';

import Container from 'components/shared/container/container';
import LINKS from 'constants/links';
import cloudIcon from 'icons/security/cloud.svg';
import dataIcon from 'icons/security/data.svg';
import privacyIcon from 'icons/security/privacy.svg';
import tableIcon from 'icons/security/table.svg';
import userLockIcon from 'icons/security/user-lock.svg';

const FEATURES = [
  {
    title: 'Neon PostgreSQL Service',
    description: 'Secure, scalable, cloud-hosted PostgreSQL database.',
    icon: dataIcon,
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Hosted on AWS and Azure, leveraging built-in security controls.',
    icon: cloudIcon,
  },
  {
    title: 'Data Storage & Processing',
    description: 'Encryption, access controls, and secure data retention policies.',
    icon: tableIcon,
  },
  {
    title: 'Access & Security Controls ',
    description: 'Identity management, monitoring, and compliance enforcement.',
    icon: privacyIcon,
  },
  {
    title: 'Personnel Security',
    description: 'Employee background checks, security training, and access management.',
    icon: userLockIcon,
  },
];

const TrustCenter = () => (
  <section className="trust-center safe-paddings relative pt-40 xl:pt-[136px] lg:pt-[120px] md:pt-[104px]">
    <Container className="relative z-10" size="960">
      <div className="flex gap-[72px] lg:mr-[52px] lg:justify-center lg:gap-9 md:mr-0 sm:flex-col sm:gap-10">
        <div className="w-[280px] shrink-0 lg:w-[328px] md:w-1/2 sm:w-full">
          <h2 className="font-title text-[44px] font-medium leading-[0.9] tracking-extra-tight xl:text-4xl lg:text-[36px] md:text-[32px]">
            Trust Center
          </h2>
          <div className="text-with-links mt-4 flex flex-col gap-2 leading-snug tracking-extra-tight text-gray-new-70 lg:text-[15px]">
            <p>
              Request audit reports, certifications, and compliance documentation via our{' '}
              <a href={LINKS.trust} target="_blank" rel="noreferrer">
                Trust Center
              </a>
              .
            </p>
            <p>
              For additional security inquiries, contact{' '}
              <a href="mailto:security@neon.tech">security@neon.tech</a>.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grow grid-cols-2 gap-x-8 gap-y-9 lg:mt-2 lg:max-w-[290px] lg:grid-cols-1 lg:gap-7 md:max-w-full sm:mt-0">
          {FEATURES.map(({ title, description, icon }) => (
            <div key={title}>
              <div className="flex items-start gap-2">
                <Image className="shrink-0" src={icon} alt={title} width={22} height={22} />
                <h3 className="text-lg font-medium leading-snug tracking-extra-tight sm:text-base">
                  {title}
                </h3>
              </div>
              <p className="mt-2 text-pretty font-light leading-snug tracking-extra-tight text-gray-new-70 sm:text-[15px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

export default TrustCenter;
