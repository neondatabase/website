import PropTypes from 'prop-types';
import { Tweet } from 'react-tweet';

const EmbedTweet = ({ id }) => <Tweet id={id} />;

EmbedTweet.propTypes = {
  id: PropTypes.number.isRequired,
};

export default EmbedTweet;
