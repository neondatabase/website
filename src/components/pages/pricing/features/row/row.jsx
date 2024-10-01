import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Tooltip from 'components/shared/tooltip';

const Row = ({ title, items, image, imagePosition = 'left' }) => (
  <div className="grid w-full grid-cols-10 items-center gap-x-10 xl:items-end xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div
      className={clsx(
        'col-span-5 lg:col-span-full',
        imagePosition === 'right' &&
          'order-1 ml-10 justify-self-start 2xl:ml-8 lg:order-none lg:ml-0 lg:justify-self-stretch'
      )}
    >
      <h3 className="text-4xl font-medium leading-tight tracking-tight xl:text-[32px] lg:text-[28px] md:text-[22px]">
        {title}
      </h3>
      <ul className="mt-6 flex flex-col gap-y-6">
        {items.map(({ icon, title, text }) => (
          <li className="flex items-start gap-x-3" key={title}>
            <Image className="shrink-0" src={icon} width={24} height={24} alt="" />
            <div>
              <h4 className="text-[22px] font-medium leading-none tracking-tight">{title}</h4>
              <p
                className="mt-2.5 text-base font-light text-gray-new-70"
                dangerouslySetInnerHTML={{ __html: text }}
              />
              <Tooltip id="cu-icon" arrowColor="#242628" />
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div
      className={clsx(
        'col-span-5 lg:col-span-full lg:flex lg:justify-center',
        imagePosition === 'left' && 'xl:ml-8 lg:ml-0'
      )}
    >
      <Image
        className={clsx('rounded-lg', imagePosition === 'left' && 'ml-10 2xl:ml-8 xl:ml-0')}
        width={590}
        height={332}
        src={image}
        quality={90}
        alt=""
      />
    </div>
  </div>
);

Row.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
  image: PropTypes.string.isRequired,
  imagePosition: PropTypes.oneOf(['left', 'right']),
};

export default Row;
