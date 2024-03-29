import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import avatar1 from 'images/pages/home/industry/avatar-1.png';
import avatar2 from 'images/pages/home/industry/avatar-2.png';
import avatar3 from 'images/pages/home/industry/avatar-3.png';
import linesImage from 'images/pages/home/industry/lines.png';
import vercelLogo from 'images/pages/home/industry/vercel.svg';

import Testimonial from './testimonial';

// TODO: update logos and avatars
// TODO: implement slider for mobiles
// TODO: implement rive animation
const TESTIMONIALS = [
  {
    quote: `Neon is very easy to use. You create an account and a project, you get a database string, and that’s that. It’s still the Postgres that you’re used to.`,
    avatar: avatar1,
    name: 'Joey Teunissen',
    position: 'CTO at Opusflow',
    logo: { src: vercelLogo, width: 111, height: 36, alt: '' },
  },
  {
    quote: `By partnering with Neon, Vercel’s frontend platform is now the end-to-end serverless solution for building on the Web, from Next.js all the way to SQL.`,
    avatar: avatar2,
    name: 'Guillermo Rauch',
    position: 'CEO at Vercel',
    logo: { src: vercelLogo, width: 111, height: 36, alt: 'Vercel' },
  },
  {
    quote: `The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer.`,
    avatar: avatar3,
    name: 'Lincoln Bergeson',
    position: 'Infrastructure Engineer at Replit',
    logo: { src: vercelLogo, width: 111, height: 36, alt: '' },
  },
  {
    quote: `Using Neon has meant our developers can continue to spend their time on things that meaningfully drive the business forward, instead of babysitting infrastructure.`,
    avatar: avatar3,
    name: 'Adithya Reddy',
    position: 'Developer at Branch',
    logo: { src: vercelLogo, width: 111, height: 36, alt: '' },
  },
];

const Industry = () => (
  <section className="industry mt-[264px] xl:mt-[75px] lg:mt-24 sm:mt-20">
    <Container
      className="box-content flex gap-24 xl:max-w-[768px] xl:gap-[76px] lg:!max-w-[627px] lg:gap-[67px] md:gap-[40px]"
      size="960"
    >
      <Image
        className="xl:w-[180px] lg:w-36 sm:hidden"
        src={linesImage}
        width={linesImage.width / 2}
        height={linesImage.height / 2}
        alt=""
      />
      <div className="sm:flex sm:w-full sm:flex-col sm:items-center">
        <h2
          className={clsx(
            'mt-11 font-title text-[88px] font-medium leading-[0.96] -tracking-[0.03em] text-white',
            'xl:mt-[64px] xl:text-[72px] lg:mt-6 lg:text-[56px]',
            'sm:mt-0 sm:text-center sm:text-[32px] sm:leading-[0.9em] sm:tracking-extra-tight'
          )}
        >
          Industry&nbsp;leaders
          <br />
          trust Neon
        </h2>
        <div
          className={clsx(
            'mt-48 flex flex-col gap-[184px] ',
            'xl:mt-[123px] xl:gap-[142px] lg:mt-[98px] lg:gap-[78px] sm:mt-6 sm:gap-0'
          )}
        >
          {TESTIMONIALS.map((testimonal, index) => (
            <Testimonial
              className={clsx(index !== 1 && 'opacity-40 blur-[2px] sm:hidden')}
              {...testimonal}
              key={index}
            />
          ))}

          <span
            className={clsx(
              'relative mx-auto mt-8 hidden h-px w-[192px] bg-[#343538] sm:block',
              'after:absolute after:left-0 after:top-0 after:h-px after:w-12 after:bg-green-45'
            )}
          />
        </div>
      </div>
    </Container>
  </section>
);

export default Industry;
