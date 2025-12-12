import PropTypes from 'prop-types';

/**
 * A wrapper component for code blocks that adds an optional label above the code.
 * Commonly used to indicate file paths, terminal commands, or language identifiers.
 *
 * @example
 * <CodeWithLabel label="src/app.ts">
 *   ```typescript
 *   const app = express();
 *   ```
 * </CodeWithLabel>
 */
const CodeWithLabel = ({ label, children, className }) => (
  <div className={className}>
    {label && (
      <div className="mb-2 inline-block rounded border border-gray-new-70 bg-gray-new-94 px-2 py-0.5 text-[11px] font-medium text-gray-new-30 dark:border-gray-new-30 dark:bg-gray-new-15 dark:text-gray-new-60">
        {label}
      </div>
    )}
    <div className="[&>*:first-child]:mt-0">{children}</div>
  </div>
);

CodeWithLabel.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default CodeWithLabel;
