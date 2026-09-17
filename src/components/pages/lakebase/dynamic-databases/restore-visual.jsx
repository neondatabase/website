import RiveAnimation from 'components/shared/rive-animation';
import { cn } from 'utils/cn';

const RestoreVisual = () => (
  <figure className="overflow-hidden md:relative md:left-1/2 md:w-screen md:-translate-x-1/2">
    <figcaption className="sr-only">
      A database timeline rolls back from a query error to a checkpoint, creating a restored main
      branch.
    </figcaption>
    <RiveAnimation
      className={cn(
        'pointer-events-none relative left-1/2 aspect-[1920/500] w-[162.2%] -translate-x-1/2',
        'lg:w-[140vw] md:w-[170vw]',
        '[&_canvas]:h-full! [&_canvas]:w-full!'
      )}
      wrapperClassName="relative"
      src="/animations/pages/home/checkpoints.riv?20260114"
      autoBind={false}
    />
  </figure>
);

export default RestoreVisual;
