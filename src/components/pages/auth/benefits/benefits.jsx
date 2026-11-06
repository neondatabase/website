import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import betterAuthIcon from 'icons/auth/benefits/better-auth.svg';
import builtInAuthIcon from 'icons/auth/benefits/built-in-auth.svg';
import clientServerIcon from 'icons/auth/benefits/client-server.svg';
import familiarApisIcon from 'icons/auth/benefits/familiar-apis.svg';
import noInfrastructureIcon from 'icons/auth/benefits/no-infrastructure.svg';
import openSourceIcon from 'icons/auth/benefits/open-source.svg';
import signInSessionsIcon from 'icons/auth/benefits/sign-in-sessions.svg';

const BADGE_ICONS = {
  'better-auth': betterAuthIcon,
  'familiar-apis': familiarApisIcon,
  'open-source': openSourceIcon,
  'no-infrastructure': noInfrastructureIcon,
  'built-in-auth': builtInAuthIcon,
  'client-server': clientServerIcon,
  'sign-in-sessions': signInSessionsIcon,
};

const Benefits = ({ content }) => (
  <section
    className="auth-benefits pt-40 safe-paddings pb-20 text-white xl:pt-32 xl:pb-16 lg:pt-24 lg:pb-12 md:pt-20 md:pb-10"
    aria-labelledby="auth-benefits-heading"
  >
    <Container size="1344">
      <h2
        className="max-w-272 text-5xl leading-dense tracking-tighter text-pretty xl:text-4xl lg:text-[2.25rem] md:text-[1.75rem]"
        id="auth-benefits-heading"
      >
        {content.title} <span className="text-gray-new-50">{content.highlightedTitle}</span>
      </h2>

      <ul className="mt-14 flex flex-col gap-y-11 lg:mt-12 md:mt-10 md:gap-y-8">
        {content.items.map(({ id, label, title, description, badges }) => (
          <li
            className="grid grid-cols-[16rem_minmax(0,1fr)] gap-x-32 border-t border-gray-new-15 pt-5.75 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-x-8 lg:grid-cols-1 lg:gap-y-4 md:gap-y-2"
            key={id}
          >
            <span className="pt-2.25 text-lg leading-tight tracking-extra-tight text-gray-new-60 lg:pt-0 md:text-base">
              {label}
            </span>

            <div className="grid grid-cols-[minmax(0,4fr)_minmax(0,5fr)] gap-x-24 xl:gap-x-8 md:grid-cols-1 md:gap-y-3">
              <h3 className="text-[2rem] leading-snug tracking-tighter text-pretty xl:text-[1.75rem] lg:text-2xl md:text-xl">
                {title}
              </h3>

              <div className="min-w-0 pt-1.25 lg:pt-0">
                <p className="text-xl leading-normal tracking-extra-tight text-pretty text-gray-new-70 xl:text-lg md:text-base">
                  {description}
                </p>
                <ul className="mt-10 flex flex-wrap gap-3.5 lg:mt-8 md:mt-6 md:gap-2">
                  {badges.map(({ id: badgeId, label: badgeLabel }) => (
                    <li
                      className="flex h-9 items-center gap-2 bg-gray-new-15/90 px-2 py-1.5 font-mono text-xs leading-none font-medium text-gray-new-80 uppercase"
                      key={badgeId}
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center overflow-hidden">
                        <Image
                          className="block max-h-full max-w-full"
                          src={BADGE_ICONS[badgeId]}
                          alt=""
                        />
                      </span>
                      {badgeLabel}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

Benefits.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    highlightedTitle: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        badges: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOf(Object.keys(BADGE_ICONS)).isRequired,
            label: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Benefits;
