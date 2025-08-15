import PropTypes from 'prop-types';

import Item from './item';

const DocsNavigation = ({ navigation, basePath }) => (
  <ul className="no-scrollbars flex size-full gap-x-6 2xl:-mx-8 2xl:w-[calc(100%+32px)] 2xl:overflow-x-auto 2xl:px-8">
    {navigation?.map((item, index) => (
      <li key={index}>
        <Item {...item} basePath={basePath} />
      </li>
    ))}
  </ul>
);

DocsNavigation.propTypes = {
  navigation: PropTypes.array.isRequired,
  basePath: PropTypes.string.isRequired,
};

export default DocsNavigation;
