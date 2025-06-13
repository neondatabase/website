import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';

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
    text: 'Databases have always been such a pain. In Neon, everything feels easier and much safer to do” (Julian Benegas.',
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
  <section className="z-10 grow overflow-hidden bg-black-pure pb-36 pt-[168px] xl:pb-20 xl:pt-32 lg:py-28 md:py-[100px]">
    <Container className="xl:max-w-5xl lg:max-w-3xl md:px-5" size="1216">
      <div className="flex justify-between lg:mx-auto lg:max-w-xl lg:flex-col lg:gap-14">
        <div className="flex max-w-xl flex-1 flex-col xl:max-w-[448px] lg:max-w-full lg:items-center lg:text-center">
          <div className="flex max-w-[544px] flex-col xl:max-w-sm lg:max-w-full lg:items-center">
            <span className="mb-[18px] text-sm uppercase leading-none tracking-tight text-gray-new-50">
              Neon Startup Program
            </span>
            <Heading
              className="w-fit font-title text-[56px] font-medium leading-none tracking-tight text-white xl:text-[48px] lg:text-[40px]"
              tag="h1"
              theme="white"
            >
              Launch faster with $100K in Neon Credits
            </Heading>
            <p className="mt-4 text-pretty text-xl leading-snug tracking-tight text-gray-new-80 xl:text-lg xl:leading-normal lg:mt-3 md:text-base">
              Join our Startup Program and get the Postgres platform built for developers: fast,
              scalable, and serverless.
            </p>
          </div>
          <div className="mt-auto lg:mt-14">
            <Quotes items={QUOTES} />
          </div>
        </div>
        <div className="max-w-xl shrink-0 xl:max-w-[512px] lg:max-w-full">
          <ContactForm />
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
