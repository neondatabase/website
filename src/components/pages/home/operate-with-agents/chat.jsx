'use client';

import { AnimatePresence, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useLayoutEffect, useRef } from 'react';

import ArrowUpIcon from 'icons/home/operate-with-agents/arrow-up.inline.svg';
import BoxIcon from 'icons/home/operate-with-agents/box.inline.svg';
import BulletListIcon from 'icons/home/operate-with-agents/bullet-list.inline.svg';
import ChevronDownIcon from 'icons/home/operate-with-agents/chevron-down.inline.svg';
import DotsIcon from 'icons/home/operate-with-agents/dots.inline.svg';
import MicrophoneIcon from 'icons/home/operate-with-agents/microphone.inline.svg';
import PlusIcon from 'icons/home/operate-with-agents/plus.inline.svg';
import PrivacyIcon from 'icons/home/operate-with-agents/privacy.inline.svg';
import RightArrowIcon from 'icons/home/operate-with-agents/right-arrow.inline.svg';
import { cn } from 'utils/cn';

const MESSAGE_TRANSITION = { duration: 0.25, ease: [0.25, 1, 0.5, 1] };
const THINKING_TEXT = 'Thinking...';
const THINKING_REVEAL_DELAY = 0.25;

export const CHAT_PROMPTS = [
  'Test two login flows, email-only and social auth. Create a branch for each.',
  'Run auth tests on both',
  'Drop social, push email to main',
];

const SendIcon = ({ isActive }) => (
  <span
    className={cn(
      'flex size-6 items-center justify-center rounded-full',
      isActive ? 'bg-white' : 'bg-[#61646b]'
    )}
  >
    <ArrowUpIcon aria-hidden />
  </span>
);

SendIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

const InlineCode = ({ children }) => (
  <span className="inline-flex rounded-md bg-[#242628] px-1 font-mono text-sm leading-[1.1875rem] tracking-[-0.021875rem] text-white">
    {children}
  </span>
);

InlineCode.propTypes = {
  children: PropTypes.node.isRequired,
};

const Reveal = ({
  children,
  delay = 0,
  fadeOnly = false,
  isCompact = false,
  shouldReduceMotion,
}) => (
  <m.div
    className={isCompact ? 'shrink-0' : 'absolute inset-0'}
    initial={shouldReduceMotion ? false : { opacity: 0, ...(fadeOnly ? {} : { y: 8 }) }}
    animate={{
      opacity: 1,
      ...(fadeOnly ? {} : { y: 0 }),
      transition: shouldReduceMotion ? { duration: 0 } : { ...MESSAGE_TRANSITION, delay },
    }}
    exit={
      shouldReduceMotion
        ? undefined
        : { opacity: 0, ...(fadeOnly ? {} : { y: -6 }), transition: MESSAGE_TRANSITION }
    }
  >
    {children}
  </m.div>
);

Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  fadeOnly: PropTypes.bool,
  isCompact: PropTypes.bool,
  shouldReduceMotion: PropTypes.bool.isRequired,
};

const UserMessage = ({ children, height, isCompact = false, left, top, width }) => (
  <div
    className={cn(
      'rounded-[10px] bg-[#242628] px-3 py-2 text-base leading-[1.375] tracking-[-0.025rem] text-white/90',
      isCompact ? 'relative ml-auto h-auto' : 'absolute'
    )}
    style={isCompact ? { width } : { height, left, top, width }}
  >
    {children}
  </div>
);

UserMessage.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  isCompact: PropTypes.bool,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

const AgentMessage = ({ children, isCompact = false, top }) => (
  <div
    className={cn(isCompact ? 'relative w-full' : 'absolute left-4 w-[352px]')}
    style={isCompact ? undefined : { top }}
  >
    <div className="flex h-3.5 items-center gap-1 text-sm leading-none tracking-[-0.021875rem] text-[#797d86] opacity-90">
      <span>Worked for 2s</span>
      <RightArrowIcon className="shrink-0" aria-hidden />
    </div>
    <span className="mt-2.5 block h-px w-full bg-[#242628]" />
    <div className="mt-2.5 w-[340px] text-base leading-[1.375] tracking-[-0.025rem] text-white/90">
      {children}
    </div>
  </div>
);

AgentMessage.propTypes = {
  children: PropTypes.node.isRequired,
  isCompact: PropTypes.bool,
  top: PropTypes.number.isRequired,
};

