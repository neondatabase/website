import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'components/shared/link/link';

import AChart from './images/a-chart.inline.svg';
import AppStore from './images/app-store.inline.svg';
import Atom from './images/atom.inline.svg';
import AudioJack from './images/audio-jack.inline.svg';
import Autoscaling from './images/autoscaling.inline.svg';
import AWS from './images/aws.inline.svg';
import BinaryCode from './images/binary-code.inline.svg';
import Branching from './images/branching.inline.svg';
import Bug from './images/bug.inline.svg';
import CalendarDay from './images/calendar-day.inline.svg';
import Cards from './images/cards.inline.svg';
import ChartBar from './images/chart-bar.inline.svg';
import Check from './images/check.inline.svg';
import Cheque from './images/cheque.inline.svg';
import CliCursor from './images/cli-cursor.inline.svg';
import CLI from './images/cli.inline.svg';
import Code from './images/code.inline.svg';
import CSV from './images/csv.inline.svg';
import Data from './images/data.inline.svg';
import Database from './images/database.inline.svg';
import Discord from './images/discord.inline.svg';
import Download from './images/download.inline.svg';
import Drizzle from './images/drizzle.inline.svg';
import Enable from './images/enable.inline.svg';
import Filter from './images/filter.inline.svg';
import FindReplace from './images/find-replace.inline.svg';
import Gamepad from './images/gamepad.inline.svg';
import Gear from './images/gear.inline.svg';
import Github from './images/github.inline.svg';
import Globe from './images/globe.inline.svg';
import GUI from './images/gui.inline.svg';
import Handshake from './images/handshake.inline.svg';
import Heroku from './images/heroku.inline.svg';
import Hook from './images/hook.inline.svg';
import Hourglass from './images/hourglass.inline.svg';
import Import from './images/import.inline.svg';
import Invert from './images/invert.inline.svg';
import Ladder from './images/ladder.inline.svg';
import LangChain from './images/langchain.inline.svg';
import Laptop from './images/laptop.inline.svg';
import LlamaIndex from './images/llamaindex.inline.svg';
import LockLandscape from './images/lock-landscape.inline.svg';
import Metrics from './images/metrics.inline.svg';
import Neon from './images/neon.inline.svg';
import Network from './images/network.inline.svg';
import Ollama from './images/ollama.inline.svg';
import OpenAI from './images/openai.inline.svg';
import Perfomance from './images/perfomance.inline.svg';
import Postgres from './images/postgres.inline.svg';
import Prisma from './images/prisma.inline.svg';
import Privacy from './images/privacy.inline.svg';
import Puzzle from './images/puzzle.inline.svg';
import Queries from './images/queries.inline.svg';
import Refresh from './images/refresh.inline.svg';
import Research from './images/research.inline.svg';
import RespondArrow from './images/respond-arrow.inline.svg';
import RowTable from './images/row-table.inline.svg';
import ScaleUp from './images/scale-up.inline.svg';
import Screen from './images/screen.inline.svg';
import SearchContent from './images/search-content.inline.svg';
import Setup from './images/setup.inline.svg';
import Sparkle from './images/sparkle.inline.svg';
import SplitBranch from './images/split-branch.inline.svg';
import SQL from './images/sql.inline.svg';
import Stopwatch from './images/stopwatch.inline.svg';
import Todo from './images/todo.inline.svg';
import Transactions from './images/transactions.inline.svg';
import TrendUp from './images/trend-up.inline.svg';
import Unlock from './images/unlocked.inline.svg';
import User from './images/user.inline.svg';
import Vercel from './images/vercel.inline.svg';
import Wallet from './images/wallet.inline.svg';
import Warning from './images/warning.inline.svg';
import Wrench from './images/wrench.inline.svg';
import X from './images/x.inline.svg';

