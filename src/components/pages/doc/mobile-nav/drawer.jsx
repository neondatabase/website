'use client';

import PropTypes from 'prop-types';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from 'utils/cn';

const Drawer = ({ shouldScaleBackground = true, ...props }) => (
  <DrawerPrimitive.Root
    data-slot="drawer"
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);

Drawer.propTypes = {
  shouldScaleBackground: PropTypes.bool,
};

const DrawerTrigger = ({ ...props }) => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
);

const DrawerPortal = ({ ...props }) => (
  <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
);

const DrawerClose = ({ ...props }) => <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;

const DrawerOverlay = ({ className, ...props }) => (
  <DrawerPrimitive.Overlay
    data-slot="drawer-overlay"
    className={cn('fixed inset-0 z-50 bg-[#C9CBCF]/80 dark:bg-black/80', className)}
    {...props}
  />
);

DrawerOverlay.propTypes = {
  className: PropTypes.string,
};

const DrawerContent = ({ className, children, ...props }) => (
  <DrawerPortal data-slot="drawer-portal">
    <DrawerOverlay />
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border',
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-[14px] h-1 w-28 rounded-full bg-gray-new-90 dark:bg-[#27272A]" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
);

DrawerContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const DrawerHeader = ({ className, ...props }) => (
  <div
    data-slot="drawer-header"
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);

DrawerHeader.propTypes = {
  className: PropTypes.string,
};

const DrawerFooter = ({ className, ...props }) => (
  <div
    data-slot="drawer-footer"
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);

DrawerFooter.propTypes = {
  className: PropTypes.string,
};

const DrawerTitle = ({ className, ...props }) => (
  <DrawerPrimitive.Title
    data-slot="drawer-title"
    className={cn('text-lg leading-none font-semibold tracking-tight', className)}
    {...props}
  />
);

DrawerTitle.propTypes = {
  className: PropTypes.string,
};

const DrawerDescription = ({ className, ...props }) => (
  <DrawerPrimitive.Description
    data-slot="drawer-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
);

DrawerDescription.propTypes = {
  className: PropTypes.string,
};

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
