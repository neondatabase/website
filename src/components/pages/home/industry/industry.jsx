import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import avatar1 from 'images/pages/home/industry/avatar-1.png';
import avatar2 from 'images/pages/home/industry/avatar-2.png';
import avatar3 from 'images/pages/home/industry/avatar-3.png';
import linesImage from 'images/pages/home/industry/lines.png';

// TODO: update and rename avatars once all photos are ready in the design
const TESTIMONIALS = [
  {
    quote: `Neon is very easy to use. You create an account and a project, you get a database string, and that’s that. It’s still the Postgres that you’re used to.`,
    avatar: avatar1,
    name: 'Joey Teunissen',
    position: 'CTO at Opusflow',
  },
  {
    quote: `By partnering with Neon, Vercel’s frontend platform is now the end-to-end serverless solution for building on the Web, from Next.js all the way to SQL.`,
    avatar: avatar2,
    name: 'Guillermo Rauch',
    position: 'CEO at Vercel',
  },
  {
    quote: `The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer.`,
    avatar: avatar3,
    name: 'Lincoln Bergeson',
    position: 'Infrastructure Engineer at Replit',
  },
  {
    quote: `Using Neon has meant our developers can continue to spend their time on things that meaningfully drive the business forward, instead of babysitting infrastructure.`,
    avatar: avatar3,
    name: 'Adithya Reddy',
    position: 'Developer at Branch',
  },
];

const Testimonial = ({ quote, avatar, name, position, className }) => (
  <figure className={className}>
    <blockquote className="text-2xl font-light leading-snug tracking-extra-tight text-white xl:text-xl lg:text-base">
      <p>{quote}</p>
    </blockquote>
    <figcaption className="mt-6 flex items-center gap-3 text-lg tracking-normal xl:mt-4 xl:gap-2.5 lg:mt-3">
      <Image
        className="h-8 w-8 rounded-full grayscale xl:h-7 xl:w-7 lg:h-6 lg:h-6"
        src={avatar}
        width={avatar.width / 2}
        height={avatar.height / 2}
        alt={name}
      />
      <div className="text-lg leading-normal text-gray-new-60 xl:text-base lg:text-sm">
        {name} <cite className="font-light not-italic text-gray-new-40">- {position}</cite>
      </div>
    </figcaption>
  </figure>
);

Testimonial.propTypes = {
  quote: PropTypes.string.isRequired,
  avatar: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  className: PropTypes.string,
};

// TODO: implement blur on scroll
const Industry = () => (
  <section className="industry mt-[264px] xl:mt-[75px] lg:mt-24 md:mt-20">
    <Container
      className="flex gap-24 xl:max-w-[768px] xl:max-w-none xl:gap-[76px] lg:gap-[67px]"
      size="960"
    >
      <Image
        className="xl:w-[180px] lg:w-36"
        src={linesImage}
        width={linesImage.width / 2}
        height={linesImage.height / 2}
      />
      <div>
        {/* TODO: get rid of &nbsp; */}
        <h2
          className={clsx(
            'mt-[62px] text-[88px] font-medium leading-[0.96] -tracking-[0.03em] text-white',
            'xl:mt-[64px] xl:text-7xl lg:mt-6 lg:text-[56px] md:mt-0 md:text-[32px] md:leading-[0.9em] md:tracking-extra-tight'
          )}
        >
          Industry&nbsp;leaders trust Neon
        </h2>
        <div className="mt-48 flex flex-col gap-[184px] xl:mt-[123px] xl:gap-[142px] lg:mt-[98px] lg:gap-[78px] md:mt-6">
          {TESTIMONIALS.map((testimonal, index) => (
            <Testimonial
              className={clsx(index !== 1 && 'opacity-40 blur-[2px]')}
              {...testimonal}
              key={index}
            />
          ))}
        </div>
      </div>
    </Container>
  </section>
);

export default Industry;
