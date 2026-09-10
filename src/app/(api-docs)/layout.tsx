import type { ReactNode } from 'react';
import Layout from 'components/shared/layout';
import { DOCS_BASE_PATH } from 'constants/docs';
import { getNavigation } from 'utils/api-docs';

export default async function ApiDocsLayout({ children }: { children: ReactNode }) {
  const navigation = await getNavigation();

  return (
    <Layout
      headerClassName="h-28"
      docsNavigation={navigation}
      docsBasePath={DOCS_BASE_PATH}
      isDocPage
      isHeaderSticky
      hasThemesSupport
    >
      {children}
    </Layout>
  );
}
