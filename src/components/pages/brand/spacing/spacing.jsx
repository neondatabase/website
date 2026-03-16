import Image from 'next/image';

import Section from '../section';

import logoSpacing from './images/logo-spacing.svg';
import logomarkSpacing from './images/logomark-spacing.svg';

const Spacing = () => (
  <Section
    title="Spacing considerations"
    description="The safety area surrounding the Logo is defined by the height of our symbol."
    className="mb-40 md:mb-[88px] lg:mb-28 xl:mb-32"
  >
    <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-7 md:justify-start md:gap-20">
      <Image
        className="md:w-48 lg:w-[238px]"
        src={logomarkSpacing}
        alt="Logo spacing"
        width={259}
        height={260}
      />
      <Image
        className="md:w-80 lg:w-[384px]"
        src={logoSpacing}
        alt="Logo spacing"
        width={420}
        height={216}
      />
    </div>
  </Section>
);

export default Spacing;
