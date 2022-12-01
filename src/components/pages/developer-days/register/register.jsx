import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import SubscriptionForm from 'components/shared/subscription-form';

import LineSvg1 from './images/line-1.inline.svg';
import LineSvg2 from './images/line-2.inline.svg';

const lines = {
  day1: {
    className: 'pt-[565px]',
    svg: <LineSvg1 className="absolute bottom-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2" />,
  },
  day2: {
    className: 'pt-[640px]',
    svg: (
      <LineSvg2 className="absolute bottom-[calc(100%+0.75rem)] left-1/2 -translate-x-[calc(50%+11rem)]" />
    ),
  },
};

const Register = ({ type }) => (
  <section
    className={clsx('safe-paddings register bg-black  pb-60 text-white', lines[type].className)}
  >
    <Container className="relative z-10 flex max-w-[521px] flex-col" size="sm">
      {lines[type].svg}
      <Heading className="text-center leading-snug" tag="h2" size="sm">
        See you tomorrow with a more updates
      </Heading>
      <SubscriptionForm
        className="mt-8"
        successText="Thanks for registering!"
        submitButtonText="Register"
        size="sm"
        localStorageKey="submittedEmailDeveloperDays1Form"
        formId="e6b0b0d0-1b8b-4b9f-8f9f-8b2b2b2b2b2b" // TODO: add missing formId
      />
    </Container>
  </section>
);

Register.propTypes = {
  type: PropTypes.oneOf(Object.keys(lines)).isRequired,
};

export default Register;
