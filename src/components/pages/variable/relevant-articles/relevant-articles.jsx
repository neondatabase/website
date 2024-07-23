import { PropTypes } from 'prop-types';

import Container from 'components/shared/container';

import Slider from './slider';

const RelevantArticles = ({ articles }) => (
  <section className="viewed-articles mt-[72px] xl:mt-16 lg:mt-14 md:mt-11">
    <Container size="1220" className="md:px-5">
      <Slider articles={articles} />
    </Container>
  </section>
);

RelevantArticles.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RelevantArticles;
