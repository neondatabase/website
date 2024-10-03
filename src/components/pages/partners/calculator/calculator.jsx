import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import UseCaseCalculator from 'components/shared/use-case-calculator';

const Calculator = () => (
  <section className="calculator safe-paddings mt-36 lg:mt-20 md:mt-12">
    <Container className="flex flex-col items-center justify-center" size="xxs">
      <GradientLabel>Calculator</GradientLabel>
      <h2 className="mt-4 text-center text-[48px] font-medium leading-none tracking-extra-tight lg:text-4xl sm:text-[36px]">
        Estimate your savings
      </h2>
      <UseCaseCalculator />
    </Container>
  </section>
);

export default Calculator;
