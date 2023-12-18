import Container from 'components/shared/container';
import Link from 'components/shared/link';

import ArrowIcon from './images/arrow.inline.svg';
import lines from './images/lines.svg';

const buttons = [
  {
    text: 'Estimate your bill',
    link: '#estimates',
  },
  {
    text: 'View billing docs',
    link: '/docs/billing',
  },
];

const Forecasting = () => (
  <section className="forecasting safe-paddings pt-[200px] 2xl:pt-36 md:pt-24 ">
    <Container size="medium">
      <div className="max-w-[1220px] flex justify-between items-center md:flex-col md:gap-y-10 mx-auto">
        <div>
          <h2 className="leading-none font-medium tracking-tighter text-[56px] lg:text-5xl md:text-4xl [&_span]:text-green-45">
            Forecasting is <span>easy</span>
          </h2>
          <p className="text-lg leading-snug font-light mt-4 max-w-[464px] md:text-base md:max-w-none">
            Refer to our billing docs to explore detailed pricing metrics or swiftly estimate your
            costs through our intuitive survey.
          </p>
          <div className="flex mt-9 gap-x-4 xs:flex-col xs:gap-y-2 xs:items-baseline">
            {buttons.map(({ text, link }) => (
              <Link
                className="rounded-[50px] flex leading-tight items-center tracking-extra-tight py-2.5 pr-2.5 pl-4 bg-gray-new-10"
                to={link}
                key={text}
              >
                <span>{text}</span>
                <ArrowIcon className="ml-6 sm:ml-3" />
              </Link>
            ))}
          </div>
        </div>
        <p className="text-bg-clipped bg-[linear-gradient(119deg,#C9CBCF_0%,rgba(201,203,207,0.40)100%)] font-light leading-snug text-xl max-w-[252px] text-right lg:text-lg lg:max-w-[200px] md:text-left md:max-w-none md:self-start">
          Solutions for every user, from starter to advanced PostgreSQL needs
        </p>
      </div>
    </Container>
    <Container className="mt-[72px] md:mt-14" size="medium">
      <img
        className="max-w-[1220px] mx-auto w-full h-auto"
        src={lines}
        alt=""
        loading="lazy"
        width={1220}
        height={66}
        aria-hidden
      />
    </Container>
  </section>
);

export default Forecasting;
