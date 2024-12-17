import InkeepEmbedded from 'components/shared/inkeep-embedded';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.docsChat);

const DocsChat = () => (
  <div className="col-span-12 flex h-[calc(100vh-215px)] w-full items-center justify-center">
    <h1 className="sr-only">Neon AI Chat</h1>
    <div className="w-[640px]">
      <InkeepEmbedded />
    </div>
  </div>
);

export default DocsChat;
