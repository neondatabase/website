import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import loginIcon from 'icons/auth/branching/login.svg';
import oauthIcon from 'icons/auth/branching/oauth.svg';
import passwordResetIcon from 'icons/auth/branching/password-reset.svg';
import rlsIcon from 'icons/auth/branching/rls.svg';
import signUpIcon from 'icons/auth/branching/sign-up.svg';

import BranchingAnimation from './branching-animation';

const ICONS = {
  'sign-up': signUpIcon,
  login: loginIcon,
  oauth: oauthIcon,
  'password-reset': passwordResetIcon,
  rls: rlsIcon,
};

const Branching = ({ content }) => (
  <section
    className="branching py-20 safe-paddings text-white xl:py-16 lg:py-12 md:py-10"
    aria-labelledby="auth-branching-heading"
    data-figma-node-id="2131:6949"
  >
    <Container size="1344">
      <header className="max-w-160">
        <SectionLabel theme="white">{content.label}</SectionLabel>
        <h2
          className="mt-6 text-6xl leading-none tracking-[-0.05em] text-pretty xl:text-[3.5rem] lg:text-5xl md:mt-5 md:text-4xl sm:text-[2rem]"
          id="auth-branching-heading"
        >
          {content.title}
        </h2>
        <p className="mt-6 text-lg leading-normal tracking-extra-tight text-pretty text-gray-new-60 md:mt-5 md:text-base">
          {content.description}
        </p>
      </header>

      <div className="mt-6 overflow-hidden">
        <BranchingAnimation description={content.diagramAlt} />
      </div>

      <div className="mt-12 flex items-center justify-between gap-x-8 gap-y-6 xl:flex-col xl:items-start md:mt-8">
        <p className="text-xl leading-normal tracking-extra-tight text-gray-new-85 md:text-lg">
          {content.caption}
        </p>
        <ul className="flex flex-wrap gap-2.5">
          {content.capabilities.map(({ id, label }) => (
            <li
              className="flex shrink-0 items-center gap-2 border border-gray-new-20 px-3.5 py-3 font-mono text-[0.9375rem] leading-none font-medium text-gray-new-70 uppercase md:px-3 md:py-2.5 md:text-xs"
              key={id}
            >
              <Image className="size-4 shrink-0" src={ICONS[id]} width={16} height={16} alt="" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

Branching.propTypes = {
  content: PropTypes.shape({
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    diagramAlt: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    capabilities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Branching;
