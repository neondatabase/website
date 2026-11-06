import Container from 'components/shared/container';

import FeatureHeading from './feature-heading';
import StartupExperience from './startup-experience';

const Startups = () => (
  <div className="relative h-[977px] xl:h-[830px] md:h-[790px] sm:h-[720px]">
    <Container
      className="grid h-full grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)] lg:block"
      size="1600"
    >
      <div className="relative col-start-2 h-full min-w-0">
        <FeatureHeading
          lines={[
            { text: 'WHERE STARTUPS', width: 608 },
            { text: 'START', width: 384 },
          ]}
          description="From Bootstrapped to VC Funded, Startups Ship Faster on Neon."
          descriptionClassName="max-w-[440px] lg:max-w-[400px] md:max-w-[360px] sm:max-w-[290px]"
        />

        <StartupExperience />
      </div>
    </Container>
  </div>
);

export default Startups;
