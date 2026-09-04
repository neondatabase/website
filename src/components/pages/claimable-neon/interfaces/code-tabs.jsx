'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

import { INTERFACES } from './data';

const CodeTabs = ({ children }) => (
  <TabGroup className="dark min-w-0 self-start overflow-hidden border border-gray-new-20 bg-black-pure">
    <TabList
      className="flex h-11 gap-5 border-b border-gray-new-20 bg-gray-new-10 px-5"
      aria-label="Claimable Neon code examples"
    >
      {INTERFACES.map(({ id, label }) => (
        <Tab
          className={({ selected }) =>
            cn(
              'relative -mb-px cursor-pointer border-b pt-2.5 pb-3.5 text-sm leading-none font-medium tracking-extra-tight whitespace-nowrap transition-colors hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-green-45',
              selected ? 'border-white text-white' : 'border-transparent text-gray-new-60'
            )
          }
          key={id}
        >
          {label}
        </Tab>
      ))}
    </TabList>
    <TabPanels>
      {INTERFACES.map(({ id }, index) => (
        <TabPanel
          className="min-h-80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-45 md:min-h-72"
          key={id}
        >
          {children[index]}
          {id === 'cli' && (
            <p className="px-6 pb-6 text-sm leading-snug tracking-extra-tight text-gray-new-60 md:px-5">
              If <code>neon claim</code> is not a command, use the auth.md example.
            </p>
          )}
        </TabPanel>
      ))}
    </TabPanels>
  </TabGroup>
);

CodeTabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CodeTabs;
