import Button from 'components/shared/button/button';
import Container from 'components/shared/container/container';

const Forecast = () => (
  <section className="forecast safe-paddings mt-[200px]">
    <Container className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lg:gap-x-4" size="medium">
      <div className="col-start-2 col-span-5 -mr-10">
        <h2 className="text-6xl leading-none font-medium tracking-tighter">Forecasting is easy</h2>
        <p className="text-lg leading-snug font-light mt-4 max-w-[464px]">
          Follow a simple survey to quickly estimate potential monthly bill based on your app users’
          activity.
        </p>
      </div>

      <div className="col-end-12 col-span-4 -ml-10">
        <p className="text-lg leading-snug font-light mt-4 max-w-[255px]">
          Need an additional help or custom volume-based plans
        </p>
        <Button className="mt-3.5" theme="green-outline">
          Contact Sales
        </Button>
      </div>
    </Container>
  </section>
);

Forecast.propTypes = {};

export default Forecast;
