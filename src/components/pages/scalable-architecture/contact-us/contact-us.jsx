import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Logos from 'components/shared/logos';

import ContactUsForm from './contact-us-form';
import Testimonial from './testimonial';

const logos = [
  'bunnyshell',
  'hasura',
  'replit',
  'vercel',
  'retool',
  'illa',
  'octolis',
  'cloudflare',
  'wundergraph',
  'fabric-io',
  'snaplet',
  'fl0',
  'encore',
];

const testimonial = {
  quote:
    'We’ve been able to manage 300K+ Postgres databases via the Neon API. It saved us a tremendous amount of time and engineering effort.',
  name: 'Himanshu Bhandoh',
  position: 'Software Engineer at Retool',
};

const ContactUs = () => (
  <section className="contact-us safe-paddings pb-[30px] pt-[104px] xl:pt-0 lg:pb-[54px] sm:pb-[58px]">
    <Container
      className="grid-gap-x grid grid-flow-dense grid-cols-12 xl:max-w-[960px] xl:gap-x-[38px] lg:max-w-[576px] md:max-w-none md:gap-x-0 md:px-10 sm:px-8 xs:px-5"
      size="1152"
    >
      <Heading
        className="col-span-5 col-start-1 text-[52px] font-medium leading-none tracking-extra-tight xl:text-[44px] lg:order-1 lg:col-span-12 lg:text-center lg:text-4xl lg:tracking-tighter xs:text-left xs:text-[32px]"
        tag="h2"
        theme="white"
      >
        Contact Us
      </Heading>
      <p className="col-span-5 col-start-1 mt-3 text-lg font-light leading-snug tracking-[0.008em] text-gray-new-80 xl:mt-2.5 lg:order-2 lg:col-span-12 lg:mx-auto lg:max-w-[488px] lg:text-center lg:text-base md:max-w-full xs:text-left">
        Reach out to the Neon team to ask about your own use case. Build and scale your database-per
        user-architecture.
      </p>
      <Testimonial
        className="col-span-5 col-start-1 mt-16 max-w-[464px] lg:order-4 lg:col-span-12 lg:mx-auto lg:mt-[46px] lg:max-w-[512px] md:max-w-full xs:mt-6"
        {...testimonial}
      />
      <Logos
        className="col-span-5 col-start-1 mt-14 lg:order-5 lg:col-span-12 lg:mt-11 xs:mt-10"
        logos={logos}
      />
      <ContactUsForm className="col-span-7 col-start-6 row-span-5 -mt-1 ml-auto max-w-[576px] xl:mt-px lg:order-3 lg:col-span-12 lg:col-start-1 lg:mr-auto lg:mt-8 lg:max-w-[512px] md:max-w-full xs:mt-6" />
    </Container>
  </section>
);

export default ContactUs;
