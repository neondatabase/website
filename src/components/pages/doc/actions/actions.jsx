'use client';

import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import ArrowBackToTopIcon from 'icons/arrow-back-to-top.inline.svg';
import ChatGptIcon from 'icons/docs/chat-gpt.inline.svg';
import ClaudeIcon from 'icons/docs/claude.inline.svg';
import CursorIcon from 'icons/docs/cursor.inline.svg';
import DeepSeekIcon from 'icons/docs/deepseek.inline.svg';
import GeminiIcon from 'icons/docs/gemini.inline.svg';
import MarkdownIcon from 'icons/docs/markdown.inline.svg';
import PerplexityIcon from 'icons/docs/perplexity.inline.svg';
import VSCodeIcon from 'icons/docs/vscode.inline.svg';
import GitHubIcon from 'icons/github.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

const ActionItem = ({ icon: Icon, text, url, onClick, iconClassName, tooltip }) => {
  const Tag = url ? Link : 'button';

  return (
    <Tag
      className={clsx(
        'group relative flex w-fit items-center gap-x-2 rounded-sm text-gray-new-40',
        'transition-colors duration-200 hover:text-secondary-8',
        'dark:text-gray-new-60 dark:hover:text-primary-1'
      )}
      to={url}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      icon={url ? 'external' : undefined}
      onClick={onClick}
    >
      <Icon className={clsx(`size-3.5`, iconClassName)} />
      <span className="text-sm leading-none tracking-extra-tight">{text}</span>
      {tooltip && (
        <span
          className={clsx(
            'pointer-events-none absolute left-0 top-full z-10 mt-1.5 whitespace-nowrap',
            'rounded-md bg-gray-new-8 px-2 py-1 text-xs text-white opacity-0',
            'transition-opacity duration-150 group-hover:opacity-100',
            'dark:bg-gray-new-90 dark:text-gray-new-8'
          )}
        >
          {tooltip}
        </span>
      )}
    </Tag>
  );
};

ActionItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  onClick: PropTypes.func,
  iconClassName: PropTypes.string,
  tooltip: PropTypes.string,
};

const CopyMarkdownButton = ({ rawFileLink }) => {
  const [status, setStatus] = useState('default'); // 'default' | 'copied' | 'failed'

  const getButtonText = () => {
    if (status === 'failed') return 'Failed to copy';
    if (status === 'copied') return 'Copied!';
    return 'Copy markdown';
  };

  const copyPageToClipboard = async () => {
    try {
      const response = await fetch(rawFileLink);
      const content = await response.text();
      copyToClipboard(content);
      setStatus('copied');
      setTimeout(() => {
        setStatus('default');
      }, 2000);
    } catch (error) {
      setStatus('failed');
      setTimeout(() => {
        setStatus('default');
      }, 2000);
    }
  };

  return (
    <ActionItem
      icon={MarkdownIcon}
      text={getButtonText()}
      tooltip="Copy this page as markdown text"
      onClick={status === 'copied' ? undefined : copyPageToClipboard}
    />
  );
};

CopyMarkdownButton.propTypes = {
  rawFileLink: PropTypes.string.isRequired,
};

/* Disabled for now - kept for possible future use
const CopyMCPServerButton = () => {
  const [status, setStatus] = useState('default'); // 'default' | 'copied' | 'failed'
  const mcpServerUrl = 'https://mcp.neon.tech/mcp';

  const getButtonText = () => {
    if (status === 'failed') return 'Failed to copy';
    if (status === 'copied') return 'Copied!';
    return 'Copy MCP Server';
  };

  const copyServerUrl = () => {
    try {
      copyToClipboard(mcpServerUrl);
      setStatus('copied');
      setTimeout(() => {
        setStatus('default');
      }, 2000);
    } catch (error) {
      setStatus('failed');
      setTimeout(() => {
        setStatus('default');
      }, 2000);
    }
  };

  return (
    <ActionItem
      icon={MarkdownIcon}
      text={getButtonText()}
      onClick={status === 'copied' ? undefined : copyServerUrl}
      tooltip="Copy the Neon MCP server URL"
    />
  );
};
*/

const CopyNeonCLIButton = () => {
  const [status, setStatus] = useState('default'); // 'default' | 'copied' | 'failed'
  const cliCommand = 'npx neonctl@latest init';

  const getButtonText = () => {
    if (status === 'failed') return 'Failed to copy';
    if (status === 'copied') return 'Copied!';
    return 'Copy neon init';
  };

  const copyCommand = () => {
    try {
      copyToClipboard(cliCommand);
      setStatus('copied');
      setTimeout(() => {
        setStatus('default');
      }, 2000);
    } catch (error) {
      setStatus('failed');
      setTimeout(() => {
        setStatus('default');
      }, 2000);
    }
  };

  return (
    <ActionItem
      icon={MarkdownIcon}
      text={getButtonText()}
      tooltip="Set up Neon in one command"
      onClick={status === 'copied' ? undefined : copyCommand}
    />
  );
};

