import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link/link';
import Search from 'components/shared/search';
import LINKS from 'constants/links';

import ChatWidget from '../chat-widget';

import CalendarIcon from './images/calendar.inline.svg';
import TransactionsIcon from './images/transactions.inline.svg';
import Item from './item';

const links = [
  {
    icon: TransactionsIcon,
    title: 'API Reference',
    slug: LINKS.apiReference,
  },
  {
    icon: CalendarIcon,
    title: 'Release notes',
    slug: LINKS.releaseNotes,
  },
];

const Sidebar = ({ className = null, sidebar, currentSlug }) => (
  <aside className={className}>
    <Search className="z-30" />
    <ChatWidget className="relative z-20 hidden xl:mt-6 xl:flex" />
    <nav className="relative z-20 mt-5 xl:mt-6">
      <ul>
        {links.map(({ icon: Icon, title, slug }, index) => (
          <li className="py-[7px] first:pt-0 last:pb-0" key={index}>
            <Link className="group flex items-center space-x-3" to={slug}>
              <span className="relative flex h-6 w-6 items-center justify-center rounded bg-[linear-gradient(180deg,#EFEFF0_100%,#E4E5E7_100%)] before:absolute before:inset-px before:rounded-[3px] before:bg-[linear-gradient(180deg,#FFF_100%,#FAFAFA_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_31.25%,rgba(255,255,255,0.05)_100%)] dark:before:bg-[linear-gradient(180deg,#242628_31.25%,#1D1E20_100%)]">
                <Icon className="relative z-10 h-3 w-3 text-gray-new-30 dark:text-gray-new-80" />
              </span>
              <span className="text-sm font-medium leading-tight transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-green-45">
                {title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-9">
        {sidebar.map((item, index) => (
          <Item {...item} currentSlug={currentSlug} key={index} />
        ))}
      </ul>
    </nav>
  </aside>
);

Sidebar.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.exact({
          title: PropTypes.string.isRequired,
          slug: PropTypes.string,
          items: PropTypes.arrayOf(
            PropTypes.exact({
              title: PropTypes.string.isRequired,
              slug: PropTypes.string,
              items: PropTypes.arrayOf(
                PropTypes.exact({
                  title: PropTypes.string,
                  slug: PropTypes.string,
                })
              ),
            })
          ),
        })
      ),
    })
  ).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

export default Sidebar;
