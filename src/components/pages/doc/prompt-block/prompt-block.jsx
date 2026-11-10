import fs from 'fs/promises';
import path from 'path';

import PropTypes from 'prop-types';

import PromptBlockCopyButton from './prompt-block-copy-button';
import toPromptGroups from './prompt-groups';

// A prompt file from public/prompts/, read on the server and shown in full: one
// white box per group (blank lines in the file separate groups), an optional grey
// label above each box, and one button that copies the file as written.
const PromptBlock = async ({ src, labels = [] }) => {
  const prompt = (await fs.readFile(path.join(process.cwd(), 'public', src), 'utf8')).trim();

  return (
    <div className="not-prose my-8 rounded-[10px] border border-gray-new-90 bg-gray-new-95 p-4 dark:border-gray-new-15 dark:bg-gray-new-10">
      {toPromptGroups(prompt).map((lines, index) => (
        <div key={index} className={index > 0 ? 'mt-4' : undefined}>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
            <p className="m-0 text-[15px] leading-relaxed text-gray-new-30 dark:text-gray-new-70">
              {labels[index]}
            </p>
            {index === 0 && <PromptBlockCopyButton text={prompt} />}
          </div>
          <div className="flex flex-col gap-1.5 rounded-md border border-gray-new-85 bg-white px-3 py-2.5 dark:border-gray-new-20 dark:bg-gray-new-8">
            {lines.map((line, lineIndex) => (
              <span
                key={lineIndex}
                className="block font-mono text-[13px] leading-[1.55] break-words text-black-pure dark:text-gray-new-94"
              >
                {line.replace(/^- /, '')}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

PromptBlock.propTypes = {
  src: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
};

export default PromptBlock;