const ShimmeringText = ({ shouldReduceMotion }) => (
  <m.span className="relative inline-block [perspective:500px]">
    {THINKING_TEXT.split('').map((character, index) => (
      <m.span
        className="inline-block whitespace-pre [transform-style:preserve-3d]"
        initial={shouldReduceMotion ? false : { color: '#797d86' }}
        animate={
          shouldReduceMotion ? { color: '#797d86' } : { color: ['#797d86', '#c9cbcf', '#797d86'] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 1,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: THINKING_TEXT.length * 0.05,
                delay: index / THINKING_TEXT.length,
                ease: 'easeInOut',
              }
        }
        key={`${character}-${index}`}
      >
        {character}
      </m.span>
    ))}
  </m.span>
);

ShimmeringText.propTypes = {
  shouldReduceMotion: PropTypes.bool.isRequired,
};

const ThinkingMessage = ({ isCompact = false, shouldReduceMotion, top }) => (
  <div
    className={cn(
      'text-sm leading-none tracking-[-0.021875rem]',
      isCompact ? 'relative w-full text-[#797d86]' : 'absolute left-4 w-[352px]'
    )}
    data-operate-chat-thinking
    style={isCompact ? undefined : { top }}
  >
    <ShimmeringText shouldReduceMotion={shouldReduceMotion} />
  </div>
);

ThinkingMessage.propTypes = {
  isCompact: PropTypes.bool,
  shouldReduceMotion: PropTypes.bool.isRequired,
  top: PropTypes.number.isRequired,
};

const Messages = ({ isCompact = false, isThinking, shouldReduceMotion, visibleMessages }) => (
  <AnimatePresence initial={false}>
    {visibleMessages >= 1 ? (
      <Reveal key="user-one" isCompact={isCompact} shouldReduceMotion={shouldReduceMotion}>
        <UserMessage height={82} isCompact={isCompact} left={82} top={67} width={286}>
          {CHAT_PROMPTS[0]}
        </UserMessage>
      </Reveal>
    ) : null}

    {isThinking && visibleMessages === 1 ? (
      <Reveal
        key="thinking-one"
        delay={THINKING_REVEAL_DELAY}
        fadeOnly
        isCompact={isCompact}
        shouldReduceMotion={shouldReduceMotion}
      >
        <ThinkingMessage isCompact={isCompact} shouldReduceMotion={shouldReduceMotion} top={181} />
      </Reveal>
    ) : null}

    {visibleMessages >= 2 ? (
      <Reveal key="agent-one" isCompact={isCompact} shouldReduceMotion={shouldReduceMotion}>
        <AgentMessage isCompact={isCompact} top={181}>
          Branches <InlineCode>test-email</InlineCode> and <InlineCode>test-social</InlineCode>{' '}
          ready. Users, sessions, and auth config cloned to both.
        </AgentMessage>
      </Reveal>
    ) : null}

    {visibleMessages >= 3 ? (
      <Reveal key="user-two" isCompact={isCompact} shouldReduceMotion={shouldReduceMotion}>
        <UserMessage height={38} isCompact={isCompact} left={180} top={314} width={188}>
          {CHAT_PROMPTS[1]}
        </UserMessage>
      </Reveal>
    ) : null}

    {isThinking && visibleMessages === 3 ? (
      <Reveal
        key="thinking-two"
        delay={THINKING_REVEAL_DELAY}
        fadeOnly
        isCompact={isCompact}
        shouldReduceMotion={shouldReduceMotion}
      >
        <ThinkingMessage isCompact={isCompact} shouldReduceMotion={shouldReduceMotion} top={384} />
      </Reveal>
    ) : null}

    {visibleMessages >= 4 ? (
      <Reveal key="agent-two" isCompact={isCompact} shouldReduceMotion={shouldReduceMotion}>
        <AgentMessage isCompact={isCompact} top={384}>
          <InlineCode>test-email</InlineCode> - all tests passing.
          <br />
          <InlineCode>test-social</InlineCode> - OAuth callback failing.
        </AgentMessage>
      </Reveal>
    ) : null}

    {visibleMessages >= 5 ? (
      <Reveal key="user-three" isCompact={isCompact} shouldReduceMotion={shouldReduceMotion}>
        <UserMessage height={38} isCompact={isCompact} left={82} top={495} width={286}>
          {CHAT_PROMPTS[2]}
        </UserMessage>
      </Reveal>
    ) : null}

    {isThinking && visibleMessages === 5 ? (
      <Reveal
        key="thinking-three"
        delay={THINKING_REVEAL_DELAY}
        fadeOnly
        isCompact={isCompact}
        shouldReduceMotion={shouldReduceMotion}
      >
        <ThinkingMessage isCompact={isCompact} shouldReduceMotion={shouldReduceMotion} top={565} />
      </Reveal>
    ) : null}

    {visibleMessages >= 6 ? (
      <Reveal key="agent-three" isCompact={isCompact} shouldReduceMotion={shouldReduceMotion}>
        <AgentMessage isCompact={isCompact} top={565}>
          <InlineCode>test-social</InlineCode> deleted. <InlineCode>test-email</InlineCode> pushed
          to main.
        </AgentMessage>
      </Reveal>
    ) : null}
  </AnimatePresence>
);

