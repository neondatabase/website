import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

const Features = ({ title, items }) => (
  <section className="features safe-paddings mt-[200px] xl:mt-[160px] lg:mt-[127px] md:mt-[95px]">
    <Container className="xl:!px-8 md:!px-5" size="1152">
      <div className="flex gap-10 rounded-2xl lg:flex-wrap lg:gap-12 md:gap-10">
        <h2 className="min-w-[360px] font-title text-[44px] font-medium leading-none tracking-extra-tight xl:min-w-[312px] xl:text-4xl lg:max-w-[440px] lg:text-[32px] md:text-[28px]">
          {title}
        </h2>
        <ul className="grid grid-cols-2 gap-x-[26px] gap-y-11 xl:gap-x-[30px] lg:gap-10 md:grid-cols-1 md:gap-[33px]">
          {items.map(({ icon, title, description, linkText, linkUrl }, index) => (
            <li className="flex flex-col" key={index}>
              <div className="flex items-center gap-x-2">
                <Image className="shrink-0" src={icon} width={22} height={22} alt="" />
                <h3 className="font-title text-[22px] font-medium leading-tight -tracking-[0.02em] lg:text-lg">
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

Features.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Features;
