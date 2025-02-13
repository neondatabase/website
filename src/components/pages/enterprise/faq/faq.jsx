import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Item from './item';

const Faq = ({ items }) => (
  <section className="faq safe-paddings mt-[200px]">
    <Container className="flex gap-x-[100px]" size="1152">
      <h2 className="shrink-0 text-balance font-title text-[52px] font-medium leading-none tracking-tighter">
        Your questions, <br />
        answered
      </h2>
      <ul className="-my-4 flex flex-col">
        {items.map((item, index) => (
          <Item {...item} key={index} index={index} />
        ))}
      </ul>
    </Container>
  </section>
);

Faq.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
      id: PropTypes.string,
      linkText: PropTypes.string,
      linkUrl: PropTypes.string,
      linkLabel: PropTypes.string,
      initialState: PropTypes.string,
      index: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Faq;
