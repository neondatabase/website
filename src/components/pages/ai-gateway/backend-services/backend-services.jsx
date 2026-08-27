import { heroServiceItems } from 'components/pages/home/hero/hero';
import HeroServices from 'components/pages/home/hero/hero-services';
import Container from 'components/shared/container';

const COPY_BY_VIDEO = {
  'postgres-database': {
    title: 'Postgres Database',
    description: 'Serverless Postgres that scales and branches with your app.',
  },
  authentication: {
    title: 'Authentication',
    description: 'Managed auth with users and sessions stored in Postgres.',
  },
  compute: {
    title: 'Compute',
    description: 'Functions without timeouts running close to your database.',
  },
  storage: {
    title: 'Storage',
    description: 'S3-compatible object storage that branches with your projects.',
  },
  'ai-gateway': {
    title: 'AI Gateway',
    description: 'One API for all frontier & open-source models, powered by Databricks.',
  },
};

const VIDEO_META = {
  'postgres-database': {
    aspectRatio: 'aspect-295/291',
    width: 590,
    height: 582,
  },
  authentication: {
    aspectRatio: 'aspect-59/44',
    width: 590,
    height: 440,
  },
  compute: {
    aspectRatio: 'aspect-59/30',
    width: 590,
    height: 300,
  },
  storage: {
    aspectRatio: 'aspect-59/68',
    width: 590,
    height: 680,
  },
  'ai-gateway': {
    aspectRatio: 'aspect-59/22',
    width: 590,
    height: 220,
  },
};

const serviceItems = heroServiceItems.map((item) => ({
  ...item,
  ...COPY_BY_VIDEO[item.videoBase],
  ...VIDEO_META[item.videoBase],
}));

const BackendServices = () => (
  <section className="backend-services bg-gray-new-10 pt-40 safe-paddings pb-20 xl:pt-32 xl:pb-16 lg:pt-24 lg:pb-12 md:pt-20 md:pb-10">
    <Container size="1600">
      <h2 className="max-w-275 text-[2.75rem] leading-dense tracking-tighter xl:max-w-240 xl:text-[2.25rem] lg:max-w-190 lg:text-[2rem] md:text-[1.75rem]">
        Your LLM branches with everything else.{' '}
        <span className="text-gray-new-50">
          Create a branch and your whole backend forks with it — database, storage, auth, and a
          gateway endpoint of its own.
        </span>
      </h2>
      <div className="mt-18 md:mt-14">
        <HeroServices
          items={serviceItems}
          variant="lighten"
          videoDirectory="/videos/pages/ai-gateway/backend-services"
          videoVersion="20260827-2"
        />
      </div>
    </Container>
  </section>
);

export default BackendServices;
