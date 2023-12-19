export const activities = [
  {
    title: 'Rarely active',
    description: 'Users access the application occasionally',
    unit: 1,
  },
  {
    title: 'Only during business hours',
    description: 'Users access app primarily during business hours',
    unit: 7,
  },
  {
    title: 'Always active',
    description: 'Users are active 24/7 and require instant connection',
    unit: 24,
  },
];

export const performance = [
  {
    title: '1 vCPU, 4GB RAM',
    description: 'Small business, non-profit, personal blogs',
    type: 'Simple static sites',
    unit: 1,
  },
  {
    title: '5 vCPU, 20GB RAM',
    description: 'CRM, social media, travel booking',
    type: 'Dynamic SaaS apps',
    unit: 5,
  },
  {
    title: '7 vCPU, 28GB RAM',
    description: 'Crypto, banking, data sciences',
    type: 'Data heavy apps',
    unit: 7,
  },
];

export const storage = [
  {
    title: '1GB',
    description: 'Small business, non-profit, personal blogs',
    type: 'Simple static sites',
    unit: 1,
  },
  {
    title: '100 GB',
    description: 'CRM, social media, travel booking',
    type: 'Dynamic SaaS apps',
    unit: 100,
  },
  {
    title: '1 TB',
    description: 'Crypto, banking, data sciences',
    type: 'Data heavy apps',
    unit: 1000,
  },
];

export const items = [
  {
    label: 'Activity',
    title: 'How active are your users?',
    items: activities,
    nextId: 'performance',
    textColor: 'text-green-45',
    activeColor: 'border-green-45 hover:border-green-45',
    defaultColor: 'border-gray-new-15 hover:border-green-45/30',
  },
  {
    label: 'Performance',
    title: 'What level of performance does your application require?',
    items: performance,
    nextId: 'storage',
    textColor: 'text-yellow-70',
    activeColor: 'border-yellow-70 hover:border-yellow-70',
    defaultColor: 'border-gray-new-15 hover:border-yellow-70/30',
  },
  {
    label: 'Storage',
    title: 'How much storage do you require?',
    items: storage,
    nextId: 'pricing',
    textColor: 'text-blue-80',
    activeColor: 'border-blue-80 hover:border-blue-80',
    defaultColor: 'border-gray-new-15 hover:border-blue-80/30',
  },
];
