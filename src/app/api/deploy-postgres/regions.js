const toRad = (value) => (value * Math.PI) / 180;

const getDistance = ({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 }) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const findClosestRegion = (userCoords) => {
  let closestRegionId = 'aws-us-east-1';
  let minDistance = Number.POSITIVE_INFINITY;

  for (const [key, region] of Object.entries(regions)) {
    const distance = getDistance(userCoords, region.coords);
    if (distance < minDistance) {
      minDistance = distance;
      closestRegionId = key;
    }
  }

  return closestRegionId;
};

export const regions = {
  'aws-us-east-1': {
    name: 'US East (N. Virginia)',
    coords: { lat: 38.0336, lon: -78.508 },
  },
  'aws-us-east-2': {
    name: 'US East (Ohio)',
    coords: { lat: 39.9612, lon: -82.9988 },
  },
  'aws-us-west-2': {
    name: 'US West (Oregon)',
    coords: { lat: 45.5235, lon: -122.6762 },
  },
  'aws-eu-central-1': {
    name: 'Europe (Frankfurt)',
    coords: { lat: 50.1109, lon: 8.6821 },
  },
  'aws-ap-southeast-1': {
    name: 'Asia Pacific (Singapore)',
    coords: { lat: 1.3521, lon: 103.8198 },
  },
  'aws-ap-southeast-2': {
    name: 'Asia Pacific (Sydney)',
    coords: { lat: -33.8688, lon: 151.2093 },
  },
  'azure-eastus2': {
    name: 'Azure US East 2',
    coords: { lat: 39.9612, lon: -82.9988 },
  },
};
