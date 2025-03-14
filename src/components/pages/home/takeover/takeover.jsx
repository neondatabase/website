import Image from 'next/image';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import bg from 'images/pages/home/hero/bg.jpg';

const Takeover = () => (
  <section className="hero safe-paddings relative pt-[168px] xl:pt-[150px] lg:pt-[120px] md:pt-[108px]">
    <Container className="relative z-10 xl:px-8" size="1100">
      <div className="flex flex-col items-center text-center">
        <span className="mb-3.5 block text-sm font-medium uppercase leading-none text-[#7EFBD6] lg:mb-3 ">
          Launch highlight
        </span>
        <h1 className="font-title text-[72px] font-medium leading-[0.94] tracking-extra-tight text-white xl:text-[64px] xl:-tracking-[0.03em] lg:text-[48px] sm:text-[36px]">
          Search faster with&nbsp;Postgres
        </h1>
        <p className="mt-3 max-w-[640px] text-lg font-light leading-snug tracking-tighter text-gray-new-80 lg:max-w-[520px] lg:text-base sm:px-3 sm:text-[15px]">
          ParadeDB is now available in all Neon databases for up to 1,300x faster text search
          queries. Get Elastic-level performance without leaving Postgres.
        </p>
        <div className="mt-8 flex items-center gap-5 xl:mt-7 sm:flex-col">
          <Button
            className="!w-[220px] font-semibold lg:text-sm"
            theme="primary"
            size="md-new"
            to={`${LINKS.blog}/pgsearch-on-neon`}
            tag_name="HP Pgsearch"
            analyticsEvent="home_hp_pgsearch_clicked"
          >
            See benchmark results
          </Button>
          <Link
            className="relative font-medium -tracking-[0.03em]"
            theme="white"
            size="2xs"
            to="/"
            withArrow
          >
            Try ParadeDB now
          </Link>
        </div>
      </div>
    </Container>

    <Image
      className="pointer-events-none absolute left-1/2 top-0 max-w-none -translate-x-1/2 xl:w-[1588px] lg:w-[1420px] md:w-[1058px] sm:left-[36%] sm:top-20"
      src={bg}
      sizes="(max-width: 767px) 1058px"
      width={1920}
      height={739}
      quality={100}
      alt=""
      priority
    />
  </section>
);

export default Takeover;
