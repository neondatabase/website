import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import digitImage from 'images/pages/home/trusted/digit.jpg';
import elephantImage from 'images/pages/home/trusted/elephant.jpg';
import githubImage from 'images/pages/home/trusted/github.jpg';
import socImage from 'images/pages/home/trusted/soc.jpg';

const Card = ({ className, bgImage, children }) => (
  <div className={clsx('relative flex items-end rounded-[10px] p-6', className)}>
    <Image
      className="absolute inset-0 rounded-[inherit]"
      width={bgImage.width}
      height={bgImage.height}
      src={bgImage}
      alt=""
    />
    <span className="absolute inset-0 rounded-[inherit] border border-white mix-blend-overlay" />
    <p className="t-lg relative font-light leading-tight tracking-extra-tight text-gray-new-50 [&_strong]:font-medium [&_strong]:text-white">
      {children}
    </p>
  </div>
);

Card.propTypes = {
  className: PropTypes.string,
  bgImage: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const Trusted = () => (
  <section className="trusted my-[224px]">
    <Container size="1152">
      <h2
        className={clsx(
          // margin-bottom in percent is based on the container's width
          '-mb-[4.86%] bg-white bg-clip-text text-[152px] font-medium leading-none -tracking-[0.05em] text-transparent',
          'bg-[radial-gradient(34.86%_84.21%_at_71.59%_84.21%,_#000_17.9%,_#FFF_64%)]'
        )}
      >
        Trusted Postgres
      </h2>
      <div className="flex aspect-[1152/428] items-end gap-x-[31px]">
        <Card className="aspect-[256/198] w-[22.22%] justify-center" bgImage={githubImage}>
          <strong>neondatabase/neon</strong>
        </Card>
        <Card className="aspect-[321/303] w-[27.86%]" bgImage={digitImage}>
          <strong>Databases under management.</strong> <span>Reliable partner for everyone.</span>
        </Card>
        <Card className="aspect-[288/428] w-[25%]" bgImage={elephantImage}>
          <strong>Actually just Postgres.</strong>{' '}
          <span>With the Neon API, you can create account.</span>
        </Card>
        <Card className="aspect-[192/247] grow" bgImage={socImage}>
          <strong>SOC2 Compliance</strong>
        </Card>
      </div>
    </Container>
  </section>
);

export default Trusted;
