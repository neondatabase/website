import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link/link';

import AppStore from './images/app-store.inline.svg';
import AudioJack from './images/audio-jack.inline.svg';
import Import from './images/import.inline.svg';
import Ladder from './images/ladder.inline.svg';
import SplitBranch from './images/split-branch.inline.svg';
import Transactions from './images/transactions.inline.svg';

const icons = {
  'audio-jack': AudioJack,
  import: Import,
  ladder: Ladder,
  'split-branch': SplitBranch,
  'app-store': AppStore,
  transactions: Transactions,
};

const DetailIconCards = ({ children = null }) => (
  <ul className="not-prose !my-10 grid grid-cols-2 gap-4 !p-0 sm:grid-cols-1">
    {React.Children.map(children, (child, index) => {
      const { children, href, title, icon } = child.props ?? {};
      const Icon = icons[icon];

      return (
        <li className="!m-0 flex before:hidden" key={index}>
          <Link
            className="relative flex w-full items-start gap-x-3.5 rounded-[10px] border border-gray-new-94 px-6 py-5 transition-colors duration-200 before:absolute before:inset-0 before:rounded-[10px] before:bg-[linear-gradient(275.74deg,#FAFAFA_0%,rgba(250,250,250,0)100%)] before:opacity-0 before:transition-opacity before:duration-200 hover:border-gray-new-80 hover:before:opacity-100 dark:border-gray-new-20 dark:before:bg-[linear-gradient(275.74deg,rgba(36,38,40,0.8)_0%,rgba(36,38,40,0)_100%)] dark:hover:border-gray-new-30 sm:p-3"
            to={href}
          >
            <Icon className="relative z-10 mt-0.5 h-4 w-4 shrink-0 text-secondary-8 dark:text-green-45" />
            <div className="relative z-10 flex flex-col gap-x-2.5">
              <h3 className="text-lg font-semibold leading-tight text-black-new dark:text-white">
                {children}
              </h3>
              <p className="mt-2.5 text-sm leading-normal text-gray-new-50 dark:text-gray-new-80">
                {title}
              </p>
            </div>
          </Link>
        </li>
      );
    })}
  </ul>
);

DetailIconCards.propTypes = {
  children: PropTypes.node,
};

export default DetailIconCards;
