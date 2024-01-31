import Button from 'components/shared/button';
import Container from 'components/shared/container/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';
import Clouflare from 'images/partners-logos/cloudflare.inline.svg';
import Hasura from 'images/partners-logos/hasura.inline.svg';
import Koyeb from 'images/partners-logos/koyeb.inline.svg';
import Replit from 'images/partners-logos/replit.inline.svg';
import Vercel from 'images/partners-logos/vercel.inline.svg';
import Wundergraph from 'images/partners-logos/wundergraph.inline.svg';

const logos = [
  {
    logo: Hasura,
    alt: 'Hasura',
    width: 111,
  },
  {
    logo: Replit,
    alt: 'Replit',
    width: 119,
  },
  {
    logo: Clouflare,
    alt: 'Cloudflare',
    width: 160,
  },
  {
    logo: Vercel,
    alt: 'Vercel',
    width: 112,
  },
  {
    logo: Koyeb,
    alt: 'Koyeb',
    width: 126,
  },
  {
    logo: Wundergraph,
    alt: 'WunderGraph',
    width: 152,
  },
];

const Partnership = () => (
  <section className="partnership safe-paddings bg-black pb-[180px] text-white 2xl:pb-40 xl:pb-32 lg:pb-24 md:pb-20">
    <Container className="flex flex-col items-center justify-center text-center" size="medium">
      <Heading
        className="text-[56px] font-bold leading-dense xl:text-[44px] lg:text-[40px] sm:text-[30px]"
        tag="h2"
        theme="white"
      >
        Discover Neon Partnership Program
      </Heading>
      <p className="t-xl mt-5">Integrate Neon into any application seamlessly.</p>
      <Button
        className="mt-12 !px-[34px] !py-5 2xl:mt-10 xl:mt-8 md:mt-6"
        to={LINKS.partners}
        size="md"
        theme="primary"
      >
        Become a partner
      </Button>
      <ul className="mt-20 grid w-full grid-cols-12 gap-x-10 xl:justify-center xl:gap-x-8 xl:gap-y-8 lg:mt-12 md:gap-x-6 sm:gap-y-6 xs:gap-4">
        {logos.map(({ logo: Logo, alt }, index) => (
          <li
            className="relative col-span-2 mr-1.5 after:absolute after:-bottom-1.5 after:-right-1.5 after:h-full after:w-full after:rounded-md after:bg-gray-1 xl:col-span-4 sm:col-span-6"
            key={index}
          >
            <div className="relative z-10 flex items-center justify-center rounded-md border-4 border-gray-1 bg-[#191919] py-[22px] md:py-4">
              <Logo className="h-8 w-auto text-white 2xl:h-6 md:h-7 sm:h-6 xs:h-5" />
              <span className="sr-only">{alt}</span>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Partnership;