const Actions = ({ gitHubPath, withBorder = false, isTemplate = false }) => {
  const githubBase = process.env.NEXT_PUBLIC_GITHUB_PATH;
  const githubRawBase = process.env.NEXT_PUBLIC_GITHUB_RAW_PATH;

  const gitHubLink = `${githubBase}${gitHubPath}`;
  const rawFileLink = `${githubRawBase}${gitHubPath}`;
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const AI_CHATBOTS = [
    {
      name: 'ChatGPT',
      enabled: true,
      generateLink: (rawFileLink) =>
        `https://chatgpt.com/?hints=search&q=Read+from+${rawFileLink}+so+I+can+ask+questions+about+it.`,
      icon: ChatGptIcon,
    },
    {
      name: 'Claude',
      enabled: true,
      generateLink: (rawFileLink) =>
        `https://claude.ai/new?q=Read+from+${rawFileLink}+so+I+can+ask+questions+about+it.`,
      icon: ClaudeIcon,
    },
    {
      name: 'Perplexity',
      enabled: false,
      generateLink: (rawFileLink) =>
        `https://www.perplexity.ai/?q=Read+from+${rawFileLink}+so+I+can+ask+questions+about+it.`,
      icon: PerplexityIcon,
    },

    // Disabled as they currently do not have a way to prefill content via URL
    {
      name: 'Gemini',
      enabled: false,
      generateLink: (rawFileLink) =>
        `https://gemini.google.com/?q=Read+from+${rawFileLink}+so+I+can+ask+questions+about+it.`,
      icon: GeminiIcon,
    },
    {
      name: 'DeepSeek',
      enabled: false,
      generateLink: (rawFileLink) =>
        `https://chat.deepseek.com/?q=Read+from+${rawFileLink}+so+I+can+ask+questions+about+it.`,
      icon: DeepSeekIcon,
    },
  ];

  const docsActions = (
    <>
      <CopyMarkdownButton rawFileLink={rawFileLink} />
      {AI_CHATBOTS.filter((bot) => bot.enabled).map((bot) => (
        <ActionItem
          key={bot.name}
          icon={bot.icon}
          text={`Open in ${bot.name}`}
          url={bot.generateLink(rawFileLink)}
          tooltip={`Open this page in ${bot.name}`}
          onClick={() => sendGtagEvent('Action Clicked', { text: `Open in ${bot.name}` })}
        />
      ))}
      <CopyNeonCLIButton />
      {/* <CopyMCPServerButton /> */}
      <ActionItem
        icon={CursorIcon}
        text="Connect MCP on Cursor"
        url="cursor://anysphere.cursor-deeplink/mcp/install?name=Neon&config=eyJ1cmwiOiJodHRwczovL21jcC5uZW9uLnRlY2gvbWNwIn0%3D"
        tooltip="Configure the Neon MCP Server in Cursor"
        onClick={() => sendGtagEvent('Action Clicked', { text: 'Connect MCP on Cursor' })}
      />
      <ActionItem
        icon={VSCodeIcon}
        text="Connect MCP on VS Code"
        url="vscode:mcp/install?%7B%22name%22%3A%22Neon%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.neon.tech%2Fmcp%22%7D"
        tooltip="Configure the Neon MCP Server in VS Code"
        onClick={() => sendGtagEvent('Action Clicked', { text: 'Connect MCP on VS Code' })}
      />
      <ActionItem
        icon={GitHubIcon}
        text="Edit on GitHub"
        url={gitHubLink}
        tooltip="Suggest changes to this page"
        onClick={() => sendGtagEvent('Action Clicked', { text: 'Edit on GitHub' })}
      />
    </>
  );

  const templateActions = (
    <>
      <ActionItem
        icon={GitHubIcon}
        text="Suggest edits"
        url={gitHubLink}
        iconClassName="size-[18px] text-white"
        tooltip="Propose changes to this page"
        onClick={() => sendGtagEvent('Action Clicked', { text: 'Suggest edits' })}
      />
      <ActionItem
        icon={ArrowBackToTopIcon}
        text="Back to top"
        iconClassName="size-5"
        tooltip="Scroll to the top of the page"
        onClick={backToTop}
      />
    </>
  );

  return (
    <div
      className={clsx(
        'flex flex-col gap-3.5',
        withBorder && 'mt-4 border-t border-gray-new-90 pt-4 dark:border-gray-new-15/70'
      )}
    >
      {isTemplate ? templateActions : docsActions}
    </div>
  );
};

Actions.propTypes = {
  gitHubPath: PropTypes.string.isRequired,
  withBorder: PropTypes.bool,
  isTemplate: PropTypes.bool,
};

export default Actions;
