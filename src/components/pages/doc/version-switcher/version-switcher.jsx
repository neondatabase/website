'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { DOCS_HOME_SLUG } from 'constants/docs';
import useClickOutside from 'hooks/use-click-outside';
import CheckIcon from 'icons/check-arrow.inline.svg';
import ArchiveIcon from 'icons/docs/sidebar/archive-drawer.inline.svg';
import chevronsUpDownIcon from 'icons/docs/sidebar/chevrons-up-down.svg';
import FileCopiesIcon from 'icons/docs/sidebar/file-copies.inline.svg';
import {
  getDocsVersionFromPathname,
  normalizeDocsVersionId,
  resolveLatestDocsVersionId,
  stripDocsVersionFromPathname,
} from 'utils/docs-versioning';

import { useDocsVersionContext } from '../version-context';

const VersionSwitcher = ({ className, isMobileMenu = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { versions, selectedVersionId, selectedVersion, setSelectedVersionId } =
    useDocsVersionContext();
  const unversionedPathname = stripDocsVersionFromPathname(pathname);
  const unversionedSegments = unversionedPathname
    .replace(/^\/docs\/?/, '')
    .split('/')
    .filter(Boolean);
  const urlVersionId = getDocsVersionFromPathname(pathname);
  const visualSelectedVersionId = urlVersionId
    ? normalizeDocsVersionId(urlVersionId)
    : resolveLatestDocsVersionId();
  const visualSelectedVersion =
    versions.find((version) => version.id === visualSelectedVersionId) || selectedVersion;

  useEffect(() => {
    const expectedVersionId = visualSelectedVersionId;
    if (expectedVersionId !== selectedVersionId) {
      setSelectedVersionId(expectedVersionId);
    }
  }, [selectedVersionId, setSelectedVersionId, visualSelectedVersionId]);

  useClickOutside([containerRef], () => setIsOpen(false));

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', onEscape);
    }

    return () => {
      document.removeEventListener('keydown', onEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navigateToVersion = (versionId) => {
    setIsOpen(false);
    setSelectedVersionId(versionId);
    const nextSlug =
      unversionedSegments.length > 0 ? unversionedSegments.join('/') : DOCS_HOME_SLUG;
    const latestVersionId = resolveLatestDocsVersionId();
    if (versionId === latestVersionId) {
      router.push(`/docs/${nextSlug}`);
      return;
    }
    router.push(`/docs/${versionId}/${nextSlug}`);
  };

  return (
    <div className={clsx('relative', className)} ref={containerRef}>
      <button
        className={clsx(
          'flex w-full items-center justify-between border border-transparent py-2 text-left',
          isMobileMenu
            ? 'px-0'
            : 'px-2.5 hover:border-gray-new-90 hover:bg-gray-new-98 hover:dark:border-gray-new-20 hover:dark:bg-gray-new-8',
        )}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center border border-gray-new-90 p-1.5 dark:border-gray-new-20">
            {visualSelectedVersion.isDeprecated ? (
              <ArchiveIcon className="text-new-gray-60 size-[22px] shrink-0 dark:text-gray-new-40" />
            ) : (
              <FileCopiesIcon className="size-[22px] shrink-0 text-green-44 dark:text-green-52" />
            )}
          </span>
          <span className={clsx('flex flex-col', isMobileMenu ? 'gap-1' : 'gap-2')}>
            <span
              className={clsx(
                isMobileMenu ? 'text-[16px]' : 'text-[15px]',
                'truncate font-medium leading-tight tracking-extra-tight text-gray-new-20 dark:text-white'
              )}
            >
              {visualSelectedVersion.label}
            </span>
            <span className="truncate text-[13px] leading-tight tracking-extra-tight text-gray-new-40 dark:text-gray-new-70">
              {visualSelectedVersion.release}
            </span>
          </span>
        </span>

        <img src={chevronsUpDownIcon} className="size-4 shrink-0" />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-1 border border-gray-new-90 bg-white dark:border-gray-new-20 dark:bg-black-new">
          <ul role="listbox" className="divide-y divide-gray-new-90 dark:divide-gray-new-20">
            {versions.map((version) => {
              const isSelected = version.id === visualSelectedVersionId;
              return (
                <li key={version.id} role="option" aria-selected={isSelected}>
                  <button
                    className="flex w-full items-center justify-between px-2.5 py-2 text-left hover:bg-gray-new-98 dark:hover:bg-gray-new-8"
                    type="button"
                    onClick={() => navigateToVersion(version.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex items-center justify-center border border-gray-new-90 p-1.5 dark:border-gray-new-20">
                        {version.isDeprecated ? (
                          <ArchiveIcon className="text-new-gray-60 size-[22px] shrink-0 dark:text-gray-new-40" />
                        ) : (
                          <FileCopiesIcon className="size-[22px] shrink-0 text-green-44 dark:text-green-52" />
                        )}
                      </span>
                      <span className="flex flex-col">
                        <span
                          className={clsx(
                            'truncate font-medium leading-tight tracking-extra-tight',
                            isMobileMenu ? 'text-[16px]' : 'text-[15px]'
                          )}
                        >
                          {version.label}
                        </span>
                        <span className="truncate text-[13px] leading-tight tracking-extra-tight text-gray-new-40 dark:text-gray-new-70">
                          {version.release}
                        </span>
                      </span>
                    </span>
                    {isSelected && (
                      <CheckIcon className="size-3.5 shrink-0 text-green-44 dark:text-green-52" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VersionSwitcher;

VersionSwitcher.propTypes = {
  className: PropTypes.string,
  isMobileMenu: PropTypes.bool,
};
