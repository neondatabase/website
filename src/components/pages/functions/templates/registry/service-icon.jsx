import PropTypes from 'prop-types';

import AiGatewayIcon from 'icons/services/ai-gateway.inline.svg';
import AuthIcon from 'icons/services/auth.inline.svg';
import FunctionsIcon from 'icons/services/functions.inline.svg';
import ObjectStorageIcon from 'icons/services/object-storage.inline.svg';
import PostgresIcon from 'icons/services/postgres.inline.svg';
import RealtimeIcon from 'icons/services/realtime.inline.svg';
import { cn } from 'utils/cn';

// Keyed by the service ids in constants/neon-services.js.
const SERVICE_ICONS = {
  postgres: PostgresIcon,
  'object-storage': ObjectStorageIcon,
  functions: FunctionsIcon,
  'ai-gateway': AiGatewayIcon,
  realtime: RealtimeIcon,
  auth: AuthIcon,
};

// Optical size fixes for icons that look smaller than the rest at the same box size.
const SERVICE_ICON_SCALE = {
  auth: 'scale-[1.06]',
};

// Always pair with the service name: the icons are generic shapes on their own. An unknown
// service keeps an empty slot of the same size, so names in a list stay aligned.
const ServiceIcon = ({ id, className = null }) => {
  const Icon = SERVICE_ICONS[id];
  if (!Icon) return <span className={cn('inline-block', className)} aria-hidden="true" />;
  return (
    <Icon className={cn(className, SERVICE_ICON_SCALE[id])} aria-hidden="true" focusable="false" />
  );
};

ServiceIcon.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ServiceIcon;
