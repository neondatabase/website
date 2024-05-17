import clsx from 'clsx';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import RiveAnimation from 'components/shared/rive-animation';
import LINKS from 'constants/links';

const GetStarted = () => (
  <section
    className={clsx(
      'get-started relative overflow-hidden pb-[307px] pt-[445px]',
      'xl:py-[230px] lg:pb-[156px] lg:pt-[179px] sm:pb-[110px] sm:pt-[116px]'
    )}
  >
    <RiveAnimation
      className="absolute left-1/2 top-[152px] aspect-[1.87365] w-[1703px] -translate-x-1/2 xl:-top-4 xl:w-[1432px] lg:w-[1126px] sm:-top-6 sm:w-[818px]"
      src="/animations/pages/home/get-started.riv"
      artboard="footer"
      intersectionRootMargin="0px 0px 600px 0px"
      animationRootMargin="0px 0px 300px 0px"
    />
    <Container
      className="pointer-events-none flex flex-col items-center justify-center"
      size="1100"
    >
      <h2
        className={clsx(
          'relative text-center font-title text-[68px] font-medium leading-[0.9] -tracking-[0.03em] text-white',
          'xl:text-[56px] xl:tracking-extra-tight lg:text-[44px] sm:text-[32px]'
        )}
      >
        Features of tomorrow.
        <br /> Available today.
      </h2>
      <Button
        className="pointer-events-auto relative mt-[38px] h-11 w-[144px] text-[15px] !font-semibold tracking-tighter xl:mt-8 lg:mt-7 sm:mt-5 sm:h-10"
        theme="primary"
        to={LINKS.signup}
        target="_blank"
      >
        Get Started
      </Button>
    </Container>
  </section>
);

export default GetStarted;
