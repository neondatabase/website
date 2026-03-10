import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';

const markClassName = 'bg-[#287458] px-0.5 text-white';

const Intro = () => (
  <section className="intro safe-paddings pt-[200px] xl:pt-[136px] lg:pt-28 md:pt-[88px]">
    <Container className="w-full max-w-[1344px]" size="1280">
      <div className="grid grid-cols-[768fr_534fr] gap-x-8 xl:grid-cols-[656fr_534fr] lg:grid-cols-[656fr_494fr] md:gap-y-20">
        <div className="border-l border-gray-new-20 pl-8 lg:pl-4 md:col-span-full md:border-l-0 md:pl-0">
          <SectionLabel icon="arrow" theme="white">
            Database Branches
          </SectionLabel>
          <h2 className="mt-5 max-w-[544px] text-[48px] font-normal leading-dense tracking-tighter text-white xl:max-w-[448px] xl:text-[36px] lg:max-w-[336px] md:mt-4 md:max-w-none md:text-[28px]">
            Neon is Postgres with instant branching built in
          </h2>
          <p className="mt-[190px] max-w-[448px] text-[20px] tracking-tight text-gray-new-70 xl:mt-[219px] xl:max-w-[416px] xl:text-[18px] lg:mt-[178px] lg:max-w-[336px] lg:text-base md:mt-6 md:max-w-none md:text-[15px]">
            Instead of provisioning heavyweight database instances for every environments, you
            create branches that are available immediately.
          </p>
        </div>
        <div className="flex flex-col justify-between border-l border-gray-new-20 pl-8 lg:pl-5 md:col-span-full md:border-l-0 md:pl-0">
          <SectionLabel icon="arrow" theme="white">
            1-click environments
          </SectionLabel>

          <div className="flex max-w-[416px] flex-col gap-y-7 lg:gap-y-5 md:mt-4 md:max-w-none md:gap-y-4">
            <p className="text-[20px] tracking-tight text-gray-new-70 xl:text-[18px] lg:text-base md:text-[15px]">
              Every branch acts like a{' '}
              <mark className={markClassName}>full copy of your database</mark>
              created in under a second.
            </p>
            <p className="text-[20px] tracking-tight text-gray-new-70 xl:text-[18px] lg:text-base md:text-[15px]">
              Branches are <mark className={markClassName}>cost efficient,</mark> since they don’t
              duplicate storage and they scale to zero.
            </p>
            <p className="text-[20px] tracking-tight text-gray-new-70 xl:text-[18px] lg:text-base md:text-[15px]">
              Use them as <mark className={markClassName}>environments</mark> for development, CI
              runs, migrations, versioning, and more
            </p>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Intro;
