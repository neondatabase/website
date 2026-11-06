const BACKEND_PRICING = {
  objectStorage: {
    freeAllowanceGb: '5',
    storageRatePerGbMonth: '0.023',
  },
  functions: {
    free: {
      activeCapacityHours: '10',
      waitingCapacityHours: '400',
      invocations: '1M',
    },
    launch: {
      activeCapacityHourRate: '0.10',
      waitingCapacityHourRate: '0.025',
      invocationRatePerMillion: '0.60',
    },
    scale: {
      activeCapacityHourRate: '0.12',
      waitingCapacityHourRate: '0.03',
      invocationRatePerMillion: '0.60',
    },
  },
};

export default BACKEND_PRICING;
