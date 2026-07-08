'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import ApiResponse from 'components/pages/doc/api-response';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';
import { cn } from 'utils/cn';

import { DocBodySection, DocField, getRequiredLeafPaths } from './doc-body';
import DocQuickStart from './doc-quick-start';
import { useRespState, ResponseSection } from './operation-response';
import { API_OPERATION_H2_WITH_MARGIN_CLASS_NAME } from './operation-shared';

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
    <h2 id="parameters" className={API_OPERATION_H2_WITH_MARGIN_CLASS_NAME}>
      Parameters
    </h2>
    <div className="border border-gray-new-90 px-4 dark:border-gray-new-20">
      {parameters.map((param) => (
        <DocField key={param.name} node={parameterToNode(param)} path={param.name} />
      ))}
    </div>
  </section>
);

function isGeneralError(err) {
  return (
    String(err.status) === 'default' &&
    (err.description?.trim().startsWith('General Error.') ||
      err.descriptionHtml?.trim().startsWith('<p>General Error.</p>'))
  );
}

const codeClassName =
  'rounded border border-gray-new-70 bg-transparent px-1.5 py-0.5 font-mono text-sm leading-normal font-medium text-black-pure dark:border-gray-new-30 dark:text-white';

const GeneralErrorCard = () => (
  <div className="api-response my-4 border border-gray-new-90 bg-gray-new-98 p-4 dark:border-gray-new-20 dark:bg-gray-new-10">
    <div className="mb-3 flex items-start gap-3">
      <span className={cn('mt-0.5 shrink-0', codeClassName)}>default</span>
      <div>
        <p className="text-sm font-semibold text-black-pure dark:text-white">General error</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-new-30 dark:text-gray-new-70">
          This endpoint can return the standard Neon API error response.
        </p>
      </div>
    </div>

    <div className="grid gap-3 text-sm leading-relaxed text-gray-new-40 dark:text-gray-new-70">
      <div>
        <p className="font-semibold text-black-pure dark:text-white">Response fields</p>
        <ul className="mt-1 list-disc space-y-1 pl-4">
          <li>
            <code className={codeClassName}>message</code> Required. Human-readable error message.
          </li>
          <li>
            <code className={codeClassName}>code</code> Required. Machine-readable error code.
          </li>
          <li>
            <code className={codeClassName}>request_id</code> Optional. Request identifier for
            debugging. You can provide one with the{' '}
            <code className={codeClassName}>X-Request-ID</code> header.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold text-black-pure dark:text-white">Retry guidance</p>
        <p className="mt-1">
          If no response is returned, the request may still have reached the server. This is why
          retry safety depends on the method and status code.
        </p>
        <p className="mt-1">
          Idempotent methods (<code>GET</code>, <code>HEAD</code>, <code>OPTIONS</code>) are
          generally safe to retry after a network error or timeout. Non-idempotent methods (
          <code>POST</code>, <code>PATCH</code>, <code>DELETE</code>, <code>PUT</code>) can change
          state, so avoid automatic retries unless your workflow can tolerate duplicate effects.
        </p>
        <p className="mt-1">
          Responses with <code>423 Locked</code> or <code>503 Service Unavailable</code> are safe to
          retry. <code>423 Locked</code> means the resource is temporarily locked, usually because
          another operation is in progress.
        </p>
      </div>
    </div>
  </div>
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
          state={resp}
          copy={copy}
          copiedId={copiedId}
        />
      )}

      {operation.errors?.length > 0 && (
        <section className="mt-8">
          <h2 id="errors" className={API_OPERATION_H2_WITH_MARGIN_CLASS_NAME}>
            Errors
          </h2>
          <div>
            {operation.errors.map((err) =>
              isGeneralError(err) ? (
                <GeneralErrorCard key={err.status} />
              ) : (
                <ApiResponse
                  key={err.status}
                  status={err.status}
                  description={err.description}
                  descriptionHtml={err.descriptionHtml}
                />
              )
            )}
          </div>
        </section>
      )}
    </>
  );
};

OperationDoc.propTypes = {
  operation: PropTypes.shape({
    method: PropTypes.string.isRequired,
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
