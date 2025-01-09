import clsx from 'clsx';

import InkeepEmbedded from 'components/shared/inkeep-embedded';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aiChat);

const AiChatPage = () => (
  <div
    className={clsx(
      'col-span-7 col-start-2 -ml-6 flex min-h-full w-full max-w-[832px] flex-1 items-center justify-center',
      '3xl:ml-0 2xl:col-span-8 2xl:col-start-1 lg:min-h-[calc(100vh-244px)] lg:max-w-none md:lg:min-h-[calc(100vh-270px)]'
    )}
  >
    <h1 className="sr-only">Neon AI Chat</h1>
    <InkeepEmbedded />
  </div>
);

export default AiChatPage;
