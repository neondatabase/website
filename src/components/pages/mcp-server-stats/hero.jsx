import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CopyCommand from 'components/shared/copy-command';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';

const INSTALL_COMMAND = 'npx neon@latest mcp';

const formatUpdated = (publishedAt) =>
  new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

const Hero = ({ publishedAt }) => (
  <section className="hero relative mt-40 safe-paddings xl:mt-[144px] lg:mt-20 md:mt-12">
    <Container size="1280">
      <SectionLabel theme="white">MCP server stats</SectionLabel>
      <h1 className="mt-5 max-w-3xl text-[3.75rem] leading-dense font-normal tracking-tighter xl:text-[3.25rem] lg:text-[2.75rem] md:mt-4 md:text-[2rem]">
        Which agents use the Neon MCP server
      </h1>
      <p className="mt-6 max-w-[672px] text-lg leading-normal tracking-extra-tight text-gray-new-60 xl:mt-5 lg:text-base md:mt-4 md:text-[0.9375rem] md:leading-snug">
        Each week, the AI clients and tools that active users of the Neon MCP server call. Updated{' '}
        {formatUpdated(publishedAt)}.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-4 xl:mt-8 lg:mt-7 md:mt-6">
        <CopyCommand
          className="w-auto max-w-full"
          command={INSTALL_COMMAND}
          trackingLabel="MCP Server Stats Hero Copy"
        />
        <Button
          className="h-11 px-7 text-base font-medium tracking-extra-tight xl:h-9 xl:px-[18px] xl:text-sm"
          theme="outlined-new"
          to={LINKS.mcpServerDocs}
          tagName="MCP Server Stats Hero Docs"
        >
          Read the docs
        </Button>
      </div>
    </Container>
  </section>
);

Hero.propTypes = {
  publishedAt: PropTypes.string.isRequired,
};

export default Hero;
