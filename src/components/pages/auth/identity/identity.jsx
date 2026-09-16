import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import identityDataImage from 'images/pages/auth/identity/identity-data.jpg';
import inspectAuthSqlImage from 'images/pages/auth/identity/inspect-auth-sql.jpg';

const Identity = ({ content }) => (
  <section
    className="identity py-20 safe-paddings text-white xl:py-16 lg:py-12 md:py-10"
    aria-labelledby="auth-identity-heading"
    data-figma-node-id="2131:9034"
  >
    <Container size="1344">
      <div className="grid grid-cols-[15rem_minmax(0,1fr)] gap-x-4 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-x-8 lg:grid-cols-1">
        <SectionLabel className="mt-4 lg:mt-0" theme="white">
          {content.label}
        </SectionLabel>

        <h2
          className="text-5xl leading-dense tracking-tighter xl:text-4xl lg:mt-5 lg:text-[2.25rem] md:text-[1.75rem]"
          id="auth-identity-heading"
        >
          {content.title} <span className="text-gray-new-50">{content.highlightedTitle}</span>
        </h2>

        <div className="col-start-2 mt-18 grid grid-cols-[minmax(0,41fr)_minmax(0,26fr)] items-end gap-x-4 lg:col-start-1 lg:mt-12 md:grid-cols-1 md:gap-y-10">
          <div className="flex min-w-0 flex-col gap-8 md:gap-6">
            <p className="text-lg leading-normal tracking-extra-tight text-gray-new-60 md:text-base">
              <strong className="font-medium text-white">{content.inspectAuth.title}</strong>{' '}
              {content.inspectAuth.descriptionBeforeCode}{' '}
              <code className="rounded border border-gray-new-30 bg-black-new px-1 py-0.25 font-mono text-base leading-[1.2] tracking-extra-tight text-white md:text-sm">
                {content.inspectAuth.code}
              </code>{' '}
              {content.inspectAuth.descriptionAfterCode}
            </p>

            <Image
              className="h-auto w-full bg-gray-new-8"
              src={inspectAuthSqlImage}
              width={1312}
              height={880}
              sizes="(max-width: 47.9375rem) calc(100vw - 2.5rem), (max-width: 63.9375rem) 60vw, 41rem"
              alt=""
              unoptimized
            />
          </div>

          <div className="flex min-w-0 flex-col gap-8 md:gap-6">
            <p className="max-w-98 text-lg leading-normal tracking-extra-tight text-gray-new-60 md:max-w-none md:text-base">
              <strong className="font-medium text-white">{content.identityData.title}</strong>{' '}
              {content.identityData.description}
            </p>

            <Image
              className="h-auto w-full bg-gray-new-8"
              src={identityDataImage}
              width={832}
              height={604}
              sizes="(max-width: 47.9375rem) calc(100vw - 2.5rem), (max-width: 63.9375rem) 38vw, 26rem"
              alt=""
              unoptimized
            />
          </div>
        </div>
      </div>
    </Container>
  </section>
);

Identity.propTypes = {
  content: PropTypes.shape({
    label: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    highlightedTitle: PropTypes.string.isRequired,
    inspectAuth: PropTypes.shape({
      title: PropTypes.string.isRequired,
      descriptionBeforeCode: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      descriptionAfterCode: PropTypes.string.isRequired,
    }).isRequired,
    identityData: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Identity;
