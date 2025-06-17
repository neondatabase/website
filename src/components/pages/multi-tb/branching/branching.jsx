import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const Branching = () => (
  <section className="branching mt-[168px] lg:mt-24 md:mt-[68px]">
    <Container className="lg:mx-24 md:mx-auto md:max-w-[640px]" size="576" as="header">
      <h2 className="pr-28 font-title text-[60px] font-medium leading-[90%] tracking-extra-tight text-white xl:max-w-[500px] xl:text-[52px] lg:max-w-[380px] lg:pr-20 lg:text-[40px] md:pr-10 md:text-[36px] md:leading-none">
        Recover multi-TB in seconds.
      </h2>
      <p className="mb-3.5 mt-6 text-balance text-lg leading-snug tracking-extra-tight text-gray-new-60 lg:mb-3 lg:mt-5 lg:text-base md:mb-2 md:mt-4 md:text-wrap">
        Neon has a unique storage architecture that records the entire history of your database.
        This allows you to revert to any point in time instantly, without duplicating data or
        replaying WAL.
      </p>
      <Link
        to={LINKS.docsBranching}
        className="text-[15px] leading-none tracking-tight"
        theme="white"
        withArrow
      >
        Learn more
      </Link>
    </Container>
    <Container
      className="mb-14 mt-[50px] lg:mx-0 lg:mb-12 lg:mt-11 md:mx-0 md:mb-[32px] md:mt-[30px]"
      size="960"
    >
      <div className="relative min-h-[486px] rounded-[10px] bg-black-new lg:min-h-[412px] md:min-h-[290px]">
        {/* TODO: Embed Brancing Demo component */}
        <div
          className="branching-demo-glass absolute -left-[8px] -top-[8px] -z-20 h-[calc(100%+16px)] w-[calc(100%+16px)] overflow-hidden rounded-[14px]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-black-pure blur" />
        </div>
        <span className="absolute right-[-241px] top-[-224px] -z-30 hidden size-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(92,129,182,0.24)_0%,_rgba(92,129,182,0.00)_100%)] opacity-30" />
        <span className="absolute bottom-[-193px] left-[-218px] -z-30 hidden size-[550px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(7,125,148,0.25)_0%,_rgba(7,125,148,0.00)_100%)] opacity-30" />
      </div>
    </Container>
    <Container className="lg:mx-8 md:mx-auto md:max-w-[640px]" size="768" as="footer">
      <ul className="flex flex-row gap-16 text-balance text-2xl font-normal leading-snug tracking-extra-tight text-gray-new-60 lg:text-xl md:text-pretty md:pr-10 md:text-lg sm:flex-col sm:gap-6">
        <li className="flex-1">
          <p>
            <span className="text-white">For teams.</span> You have a reliable safety net protecting
            you against accidental errors.
          </p>
        </li>
        <li className="flex-1">
          <p>
            <span className="text-white">For businesses.</span> You prevent downtimes, preserving
            customer trust and SLAs.
          </p>
        </li>
      </ul>
    </Container>
  </section>
);

export default Branching;
