import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Form from '../form';

import azureLogo from './images/azure-logo.png';

const Azure = ({ title, description, hubspotFormId, formData, ...restProps }) => {
  const fieldGroups = formData?.formFieldGroups;
  const submitText = formData?.submitText;

  return (
    <section className="safe-paddings overflow-hidden pb-12 pt-[112px] xl:pb-10 xl:pt-[92px] lg:pt-1.5">
      <Container
        className="flex justify-between px-[26px] 2xl:px-[76px] xl:max-w-5xl xl:px-11 lg:!max-w-3xl lg:gap-10 lg:px-8 md:flex-col md:gap-8 md:px-4"
        size="1100"
      >
        <div className="w-[420px] shrink-0 pl-10 xl:w-[370px] xl:pl-0 lg:w-80 md:w-full">
          <Image
            className="-mb-2 -ml-14 animate-logo-move lg:-ml-12 lg:h-auto lg:w-[172px] md:-mb-3 md:-ml-10 md:w-40"
            width={205}
            height={154}
            src={azureLogo}
            alt=""
            quality={100}
            priority
          />
          <h1 className="font-title text-[56px] font-medium leading-[90%] tracking-extra-tight lg:text-[44px] sm:max-w-xs">
            {title}
          </h1>
          <p
            className="mx-auto mt-3.5 text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:text-base md:mt-3"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="relative w-[464px] pt-6 xl:w-[456px] xl:pt-5 lg:pt-2 md:w-full md:pt-0">
          {formData && (
            <Form
              hubspotFormId={hubspotFormId}
              fieldGroups={fieldGroups}
              submitText={submitText}
              isAzurePage
              {...restProps}
            />
          )}
        </div>
      </Container>
    </section>
  );
};

Azure.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
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
};

export default Azure;
