'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = ({ ...props }) => (
  <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
);

const CollapsibleTrigger = ({ ...props }) => (
  <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />
);

const CollapsibleContent = ({ ...props }) => (
  <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
