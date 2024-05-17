'use client';

import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Form from './form';

const Hero = ({ title, description, hubspotFormId, successMessage, items = [] }) => (
  <section className="safe-paddings pt-[152px] xl:pt-[120px] lg:pt-11 md:pt-7">
    <Container className="flex flex-col items-center" size="medium">
      <h1 className="text-center text-[72px] font-medium leading-none tracking-extra-tight 2xl:text-6xl xl:text-[56px] lg:text-[44px] md:text-[40px]">
        {title}
      </h1>
      <p
        className="mx-auto mt-4 max-w-[760px] text-center text-2xl font-light leading-snug lg:text-lg md:max-w-[85%] md:text-base [&>a]:text-green-45"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <Form hubspotFormId={hubspotFormId} successMessage={successMessage} items={items} />
    </Container>
  </section>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  hubspotFormId: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
};

export default Hero;
