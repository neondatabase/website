'use client';

import copyToClipboard from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback } from 'react';

import Link from 'components/shared/link';
import ChevronDownIcon from 'icons/chevron-down.inline.svg';
import CopyIcon from 'icons/copy-docs.inline.svg';
import ChatGptIcon from 'icons/docs/chat-gpt.inline.svg';
import ClaudeIcon from 'icons/docs/claude.inline.svg';
import ExternalIcon from 'icons/external.inline.svg';
import { cn } from 'utils/cn';
import sendGtagEvent from 'utils/send-gtag-event';

const DropdownItem = ({ icon: Icon, text, description, url, onClick, className }) => {
  const Tag = url ? Link : 'button';

  return (
    <Tag
      className={cn(
        'group flex w-full items-center gap-2 border-b border-gray-new-90 py-2.25 pr-5 pl-3 text-left hover:bg-gray-new-98 dark:border-gray-new-20 dark:hover:bg-gray-new-15',
        'last:border-b-0',
        className
      )}
      to={url}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      onClick={onClick}
    >
      <div className="flex size-8 shrink-0 items-center justify-center border border-gray-new-90 bg-white dark:border-gray-new-20 dark:bg-black-pure">
        <Icon className="size-4.5 text-gray-new-60 dark:text-gray-new-50" />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-sm leading-tight font-medium text-gray-new-20 dark:text-gray-new-94">
          {text}
          {url && <ExternalIcon className="size-3.5" />}
        </div>
        {description && (
          <span className="mt-1.5 text-xs leading-none tracking-extra-tight text-gray-new-40 dark:text-gray-new-70">
            {description}
          </span>
        )}
      </div>
    </Tag>
  );
};

DropdownItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  description: PropTypes.string,
  url: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

const CopyMarkdownButton = ({
  markdownPath,
  text = 'Copy page',
  description = 'Copy page as Markdown',
  variant = 'md',
}) => {
  const [status, setStatus] = useState('default'); // 'default' | 'copied' | 'failed'

  const getButtonText = () => {
    if (status === 'failed') return 'Failed to copy';
    if (status === 'copied') return 'Copied!';
    return text;
  };

  const copyPageToClipboard = () => {
    const onSuccess = () => {
      setStatus('copied');
      sendGtagEvent('Action Clicked', { text: 'Copy markdown', tag_name: 'DocsSidebar' });
      setTimeout(() => setStatus('default'), 2000);
    };
    const onError = () => {
      setStatus('failed');
      setTimeout(() => setStatus('default'), 2000);
    };

    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      const textPromise = fetch(markdownPath).then((r) => r.text());
      navigator.clipboard
        .write([new ClipboardItem({ 'text/plain': textPromise })])
        .then(onSuccess)
        .catch(onError);
    } else {
      fetch(markdownPath)
        .then((r) => r.text())
        .then((content) => {
          copyToClipboard(content);
          onSuccess();
        })
        .catch(onError);
    }
  };

  if (variant === 'sm') {
    return (
      <button
        className="flex h-8 w-fit shrink-0 items-center gap-2 border-r border-gray-new-90 px-2.5 whitespace-nowrap text-black-new hover:bg-gray-new-98 dark:border-gray-new-20 dark:text-gray-new-94 dark:hover:bg-gray-new-8"
        onClick={status === 'copied' ? undefined : copyPageToClipboard}
      >
        <CopyIcon className="size-4 shrink-0" />
        <span className="text-sm leading-none tracking-extra-tight whitespace-nowrap">
          {getButtonText()}
        </span>
      </button>
    );
  }

  return (
    <DropdownItem
      icon={CopyIcon}
      text={getButtonText()}
      description={description}
      onClick={status === 'copied' ? undefined : copyPageToClipboard}
    />
  );
};

CopyMarkdownButton.propTypes = {
  markdownPath: PropTypes.string.isRequired,
  description: PropTypes.string,
  text: PropTypes.string,
  variant: PropTypes.oneOf(['sm', 'md']),
};

const AI_CHATBOTS = [
  {
    name: 'ChatGPT',
    enabled: true,
    generateLink: (url) =>
      `https://chatgpt.com/?hints=search&q=Read+from+${url}+so+I+can+ask+questions+about+it.`,
    icon: ChatGptIcon,
    description: 'Ask questions about this page',
  },
  {
    name: 'Claude',
    enabled: true,
    generateLink: (url) =>
      `https://claude.ai/new?q=Read+from+${url}+so+I+can+ask+questions+about+it.`,
    icon: ClaudeIcon,
    description: 'Ask questions about this page',
  },
];

const DropdownMenu = ({
  gitHubPath,
  markdownPath: customMarkdownPath,
  variant = 'box',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const siteUrl = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || '';
  const markdownPath = customMarkdownPath || `/${gitHubPath.replace('content/', '')}`;
  const pageUrl = `${siteUrl}${markdownPath.replace(/\.md$/, '')}`;

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  // The menu panel is identical across variants: Copy page as Markdown, then the
  // "Open in ChatGPT / Claude" items.
  const menuItems = (
    <>
      <CopyMarkdownButton markdownPath={markdownPath} description="Copy page as Markdown" />
      {AI_CHATBOTS.filter((bot) => bot.enabled).map((bot) => (
        <DropdownItem
          key={bot.name}
          icon={bot.icon}
          text={`Open in ${bot.name}`}
          url={bot.generateLink(pageUrl)}
          description={bot.description}
          onClick={() =>
            sendGtagEvent('Action Clicked', {
              text: `Open in ${bot.name}`,
              tag_name: 'DropdownMenu',
            })
          }
        />
      ))}
    </>
  );

  // Inline variant: a plain text "Copy page" trigger with a small chevron that
  // opens the same menu. No border or background, to sit in the page actions row.
  if (variant === 'inline') {
    return (
      <div ref={containerRef} className={cn('relative flex', className)}>
        <button
          className="flex items-center gap-[7px] text-sm leading-none text-gray-new-20 transition-colors duration-[120ms] ease-out hover:text-black-new dark:text-gray-new-94 dark:hover:text-white"
          type="button"
          aria-label="Copy page options"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <CopyIcon className="size-[15px] shrink-0" />
          Copy page
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              'ml-[-2px] size-3 text-[#6B6F77] transition-transform duration-200 dark:text-gray-new-60',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        {isOpen && (
          <div className="absolute top-[calc(100%+10px)] left-0 z-50 w-70 origin-top-left border border-gray-new-90 bg-white focus:outline-none dark:border-gray-new-20 dark:bg-black-new">
            {menuItems}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('relative mt-2.5 w-fit sm:mt-0', className)}>
      <div className="flex items-center border border-gray-new-90 dark:border-gray-new-20">
        <CopyMarkdownButton markdownPath={markdownPath} variant="sm" />
        <button
          className="flex h-8 items-center px-1 hover:bg-gray-new-98 dark:hover:bg-gray-new-8"
          type="button"
          aria-label="More page actions"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              'size-3.5 text-gray-new-50 transition-transform duration-200 dark:text-gray-new-50',
              isOpen && 'rotate-180'
            )}
          />
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-8.25 right-0 z-50 w-65 origin-top-right border border-gray-new-90 bg-white focus:outline-none dark:border-gray-new-20 dark:bg-black-new sm:left-0">
          {menuItems}
        </div>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  gitHubPath: PropTypes.string.isRequired,
  markdownPath: PropTypes.string,
  variant: PropTypes.oneOf(['box', 'inline']),
  className: PropTypes.string,
};

export default DropdownMenu;
