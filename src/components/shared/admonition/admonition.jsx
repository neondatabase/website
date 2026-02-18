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
    titleClassName: 'text-[#648DFF] dark:text-[#648DFF]',
    borderClassName: 'border-[#648DFF] dark:border-[#648DFF]',
    icon: NoteIcon,
  },
  important: {
    titleClassName: 'text-[#EB832D] dark:text-[#F99D51]',
    borderClassName: 'border-[#EB832D] dark:border-[#F99D51]',
    icon: ImportantIcon,
  },
  tip: {
    titleClassName: 'text-[#39A57D] dark:text-[#34D59A]',
    borderClassName: 'border-[#39A57D] dark:border-[#34D59A]',
    icon: TipIcon,
  },
  warning: {
    titleClassName: 'text-[#CA2716] dark:text-[#FF5645]',
    borderClassName: 'border-[#CA2716] dark:border-[#FF5645]',
    icon: WarningIcon,
  },
  info: {
    titleClassName: 'text-gray-new-50 dark:text-gray-5',
    borderClassName: 'border-gray-new-50 dark:border-gray-5',
    icon: InfoIcon,
  },
  comingSoon: {
    titleClassName: 'text-[#52A5E0] dark:text-[#99D5FF]',
    borderClassName: 'border-[#52A5E0] dark:border-[#99D5FF]',
    icon: ComingSoonIcon,
  },
};

const textClassName = 'admonition-text mt-2.5 text-base [&_a]:rounded-sm';

const Admonition = ({ children = null, type = 'note', title = null, asHTML = false }) => {
  const typeText = type === 'comingSoon' ? 'Coming soon' : type;
  const theme = themes[type] || themes.note;
  const Icon = theme.icon;

  return (
    <div
      className={clsx(
        'admonition not-prose mt-5 rounded-none border-l-2 bg-gray-new-98 px-5 py-4 dark:bg-gray-new-8',
        theme.borderClassName,
        '[&_pre[data-language]]:!bg-white [&_pre[data-language]]:dark:!bg-gray-new-8 [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:!text-sm'
      )}
    >
      <div className={clsx('flex items-center gap-1', theme.titleClassName)}>
        <Icon width={16} height={16} className="shrink-0" />
        <h4>{title || typeText}</h4>
      </div>
      {asHTML ? (
        <div className={textClassName} dangerouslySetInnerHTML={{ __html: children }} />
      ) : (
        <div className={textClassName}>{children}</div>
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
