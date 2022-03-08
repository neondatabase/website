/* eslint-disable react/prop-types */
import classNames from 'classnames';
import { Link, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState, useLayoutEffect } from 'react';

import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import ChevronRight from 'icons/chevron-right.inline.svg';

const MobileNavMenu = ({ sidebar, currentSlug }) => {
  const [value, setValue] = useState(null);
  useLayoutEffect(() => {
    const sectionIndex = sidebar.findIndex(
      (item) => item.children.findIndex((child) => child.slug === currentSlug) !== -1
    );
    const itemIndex = sidebar[sectionIndex].children.findIndex(
      (child) => child.slug === currentSlug
    );
    setValue({
      label: sidebar[sectionIndex].children[itemIndex].sidebarLabel,
      value: sidebar[sectionIndex].children[itemIndex].slug,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug]);

  return (
    <div className="relative w-full">
      <select
        className="select w-full"
        // value={value}
        onChange={({ target }) => {
          const val = target.value;
          if (!val) return;
          navigate(`/docs/${val}`);
        }}
      >
        <option value={false} disabled>
          Choose section
        </option>
        {sidebar &&
          sidebar.map(({ sidebarLabel, children }) => (
            <optgroup label={sidebarLabel} key={sidebarLabel}>
              {children.map(({ slug, sidebarLabel: childSidebarLabel }) => (
                <option
                  label={childSidebarLabel}
                  value={slug}
                  key={childSidebarLabel}
                  selected={value && slug === value.value}
                >
                  {childSidebarLabel}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90" />
    </div>
  );
};

const Sidebar = ({ sidebar, currentSlug }) => {
  const initialState = {};
  sidebar.forEach(({ title }) => (initialState[title] = false));
  const sectionIndex = sidebar.findIndex(
    (item) => item.children.find((child) => child.slug === currentSlug) !== undefined
  );

  initialState[sidebar[sectionIndex].title] = true;

  const [sidebarState, setSidebarState] = useState(initialState);

  const handleItemClick = (title) => {
    const newState = { ...sidebarState };
    newState[title] = !newState[title];
    setSidebarState(newState);
  };

  return (
    <>
      {sidebar.map(({ title, sidebarLabel, children }, index) => (
        <div key={index}>
          <div
            className="flex items-center pt-3 pb-3"
            role="button"
            tabIndex="0"
            onClick={() => handleItemClick(title)}
            onKeyDown={() => handleItemClick(title)}
          >
            <ChevronRight
              className={classNames('mr-2 transition-transform duration-500', {
                'rotate-90 transform': sidebarState[title],
              })}
            />
            <span className="text-lg font-semibold leading-none">{sidebarLabel}</span>
          </div>
          {sidebarState[title] && (
            <div className="flex flex-col space-y-1 py-2 pl-4">
              {children.map((child, childIndex) => (
                <Link
                  key={`${index}-${childIndex}`}
                  to={`/docs/${child.slug}`}
                  className={classNames('text-md py-2 leading-none hover:text-primary-2', {
                    'font-semibold text-primary-2': currentSlug === child.slug,
                  })}
                >
                  {child.sidebarLabel}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

const DocLayout = ({ seo, currentSlug, sidebar, children }) => (
  <Layout headerTheme="white" pageMetadata={seo}>
    <Container size="md">
      <div className="mb-auto flex h-full flex-grow lg:flex-col">
        <div className="mt-44 w-[313px] flex-shrink-0 xl:w-[256px] lg:hidden">
          <Sidebar sidebar={sidebar} currentSlug={currentSlug} />
        </div>
        <div className="hidden w-full lg:block">
          <MobileNavMenu sidebar={sidebar} currentSlug={currentSlug} />
        </div>
        <main className="mt-44 w-[calc(100%-313px)] pb-44 xl:w-[calc(100%-256px)] lg:mt-14 lg:w-full md:mt-10">
          {children}
        </main>
      </div>
    </Container>
  </Layout>
);

DocLayout.propTypes = {
  seo: PropTypes.object,
  pageContext: PropTypes.object,
  children: PropTypes.node.isRequired,
};

DocLayout.defaultProps = {
  seo: null,
  pageContext: null,
};

export default DocLayout;
