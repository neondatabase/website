import PropTypes from 'prop-types';

import Link from 'components/shared/link';

const TemplatesList = ({ templates }) => (
  <ul className="col-span-4 max-w-[703px] divide-y divide-gray-new-15/80">
    {templates.map(({ title, description, url }) => (
      <li className="pb-6 pt-6 first:pt-0 last:pb-0" key={url}>
        <Link className="group flex items-center justify-between" to={url}>
          <div>
            <h2 className="text-lg font-semibold leading-tight tracking-extra-tight transition-colors duration-200 group-hover:text-primary-1">
              {title}
            </h2>
            <p className="mt-1.5 max-w-[480px] leading-snug tracking-extra-tight dark:text-gray-new-50">
              {description}
            </p>
          </div>
          <button
            className="shrink whitespace-nowrap rounded-full border px-3 py-2 text-[13px] font-medium leading-none tracking-extra-tight transition-colors duration-200 dark:border-gray-new-30 dark:text-gray-new-80 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black-new"
            type="button"
          >
            Use Template
          </button>
        </Link>
      </li>
    ))}
  </ul>
);

TemplatesList.propTypes = {
  templates: PropTypes.array.isRequired,
};

export default TemplatesList;
