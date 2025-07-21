'use client';

import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const BranchingDemoToast = ({ open, onOpenChange, duration = 4000, message }) => (
  <Toast.Provider swipeDirection="right">
    <Toast.Root
      className={clsx(
        'rounded-md border border-[#1D2025] bg-[#121418] px-3 py-2 text-gray-new-70 drop-shadow-[0_4px_40px_0_rgba(0,0,0,0.25)]',
        'data-[state=closed]:animate-fade-out-overlay data-[state=open]:animate-fade-in-overlay',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]'
      )}
      open={open}
      duration={duration}
      onOpenChange={onOpenChange}
    >
      <Toast.Title className="whitespace-nowrap text-sm leading-snug tracking-extra-tight">
        {message}
      </Toast.Title>
    </Toast.Root>
    <Toast.Viewport className="absolute bottom-2.5 right-2.5 z-50 m-0 flex list-none flex-col gap-[10px] outline-none" />
  </Toast.Provider>
);

BranchingDemoToast.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  duration: PropTypes.number,
  message: PropTypes.string.isRequired,
};

export default BranchingDemoToast;
