import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

const Branching = () => (
  <section className="branching mt-44 lg:mt-24 md:mt-14">
    <Container className="lg:mx-8 md:mx-1 " size="576" as="header">
      <h2 className="pr-28 font-title text-[60px] font-medium leading-[90%] tracking-extra-tight text-white lg:pr-20 md:pr-0">
        Recover multi-TB in seconds.
      </h2>
      <p className="mb-3.5 mt-6 text-balance text-lg leading-snug tracking-extra-tight text-gray-new-60">
        Neon has a unique storage architecture that records the entire history of your database.
        This allows you to revert to any point in time instantly, without duplicating data or
        replaying WAL.
      </p>
      <Link
        to={LINKS.docsBranching}
        className="text-[15px] leading-none tracking-tight text-white"
        withArrow
      >
        Learn more
      </Link>
    </Container>
    <Container className="mb-12 mt-14 lg:mx-8 md:mx-1" size="960">
      <div className="relative flex h-[486px] flex-col gap-4 rounded-[10px] bg-black-new p-8">
        <div className="branching-demo-embed z-10">
          {/* TODO: Embed Brancing Demo component */}
          <h3 className="text-2xl font-medium leading-none tracking-extra-tight text-white">
            Copy your database in milliseconds - regardless of size
          </h3>
          <p className="text-lg leading-snug tracking-extra-tight text-gray-new-60">
            In this demo, you will create a copy of your database, make changes to it, and restore
            it to the original state in milliseconds. Behind the scenes, you are leveraging
            Neon&apos;s instant branching.
          </p>
        </div>
        <div className="absolute inset-0" aria-hidden>
          {/* TODO: add glass effect */}
        </div>
        <span className="absolute right-[-241px] top-[-224px] -z-30 size-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(92,129,182,0.24)_0%,_rgba(92,129,182,0.00)_100%)] opacity-30" />
        <span className="absolute bottom-[-193px] left-[-218px] -z-30 size-[550px] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(7,125,148,0.25)_0%,_rgba(7,125,148,0.00)_100%)] opacity-30" />
      </div>
    </Container>
    <Container className="lg:mx-8 md:mx-1" size="768" as="footer">
      <ul className="flex flex-row gap-16 lg:gap-12 md:gap-8">
        <li className="flex-1">
          <p className="text-balance text-2xl font-normal leading-snug tracking-extra-tight text-gray-new-60">
            <span className="text-white">For teams.</span> You have a reliable safety net protecting
            you against accidental errors.
          </p>
        </li>
        <li className="flex-1">
          <p className="text-balance text-2xl font-normal leading-snug tracking-extra-tight text-gray-new-60">
            <span className="text-white">For businesses.</span> You prevent downtimes, preserving
            customer trust and SLAs.
          </p>
        </li>
      </ul>
    </Container>
  </section>
);

export default Branching;
