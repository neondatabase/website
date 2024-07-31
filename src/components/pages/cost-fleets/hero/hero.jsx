import Calculator from 'components/shared/calculator';
import Container from 'components/shared/container';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden pt-[152px] xl:pt-32 lg:pt-12 md:pt-8">
    <Container size="xxs">
      <div className="px-8">
        <h1 className="text-[56px] font-semibold leading-dense tracking-tighter xl:text-5xl lg:text-4xl md:text-[28px] md:leading-tight">
          Neon for platforms
        </h1>
        <p className="mt-4 text-2xl leading-snug tracking-extra-tight text-gray-new-80 xl:text-xl md:mt-3 md:text-lg">
          Use Neon to build your free tier for a fraction of the cost.
        </p>
      </div>

      <Calculator />
      <div className="px-8">
        <p className="mt-4 text-2xl leading-snug tracking-extra-tight text-gray-new-80 xl:text-xl md:mt-3 md:text-lg">
          Thanks to scaling and usage-based pricing, Neon is a cost-effective option for managing
          fleets of Postgres instances. Its developer-friendly API makes it possible to scale the
          fleet up to hundreds of thousands without a DBA. Comapnies like Retool, Vercel, Replit,
          and Koyeb are already using Neon to offer Postgres to their end-users. Discover more on
          our case studies page.
        </p>
      </div>
    </Container>
  </section>
);

export default Hero;
