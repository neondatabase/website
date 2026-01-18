import Image from 'next/image';

import Section from '../section';

import logoSpacing from './images/logo-spacing.svg';
import logomarkSpacing from './images/logomark-spacing.svg';

const Spacing = () => (
  <Section
    title="Spacing considerations"
    description="The safety area surrounding the Logo is defined by the height of our symbol."
    className="mb-40 xl:mb-32 lg:mb-28 md:mb-[88px]"
  >
    <div className="flex items-center justify-between md:justify-start md:gap-20 sm:flex-col sm:items-start sm:gap-7">
      <Image
        className="lg:w-[238px] md:w-48"
        src={logomarkSpacing}
        alt="Logo spacing"
        width={259}
        height={260}
      />
      <Image
        className="lg:w-[384px] md:w-80"
        src={logoSpacing}
        alt="Logo spacing"
        width={420}
        height={216}
      />
    </div>
  </Section>
);

export default Spacing;
