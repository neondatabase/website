import { heroServiceItems } from 'components/pages/home/hero/hero';
import HeroServices from 'components/pages/home/hero/hero-services';
import Container from 'components/shared/container';
import { sharedBackendPlatformContent } from 'constants/backend-platform-page-content';

const { backendServices } = sharedBackendPlatformContent;

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
  ...backendServices.itemsByVideo[item.videoBase],
  ...VIDEO_META[item.videoBase],
}));

const BackendServices = () => (
  <section className="backend-services bg-gray-new-10 pt-40 safe-paddings pb-20 xl:pt-32 xl:pb-16 lg:pt-24 lg:pb-12 md:pt-20 md:pb-10">
    <Container size="1600">
      <h2 className="max-w-275 text-[2.75rem] leading-dense tracking-tighter xl:max-w-240 xl:text-[2.25rem] lg:max-w-190 lg:text-[2rem] md:text-[1.75rem]">
        {backendServices.title}{' '}
        <span className="text-gray-new-50">{backendServices.highlightedTitle}</span>
      </h2>
      <div className="mt-18 md:mt-14">
        <HeroServices
          items={serviceItems}
          mediaLoading="in-view"
          variant="lighten"
          videoDirectory="/videos/pages/backend-platform/backend-services"
          videoVersion="20260827-2"
        />
      </div>
    </Container>
  </section>
);

export default BackendServices;
