import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';

import Item from './item';

const Faq = ({ items, className }) => (
  <section
    className={clsx('faq safe-paddings mt-[200px] xl:mt-[184px] lg:mt-40 md:mt-[104px]', className)}
    id="faq"
  >
    <Container className="flex gap-x-16 xl:gap-x-8 lg:flex-col lg:gap-y-10 md:gap-y-5" size="1152">
      <h2
        className={clsx(
          'w-80 shrink-0 text-balance text-[44px] leading-dense tracking-[-0.05em]',
          'xl:w-[288px] xl:text-[36px] lg:w-full md:text-[28px]'
        )}
      >
        Your questions, <br className="lg:hidden" />
        answered
      </h2>
      <ul className="flex w-full flex-col">
        {items.map((item, index) => (
          <Item {...item} key={item.question} index={index} />
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
      initialState: PropTypes.oneOf(['open', 'closed']),
    })
  ).isRequired,
  className: PropTypes.string,
};

export default Faq;
