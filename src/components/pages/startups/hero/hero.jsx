import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import Logos, { allLogos } from 'components/shared/logos';
import SectionLabel from 'components/shared/section-label';

import ApplyLink from './apply-link';
import ContactForm from './contact-form';
import Quotes from './quotes';

// Toggle between the external Google Sites application form (ApplyLink) and the
// legacy inline HubSpot form (ContactForm). Flip this to `false` to instantly
// restore the old form.
const USE_EXTERNAL_APPLY_FORM = true;

const Hero = ({ logos, quotes }) => (
  <section className="hero pt-40 lg:pt-16 md:pt-12">
    <Container size="1280">
      <div className="flex justify-between gap-16 xl:gap-12 lg:mx-auto lg:max-w-lg lg:flex-col lg:gap-10">
        <div className="flex max-w-xl flex-1 flex-col justify-between gap-16 xl:max-w-[48%] lg:max-w-full lg:gap-10 md:gap-8">
          <div className="flex flex-col lg:max-w-[448px]">
            <SectionLabel className="mb-5 lg:mb-[18px] md:mb-4" theme="white">
              Databricks Startup Program
            </SectionLabel>
            <Heading
              className="text-pretty lg:max-w-2xl md:text-[36px]! xs:text-[32px]!"
              tag="h1"
              size="md-new"
              theme="white"
            >
              Launch faster with <br /> up to $200K in credits
            </Heading>
            <p className="mt-7 text-lg leading-snug tracking-extra-tight text-gray-new-70 xl:text-base lg:mt-3.5 md:mt-3 md:text-[15px]">
              Qualifying startups can receive up to $200K in credits for Neon and Databricks. Not
              sure if you qualify? Apply or ask your investor.
            </p>
          </div>
          <div className="max-w-[530px] lg:mt-2 lg:max-w-full">
            <Quotes items={quotes} />
          </div>
        </div>
        <div className="w-full max-w-xl shrink-0 xl:max-w-[48%] lg:max-w-full">
          {USE_EXTERNAL_APPLY_FORM ? <ApplyLink /> : <ContactForm />}
        </div>
      </div>

      <Logos
        className="mt-32 max-w-full min-w-0"
        logoClassName="text-[#AFB1B6]"
        logos={logos}
        size="sm"
        staticDesktop
      />
    </Container>
  </section>
);

Hero.propTypes = {
  logos: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(allLogos))).isRequired,
  quotes: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      post: PropTypes.string,
    })
  ).isRequired,
};

export default Hero;
