import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import triangleIcon from 'icons/triangle.svg';
import backgroundSvg from 'images/pages/case-studies/testimonials/background.svg';
import koyebLogo from 'images/pages/case-studies/testimonials/koyeb.svg';
import retoolLogo from 'images/pages/case-studies/testimonials/retool.svg';
import topoLogo from 'images/pages/case-studies/testimonials/topo.svg';

const TESTIMONIALS = [
  {
    quote:
      "Neon's serverless philosophy is <span>aligned with our vision</span>: no infrastructure to manage, no servers to provision, no database cluster to maintain.",
    author: 'Edouard Bonlieu',
    role: 'Co-founder at Koyeb',
    logo: koyebLogo,
    logoWidth: 115,
  },
  {
    quote:
      '<span>The killer feature</span> that convinced us to use Neon was branching: it keeps our engineering velocity high.',
    author: 'Léonard Henriquez',
    role: 'Co-founder and CTO at Topo.io',
    logo: topoLogo,
    logoWidth: 105,
  },
  {
    quote:
      "We've been able to automate virtually all database tasks <span>via the Neon API,</span> saving us a tremendous amount of time and engineering.",
    author: 'Himanshu Bhandoh',
    role: 'Software Engineer at Retool',
    logo: retoolLogo,
    logoWidth: 111,
  },
];

const TestimonialCard = ({ quote, author, role, logo, logoWidth }) => (
  <article className="flex h-[274px] max-w-[384px] flex-col justify-between pl-8 first:max-w-[352px] first:pl-0 lg:pl-6 md:pl-0">
    <div className="flex flex-col gap-9">
      <Image
        src={logo}
        alt=""
        width={logoWidth}
        height={32}
        className="h-8 w-auto object-contain object-left"
      />
      <blockquote
        className="font-mono text-[20px] font-normal leading-snug -tracking-wide text-black xl:text-lg md:text-base [&_span]:bg-green-44/80"
        dangerouslySetInnerHTML={{ __html: quote }}
      />
    </div>
    <div className="mt-auto flex flex-col gap-1">
      <span className="font-mono text-[15px] font-medium leading-snug -tracking-wide text-[#242628]">
        {author}
      </span>
      <span className="font-mono text-[15px] font-normal leading-snug -tracking-wide text-[#242628]">
        {role}
      </span>
    </div>
  </article>
);

TestimonialCard.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    type: PropTypes.oneOf(['image', 'text']).isRequired,
    src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    width: PropTypes.number,
    height: PropTypes.number,
    alt: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  logoWidth: PropTypes.number.isRequired,
};

const Testimonials = () => (
  <section className="safe-paddings relative overflow-hidden bg-[#E4F1EB] py-40 text-black-pure xl:py-20 lg:py-16 md:py-14">
    <Image
      src={backgroundSvg}
      alt=""
      width={1175}
      height={896}
      className="absolute right-0 top-0"
      aria-hidden
    />
    <Container
      size="1280"
      className="relative z-10 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gray-new-50"
    >
      <div className="flex flex-col">
        <div className="flex items-end gap-2 md:gap-1.5">
          <Image
            src={triangleIcon}
            alt=""
            width={12}
            height={14}
            className="md:h-2.5 md:w-2.5"
            aria-hidden
          />
          <span className="font-mono text-xs font-medium uppercase leading-none text-[#303236]">
            backed by giants
          </span>
        </div>
        <h2 className="mt-5 max-w-[800px] text-[48px] font-normal leading-dense tracking-tighter text-black xl:text-[40px] lg:text-[32px] md:text-2xl">
          Powering ambitious product teams{' '}
          <span className="text-gray-new-40">of all shapes and sizes with Postgres.</span>
        </h2>
        <div className="mt-40 flex gap-12 xl:mt-36 xl:gap-10 lg:mt-16 lg:gap-8 md:mt-14 md:gap-10">
          {TESTIMONIALS.map((item, index) => (
            <TestimonialCard key={index} {...item} />
          ))}
        </div>
      </div>
    </Container>
  </section>
);

export default Testimonials;
