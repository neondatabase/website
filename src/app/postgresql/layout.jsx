/* eslint-disable react/prop-types */
import MobileNav from 'components/pages/doc/mobile-nav';
import Sidebar from 'components/pages/doc/sidebar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import { POSTGRESQL_BASE_PATH } from 'constants/docs';
import { getNavigation } from 'utils/api-postgresql';

const NeonPostgresLayout = async ({ children }) => {
  const navigation = await getNavigation();

  const customType = {
    title: 'PostgreSQL Tutorial',
    link: `${POSTGRESQL_BASE_PATH}tutorial`,
  };

  return (
    <Layout
      headerClassName="h-28 lg:h-16"
      docsNavigation={navigation}
      docsBasePath={POSTGRESQL_BASE_PATH}
      customType={customType}
      docPageType="postgres"
      isDocPage
      isHeaderSticky
      headerWithBorder
      hasThemesSupport
    >
      <div className="safe-paddings flex flex-1 dark:bg-black-pure dark:text-white lg:block">
        <Container
          className="flex w-full flex-1 gap-x-24 pt-11 2xl:gap-x-8 xl:pt-9 lg:block sm:pt-7"
          size="1600"
        >
          <Sidebar
            className="w-64 shrink-0 lg:hidden"
            navigation={navigation}
            basePath={POSTGRESQL_BASE_PATH}
            customType={customType}
          />
          {children}
        </Container>
        <MobileNav
          navigation={navigation}
          basePath={POSTGRESQL_BASE_PATH}
          title="PostgreSQL Documentation"
        />
      </div>
    </Layout>
  );
};

export default NeonPostgresLayout;
