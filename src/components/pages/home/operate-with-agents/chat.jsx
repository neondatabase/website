'use client';

import { AnimatePresence, m } from 'framer-motion';
import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const MESSAGE_TRANSITION = {
  opacity: { duration: 0.167, ease: 'easeOut' },
  y: { duration: 0.333, ease: [0.25, 1, 0.5, 1] },
};

const PanelIcon = () => (
  <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M2.5 3.5h11v9h-11zM2.5 6.5h11" stroke="currentColor" />
    <path d="M5 2v3M11 2v3" stroke="currentColor" />
  </svg>
);

const DotsIcon = () => (
  <svg className="size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <circle cx="3" cy="8" r="1" />
    <circle cx="8" cy="8" r="1" />
    <circle cx="13" cy="8" r="1" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="h-3.5 w-2" viewBox="0 0 8 14" fill="none" aria-hidden>
    <path d="m2.5 3.5 3 3.5-3 3.5" stroke="currentColor" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="size-3" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="m3.25 4.75 2.75 2.5 2.75-2.5" stroke="currentColor" />
  </svg>
);

const PlusIcon = () => (
  <svg className="size-3" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M6 2v8M2 6h8" stroke="currentColor" />
  </svg>
);

const PrivacyIcon = () => (
  <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M8 1.5 13 3v3.75c0 3.2-2.05 5.95-5 7.25-2.95-1.3-5-4.05-5-7.25V3l5-1.5Z"
      stroke="currentColor"
    />
    <path d="M6.25 7.5 7.5 8.75 10.25 6" stroke="currentColor" />
  </svg>
);

const MicrophoneIcon = () => (
  <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect x="5.25" y="1.5" width="5.5" height="8.5" rx="2.75" stroke="currentColor" />
    <path d="M3.5 7.5v.5a4.5 4.5 0 0 0 9 0v-.5M8 12.5v2" stroke="currentColor" />
  </svg>
);

const SendIcon = () => (
  <span className="flex size-6 items-center justify-center rounded-full bg-white text-black">
    <svg className="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 11V3M3.5 6.5 7 3l3.5 3.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  </span>
);

const InlineCode = ({ children }) => (
  <span className="inline-flex rounded-md bg-[#242628] px-1 font-mono text-sm leading-[1.1875rem] tracking-[-0.021875rem] text-white">
    {children}
  </span>
);

InlineCode.propTypes = {
  children: PropTypes.node.isRequired,
};

const Reveal = ({ children, shouldReduceMotion }) => (
  <m.div
    className="absolute inset-0"
    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
    transition={shouldReduceMotion ? { duration: 0 } : MESSAGE_TRANSITION}
  >
    {children}
  </m.div>
);

Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  shouldReduceMotion: PropTypes.bool.isRequired,
};

const UserMessage = ({ children, height, left, top, width }) => (
  <div
    className="absolute rounded-[10px] bg-[#242628] px-3 py-2 text-base leading-[1.375] tracking-[-0.025rem] text-white/90"
    style={{ height, left, top, width }}
  >
    {children}
  </div>
);

UserMessage.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

const AgentMessage = ({ children, top }) => (
  <div className="absolute left-4 w-[352px]" style={{ top }}>
    <div className="flex h-3.5 items-center gap-1 text-sm leading-none tracking-[-0.021875rem] text-[#797d86] opacity-90">
      <span>Worked for 2s</span>
      <ChevronRightIcon />
    </div>
    <span className="mt-2.5 block h-px w-full bg-[#242628]" />
    <div className="mt-2.5 w-[340px] text-base leading-[1.375] tracking-[-0.025rem] text-white/90">
      {children}
    </div>
  </div>
);

AgentMessage.propTypes = {
  children: PropTypes.node.isRequired,
  top: PropTypes.number.isRequired,
};