const icons = {
  'a-chart': AChart,
  'app-store': AppStore,
  atom: Atom,
  'audio-jack': AudioJack,
  autoscaling: Autoscaling,
  aws: AWS,
  'binary-code': BinaryCode,
  branching: Branching,
  bug: Bug,
  'calendar-day': CalendarDay,
  cards: Cards,
  check: Check,
  cheque: Cheque,
  'chart-bar': ChartBar,
  cli: CLI,
  'cli-cursor': CliCursor,
  code: Code,
  csv: CSV,
  data: Data,
  database: Database,
  discord: Discord,
  download: Download,
  drizzle: Drizzle,
  enable: Enable,
  filter: Filter,
  'find-replace': FindReplace,
  gamepad: Gamepad,
  gear: Gear,
  github: Github,
  globe: Globe,
  gui: GUI,
  handshake: Handshake,
  heroku: Heroku,
  hook: Hook,
  hourglass: Hourglass,
  import: Import,
  invert: Invert,
  ladder: Ladder,
  laptop: Laptop,
  langchain: LangChain,
  llamaindex: LlamaIndex,
  'lock-landscape': LockLandscape,
  metrics: Metrics,
  neon: Neon,
  network: Network,
  ollama: Ollama,
  openai: OpenAI,
  perfomance: Perfomance,
  postgres: Postgres,
  prisma: Prisma,
  privacy: Privacy,
  puzzle: Puzzle,
  queries: Queries,
  refresh: Refresh,
  research: Research,
  'respond-arrow': RespondArrow,
  'scale-up': ScaleUp,
  screen: Screen,
  search: SearchContent,
  setup: Setup,
  'split-branch': SplitBranch,
  sparkle: Sparkle,
  sql: SQL,
  stopwatch: Stopwatch,
  table: RowTable,
  todo: Todo,
  transactions: Transactions,
  'trend-up': TrendUp,
  unlock: Unlock,
  user: User,
  vercel: Vercel,
  wallet: Wallet,
  warning: Warning,
  wrench: Wrench,
  x: X,
};

const monochromeIcons = ['github'];

const DetailIconCards = ({ children = null, withNumbers = false }) => {
  const ListComponent = withNumbers ? 'ol' : 'ul';

  return (
    <ListComponent className="not-prose !my-10 grid grid-cols-2 gap-5 !p-0 sm:grid-cols-1">
      {React.Children.map(children, (child, index) => {
        const { children, href, description, icon, target } = child.props ?? {};
        const Icon = icons[icon];

        return (
          <li className="!m-0 flex before:hidden" key={index}>
            <Link
              className={clsx(
                'relative flex w-full items-start rounded-[10px] border border-gray-new-94 py-5 transition-colors duration-200',
                withNumbers ? 'gap-x-0.5 px-5' : 'gap-x-3.5 px-6',
                'before:absolute before:inset-0 before:rounded-[10px] before:bg-[linear-gradient(275.74deg,#FAFAFA,rgba(250,250,250,0)100%)] before:opacity-0 before:transition-opacity before:duration-200',
                'hover:border-gray-new-80 hover:before:opacity-100',
                'dark:border-gray-new-20 dark:before:bg-[linear-gradient(275.74deg,rgba(36,38,40,0.8),rgba(36,38,40,0))] dark:hover:border-gray-new-30 sm:p-3'
              )}
              to={href}
              {...(target && { target })}
            >
              <div
                className={clsx(
                  'relative z-10 shrink-0',
                  monochromeIcons.includes(icon)
                    ? 'text-black-new dark:text-white'
                    : 'text-secondary-8 dark:text-green-45',
                  withNumbers
                    ? 'w-6 text-lg font-medium leading-tight tracking-extra-tight'
                    : 'mt-0.5 h-4 w-4'
                )}
              >
                {withNumbers ? (
                  <span>{index + 1}.</span>
                ) : (
                  <div
                    className={clsx(
                      'h-full w-full',
                      withNumbers &&
                        'dark:rounded dark:bg-gradient-to-b dark:from-gray-new-15 dark:from-30% dark:to-[#1D1E20] dark:p-[5px]'
                    )}
                  >
                    <Icon className="h-full w-full" />
                  </div>
                )}
              </div>
              <div className="relative z-10 flex flex-col gap-x-2.5">
                <h3 className="text-balance text-lg font-semibold leading-tight text-black-new dark:text-white">
                  {children}
                </h3>
                <p
                  className={clsx(
                    'text-balance text-sm leading-normal text-gray-new-50 dark:text-gray-new-80',
                    withNumbers ? 'mt-1' : 'mt-2.5'
                  )}
                >
                  {description}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ListComponent>
  );
};

DetailIconCards.propTypes = {
  children: PropTypes.node,
  withNumbers: PropTypes.bool,
};

export default DetailIconCards;
