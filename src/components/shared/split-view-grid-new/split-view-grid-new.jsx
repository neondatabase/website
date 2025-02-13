import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

const SplitViewGridNew = ({ className = null, title, items }) => (
  <section className={clsx('split-view-grid-new safe-paddings', className)}>
    <Container className="" size="1152">
      <div className="flex gap-x-10 rounded-2xl">
        <h2 className="min-w-[360px] font-title text-[44px] font-medium leading-none tracking-extra-tight">
          {title}
        </h2>
        <ul className="grid grid-cols-2 gap-x-[26px] gap-y-11">
          {items.map(({ icon, title, description, linkText, linkUrl }, index) => (
            <li className="flex flex-col" key={index}>
              <div className="flex gap-x-2">
                <Image
                  className="mt-0.5 shrink-0"
                  src={icon}
                  alt=""
                  loading="lazy"
                  width={22}
                  height={22}
                  aria-hidden
                />
                <h3 className="font-title text-[22px] font-medium leading-tight -tracking-[0.03em] xl:text-xl">
                  {title}
                </h3>
              </div>
              <p className="mt-2 font-light leading-snug text-gray-new-60">{description}</p>
              <Link
                className="mt-4 !text-[15px] font-medium leading-none tracking-tight"
                theme="white"
                size="xs"
                to={linkUrl}
                rel="noopener noreferrer"
                target="_blank"
                withArrow
              >
                {linkText}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

SplitViewGridNew.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SplitViewGridNew;
