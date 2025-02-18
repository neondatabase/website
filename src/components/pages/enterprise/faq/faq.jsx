import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Item from './item';

const Faq = ({ items }) => (
  <section className="faq safe-paddings mt-[200px] xl:mt-[160px] lg:mt-[126px]">
    <Container className="flex gap-x-[100px] xl:gap-x-[62px] xl:px-8 lg:flex-wrap" size="1152">
      <h2 className="shrink-0 text-balance font-title text-[52px] font-medium leading-none tracking-tighter xl:text-[48px] lg:w-full lg:text-center lg:text-[36px] md:text-[32px]">
        Your questions, <br className="lg:hidden" />
        answered
      </h2>
      <ul className="-my-4 flex w-full flex-col xl:-my-5 lg:mt-4">
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
      index: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Faq;
