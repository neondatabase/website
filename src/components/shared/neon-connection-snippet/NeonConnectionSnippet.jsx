'use client';

import Mustache from 'mustache';
import PropTypes from 'prop-types';
import React from 'react';

import CustomChevronIcon from 'components/shared/footer/images/chevrons.inline.svg';
import { useUserData } from 'components/shared/user-data-provider/UserDataProvider';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';

import CheckIcon from '../code-block-wrapper/images/check.inline.svg';
import CopyIcon from '../code-block-wrapper/images/copy.inline.svg';

import styles from './NeonConnectionSnippet.module.css';

const RenderCodeBlock = ({ children }) => <pre className={styles.codeBlock}>{children}</pre>;
RenderCodeBlock.propTypes = {
  children: PropTypes.string.isRequired,
};

const NeonConnectionSnippet = () => {
  const { loggedIn, data, selection, setSelection } = useUserData();
  const { isCopied, handleCopy } = useCopyToClipboard(3000);
  const { orgs, org_projects: projects } = data;

  // Empty state: no projects
  if (!loggedIn) {
    return (
      <div className={styles.controls}>
        <div className={styles.selectorRow}>
          <span className={styles.emptyState}>
            To view with your credentials,{' '}
            <a href="https://console.neon.tech/login" target="_blank" rel="noopener noreferrer">
              log in
            </a>
            .
          </span>
        </div>
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
        <div className={styles.selectorRow}>
          <span className={styles.liveContext}>Credentials for:</span>
          <div className={styles.selectorGroup}>
            <div className={styles.selectWrapper}>
              <select
                id="project-select"
                className={styles.styledSelect}
                value={selection.org_id || ''}
                required
                onChange={(e) => {
                  const org = orgs.find((p) => p.id === e.target.value);
                  setSelection({ org_id: org.id });
                }}
              >
                <option value="" className={styles.placeholderOption} disabled>
                  project
                </option>
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <CustomChevronIcon className={styles.selectChevron} />
            </div>
          </div>
          <div className={styles.selectorGroup}>
            <div className={styles.selectWrapper}>
              <select
                className={styles.styledSelect}
                value={selection.project_id || ''}
                disabled={!selection.org_id}
                onChange={(e) => {
                  const project = projects.find((b) => b.id === e.target.value);
                  setSelection({ org_id: project.org_id, project_id: project.id });
                }}
              >
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <CustomChevronIcon className={styles.selectChevron} />
            </div>
          </div>
        </div>
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

export default NeonConnectionSnippet;
