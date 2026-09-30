import Image from 'next/image';

import Container from 'components/shared/container/container';
import databricksLogo from 'components/shared/footer/images/databricks-logo-dark.svg';
import Heading from 'components/shared/heading';
import SectionLabel from 'components/shared/section-label';
import NeonLogo from 'icons/logo-dark.inline.svg';

import RaffleForm from './raffle-form';

const RaffleHero = () => (
  <section className="relative z-10 grow overflow-hidden bg-black-pure py-40 xl:pt-32 xl:pb-24 lg:py-24">
    <Container size="1280">
      <div className="flex items-start justify-between gap-16 xl:gap-10 lg:flex-col lg:items-stretch lg:gap-12">
        <div className="flex max-w-[544px] flex-1 flex-col lg:contents">
          <div>
            <SectionLabel className="mb-5 lg:mb-[18px] md:mb-4" theme="white">
              PGConf US · New York 2026
            </SectionLabel>
            <Heading
              className="text-balance lg:max-w-2xl md:!text-[36px] xs:!text-[32px]"
              tag="h1"
              size="md-new"
              theme="white"
            >
              Enter to win a $500&nbsp;LEGO gift card
            </Heading>
            <p className="mt-7 max-w-[470px] text-lg leading-normal tracking-tight text-pretty text-gray-new-70 xl:text-base lg:mt-5">
              Register for the Databricks / Neon raffle. Leave your details for a chance to bring
              your next big idea to life, one brick at a time.
            </p>
          </div>
          <div className="mt-8 border-t border-gray-new-20 pt-7 lg:order-3 lg:mt-0 lg:border-t-0 lg:pt-0">
            <p className="mb-4 text-sm leading-normal tracking-tight text-gray-new-60">
              Brought to you by Databricks and Neon
            </p>
            <div className="flex flex-wrap items-center gap-7" aria-label="Databricks and Neon">
              <Image src={databricksLogo} alt="Databricks" height={28} width={177} />
              <span className="h-7 w-px bg-gray-new-20" aria-hidden="true" />
              <NeonLogo className="h-8 w-auto" aria-label="Neon" role="img" />
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-xl flex-1 lg:order-2 lg:max-w-full">
          <RaffleForm />
        </div>
      </div>
    </Container>
  </section>
);

export default RaffleHero;
