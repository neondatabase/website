import dynamic from 'next/dynamic';

import ChatProvider from 'app/chat-provider';
import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getSidebar } from 'utils/api-docs';

const ChatWidget = dynamic(() => import('components/pages/doc/chat-widget'));

const NeonDocsLayout = async ({ children }) => {
  const sidebar = await getSidebar();

  return (
    <ChatProvider>
      <Layout
        headerTheme="white"
        headerWithBottomBorder
        footerWithTopBorder
        burgerWithoutBorder
        isDocPage
      >
        <div className="safe-paddings flex flex-1 flex-col dark:bg-gray-new-8 dark:text-white lg:block">
          <MobileNav className="hidden lg:block" sidebar={sidebar} />

          <Container
            className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-[110px] xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
            size="medium"
          >
            <Sidebar sidebar={sidebar} basePath={DOCS_BASE_PATH} />
            {children}
            <ChatWidget />
          </Container>
        </div>
      </Layout>
    </ChatProvider>
  );
};

export default NeonDocsLayout;
