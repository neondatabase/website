import dynamic from 'next/dynamic';

import ChatProvider from 'app/chat-provider';
import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import BuiltInDocsLayout from 'components/shared/built-in-docs-layout/built-in-docs-layout';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getSidebar } from 'utils/api-docs';

const ChatWidget = dynamic(() => import('components/pages/doc/chat-widget'));

const NeonDocsLayout = async ({ children }) => {
  const sidebar = await getSidebar();

  const isSimple = true;

  const content = (
    <div className="safe-paddings flex flex-1 flex-col dark:bg-gray-new-8 dark:text-white lg:block">
      <MobileNav className="lg:block" sidebar={sidebar} basePath={DOCS_BASE_PATH} />

      <Container
        className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-[110px] xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
        size="medium"
      >
        {!isSimple && <Sidebar sidebar={sidebar} basePath={DOCS_BASE_PATH} />}
        {children}
        {!isSimple && <ChatWidget />}
      </Container>
    </div>
  );

  return (
    <ChatProvider>
      {isSimple ? (
        <BuiltInDocsLayout>{content}</BuiltInDocsLayout>
      ) : (
        <Layout
          headerTheme="white"
          isSignIn={!isSimple}
          isHeaderSticky={!isSimple}
          headerWithBottomBorder
          footerWithTopBorder
          burgerWithoutBorder
          isDocPage
        >
          {content}
        </Layout>
      )}
    </ChatProvider>
  );
};

export default NeonDocsLayout;
