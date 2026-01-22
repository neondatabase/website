import Container from 'components/shared/container/container';

import ContactForm from './contact-form';
import Quotes from './quotes';

const QUOTES = [
  {
    text: 'Every tech choice we make is about staying lightweight and scalable. Neon fits that perfectly: we can spin up real Postgres databases in CI, in seconds, with zero hassle.',
    author: 'Oliver Stenbom',
    post: 'Co-Founder at Endform',
  },
  {
    text: 'Postgres fits with our architecture, and Neon made it easy. I didn’t want to deal with any overhead, Neon worked out of the box and let us stay focused.',
    author: 'Chris Sims',
    post: 'CEO and Co-Founder of Rhythmic',
  },
  {
    text: 'We use Neon branching in our development process to find issues, test migrations, and experiment safely.',
    author: 'Tal Kain',
    post: 'Founder and CEO at Velocity',
  },
  {
    text: 'Databases have always been such a pain. In Neon, everything feels easier and much safer to do.',
    author: 'Julian Benegas',
    post: 'CEO of BaseHub',
  },
  {
    text: 'We work with a workflow where each developer has a branch with their name, and then we also have a Neon branch associated with a GitHub branch.',
    author: 'Sarim Malik',
    post: 'CEO at Rubric Labs',
  },
  {
    text: 'Neon autoscaling kicks in when we have bursts of traffic. Neon’s managed database experience made it effortless to handle.',
    author: 'Lex Nasser',
    post: 'Founding Engineer at 222',
  },
];

const Hero = () => (
  <section className="hero pt-[192px] xl:pt-[166px] lg:pt-16 md:pt-12">
    <Container className="xl:max-w-5xl" size="1280">
      <div className="relative flex justify-between gap-16 xl:gap-12 lg:mx-auto lg:max-w-lg lg:flex-col lg:gap-10">
        <div className="flex max-w-xl flex-1 flex-col gap-10 xl:max-w-[460px] lg:max-w-full md:gap-8">
          <div className="flex flex-col lg:max-w-[448px]">
            <span className="mb-[18px] text-sm uppercase leading-none tracking-wide text-gray-new-50 lg:mb-3.5 lg:text-xs">
              Neon Startup Program
            </span>
            <h1 className="w-fit font-title text-[56px] font-medium leading-none tracking-extra-tight xl:text-[48px] lg:text-[40px] md:text-[32px]">
              Launch faster with
              <br /> $100K in Neon Credits
            </h1>
            <p className="mt-4 text-balance text-lg leading-snug tracking-extra-tight text-gray-new-80 xl:text-base lg:mt-3.5 md:mt-3 md:text-[15px]">
              Join the Startup Program and start building with the best database for developers:
              fast, scalable, and serverless.
            </p>
          </div>
        </div>
        <div className="w-full max-w-xl shrink-0 xl:max-w-[448px] lg:max-w-full">
          <ContactForm />
        </div>
        <div className="absolute bottom-0 left-0 max-w-xl xl:max-w-[460px] lg:relative lg:mt-2 lg:max-w-full">
          <Quotes items={QUOTES} />
        </div>
        <span className="absolute -right-[120px] top-1/2 -z-10 h-[917px] w-[614px] -translate-y-1/2 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(30,52,62,.5),transparent)] lg:hidden" />
      </div>
    </Container>
  </section>
);

export default Hero;
