/* eslint-disable react/prop-types */
import ModeToggler from 'components/pages/doc/mode-toggler';
import InkeepEmbedded from 'components/shared/inkeep-embedded';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aiChat);

const AiChatPage = () => (
  <>
    <ModeToggler className="hidden shrink-0 md:flex" />
    <h1 className="sr-only">Neon AI Chat</h1>
    <div className="col-span-7 col-start-2 -ml-6 flex w-full max-w-[832px] flex-1 items-center justify-center 3xl:ml-0 2xl:col-span-8 2xl:col-start-1 lg:max-w-none">
      <InkeepEmbedded />
    </div>
  </>
);

export default AiChatPage;
