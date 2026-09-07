import PropTypes from 'prop-types';
import { Fragment } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Logos from 'components/shared/logos';
import SectionLabel from 'components/shared/section-label';
import LINKS from 'constants/links';
import { cn } from 'utils/cn';

const DEFAULT_LOGOS = [
  'replit',
  'outfront',
  'doordash',
  'bcg',
  'pepsi',
  'retool',
  'meta',
  'bitso',
  'framer',
];

const Hero = ({
  className,
  content,
  dataFigmaNodeId = null,
  headingClassName = null,
  headingId,
  headingRowClassName,
  illustration,
  illustrationClassName,
  logos = DEFAULT_LOGOS,
  logosClassName,
  logosDataFigmaNodeId = null,
  logosStaticDesktop = false,
  testIdPrefix = null,
}) => {
  const titleLines = content.titleLines ?? [content.title];

  return (
    <section className={className} data-figma-node-id={dataFigmaNodeId} aria-labelledby={headingId}>
      <Container size="1344">
        <SectionLabel theme="white">{content.label}</SectionLabel>

        <div className={headingRowClassName}>
          <h1 className={headingClassName} id={headingId}>
            {titleLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && (
                  <>
                    <br className="md:hidden" />{' '}
                  </>
                )}
                {line}
              </Fragment>
            ))}
          </h1>

          <div className="flex shrink-0 gap-x-5 sm:gap-x-3">
            <Button
              data-test={testIdPrefix ? `${testIdPrefix}-start-building` : undefined}
              theme="white-filled"
              size="new"
              to={LINKS[content.primaryAction.linkKey]}
            >
              {content.primaryAction.label}
            </Button>
            <Button
              data-test={testIdPrefix ? `${testIdPrefix}-read-docs` : undefined}
              theme="outlined"
              size="new"
              to={LINKS[content.secondaryAction.linkKey]}
            >
              {content.secondaryAction.label}
            </Button>
          </div>
        </div>

        <div className={illustrationClassName}>{illustration}</div>

        <div
          className={cn('select-none', logosClassName)}
          data-figma-node-id={logosDataFigmaNodeId}
        >
          <Logos
            className="max-w-full p-0!"
            logos={logos}
            size="md"
            staticDesktop={logosStaticDesktop}
          />
        </div>
      </Container>
    </section>
  );
};

Hero.propTypes = {
  className: PropTypes.string.isRequired,
  content: PropTypes.shape({
    label: PropTypes.string.isRequired,
    primaryAction: PropTypes.shape({
      label: PropTypes.string.isRequired,
      linkKey: PropTypes.string.isRequired,
    }).isRequired,
    secondaryAction: PropTypes.shape({
      label: PropTypes.string.isRequired,
      linkKey: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    titleLines: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dataFigmaNodeId: PropTypes.string,
  headingClassName: PropTypes.string,
  headingId: PropTypes.string.isRequired,
  headingRowClassName: PropTypes.string.isRequired,
  illustration: PropTypes.node.isRequired,
  illustrationClassName: PropTypes.string.isRequired,
  logos: PropTypes.arrayOf(PropTypes.string),
  logosClassName: PropTypes.string.isRequired,
  logosDataFigmaNodeId: PropTypes.string,
  logosStaticDesktop: PropTypes.bool,
  testIdPrefix: PropTypes.string,
};

export default Hero;
