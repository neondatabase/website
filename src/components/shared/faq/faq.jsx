import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Item from './item';

const Faq = ({ items }) => (
  <section className="faq safe-paddings mt-[200px] lg:mt-[168px] md:mt-28">
    <Container className="flex gap-x-24 xl:gap-x-16 xl:px-8 lg:flex-wrap md:px-5" size="1152">
      <h2 className="w-80 shrink-0 text-balance font-title text-[52px] font-medium leading-none tracking-tighter xl:text-5xl lg:w-full lg:text-center md:text-4xl">
        Your questions, <br className="lg:hidden" />
        answered
      </h2>
      <ul className="-my-4 flex w-full flex-col lg:mt-12 md:mt-5">
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
      initialState: PropTypes.string,
    })
  ).isRequired,
};

export default Faq;
