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
import GrokIcon from 'icons/docs/grok.inline.svg';
import MarkdownIcon from 'icons/docs/markdown.inline.svg';
import PerplexityIcon from 'icons/docs/perplexity.inline.svg';
import T3ChatIcon from 'icons/docs/t3-chat.inline.svg';
import GitHubIcon from 'icons/github.inline.svg';
import sendGtagEvent from 'utils/send-gtag-event';

const ActionItem = ({ icon: Icon, text, url, onClick, iconClassName }) => {
  const Tag = url ? Link : 'button';

  return (
    <Tag
      className={clsx(
        'flex w-fit items-center gap-x-2 rounded-sm text-gray-new-40',
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
    </Tag>
  );
};

ActionItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  onClick: PropTypes.func,
  iconClassName: PropTypes.string,
};

const CopyMarkdownButton = ({ rawFileLink }) => {
  const [status, setStatus] = useState('default'); // 'default' | 'copied' | 'failed'

  const getButtonText = () => {
    if (status === 'failed') return 'Failed to copy';
    if (status === 'copied') return 'Copied!';
    return 'Copy page as markdown';
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
      onClick={status === 'copied' ? undefined : copyPageToClipboard}
    />
  );
};

CopyMarkdownButton.propTypes = {
  rawFileLink: PropTypes.string.isRequired,
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
      generateLink: (rawFileLink) => `https://chatgpt.com/?hints=search&q=Read+${rawFileLink}`,
      icon: ChatGptIcon,
    },
    {
      name: 'Claude',
      enabled: true,
      generateLink: (rawFileLink) => `https://claude.ai/new?q=Read+${rawFileLink}`,
      icon: ClaudeIcon,
    },
    {
      name: 'Cursor',
      enabled: true,
      generateLink: (rawFileLink) => `https://cursor.com/link/prompt?text=Read+${rawFileLink}`,
      icon: CursorIcon,
    },
    {
      name: 'Grok',
      enabled: true,
      generateLink: (rawFileLink) => `https://x.com/i/grok?text=Read+${rawFileLink}`,
      icon: GrokIcon,
    },
    {
      name: 'Perplexity',
      enabled: true,
      generateLink: (rawFileLink) => `https://www.perplexity.ai/?q=Read+${rawFileLink}`,
      icon: PerplexityIcon,
    },
    {
      name: 'T3 Chat',
      enabled: true,
      generateLink: (rawFileLink) => `https://t3.chat/new?q=Read+${rawFileLink}`,
      icon: T3ChatIcon,
    },

    // Disabled as they currently do not have a way to prefill content via URL
    {
      name: 'Gemini',
      enabled: false,
      generateLink: (rawFileLink) => `https://gemini.google.com/?q=Read+${rawFileLink}`,
      icon: GeminiIcon,
    },
    {
      name: 'DeepSeek',
      enabled: false,
      generateLink: (rawFileLink) => `https://chat.deepseek.com/?q=Read+${rawFileLink}`,
      icon: DeepSeekIcon,
    },
  ];

  const docsActions = (
    <>
      <CopyMarkdownButton rawFileLink={rawFileLink} />
      <ActionItem
        icon={GitHubIcon}
        text="Edit this page on GitHub"
        url={gitHubLink}
        onClick={() => sendGtagEvent('Action Clicked', { text: 'Edit this page on GitHub' })}
      />
      {AI_CHATBOTS.filter((bot) => bot.enabled).map((bot) => (
        <ActionItem
          key={bot.name}
          icon={bot.icon}
          text={`Open in ${bot.name}`}
          url={bot.generateLink(rawFileLink)}
          onClick={() => sendGtagEvent('Action Clicked', { text: `Open in ${bot.name}` })}
        />
      ))}
    </>
  );

  const templateActions = (
    <>
      <ActionItem
        icon={GitHubIcon}
        text="Suggest edits"
        url={gitHubLink}
        iconClassName="size-[18px] text-white"
        onClick={() => sendGtagEvent('Action Clicked', { text: 'Suggest edits' })}
      />
      <ActionItem
        icon={ArrowBackToTopIcon}
        text="Back to top"
        iconClassName="size-5"
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
