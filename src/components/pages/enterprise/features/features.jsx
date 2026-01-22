import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';

const Features = ({ title, items }) => (
  <section className="features safe-paddings mt-[200px] xl:mt-40 lg:mt-32 md:mt-24">
    <Container className="xl:!px-8 md:!px-5" size="1152">
      <div className="flex gap-10 rounded-2xl lg:flex-wrap lg:gap-12 md:gap-10">
        <h2 className="min-w-[360px] font-title text-[44px] font-medium leading-none tracking-extra-tight xl:min-w-[312px] xl:text-4xl lg:max-w-[440px] lg:text-[32px] md:text-[28px]">
          {title}
        </h2>
        <ul className="grid grid-cols-2 gap-x-[26px] gap-y-11 xl:gap-x-[30px] lg:gap-10 md:grid-cols-1 md:gap-8">
          {items.map(({ icon, title, description, url }, index) => (
            <li className="flex flex-col" key={index}>
              <div className="flex items-center gap-x-2">
                <Image
                  className="shrink-0"
                  src={icon}
                  width={22}
                  height={22}
                  alt=""
                  loading="lazy"
                />
                <h3 className="text-[22px] font-medium leading-tight tracking-extra-tight lg:text-lg">
                  {title}
                </h3>
              </div>
              <p className="mt-2 font-light leading-snug text-gray-new-70">{description}</p>
              <Link
                className="mt-4 !text-[15px] font-medium leading-none tracking-tight"
                theme="white"
                size="xs"
                to={url}
                rel="noopener noreferrer"
                target="_blank"
                withArrow
              >
                Learn more <span className="sr-only">about ${title}</span>
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
      icon: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Features;
