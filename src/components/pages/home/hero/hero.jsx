import clsx from 'clsx';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import Clouflare from 'images/partners-logos/cloudflare.inline.svg';
import Hasura from 'images/partners-logos/hasura.inline.svg';
import Koyeb from 'images/partners-logos/koyeb.inline.svg';
import Replit from 'images/partners-logos/replit.inline.svg';
import Retool from 'images/partners-logos/retool.inline.svg';
import Vercel from 'images/partners-logos/vercel.inline.svg';
import Wundergraph from 'images/partners-logos/wundergraph.inline.svg';

const logos = [
  {
    logo: Hasura,
    alt: 'Hasura',
  },
  {
    logo: Replit,
    alt: 'Replit',
  },
  {
    logo: Clouflare,
    alt: 'Cloudflare',
  },
  {
    logo: Vercel,
    alt: 'Vercel',
  },
  {
    logo: Koyeb,
    alt: 'Koyeb',
  },
  {
    logo: Wundergraph,
    alt: 'WunderGraph',
  },
  {
    logo: Retool,
    alt: 'Retool',
  },
];

const buttons = [
  {
    text: 'Start Free',
    to: LINKS.signup,
    theme: 'primary',
  },
  {
    text: 'View Pricing',
    to: LINKS.pricing,
    theme: 'gray-dark-outline',
    className: '!border-4 sm:!border-[3px]',
  },
];

const Hero = () => (
  <section className="safe-paddings bg-black pt-[184px] lg:pt-12 md:pt-6">
    <Container
      className="z-20 flex flex-col items-center justify-center lg:flex-col lg:justify-center"
      size="medium"
      id="container"
    >
      <div className="relative z-20 text-center">
        <Heading
          className="with-highlighted-text-secondary-2 leading-dense"
          id="hero-title"
          tag="h1"
          size="xl"
          theme="white"
        >
          Serverless Postgres
        </Heading>
        <p className="t-xl mx-auto mt-5 max-w-[780px] text-white">
          The fully managed serverless Postgres with a generous free tier. We separate storage and
          compute to offer autoscaling, branching, and bottomless storage.
        </p>
        <div className="mx-auto mt-12 grid max-w-[400px] auto-rows-fr grid-cols-2 items-center gap-x-6 2xl:mt-8 xl:mt-7 md:mt-6 xs:grid-cols-1 xs:gap-y-4">
          {buttons.map(({ text, to, theme, className }) => (
            <Button
              className={clsx(className, 'h-16 md:h-14')}
              key={text}
              to={to}
              theme={theme}
              size="sm"
            >
              {text}
            </Button>
          ))}
        </div>
      </div>
      <p className="mt-[104px] text-center text-lg font-medium leading-snug text-gray-new-60 lg:mt-16 md:mt-14 sm:mt-10">
        Powering 500,000+ databases for developers and partners
      </p>
      <ul className="mx-auto mt-7 flex w-full max-w-[1472px] justify-center gap-x-16 2xl:max-w-[800px] 2xl:flex-wrap 2xl:gap-y-10 xl:justify-center xl:gap-x-14 md:gap-y-8 xs:gap-y-6">
        {logos.map(({ logo: Logo, alt }) => (
          <li key={alt}>
            <Logo className="h-9 w-auto text-gray-new-60 2xl:h-8 md:h-7" />
            <span className="sr-only">{alt}</span>
          </li>
        ))}
      </ul>
      <Link to={LINKS.caseStudies} theme="underline-primary-1" className="mt-9 text-xl lg:text-lg">
        Read case studies
      </Link>
    </Container>
  </section>
);

export default Hero;
