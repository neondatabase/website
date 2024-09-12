import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';

const TemplatesList = ({ className, templates }) => (
  <ul className={clsx('divide-y divide-gray-new-80/80 dark:divide-gray-new-15/80', className)}>
    {templates.map(({ name, description, slug, githubUrl }) => (
      <li className="pb-6 pt-6 first:pt-0 last:pb-0" key={githubUrl}>
        <Link
          className="group flex items-center justify-between md:flex-col md:items-start md:gap-y-3"
          to={`/templates/${slug}`}
        >
          <div>
            <h2 className="text-lg font-semibold leading-tight tracking-extra-tight transition-colors duration-200 group-hover:text-secondary-8 dark:group-hover:text-primary-1">
              {name}
            </h2>
            <p className="mt-1.5 max-w-[480px] leading-snug tracking-extra-tight text-gray-new-40 dark:text-gray-new-50">
              {description}
            </p>
          </div>
          <div
            className="inline-flex h-7 shrink items-center justify-center whitespace-nowrap rounded-full border border-gray-new-70 px-3 text-[13px] font-medium leading-none tracking-tighter text-gray-new-20 transition-colors duration-200
              group-hover:border-gray-new-8 group-hover:bg-gray-new-8 group-hover:text-white
              dark:border-gray-new-30 dark:text-gray-new-80
              dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black-new"
          >
            Use Template
          </div>
        </Link>
      </li>
    ))}
  </ul>
);

TemplatesList.propTypes = {
  className: PropTypes.string,
  templates: PropTypes.array.isRequired,
};

export default TemplatesList;
