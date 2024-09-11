import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Logos from 'components/shared/logos';

import Testimonial from '../testimonial';

import ContactUsForm from './contact-us-form';

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
  <section className="contact-us safe-paddings pb-[30px] pt-[104px] 2xl:pt-[150px] xl:pt-[120px] lg:pt-[52px] md:overflow-hidden md:pt-[40px] sm:pb-[80px]">
    <Container className="grid-gap-x grid grid-flow-dense grid-cols-12" size="1152">
      <div className="col-span-5 col-start-1">
        <Heading
          className="z-20 text-[52px] font-medium leading-none tracking-extra-tight"
          tag="h2"
          theme="white"
        >
          Contact Us
        </Heading>
        <p className="z-20 mt-3 flex flex-col gap-5 text-lg font-light leading-snug tracking-[0.008em] text-gray-new-80">
          Reach out to the Neon team to ask about your own use case. Build and scale your
          database-per user-architecture.
        </p>
        <Testimonial {...testimonial} />
        <Logos className="mt-14" logos={logos} />
      </div>
      <ContactUsForm className="col-span-7 col-start-6 ml-auto max-w-[576px]" />
    </Container>
  </section>
);

export default ContactUs;
