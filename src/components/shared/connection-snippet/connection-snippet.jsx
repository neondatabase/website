'use client';

import Mustache from 'mustache';
import PropTypes from 'prop-types';
import React from 'react';

import Combobox from 'components/shared/combo-box';
import { useUserData } from 'components/shared/user-data-provider/UserDataProvider';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from '../code-block-wrapper/images/check.inline.svg';
import CopyIcon from '../code-block-wrapper/images/copy.inline.svg';

import styles from './connection-snippet.module.css';

const RenderCodeBlock = ({ children }) => <pre className={styles.codeBlock}>{children}</pre>;
RenderCodeBlock.propTypes = {
  children: PropTypes.string.isRequired,
};

const ConnectionSnippet = () => {
  const { loggedIn, data, selection, setSelection } = useUserData();
  const { isCopied, handleCopy } = useCopyToClipboard(3000);
  const { orgs, org_projects: projects } = data;

  // Empty state: no projects
  if (!loggedIn) {
    return (
      <div className={styles.controls}>
        <span className={styles.emptyState}>
          To view with your credentials,{' '}
          <a href="https://console.neon.tech/login" target="_blank" rel="noopener noreferrer">
            log in
          </a>
          .
        </span>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  const connectionSnippet = Mustache.render(`DATABASE_URL={{{DATABASE_URL}}}`, {
    DATABASE_URL: data.connection_uri,
  });
  return (
    <>
      <div className={styles.controls}>
        <Combobox
          value={selection.org_id || ''}
          placeholder="Select an organization"
          options={orgs}
          onChange={(value) => {
            const org = orgs.find((p) => p.id === value);
            setSelection({ org_id: org?.id });
          }}
        />
        <Combobox
          value={selection.project_id || ''}
          placeholder="Select a project"
          options={projects}
          onChange={(value) => {
            const project = projects.find((p) => p.id === value);
            setSelection({
              org_id: project?.org_id,
              project_id: project?.id,
            });
          }}
        />
      </div>
      <div className={styles.codeBlockWrapper}>
        <div className={styles.codeArea}>
          <button
            className={styles.copyButton}
            type="button"
            aria-label={isCopied ? 'Copied!' : 'Copy to clipboard'}
            disabled={isCopied}
            tabIndex={0}
            title={isCopied ? 'Copied!' : 'Copy to clipboard'}
            onClick={() => handleCopy(connectionSnippet)}
          >
            {isCopied ? (
              <CheckIcon className={styles.copyIcon} />
            ) : (
              <CopyIcon className={styles.copyIcon} />
            )}
          </button>
          <RenderCodeBlock>{connectionSnippet}</RenderCodeBlock>
        </div>
      </div>
    </>
  );
};

export default ConnectionSnippet;
