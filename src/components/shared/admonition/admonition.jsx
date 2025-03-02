import clsx from 'clsx';
import PropTypes from 'prop-types';

import ComingSoonIcon from 'icons/docs/admonition/coming-soon.inline.svg';
import ImportantIcon from 'icons/docs/admonition/important.inline.svg';
import InfoIcon from 'icons/docs/admonition/info.inline.svg';
import NoteIcon from 'icons/docs/admonition/note.inline.svg';
import TipIcon from 'icons/docs/admonition/tip.inline.svg';
import WarningIcon from 'icons/docs/admonition/warning.inline.svg';

const themes = {
  note: {
    titleClassName: 'text-[#2982FF] dark:text-[#4C97FF]',
    borderClassName: 'border-[#2982FF] dark:border-[#4C97FF]',
    icon: NoteIcon,
  },
  important: {
    titleClassName: 'text-[#F9A806] dark:text-[#FFBB33]',
    borderClassName: 'border-[#F9A806] dark:border-[#FFBB33]',
    icon: ImportantIcon,
  },
  tip: {
    titleClassName: 'text-primary-2',
    borderClassName: 'border-primary-2',
    icon: TipIcon,
  },
  warning: {
    titleClassName: 'text-[#DA0A51] dark:text-secondary-1',
    borderClassName: 'border-[#DA0A51] dark:border-secondary-1',
    icon: WarningIcon,
  },
  info: {
    titleClassName: 'text-gray-new-50 dark:text-gray-5',
    borderClassName: 'border-gray-new-50 dark:border-gray-5',
    icon: InfoIcon,
  },
  comingSoon: {
    titleClassName: 'text-[#8873EF] dark:text-secondary-5',
    borderClassName: 'border-[#8873EF] dark:border-secondary-5',
    icon: ComingSoonIcon,
  },
};

const Admonition = ({ children = null, type = 'note', title = null, asHTML = false }) => {
  const typeText = type == 'comingSoon' ? 'Coming soon' : type;
  const theme = themes[type] || themes.note;
  const Icon = theme.icon;

  return (
    <div
      className={clsx(
        'admonition not-prose mt-5 rounded-[1px] border-l-4 bg-gray-new-98 px-5 py-4 dark:bg-gray-new-8',
        theme.borderClassName,
        '[&_pre[data-language]]:!bg-white [&_pre[data-language]]:dark:!bg-gray-new-8 [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:!text-sm'
      )}
    >
      <div className={clsx('flex items-center gap-1.5', theme.titleClassName)}>
        <Icon width={14} height={14} />
        <h4 className="text-[13px] font-semibold uppercase leading-none tracking-normal">
          {title || typeText}
        </h4>
      </div>
      {asHTML ? (
        <div
          className="admonition-text mt-2.5 text-base"
          dangerouslySetInnerHTML={{ __html: children }}
        />
      ) : (
        <div className="admonition-text mt-2.5 text-base">{children}</div>
      )}
    </div>
  );
};

Admonition.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(Object.keys(themes)),
  title: PropTypes.string,
  asHTML: PropTypes.bool,
};

export default Admonition;
