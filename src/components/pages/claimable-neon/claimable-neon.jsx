import CTANew from 'components/shared/cta-new';
import LINKS from 'constants/links';

import Hero from './hero';
import Interfaces from './interfaces';
import Ownership from './ownership';
import Workflow from './workflow';

const ClaimableNeon = () => (
  <>
    <Hero />
    <Workflow />
    <Interfaces />
    <Ownership />
    <CTANew
      className="mt-50 bg-gray-new-10 xl:mt-40 lg:mt-32 md:mt-20"
      title="Building something ambitious?"
      description="Fill out a short form and we’ll get back to you within a few business days."
      label="Get started"
      buttonText="Apply now"
      buttonUrl={LINKS.contactSales}
    />
  </>
);

export default ClaimableNeon;
