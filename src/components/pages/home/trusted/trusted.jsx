import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import digitImage from 'images/pages/home/trusted/digit.jpg';
import elephantImage from 'images/pages/home/trusted/elephant.jpg';
import githubImage from 'images/pages/home/trusted/github.jpg';
import socImage from 'images/pages/home/trusted/soc.jpg';

const Card = ({ className, borderClassName, bgImage, children }) => (
  <div className={clsx('relative flex items-end rounded-[10px] p-6', className)}>
    <Image
      className="absolute inset-0 rounded-[inherit]"
      width={bgImage.width}
      height={bgImage.height}
      src={bgImage}
      alt=""
    />
    <div className={clsx('absolute inset-0 z-10 rounded-[inherit]', borderClassName)} />
    <p className="t-lg relative z-20 leading-snug tracking-extra-tight text-gray-new-50">
      {children}
    </p>
  </div>
);

Card.propTypes = {
  className: PropTypes.string,
  borderClassName: PropTypes.string,
  bgImage: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const Trusted = () => (
  <section className="trusted mt-[224px]">
    <Container size="1152">
      <h2
        className={clsx(
          '-mb-[56px] bg-white bg-clip-text text-[152px] font-medium leading-none -tracking-[0.05em] text-transparent',
          'bg-[radial-gradient(34.86%_84.21%_at_71.59%_84.21%,_#000_17.9%,_#FFF_64%)]'
        )}
      >
        Trusted Postgres
      </h2>
      <div className="flex aspect-[1152/428] items-end gap-x-8">
        <Card
          className="aspect-[256/198] w-[22.2222%] justify-center"
          borderClassName="border-linear border-image-home-trusted-github-card"
          bgImage={githubImage}
        >
          <strong className="font-medium text-white">neondatabase/neon</strong>
        </Card>
        <Card
          className="relative z-10 aspect-[321/303] w-[27.8645833%]"
          borderClassName="border-linear border-image-home-trusted-digit-card"
          bgImage={digitImage}
        >
          <strong className="font-medium text-white">Databases under management.</strong>{' '}
          <span className="font-light">Reliable partner for everyone.</span>
        </Card>
        <Card
          className={clsx(
            'aspect-[288/428] w-[25%]',
            'shadow-[0px_-10px_62px_12px_rgba(0,0,0,0.9),30px_10px_60px_0px_rgba(0,0,0,0.8),-50px_10px_60px_0px_rgba(0,0,0,0.9)]'
          )}
          borderClassName="border-gray-new-10 border"
          bgImage={elephantImage}
        >
          <strong className="font-medium text-white">Actually just Postgres.</strong>{' '}
          <span className="font-regular">With the Neon API, you can create account.</span>
        </Card>
        <Card
          className="aspect-[192/247] grow"
          borderClassName="border-linear border-image-home-trusted-soc-card"
          bgImage={socImage}
        >
          <strong className="font-medium text-white">SOC2 Compliance</strong>
        </Card>
      </div>
    </Container>
  </section>
);

export default Trusted;
