import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import { cn } from 'utils/cn';

import Item from './item';

const variants = {
  default: {
    section: 'mt-[200px] xl:mt-[184px] lg:mt-40 md:mt-[104px]',
    container: 'flex gap-x-16 xl:gap-x-8 lg:flex-col lg:gap-y-10 md:gap-y-5',
    title: cn(
      'w-80 shrink-0 text-[44px] leading-dense tracking-[-0.05em] text-balance',
      'xl:w-[288px] xl:text-[36px] lg:w-full md:text-[28px]'
    ),
    items: null,
  },
  light: {
    section:
      'mt-0! bg-[#E4F1EB] pt-40 pb-35 text-black-pure xl:pt-32 xl:pb-28 lg:pt-24 lg:pb-19 md:pt-20 md:pb-17',
    container: 'flex max-w-352 gap-x-31 xl:gap-x-12 lg:flex-col lg:gap-y-10 md:gap-y-5',
    title: cn(
      'w-105 shrink-0 text-[5rem] leading-none tracking-tighter text-balance',
      'xl:w-84 xl:text-[3rem] lg:w-full md:text-[2.5rem]'
    ),
    items: '-mt-4 lg:mt-0',
  },
};

const DEFAULT_TITLE_LINES = ['Your questions,', 'answered'];

const Faq = ({ items, titleLines = DEFAULT_TITLE_LINES, variant = 'default', className }) => {
  const resolvedVariant = variants[variant] ? variant : 'default';
  const styles = variants[resolvedVariant];

  return (
    <section className={cn('faq safe-paddings', styles.section, className)} id="faq">
      <Container className={styles.container} size="1152">
        <h2 className={styles.title}>
          {titleLines[0]} <br className="lg:hidden" />
          {titleLines[1]}
        </h2>
        <ul className={cn('flex w-full flex-col', styles.items)}>
          {items.map((item, index) => (
            <Item {...item} key={item.question} index={index} variant={resolvedVariant} />
          ))}
        </ul>
      </Container>
    </section>
  );
};

Faq.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
      id: PropTypes.string,
      initialState: PropTypes.oneOf(['open', 'closed']),
    })
  ).isRequired,
  titleLines: PropTypes.arrayOf(PropTypes.string),
  variant: PropTypes.oneOf(Object.keys(variants)),
  className: PropTypes.string,
};

export default Faq;
