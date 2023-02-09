import PropTypes from 'prop-types';

import Button from 'components/shared/button';
import Container from 'components/shared/container';

const CTA = ({ title, buttonText, buttonUrl }) => (
  <section className="safe-paddings mt-48 bg-secondary-6 py-32 text-center 3xl:mt-44 2xl:mt-40 2xl:py-28 xl:mt-32 xl:py-20 lg:mt-24 lg:py-16 md:mt-20">
    <Container size="xs">
      <h2 className="t-5xl font-bold leading-tight">{title}</h2>
      <Button className="mt-10 2xl:mt-8 xl:mt-7 md:mt-6" to={buttonUrl} size="sm" theme="primary">
        {buttonText}
      </Button>
    </Container>
  </section>
);

CTA.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
};

export default CTA;
