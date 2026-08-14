import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';

import BackendServices from './services';

const SERVICE_ITEMS = [
  {
    title: 'Postgres Database',
    description: 'Serverless Postgres that scales and branches with your app.',
    videoBase: 'postgres-database',
    version: '20260813-3',
    aspectRatio: 'aspect-588/580',
    width: 588,
    height: 580,
  },
  {
    title: 'Authentication',
    description: 'Managed auth with users and sessions stored in Postgres.',
    videoBase: 'authentication',
    version: '20260814',
    aspectRatio: 'aspect-590/440',
    width: 590,
    height: 440,
  },
  {
    title: 'Compute',
    description: 'Functions without timeouts running close to your database.',
    videoBase: 'compute',
    version: '20260814',
    aspectRatio: 'aspect-590/300',
    width: 590,
    height: 300,
  },
  {
    title: 'Storage',
    description: 'S3-compatible object storage that branches with your projects.',
    videoBase: 'storage',
    version: '20260813-3',
    aspectRatio: 'aspect-590/680',
    width: 590,
    height: 680,
  },
  {
    title: 'AI Gateway',
    description: 'One API for all frontier & open-source models, powered by Databricks.',
    videoBase: 'ai-gateway',
    version: '20260814',
    aspectRatio: 'aspect-592/220',
    width: 592,
    height: 220,
  },
];

const BuildYourBackend = () => (
  <section
    className="build-your-backend mt-49 overflow-hidden bg-black-pure safe-paddings lg:mt-36 md:mt-24 sm:mt-18"
    id="build-your-backend"
    aria-labelledby="build-your-backend-heading"
  >
    <Container className="lg:pt-10 md:pt-8 sm:pt-6" size="1600">
      <div className="grid grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)] lg:block">
        <div className="pt-3.25 lg:pt-0">
          <SectionLabel theme="white">BUILD YOUR BACKEND</SectionLabel>
          <span
            className="mt-4.25 block font-mono text-[8rem] leading-none tracking-tighter text-gray-new-8 lg:text-[6rem] md:text-[5rem] sm:text-[5rem]"
            aria-hidden="true"
          >
            01
          </span>
        </div>
        <h2
          className="max-w-296 min-w-0 indent-24 text-5xl leading-dense font-normal tracking-tighter text-pretty text-white xl:indent-16 xl:text-4xl lg:mt-10 lg:indent-0 lg:text-[2.25rem] md:mt-8 md:text-[2rem]"
          id="build-your-backend-heading"
        >
          <span>Pick the services you need. Build the application you want. </span>
          <span className="text-gray-new-50">
            Use only the services you need—or combine them into a complete platform.
          </span>
        </h2>
      </div>

      <div className="mt-32.5 lg:mt-16 md:mt-14 sm:mt-12">
        <BackendServices items={SERVICE_ITEMS} />
      </div>
    </Container>
  </section>
);

export default BuildYourBackend;
