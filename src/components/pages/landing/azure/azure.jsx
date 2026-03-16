import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Form from '../form';

import azureLogo from './images/azure-logo.png';

const Azure = ({ title, description, hubspotFormId, formData, ...restProps }) => {
  const fieldGroups = formData?.formFieldGroups;
  const submitText = formData?.submitText;

  return (
    <section className="overflow-hidden pt-[112px] safe-paddings pb-12 lg:pt-1.5 xl:pt-[92px] xl:pb-10">
      <Container
        className="flex justify-between px-[26px] md:flex-col md:gap-8 md:px-4 lg:max-w-3xl! lg:gap-10 lg:px-8 xl:max-w-5xl xl:px-11 2xl:px-[76px]"
        size="1100"
      >
        <div className="w-[420px] shrink-0 pl-10 md:w-full lg:w-80 xl:w-[370px] xl:pl-0">
          <Image
            className="-mb-2 -ml-14 animate-logo-move md:-mb-3 md:-ml-10 md:w-40 lg:-ml-12 lg:h-auto lg:w-[172px]"
            width={205}
            height={154}
            src={azureLogo}
            alt=""
            quality={100}
            priority
          />
          <h1 className="font-title text-[56px] leading-[90%] font-medium tracking-extra-tight sm:max-w-xs lg:text-[44px]">
            {title}
          </h1>
          <p
            className="mx-auto mt-3.5 text-lg leading-snug tracking-extra-tight text-gray-new-70 md:mt-3 lg:text-base"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="relative w-[464px] pt-6 md:w-full md:pt-0 lg:pt-2 xl:w-[456px] xl:pt-5">
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
