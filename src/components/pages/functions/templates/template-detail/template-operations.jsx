import PropTypes from 'prop-types';

import { isInlineCodeSafe } from 'utils/function-registry';

import CodeSnippet from './code-snippet';

// Keep the client's structured operation UI alongside the shared docs renderer.
const TemplateOperations = ({ operations, installCommand }) => (
  <section className="mt-8" aria-labelledby="template-operations-heading">
    <h2
      id="template-operations-heading"
      className="text-2xl leading-[1.3] font-normal tracking-tighter"
    >
      What this function exposes
    </h2>
    <p className="mt-4 text-base leading-normal tracking-extra-tight text-gray-new-80">
      After you deploy, call these paths on the function URL.
    </p>
    <ul className="mt-6 flex flex-col gap-6">
      {operations.map((operation) => {
        const command = isInlineCodeSafe(operation.id)
          ? `${installCommand} --operation ${operation.id}`
          : null;

        return (
          <li key={operation.id || operation.title} className="border-t border-gray-new-20 pt-6">
            <h3 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xl leading-snug font-medium tracking-extra-tight">
              {operation.title}
              {operation.recommended && (
                <span className="bg-[#00e599]/12 px-2 py-1 font-mono text-[11px] leading-[14px] font-medium tracking-[0.04em] whitespace-nowrap text-[#00e599] uppercase">
                  Recommended
                </span>
              )}
            </h3>
            <p className="mt-2 text-base leading-normal tracking-extra-tight text-gray-new-60">
              {operation.description}
            </p>
            {isInlineCodeSafe(operation.route) && (
              <p className="mt-2 font-mono text-sm text-gray-new-80">{operation.route}</p>
            )}
            {command && (
              <CodeSnippet className="mt-4" command={command} trackingLabel={`Copy ${command}`} />
            )}
          </li>
        );
      })}
    </ul>
  </section>
);

TemplateOperations.propTypes = {
  installCommand: PropTypes.string.isRequired,
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      route: PropTypes.string,
      recommended: PropTypes.bool,
    })
  ).isRequired,
};

export default TemplateOperations;