Messages.propTypes = {
  isCompact: PropTypes.bool,
  isThinking: PropTypes.bool.isRequired,
  shouldReduceMotion: PropTypes.bool.isRequired,
  visibleMessages: PropTypes.number.isRequired,
};

const CompactMessages = ({ isThinking, shouldReduceMotion, visibleMessages }) => {
  const viewportRef = useRef(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [shouldReduceMotion, visibleMessages]);

  return (
    <div className="h-[120px] overflow-hidden" data-operate-chat-messages ref={viewportRef}>
      <div className="flex min-h-full flex-col justify-end gap-4 px-4 py-2">
        <Messages
          isCompact
          isThinking={isThinking}
          shouldReduceMotion={shouldReduceMotion}
          visibleMessages={visibleMessages}
        />
      </div>
    </div>
  );
};

CompactMessages.propTypes = {
  isThinking: PropTypes.bool.isRequired,
  shouldReduceMotion: PropTypes.bool.isRequired,
  visibleMessages: PropTypes.number.isRequired,
};

const ChatComposer = ({ text }) => (
  <div className="absolute bottom-4 left-4 h-24 w-[352px] rounded-[10px] bg-[#18191b] text-[#c9cbcf] before:pointer-events-none before:absolute before:inset-0 before:rounded-[10px] before:border before:border-[#242628]">
    <span
      className={cn(
        'absolute top-2 right-3 left-3 text-base leading-[1.375] tracking-[-0.025rem]',
        text ? 'text-white/90' : 'text-gray-new-20'
      )}
    >
      {text || 'Ask for follow-up changes'}
    </span>
    <div className="absolute bottom-3 flex w-full items-center justify-between pr-3 pl-3.5">
      <div className="flex items-center text-gray-new-40">
        <PlusIcon className="mr-3.5 shrink-0" aria-hidden />
        <PrivacyIcon className="shrink-0" aria-hidden />
        <ChevronDownIcon className="ml-1 shrink-0" aria-hidden />
      </div>
      <div className="flex flex-row items-center gap-x-3.5">
        <div className="flex items-center gap-1 text-sm leading-snug tracking-[-0.0175rem]">
          <span>5.5</span>
          <ChevronDownIcon aria-hidden />
        </div>
        <MicrophoneIcon aria-hidden />
        <SendIcon isActive={Boolean(text)} />
      </div>
    </div>
  </div>
);

ChatComposer.propTypes = {
  text: PropTypes.string.isRequired,
};

const Chat = ({
  className,
  chatRef,
  composerText,
  isCompact,
  isThinking,
  style,
  visibleMessages,
  shouldReduceMotion,
}) => (
  <div
    className={cn(
      'w-96 bg-gray-new-8 font-sans text-white before:pointer-events-none before:absolute before:inset-0 before:z-20 before:border before:border-[#242628]',
      isCompact ? 'h-[295px]' : 'h-[788px]',
      className
    )}
    data-operate-chat
    ref={chatRef}
    style={style}
    aria-hidden
  >
    <div className="flex h-[47px] items-center border-b border-[#242628] px-4 text-[#c9cbcf]">
      <div className="mr-3.5 flex items-center gap-2">
        <BoxIcon className="shrink-0" aria-hidden />
        <span className="text-base leading-snug tracking-[-0.025rem]">User Authentication</span>
      </div>
      <DotsIcon className="shrink-0" aria-hidden />
      <BulletListIcon className="ml-auto shrink-0" aria-hidden />
    </div>

    {isCompact ? (
      <CompactMessages
        isThinking={isThinking}
        shouldReduceMotion={shouldReduceMotion}
        visibleMessages={visibleMessages}
      />
    ) : (
      <Messages
        isThinking={isThinking}
        shouldReduceMotion={shouldReduceMotion}
        visibleMessages={visibleMessages}
      />
    )}

    <ChatComposer text={composerText} />
  </div>
);

Chat.propTypes = {
  className: PropTypes.string,
  chatRef: PropTypes.func,
  composerText: PropTypes.string.isRequired,
  isCompact: PropTypes.bool.isRequired,
  isThinking: PropTypes.bool.isRequired,
  visibleMessages: PropTypes.number.isRequired,
  shouldReduceMotion: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

export default Chat;
