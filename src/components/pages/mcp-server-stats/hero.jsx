import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

import ShareChange from './share-change';
import { formatWeekRange } from './weeks';

const BUTTON_CLASS_NAME =
  'h-11 px-7 text-base font-medium tracking-extra-tight xl:h-9 xl:px-[18px] xl:text-sm';

const TOP_CLIENTS = 4;

const Hero = ({ latestWeek, clients }) => (
  <section className="hero relative mt-40 safe-paddings xl:mt-[144px] lg:mt-20 md:mt-12">
    <Container size="1280">
      <SectionLabel theme="white">MCP server stats</SectionLabel>
      <h1 className="mt-5 max-w-3xl text-[3.75rem] leading-dense font-normal tracking-tighter xl:text-[3.25rem] lg:text-[2.75rem] md:mt-4 md:text-[2rem]">
        Which agents use the Neon MCP server
      </h1>
      <p className="mt-6 max-w-[672px] text-lg leading-normal tracking-extra-tight text-gray-new-60 xl:mt-5 lg:text-base md:mt-4 md:text-[0.9375rem] md:leading-snug">
        The share of sessions each AI client opened on the Neon MCP server, updated every day.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-4 xl:mt-8 lg:mt-7 md:mt-6">
        <Button
          className={BUTTON_CLASS_NAME}
          theme="white-filled"
          to={LINKS.mcpServerDocs}
          tagName="MCP Server Stats Hero"
        >
          Connect your agent
        </Button>
        <Button
          className={BUTTON_CLASS_NAME}
          theme="outlined-new"
          to={LINKS.mcpServerGithub}
          target="_blank"
          tagName="MCP Server Stats Hero GitHub"
        >
          View on GitHub
        </Button>
      </div>

      <div className="mt-24 xl:mt-20 lg:mt-16 md:mt-12">
        <p className="font-mono text-sm leading-none tracking-extra-tight text-gray-new-60 uppercase">
          Last week, {formatWeekRange(latestWeek)}
        </p>
        <ul className="mt-5 grid grid-cols-4 gap-5 lg:grid-cols-2 sm:gap-3">
          {clients.slice(0, TOP_CLIENTS).map(({ client, label, color, share, change }) => (
            <li
              key={client}
              className="min-w-0 border border-gray-new-20 bg-[#080808] p-5 md:p-4 sm:p-3.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-base leading-snug tracking-extra-tight text-gray-new-80">
                  {label}
                </span>
              </div>
              <p className="mt-8 text-[3.25rem] leading-none tracking-tighter tabular-nums xl:text-[2.75rem] md:mt-6 sm:text-[2rem]">
                {share.toFixed(1)}%
              </p>
              <ShareChange
                className="mt-3 block text-sm leading-snug tracking-extra-tight"
                change={change}
              />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

Hero.propTypes = {
  latestWeek: PropTypes.string.isRequired,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      share: PropTypes.number.isRequired,
      change: PropTypes.number,
    })
  ).isRequired,
};

export default Hero;
