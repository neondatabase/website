import AiGatewayModelIndex from 'components/pages/doc/ai-gateway-model-index';

const Models = () => {
  return (
    <section
      id="models"
      className="relative mt-40 pb-0 lg:mt-24 md:mt-18"
      aria-labelledby="models-heading"
    >
      <div className="mx-auto w-full max-w-400 px-8 md:px-5">
        <h2
          id="models-heading"
          className="ml-24 max-w-224 text-[2.75rem] leading-[1.15] font-normal tracking-tighter text-pretty text-white xl:ml-0 xl:text-[2.5rem] lg:text-[2.125rem] md:text-[1.75rem]"
        >
          Access a wide catalog of frontier and open
          <br className="xl:hidden" /> weight models.{' '}
          <span className="text-gray-new-50">
            Served with optimized
            <br className="xl:hidden" /> performance via Databricks.
          </span>
        </h2>

        <AiGatewayModelIndex variant="landing" />
      </div>
    </section>
  );
};

export default Models;
