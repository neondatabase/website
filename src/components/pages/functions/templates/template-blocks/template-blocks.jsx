import PropTypes from 'prop-types';

import CopyCommand from 'components/shared/copy-command';
import { cn } from 'utils/cn';
import {
  REGISTRY_ENV_REQUIRED_ON_DEFAULT_BRANCH,
  isInlineCodeSafe,
  registryEnvironmentRequiredLabel,
} from 'utils/function-registry';

const Operation = ({ operation, installCommand }) => {
  const command = operation.id ? `${installCommand} --operation ${operation.id}` : null;

  return (
    <li className="border-t border-gray-new-20 pt-6">
      <h3 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xl leading-snug font-medium tracking-extra-tight">
        {operation.title}
        {operation.recommended && (
          <span className="border border-green-45/40 px-1.5 py-1 font-mono text-[11px] leading-none font-medium tracking-tight text-green-45 uppercase">
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
        <CopyCommand className="mt-4" command={command} trackingLabel={`Copy ${command}`} />
      )}
    </li>
  );
};

const operationShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  route: PropTypes.string,
  recommended: PropTypes.bool,
});

Operation.propTypes = {
  installCommand: PropTypes.string.isRequired,
  operation: operationShape.isRequired,
};

export const OperationList = ({ className = null, operations, installCommand }) => (
  <ul className={cn('flex flex-col gap-6', className)}>
    {operations.map((operation) => (
      <Operation
        key={operation.id || operation.title}
        operation={operation}
        installCommand={installCommand}
      />
    ))}
  </ul>
);

OperationList.propTypes = {
  className: PropTypes.string,
  installCommand: PropTypes.string.isRequired,
  operations: PropTypes.arrayOf(operationShape).isRequired,
};

export const EnvironmentTable = ({ className = null, variables }) => (
  <div className={cn('overflow-x-auto border border-gray-new-20', className)}>
    <table className="w-full min-w-80 text-left text-sm">
      <thead className="bg-gray-new-8 font-mono text-xs tracking-tight text-gray-new-60 uppercase">
        <tr>
          <th className="px-4 py-3 font-medium">Variable</th>
          <th className="px-4 py-3 font-medium">Description</th>
          <th className="px-4 py-3 font-medium">Required</th>
        </tr>
      </thead>
      <tbody>
        {variables.map(({ name, description, required }) => (
          <tr className="border-t border-gray-new-20" key={name}>
            <td className="px-4 py-3 font-mono text-white">{name}</td>
            <td className="px-4 py-3 text-gray-new-60">{description}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-new-80">
              {registryEnvironmentRequiredLabel(required)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

EnvironmentTable.propTypes = {
  className: PropTypes.string,
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      required: PropTypes.oneOf([true, false, REGISTRY_ENV_REQUIRED_ON_DEFAULT_BRANCH]),
    })
  ).isRequired,
};