const ChatComposer = () => (
  <div className="absolute bottom-4 left-4 h-24 w-[352px] rounded-[10px] bg-[#18191b] text-[#c9cbcf] before:pointer-events-none before:absolute before:inset-0 before:rounded-[10px] before:border before:border-[#242628]">
    <span className="absolute top-2 left-3 text-base leading-[1.375] tracking-[-0.025rem] text-[#303236]">
      Ask for follow-up changes
    </span>
    <div className="absolute bottom-3 left-3.5 text-[#61646b]">
      <PlusIcon />
    </div>
    <div className="absolute bottom-3 left-10 flex items-center gap-1 text-[#61646b]">
      <PrivacyIcon />
      <ChevronDownIcon />
    </div>
    <div className="absolute right-20 bottom-3 flex items-center gap-1 text-sm leading-[1.375] tracking-[-0.0175rem]">
      <span>5.5</span>
      <ChevronDownIcon />
    </div>
    <div className="absolute right-[49px] bottom-3 text-[#61646b]">
      <MicrophoneIcon />
    </div>
    <div className="absolute right-3 bottom-2.5">
      <SendIcon />
    </div>
  </div>
);

const Chat = ({ className, style, visibleMessages, shouldReduceMotion }) => (
  <div
    className={cn(
      'h-[788px] w-96 bg-[#131415] font-sans text-white before:pointer-events-none before:absolute before:inset-0 before:z-20 before:border before:border-[#242628]',
      className
    )}
    style={style}
    aria-hidden
  >
    <div className="flex h-[47px] items-center justify-between border-b border-[#242628] px-4 text-[#c9cbcf]">
      <div className="flex items-center gap-2">
        <PanelIcon />
        <span className="text-base leading-[1.375] tracking-[-0.025rem]">User Authentication</span>
      </div>
      <DotsIcon />
    </div>

    <AnimatePresence initial={false}>
      {visibleMessages >= 1 ? (
        <Reveal key="user-one" shouldReduceMotion={shouldReduceMotion}>
          <UserMessage height={82} left={82} top={67} width={286}>
            Test two login flows, email-only and social auth. Create a branch for each.
          </UserMessage>
        </Reveal>
      ) : null}

      {visibleMessages >= 2 ? (
        <Reveal key="agent-one" shouldReduceMotion={shouldReduceMotion}>
          <AgentMessage top={181}>
            Branches <InlineCode>test-email</InlineCode> and <InlineCode>test-social</InlineCode>{' '}
            ready. Users, sessions, and auth config cloned to both.
          </AgentMessage>
        </Reveal>
      ) : null}

      {visibleMessages >= 3 ? (
        <Reveal key="user-two" shouldReduceMotion={shouldReduceMotion}>
          <UserMessage height={38} left={180} top={314} width={188}>
            Run auth tests on both
          </UserMessage>
        </Reveal>
      ) : null}

      {visibleMessages >= 4 ? (
        <Reveal key="agent-two" shouldReduceMotion={shouldReduceMotion}>
          <AgentMessage top={384}>
            <InlineCode>test-email</InlineCode> - all tests passing.
            <br />
            <InlineCode>test-social</InlineCode> - OAuth callback failing.
          </AgentMessage>
        </Reveal>
      ) : null}

      {visibleMessages >= 5 ? (
        <Reveal key="user-three" shouldReduceMotion={shouldReduceMotion}>
          <UserMessage height={38} left={82} top={495} width={286}>
            Drop social, push email to main
          </UserMessage>
        </Reveal>
      ) : null}

      {visibleMessages >= 6 ? (
        <Reveal key="agent-three" shouldReduceMotion={shouldReduceMotion}>
          <AgentMessage top={565}>
            <InlineCode>test-social</InlineCode> deleted. <InlineCode>test-email</InlineCode> pushed
            to main.
          </AgentMessage>
        </Reveal>
      ) : null}
    </AnimatePresence>

    <ChatComposer />
  </div>
);

Chat.propTypes = {
  className: PropTypes.string,
  visibleMessages: PropTypes.number.isRequired,
  shouldReduceMotion: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

export default Chat;
