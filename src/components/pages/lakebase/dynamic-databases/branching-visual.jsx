import RiveAnimation from 'components/shared/rive-animation';

const BranchingVisual = () => (
  <figure
    className="relative aspect-[1184/422] overflow-hidden"
    data-lakebase-animation-slot="instant-branching"
  >
    <figcaption className="sr-only">
      Production branches into isolated checkout-test and payment-fix environments, each with its
      own database, functions, and authentication.
    </figcaption>
    <RiveAnimation
      className="pointer-events-none size-full select-none"
      wrapperClassName="pointer-events-none absolute inset-0 size-full"
      src="/animations/pages/lakebase/branching.riv?20260903"
      autoBind={false}
    />
  </figure>
);

export default BranchingVisual;
