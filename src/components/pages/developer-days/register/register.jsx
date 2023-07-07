import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import SubscriptionForm from 'components/shared/subscription-form';
import { HUBSPOT_DEVELOPER_DAYS_1_FORM_ID } from 'constants/forms';
import StraightLineSvg from 'images/pages/developer-days/straight-line.inline.svg';

import LineSvg1 from './images/line-1.inline.svg';
import LineSvg2 from './images/line-2.inline.svg';

const lines = {
  day1: {
    className: 'pt-[610px]',
    svg: (
      <LineSvg1 className="absolute bottom-[calc(100%+0.75rem)] left-1/2 -translate-x-1/2 xl:hidden" />
    ),
  },
  day2: {
    className: 'pt-[640px] 2xl:pt-[670px]',
    svg: (
      <LineSvg2 className="absolute bottom-[calc(100%+0.75rem)] left-1/2 -translate-x-[calc(50%+11rem)] xl:hidden" />
    ),
  },
};

const Register = ({ type }) => (
  <section
    className={clsx(
      'safe-paddings register bg-black pb-60 text-white xl:pb-40 xl:pt-[408px] md:pt-[364px] sm:pb-20 sm:pt-[190px]',
      lines[type].className
    )}
  >
    <Container className="relative z-10 flex !max-w-[521px] flex-col" size="sm">
      {lines[type].svg}

      <StraightLineSvg className="absolute bottom-[calc(100%+1rem)] left-1/2 hidden h-auto w-8 -translate-x-1/2 xl:block lg:w-[30px] md:w-7 sm:w-3.5" />

      <Heading className="text-center leading-snug" tag="h2" size="sm">
        Register for event updates
      </Heading>
      <SubscriptionForm
        className="mt-8"
        successText="Thanks for registering!"
        submitButtonText="Register"
        size="sm"
        localStorageKey="submittedEmailDeveloperDays1Form"
        formId={HUBSPOT_DEVELOPER_DAYS_1_FORM_ID}
      />
    </Container>
  </section>
);

Register.propTypes = {
  type: PropTypes.oneOf(Object.keys(lines)).isRequired,
};

export default Register;
