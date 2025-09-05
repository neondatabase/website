'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import slugify from 'slugify';

import Icon, { ICONS } from './icon';

const FeatureList = ({ className = '', icons = [], children }) => {
  const [lastActive, setLastActive] = useState(0);
  // Split content into features by h2/h3 headings
  const features = [];
  let currentFeature = [];

  React.Children.toArray(children).forEach((child) => {
    // Determine if the child is a h2 or h3 heading
    const isHeading =
      (typeof child.type === 'string' && (child.type === 'h2' || child.type === 'h3')) ||
      (typeof child.type === 'function' &&
        (child.type.displayName === 'h2' || child.type.displayName === 'h3'));

    // Start a new feature if the current child is a heading
    if (isHeading) {
      if (currentFeature.length > 0) {
        features.push(currentFeature);
      }
      currentFeature = [];
    }

    currentFeature.push(child);
  });

  if (currentFeature.length > 0) {
    features.push(currentFeature);
  }

  // Extract title from the first heading in each feature
  const getFeatureTitle = (feature) => {
    const heading = feature.find(
      (child) =>
        (typeof child.type === 'string' || typeof child.type === 'function') &&
        (child.type === 'h2' || child.type === 'h3')
    );

    if (heading && heading.props && heading.props.children) {
      return typeof heading.props.children === 'string'
        ? heading.props.children
        : React.Children.toArray(heading.props.children).join('');
    }

    return `Feature ${features.indexOf(feature) + 1}`;
  };

  const updateTitleById = (title) =>
    slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

  return (
    <ul
      className={clsx('feature-list !mt-8 flex flex-col gap-10 !p-0 sm:!mt-7 sm:gap-9', className)}
    >
      {features.map((feature, index) => {
        const title = getFeatureTitle(feature);
        const id = updateTitleById(title);

        return (
          <li className="relative !m-0 flex gap-3 before:!content-none" key={id}>
            <Icon
              icon={icons[index] || ''}
              index={index}
              isLast={index === features.length - 1}
              lastActive={lastActive}
              setLastActive={setLastActive}
            />
            <div className="flex max-w-[664px] flex-col gap-3 !tracking-tight md:gap-2 [&>*]:!m-0">
              {feature}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

FeatureList.propTypes = {
  className: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(ICONS))),
  children: PropTypes.node,
};

export default FeatureList;
