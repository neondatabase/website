import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import slugify from 'slugify';

import AnchorIcon from 'icons/anchor.inline.svg';
// local constants
const termDelimiterRegEx = /\n/;
const listDelimiterRegEx = /\n:/;
const termDelimiterVariations = ['\n', '\n ', ' \n'];
const listDelimiterVariations = ['\n:', ' \n:', '\n: '];
// local helpers
const checkStrNonEmpty = (str) => str && str.trim().length > 0;
const getPlainText = (arr) => arr.reduce((acc, cur) => acc.concat(cur.props?.children ?? cur), '');

const buildRenderContent = ({ delimiterRegEx, delimiterVariations }, jsx) => {
  // 1. Content is a plain string
  // just split it using list delimiter
  if (typeof jsx === 'string') {
    return jsx.split(delimiterRegEx);
  }
  // 2. If compound content
  // init content store
  const store = [];
  // init pointer
  let pointer = 0;
  // init loop
  jsx.forEach((item) => {
    // make sure nested store is initialized
    store[pointer] = store[pointer] || [];
    if (typeof item === 'string') {
      if (delimiterRegEx.test(item)) {
        if (delimiterVariations.includes(item)) {
          pointer += 1;
        } else {
          const [end, target, start] = item.split(delimiterRegEx);
          if (checkStrNonEmpty(end)) {
            store[pointer].push(end);
            pointer += 1;
          }
          if (checkStrNonEmpty(target)) {
            pointer += 1;
            store[pointer] = [target];
          }
          if (checkStrNonEmpty(start)) {
            pointer += 1;
            store[pointer] = [start];
          }
        }
      } else {
        store[pointer].push(item);
      }
    } else {
      store[pointer].push(item);
    }
  });
  return store;
};

const DefinitionList = ({ children }) => {
  let content = children;
  if (!Array.isArray(children)) {
    content = [children];
  }
  return (
    <dl>
      {content.map(({ props: { children } }, idx) => {
        const [term, ...descriptions] = buildRenderContent(
          {
            delimiterRegEx: listDelimiterRegEx,
            delimiterVariations: listDelimiterVariations,
          },
          children
        );
        const terms = buildRenderContent(
          {
            delimiterRegEx: termDelimiterRegEx,
            delimiterVariations: termDelimiterVariations,
          },
          term
        );
        const termTextContent = Array.isArray(term) ? getPlainText(term) : term;
        return (
          <Fragment key={idx}>
            {terms.map((term, termIdx) => {
              const anchorMold = slugify(termTextContent);
              return (
                <dt
                  className="relative mt-4 flex font-bold first:mt-0"
                  id={!termIdx ? anchorMold : termIdx}
                >
                  {!termIdx && (
                    <a
                      className="absolute -left-5 top-1/2 -translate-y-1/2 !border-b-0 opacity-0 transition-opacity duration-200 hover:opacity-100"
                      href={`#${anchorMold}`}
                    >
                      <AnchorIcon className="h-4 w-4" />
                    </a>
                  )}
                  <span className="mr-2.5">—</span>
                  {term}
                </dt>
              );
            })}
            {descriptions.map((description, index) => (
              <dd className="pl-6 first:mt-1" key={index}>
                {description}
              </dd>
            ))}
          </Fragment>
        );
      })}
    </dl>
  );
};

DefinitionList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DefinitionList;
