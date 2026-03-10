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
    titleClassName: 'text-[#2D8665] dark:text-green-52',
    borderClassName: 'border-[#2D8665] dark:border-green-52',
    icon: NoteIcon,
  },
  important: {
    titleClassName: 'text-[#EC6F09] dark:text-[#F99D51]',
    borderClassName: 'border-[#EC6F09] dark:border-[#F99D51]',
    icon: ImportantIcon,
  },
  tip: {
    titleClassName: 'text-[#BE8A3C] dark:text-[#FFED9C]',
    borderClassName: 'border-[#BE8A3C] dark:border-[#FFED9C]',
    icon: TipIcon,
  },
  warning: {
    titleClassName: 'text-[#E2301D] dark:text-[#FF5645]',
    borderClassName: 'border-[#E2301D] dark:border-[#FF5645]',
    icon: WarningIcon,
  },
  info: {
    titleClassName: 'text-[#426CE0] dark:text-blue-70',
    borderClassName: 'border-[#426CE0] dark:border-blue-70',
    icon: InfoIcon,
  },
  comingSoon: {
    titleClassName: 'text-[#8458D0] dark:text-[#AF93EA]',
    borderClassName: 'border-[#8458D0] dark:border-[#AF93EA]',
    icon: ComingSoonIcon,
  },
};

const textClassName =
  'admonition-text mt-2.5 text-base leading-normal tracking-extra-tight text-gray-new-20 dark:text-gray-new-85 [&_a]:rounded-sm';

const Admonition = ({ children = null, type = 'note', title = null, asHTML = false }) => {
  const typeText = type === 'comingSoon' ? 'Coming soon' : type;
  const theme = themes[type] || themes.note;
  const Icon = theme.icon;

  return (
    <div
      className={clsx(
        'admonition not-prose my-9 rounded-none border-l-2 bg-gray-new-98 py-4 pl-[1.125rem] pr-5 dark:bg-gray-new-8',
        theme.borderClassName,
        '[&_pre[data-language]]:!bg-white [&_pre[data-language]]:dark:!bg-gray-new-8 [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:!text-sm'
      )}
    >
      <div className={clsx('flex items-center gap-1', theme.titleClassName)}>
        <Icon width={16} height={16} className="shrink-0" />
        <h4 className="font-mono text-[13px] font-medium uppercase">{title || typeText}</h4>
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
