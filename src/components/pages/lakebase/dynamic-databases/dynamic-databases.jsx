import Container from 'components/shared/container';
import { lakebasePageContent } from 'constants/backend-platform-page-content';

import AgentsVisual from './agents-visual';
import Benefits from './benefits';
import BranchingVisual from './branching-visual';
import Capability from './capability';
import RestoreVisual from './restore-visual';
import SectionNavigation from './section-navigation';

const VISUALS = {
  'instant-branching': BranchingVisual,
  'restore-to-any-point': RestoreVisual,
  'database-built-for-agents': AgentsVisual,
};

const { dynamicDatabases } = lakebasePageContent;

const DynamicDatabases = () => {
  const { capabilities } = dynamicDatabases;

  return (
    <section
      className="dynamic-databases bg-black-pure pt-40 safe-paddings pb-16 xl:pt-32 xl:pb-32 lg:pt-24 lg:pb-24 md:pt-20 md:pb-20"
      aria-labelledby="dynamic-databases-heading"
    >
      <Container size="1600">
        <h2
          className="max-w-[1280px] indent-[96px] text-[56px] leading-[1.125] font-normal tracking-tighter text-pretty text-white xl:max-w-[1120px] xl:text-[48px] lg:indent-16 lg:text-[40px] md:indent-0 md:text-[34px] sm:text-[30px]"
          id="dynamic-databases-heading"
        >
          {dynamicDatabases.title}{' '}
          <mark className="bg-green-52/60 box-decoration-clone px-2 text-white">
            {dynamicDatabases.highlightedTitle}
          </mark>
        </h2>

        <div className="mt-15 grid grid-cols-[224px_minmax(0,1184px)] gap-x-32 border-t border-gray-new-20 pt-25.5 2xl:gap-x-12 xl:block">
          <div className="relative xl:hidden">
            <SectionNavigation items={capabilities} />
          </div>

          <div>
            {capabilities.map(({ id, primary, secondary, benefits }, index) => {
              const Visual = VISUALS[id];

              return (
                <Capability
                  className={
                    index > 0
                      ? 'mt-40 pt-16 2xl:mt-24 xl:mt-24 lg:mt-24 lg:pt-0 md:mt-20'
                      : undefined
                  }
                  id={id}
                  key={id}
                  primary={primary}
                  secondary={secondary}
                >
                  <Visual />
                  {benefits && <Benefits items={benefits} />}
                </Capability>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DynamicDatabases;
