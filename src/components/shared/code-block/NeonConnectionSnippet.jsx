'use client';

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import CustomChevronIcon from 'components/shared/footer/images/chevrons.inline.svg';
import useCopyToClipboard from 'hooks/use-copy-to-clipboard';



import CheckIcon from '../code-block-wrapper/images/check.inline.svg';
import CopyIcon from '../code-block-wrapper/images/copy.inline.svg';

import styles from './NeonConnectionSnippet.module.css';


// Dummy data for preview/demo
const demoProjects = [
  {
    id: 'proj1',
    name: 'My Project',
    branches: [
      { id: 'production', name: 'production' },
      { id: 'development', name: 'development' },
    ],
  },
  {
    id: 'proj2',
    name: 'Another Project',
    branches: [{ id: 'main', name: 'main' }],
  },
];

// Simulate fetching connection details
const fetchConnectionDetails = async (projectId, branchId) => 
  // Replace with your real API call
   ({
    PGHOST: `host-for-${projectId}-${branchId}`,
    PGDATABASE: `db-${projectId}`,
    PGUSER: 'user123',
    PGPASSWORD: 'secret',
    ENDPOINT_ID: 'endpoint-xyz',
  })
;

// For clipboard (plain text)
const getCodeStringPlain = (vars) =>
  `PGHOST='${vars?.PGHOST || '[neon_hostname]'}'\n` +
  `PGDATABASE='${vars?.PGDATABASE || '[dbname]'}'\n` +
  `PGUSER='${vars?.PGUSER || '[user]'}'\n` +
  `PGPASSWORD='${vars?.PGPASSWORD || '[password]'}'\n` +
  `ENDPOINT_ID='${vars?.ENDPOINT_ID || '[endpoint_id]'}'`;

const RenderCodeBlock = ({ rows }) => (
  <pre className={styles.codeBlock}>
    {rows.map(([key, value]) => (
      <div key={key}>
        {key}=<span className={styles.glow}>&apos;{value}&apos;</span>
      </div>
    ))}
  </pre>
);
RenderCodeBlock.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.array).isRequired,
};

const NeonConnectionSnippet = ({
  projects = demoProjects,
  getConnectionDetails = fetchConnectionDetails,
  isLoggedIn = true,
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [connVars, setConnVars] = useState(null);

  const { isCopied, handleCopy } = useCopyToClipboard(3000);
  const codeStringPlain = getCodeStringPlain(connVars);

  // Handle project change and branch loading
  useEffect(() => {
    if (!selectedProject) return;
    setTimeout(() => {
      setSelectedBranch(selectedProject.branches[0] || null);
    }, 300);
  }, [selectedProject]);

  // Fetch connection details
  useEffect(() => {
    if (!selectedProject || !selectedBranch) {
      setConnVars(null);
      return;
    }
    getConnectionDetails(selectedProject.id, selectedBranch.id).then(setConnVars);
  }, [selectedProject, selectedBranch, getConnectionDetails]);

  // Only use regular bracketed placeholders for the code block when not logged in or when no project/branch is selected
  const codeBlockPlaceholders = [
    ['PGHOST', '[neon_hostname]'],
    ['PGDATABASE', '[dbname]'],
    ['PGUSER', '[user]'],
    ['PGPASSWORD', '[password]'],
    ['ENDPOINT_ID', '[endpoint_id]'],
  ];

  // Auto-select first project/branch if logged in and not already selected
  useEffect(() => {
    if (isLoggedIn && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
      setSelectedBranch(projects[0].branches[0] || null);
    }
  }, [isLoggedIn, projects, selectedProject]);

  // Empty state: no projects
  if (!isLoggedIn || !projects.length) {
    return (
      <>
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
        <div className={styles.codeBlockWrapper}>
          <div className={styles.codeArea}>
            <RenderCodeBlock rows={codeBlockPlaceholders} />
          </div>
        </div>
      </>
    );
  }

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
                value={selectedProject?.id || ''}
                defaultValue=""
                required
                onChange={(e) => {
                  const proj = projects.find((p) => p.id === e.target.value);
                  setSelectedProject(proj);
                  setSelectedBranch(null);
                }}
              >
                <option value="" className={styles.placeholderOption} disabled>
                  project
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
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
                value={selectedBranch?.id || ''}
                disabled={!selectedProject}
                onChange={(e) => {
                  const branch = selectedProject.branches.find((b) => b.id === e.target.value);
                  setSelectedBranch(branch);
                }}
              >
                <option value="" className={styles.placeholderOption} disabled>
                  branch
                </option>
                {selectedProject?.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
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
            onClick={() => handleCopy(codeStringPlain)}
          >
            {isCopied ? (
              <CheckIcon className={styles.copyIcon} />
            ) : (
              <CopyIcon className={styles.copyIcon} />
            )}
          </button>
          <RenderCodeBlock
            rows={[
              ['PGHOST', connVars?.PGHOST || '[neon_hostname]'],
              ['PGDATABASE', connVars?.PGDATABASE || '[dbname]'],
              ['PGUSER', connVars?.PGUSER || '[user]'],
              ['PGPASSWORD', connVars?.PGPASSWORD || '[password]'],
              ['ENDPOINT_ID', connVars?.ENDPOINT_ID || '[endpoint_id]'],
            ]}
          />
        </div>
      </div>
    </>
  );
};

NeonConnectionSnippet.propTypes = {
  projects: PropTypes.array,
  getConnectionDetails: PropTypes.func,
  isLoggedIn: PropTypes.bool,
};

export default NeonConnectionSnippet;
