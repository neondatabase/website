'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import ApiResponse from 'components/pages/doc/api-response';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import { DocBodySection, DocField, getRequiredLeafPaths } from './doc-body';
import DocQuickStart from './doc-quick-start';
import { useRespState, ResponseSection } from './operation-response';

function parameterToNode(param) {
  return {
    key: param.name,
    type: param.type ?? 'string',
    required: !!param.required,
    value:
      param.default !== undefined && param.default !== null ? String(param.default) : undefined,
    details:
      param.description || param.descriptionHtml
        ? {
            description: param.description ?? null,
            descriptionHtml: param.descriptionHtml ?? null,
          }
        : null,
  };
}

const ParametersSection = ({ parameters }) => (
  <section className="mt-9">
    <h2
      id="parameters"
      className="mb-4 scroll-mt-20 text-base leading-tight font-semibold tracking-tight"
    >
      Parameters
    </h2>
    <div className="rounded-xl border border-gray-new-90 px-4 dark:border-gray-new-20">
      {parameters.map((param) => (
        <DocField key={param.name} node={parameterToNode(param)} path={param.name} />
      ))}
    </div>
  </section>
);

ParametersSection.propTypes = {
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
      default: PropTypes.any,
      description: PropTypes.string,
      descriptionHtml: PropTypes.string,
    })
  ).isRequired,
};

const OperationDoc = ({ operation, bodyTree, respTree }) => {
  const resp = useRespState();
  const { handleCopy } = useCopyToClipboard(1800);
  const [copiedId, setCopiedId] = useState(null);
  const clearCopiedTimer = useRef(null);
  const requiredLeafCount = getRequiredLeafPaths(bodyTree).length;

  useEffect(
    () => () => {
      if (clearCopiedTimer.current) clearTimeout(clearCopiedTimer.current);
    },
    []
  );

  const copy = useCallback(
    (id, text) => {
      handleCopy(text);
      setCopiedId(id);
      if (clearCopiedTimer.current) clearTimeout(clearCopiedTimer.current);
      clearCopiedTimer.current = setTimeout(() => setCopiedId(null), 1800);
    },
    [handleCopy]
  );

  return (
    <>
      <DocQuickStart operation={operation} requiredLeafCount={requiredLeafCount} />

      {operation.parameters?.length > 0 && <ParametersSection parameters={operation.parameters} />}

      {bodyTree.length > 0 && (
        <DocBodySection bodyTree={bodyTree} requestBody={operation.requestBody} />
      )}

      {operation.response && (
        <ResponseSection
          operation={operation}
          respTree={respTree}
          current="api"
          state={resp}
          copy={copy}
          copiedId={copiedId}
        />
      )}

      {operation.errors?.length > 0 && (
        <section className="mt-8">
          <h2
            id="errors"
            className="mb-3 scroll-mt-20 text-base leading-tight font-semibold tracking-tight"
          >
            Errors
          </h2>
          <div>
            {operation.errors.map((err) => (
              <ApiResponse
                key={err.status}
                status={err.status}
                description={err.description}
                descriptionHtml={err.descriptionHtml}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

OperationDoc.propTypes = {
  operation: PropTypes.shape({
    requestBody: PropTypes.shape({}),
    response: PropTypes.shape({}),
    parameters: PropTypes.arrayOf(PropTypes.shape({})),
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        description: PropTypes.string,
        descriptionHtml: PropTypes.string,
      })
    ),
  }).isRequired,
  bodyTree: PropTypes.array.isRequired,
  respTree: PropTypes.array.isRequired,
};

export default OperationDoc;
