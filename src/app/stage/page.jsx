import Stage from 'components/pages/stage/stage';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.stage);

const StagePage = () => (
  <>
    <header className="safe-paddings relative left-0 right-0 top-0 z-10 border-b border-[rgba(255,255,255,0.2)] xl:relative">
      <div className="flex h-[70px] items-center justify-between px-14 py-3.5 xl:h-auto xl:px-11 xl:py-6 lg:px-8 lg:py-5 md:px-4">
        <Link to="/">
          <span className="sr-only">Neon</span>
          <Logo width={102} height={28} />
        </Link>
      </div>
    </header>
    <div className="relative grid flex-grow grid-cols-[1fr_320px] lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
      <Stage />
    </div>
  </>
);

export default StagePage;
