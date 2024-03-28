import dynamic from 'next/dynamic';

import ChatProvider from 'app/chat-provider';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';

const ChatWidget = dynamic(() => import('components/pages/doc/chat-widget'));

const NeonDocsLayout = async ({ children }) => (
  <ChatProvider>
    <Layout
      headerTheme="white"
      headerWithBottomBorder
      footerWithTopBorder
      burgerWithoutBorder
      isDocPage
      isHeaderSticky
    >
      <div className="safe-paddings flex flex-1 flex-col dark:bg-gray-new-8 dark:text-white lg:block">
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-10 pb-20 pt-10 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-4"
          size="medium"
        >
          {children}
          <ChatWidget />
        </Container>
      </div>
    </Layout>
  </ChatProvider>
);

export default NeonDocsLayout;
