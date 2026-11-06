import PropTypes from 'prop-types';

import ClaudeMark from 'icons/docs/providers/claude.inline.svg';
import CursorMark from 'icons/docs/providers/cursor.inline.svg';
import OpenAiMark from 'icons/docs/providers/openai.inline.svg';
import { cn } from 'utils/cn';

// Cluster of coding-agent vendor marks shown on the agent-prompt copy controls,
// so a control explains itself ("paste this into one of these"). Order is fixed:
// Claude, OpenAI, Cursor.
//
// Colors: all three marks are monochrome `currentColor` assets, so they take the
// cluster's text color and stay consistent with each other and with the control's
// label. The default is black on light / white on dark; pass `className` with a
// different text color when the cluster sits on a surface that inverts (for
// example a dark pill, where all three marks render white).
//
// The whole control is a single click target, so the cluster is decorative:
// it is hidden from assistive tech and the control carries its own label.
const DEFAULT_MARK_SIZE = 14;

const ProviderMarks = ({ size = DEFAULT_MARK_SIZE, className = null }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-[5px] text-black-new dark:text-white',
      className
    )}
    aria-hidden="true"
  >
    <ClaudeMark width={size} height={size} />
    <OpenAiMark width={size} height={size} />
    <CursorMark width={size} height={size} />
  </span>
);

ProviderMarks.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export default ProviderMarks;
