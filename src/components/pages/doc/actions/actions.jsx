'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Link from 'components/shared/link';
import ArrowBackToTopIcon from 'icons/arrow-back-to-top.inline.svg';
import StarIcon from 'icons/docs/star.inline.svg';
import GitHubIcon from 'icons/github.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

import NeonInitModal from '../neon-init-modal';

export const ActionItem = ({
  icon: Icon,
  text,
  url,
  onClick,
  iconClassName,
  tooltip,
  className,
}) => {
  const Tag = url ? Link : 'button';

  return (
    <div className="group relative">
      <Tag
        className={cn(
          'relative flex h-3.5 w-full items-center justify-between rounded-sm text-gray-new-40',
          'transition-colors duration-200 hover:text-black-pure',
          'dark:text-gray-new-70 dark:hover:text-white',
          className
        )}
        to={url}
        target={url ? '_blank' : undefined}
        rel={url ? 'noopener noreferrer' : undefined}
        icon={url ? 'external' : undefined}
        onClick={onClick}
      >
        <div className="flex items-center gap-x-2">
          <Icon className={cn(`size-3.5`, iconClassName)} />
          <span className="text-sm leading-none tracking-extra-tight">{text}</span>
        </div>
      </Tag>
      {tooltip && (
        <span
          className={cn(
            'pointer-events-none absolute top-full left-0 z-10 mt-2.75 whitespace-nowrap opacity-0',
            'flex h-6.5 items-center border border-gray-new-80 bg-gray-new-98 px-2 text-xs text-gray-new-40',
            'transition-opacity duration-150 group-hover:opacity-100',
            'dark:border-gray-new-20 dark:bg-gray-new-8 dark:text-gray-new-60',
            'before:absolute before:-top-[4px] before:left-1/2 before:-translate-x-1/2',
            'before:size-2 before:rotate-45',
            'before:border-t before:border-l before:border-gray-new-80 before:bg-gray-new-98',
            'dark:before:border-gray-new-20 dark:before:bg-gray-new-8',
            'after:absolute after:top-0 after:left-1/2 after:h-px after:w-3 after:-translate-x-1/2',
            'after:bg-gray-new-98 dark:after:bg-gray-new-8'
          )}
        >
          {tooltip}
        </span>
      )}
    </div>
  );
};

ActionItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  onClick: PropTypes.func,
  iconClassName: PropTypes.string,
  tooltip: PropTypes.string,
  className: PropTypes.string,
};

const SetUpNeonButton = ({ onClick, tooltip }) => (
  <ActionItem icon={StarIcon} text="Set up Neon with AI" tooltip={tooltip} onClick={onClick} />
);

SetUpNeonButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
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

const Actions = ({ gitHubPath, withBorder = false, isTemplate = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const githubBase = process.env.NEXT_PUBLIC_GITHUB_PATH;

  const gitHubLink = `${githubBase}${gitHubPath}`;
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleOpenModal = () => {
    setIsModalOpen(true);
    sendGtagEvent('Action Clicked', { text: 'Set up Neon with your AI', tag_name: 'DocsSidebar' });
  };

  const docsActions = (
    <SetUpNeonButton tooltip="Copy neon init command" onClick={handleOpenModal} />
  );

  const templateActions = (
    <>
      <ActionItem
        icon={GitHubIcon}
        text="Suggest edits"
        url={gitHubLink}
        tooltip="Propose changes to this page"
        onClick={() =>
          sendGtagEvent('Action Clicked', { text: 'Suggest edits', tag_name: 'DocsSidebar' })
        }
      />
      <ActionItem
        icon={ArrowBackToTopIcon}
        text="Back to top"
        tooltip="Scroll to the top of the page"
        onClick={backToTop}
      />
    </>
  );

  return (
    <>
      <div
        className={cn(
          'flex flex-col gap-3.5',
          withBorder && 'mt-5 border-t border-gray-new-90 pt-5 dark:border-gray-new-20'
        )}
      >
        {isTemplate ? templateActions : docsActions}
      </div>
      <NeonInitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

Actions.propTypes = {
  gitHubPath: PropTypes.string.isRequired,
  withBorder: PropTypes.bool,
  isTemplate: PropTypes.bool,
};

export default Actions;
