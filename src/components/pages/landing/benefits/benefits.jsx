import PropTypes from 'prop-types';

import Container from 'components/shared/container';

const Benefits = ({ title, description, items }) => (
  <section className="benefits safe-paddings">
    <Container className="" size="960">
      <div className="mx-auto max-w-[520px] text-center">
        <h2 className="font-title text-5xl font-medium leading-none tracking-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
          {title}
        </h2>
        <p className="mt-[18px] text-lg font-light leading-snug text-gray-new-70">{description}</p>
      </div>
      <ul className="mt-12 flex flex-wrap justify-center gap-x-[72px] gap-y-10 lg:gap-8 sm:mt-8">
        {items.map(({ icon, title, description }, index) => (
          <li className="w-[272px] xl:w-[248px] lg:w-[212px] sm:w-full" key={index}>
            <img
              className="shrink-0"
              src={icon}
              alt=""
              loading="lazy"
              width={22}
              height={22}
              aria-hidden
            />
            <h3 className="mt-4 font-title text-xl font-medium leading-tight tracking-extra-tight text-white">
              {title}
            </h3>
            <p className="mt-2 text-balance font-light leading-snug text-gray-new-70 sm:text-pretty">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

Benefits.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Benefits;
