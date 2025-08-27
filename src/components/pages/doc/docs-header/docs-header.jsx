import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Sidebar from 'components/shared/header/sidebar';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Link from 'components/shared/link';
import Logo from 'components/shared/logo';
import LINKS from 'constants/links';

import DocsNavigation from '../docs-navigation';

const DocsHeader = ({ customType, docPageType, basePath, navigation, isClient }) => (
  <div className="flex h-28 w-full items-center border-b border-gray-new-90 dark:border-gray-new-15 lg:h-16">
    <Container className="z-10 w-full" size="1600">
      <div className="flex h-16 w-full items-center justify-between lg:pr-20">
        <div className="flex items-center gap-x-7">
          <Logo className="h-7" width={102} height={28} priority isHeader />
          <Link
            className="relative text-[15px] font-medium leading-tight tracking-extra-tight text-gray-new-60 transition-colors duration-200 before:absolute before:inset-y-0 before:-left-3.5 before:h-full before:w-px before:bg-gray-new-80 hover:text-black-new dark:text-gray-new-60 before:dark:bg-gray-new-20 dark:hover:text-white"
            to={customType?.link || LINKS.docs}
          >
            {customType?.title || 'Docs'}
          </Link>
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 gap-2.5 xl:relative xl:left-0 xl:translate-x-0 lg:hidden">
          <InkeepTrigger docPageType={docPageType} />
        </div>
        <Sidebar className="lg:hidden" isClient={isClient} simpleMode />
      </div>
      <div className="h-12 w-full border-t border-gray-new-90 dark:border-gray-new-15 lg:hidden">
        <DocsNavigation navigation={navigation} basePath={basePath} />
      </div>
    </Container>
  </div>
);

DocsHeader.propTypes = {
  docPageType: PropTypes.string,
  customType: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
  }),
  basePath: PropTypes.string.isRequired,
  navigation: PropTypes.array.isRequired,
  isClient: PropTypes.bool,
};

export default DocsHeader;
