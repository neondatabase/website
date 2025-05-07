'use client';

import clsx from 'clsx';
import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import ChatGptIcon from 'icons/docs/chat-gpt.inline.svg';
import MarkdownIcon from 'icons/docs/markdown.inline.svg';
import GitHubIcon from 'icons/github.inline.svg';

const ActionItem = ({ icon: Icon, text, url, onClick }) => {
  const Tag = url ? Link : 'button';

  return (
    <Tag
      className={clsx(
        'flex items-center gap-x-2 text-gray-new-40',
        'transition-colors duration-200 hover:text-secondary-8',
        'dark:text-gray-new-60 dark:hover:text-primary-1'
      )}
      to={url}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      icon={url ? 'external' : undefined}
      onClick={onClick}
    >
      <Icon className="size-3.5" />
      <span className="text-sm leading-none tracking-extra-tight">{text}</span>
    </Tag>
  );
};

ActionItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  onClick: PropTypes.func,
};

const CopyMarkdownButton = ({ rawFileLink }) => {
  const [copied, setCopied] = useState(false);

  const copyPageToClipboard = async () => {
    try {
      const response = await fetch(rawFileLink);
      const content = await response.text();
      copyToClipboard(content);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy file content:', error);
    }
  };

  return (
    <ActionItem
      icon={MarkdownIcon}
      text={copied ? 'Copied!' : 'Copy page as markdown'}
      onClick={copied ? undefined : copyPageToClipboard}
    />
  );
};

CopyMarkdownButton.propTypes = {
  rawFileLink: PropTypes.string.isRequired,
};

const Actions = ({ githubPath, withBorder = false }) => {
  const gitHubLink = `${process.env.NEXT_PUBLIC_GITHUB_PATH}${githubPath}`;
  const rawFileLink = `${process.env.NEXT_PUBLIC_GITHUB_RAW_PATH}${githubPath}`;
  const chatGptLink = `https://chatgpt.com/?hints=search&q=Read+${rawFileLink}`;

  return (
    <div
      className={clsx(
        'flex flex-col gap-3.5',
        withBorder ? 'mt-4 border-t border-gray-new-90 pt-4 dark:border-gray-new-15/70' : 'mt-12'
      )}
    >
      <CopyMarkdownButton rawFileLink={rawFileLink} />
      <ActionItem icon={GitHubIcon} text="Edit this page on Github" url={gitHubLink} />
      <ActionItem icon={ChatGptIcon} text="Open in ChatGPT" url={chatGptLink} />
    </div>
  );
};

Actions.propTypes = {
  githubPath: PropTypes.string.isRequired,
  withBorder: PropTypes.bool,
};

export default Actions;
