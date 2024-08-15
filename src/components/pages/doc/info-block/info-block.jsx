import PropTypes from 'prop-types';
import React from 'react';

const InfoBlock = ({ children }) => {
  const childrenArray = React.Children.toArray(children);

  if (!childrenArray.length) return null;

  return (
    <div className="my-9 grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-6">
      <div>{childrenArray[0]}</div>
      {childrenArray.length > 1 && (
        <div className="flex flex-col gap-8 sm:gap-6">
          {childrenArray.slice(1).map((child, index) => (
            <div key={index}>{child}</div>
          ))}
        </div>
      )}
    </div>
  );
};

InfoBlock.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InfoBlock;
