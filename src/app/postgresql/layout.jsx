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
      customType={customType}
      headerClassName="lg:border-none"
      docPageType="postgres"
      isDocPage
      isHeaderSticky
      headerWithBorder
      hasThemesSupport
    >
      <div className="safe-paddings flex flex-1 dark:bg-black-pure dark:text-white lg:block">
        <MobileNav
          className="hidden lg:block"
          navigation={navigation}
          slug="index"
          basePath={POSTGRESQL_BASE_PATH}
          customName="PostgreSQL Documentation"
          customType={customType}
        />

        <Sidebar
          className="-mt-[65px] w-[350px] shrink-0 xl:w-[302px] lg:hidden"
          navigation={navigation}
          slug="index"
          basePath={POSTGRESQL_BASE_PATH}
          customType={customType}
          docPageType="postgres"
        />
        <Container
          className="grid w-full flex-1 grid-cols-12 gap-x-8 pb-20 pt-9 xl:block lg:pt-7"
          size="1408"
        >
          {children}
        </Container>
      </div>
    </Layout>
  );
};

export default NeonPostgresLayout;
