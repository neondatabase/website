import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Form from '../form';

import Details from './details';

const themes = {
  hero: {
    className: 'hero pt-[152px] xl:pt-[120px] lg:pt-11 md:pt-7',
    titleClassName: 'text-[72px] 2xl:text-6xl xl:text-[56px] lg:text-[44px] md:text-[40px]',
  },
  'form-copy': {
    className: 'form-copy pb-12 pt-[136px] xl:pt-[120px] lg:pb-8 lg:pt-20 md:pt-16',
    titleClassName: 'text-[56px] xl:text-5xl lg:text-4xl md:text-[32px]',
  },
};

const Hero = ({
  theme = 'hero',
  title,
  description,
  formTitle,
  hubspotFormId,
  formData,
  detailsLabel,
  detailsTitle,
  detailsDescription,
  isAzurePage,
  ...restProps
}) => {
  const fieldGroups = formData?.formFieldGroups;
  const submitText = formData?.submitText;
  let simpleField = null;

  if (fieldGroups && fieldGroups.length === 1 && fieldGroups[0].fields.length === 1) {
    simpleField = fieldGroups[0].fields[0];
  }

  const hasDetails = detailsTitle && detailsDescription;

  return (
    <section className={clsx('safe-paddings overflow-hidden', themes[theme].className)}>
      <Container className="flex flex-col items-center" size="medium">
        <h1
          className={clsx(
            'text-center font-title font-medium leading-none tracking-extra-tight',
            themes[theme].titleClassName
          )}
        >
          {title}
        </h1>
        <p
          className="mx-auto mt-4 max-w-3xl text-center text-xl font-light leading-snug tracking-tight lg:text-lg md:max-w-[85%] md:text-base xs:max-w-full [&>a]:text-green-45"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {simpleField ? (
          <div className="mx-auto my-[75px] w-[504px] max-w-full md:my-16 md:max-w-[90%] sm:my-14">
            <Form
              hubspotFormId={hubspotFormId}
              fieldGroups={fieldGroups}
              simpleField={simpleField}
              submitText={submitText}
              detailsTitle={detailsTitle}
              detailsDescription={detailsDescription}
              {...restProps}
            />
          </div>
        ) : (
          (formData || hasDetails) && (
            <div
              className={clsx(
                'flex w-full justify-center lg:items-center',
                hasDetails
                  ? 'my-[120px] gap-[86px] xl:gap-10 lg:mx-auto lg:my-20 lg:flex-col sm:my-14'
                  : 'my-[88px] lg:my-16 sm:my-14'
              )}
            >
              <div className={clsx('max-w-[630px]', hasDetails ? 'w-1/2 lg:w-full' : 'w-full')}>
                {formData && (
                  <Form
                    title={formTitle}
                    hubspotFormId={hubspotFormId}
                    fieldGroups={fieldGroups}
                    greenMode={!hasDetails}
                    submitText={submitText}
                    detailsTitle={detailsTitle}
                    detailsDescription={detailsDescription}
                    {...restProps}
                  />
                )}
              </div>
              {hasDetails && (
                <Details
                  label={detailsLabel}
                  title={detailsTitle}
                  description={detailsDescription}
                />
              )}
            </div>
          )
        )}
      </Container>
    </section>
  );
};

Hero.propTypes = {
  theme: PropTypes.oneOf(Object.keys(themes)),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  formTitle: PropTypes.string,
  hubspotFormId: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    formFieldGroups: PropTypes.arrayOf({
      fieldGroup: PropTypes.shape({
        fields: PropTypes.arrayOf({
          name: PropTypes.string,
          label: PropTypes.string,
          placeholder: PropTypes.string,
          fieldType: PropTypes.string,
        }),
      }),
    }),
    submitText: PropTypes.string,
  }).isRequired,
  detailsLabel: PropTypes.string,
  detailsTitle: PropTypes.string,
  detailsDescription: PropTypes.string,
  isAzurePage: PropTypes.bool,
};

export default Hero;
