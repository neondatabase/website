#! /bin/env node

const http = require('https');

if (process.argv.length < 3) {
  console.error('Usage: ORB_API_KEY=<api-key> get_prices.js <plan_id> > public/prices.json');
  process.exit(1);
}

const API_KEY = process.env.ORB_API_KEY;
if (!API_KEY) {
  console.error('No API key found in environment variable ORB_API_KEY');
  process.exit(1);
}

const planId = process.argv[2];
if (!planId) {
  console.error('No plan ID provided');
  process.exit(1);
}

function writePlans(data) {
  const result = {
    name: data.name,
    regions: {},
  };
  data.prices.forEach((plan) => {
    const planName = plan.name;
    plan.matrix_config.matrix_values.forEach((matrix) => {
      const region = matrix.dimension_values[0];
      const price = +matrix.unit_amount;
      if (!result.regions[region]) {
        result.regions[region] = {};
      }
      if (!result.regions[region][planName]) {
        result.regions[region][planName] = {};
      }
      result.regions[region][planName] = price;
    });
  });
  console.log(JSON.stringify(result, null, 2));
}

http
  .get(`https://api.withorb.com/v1/plans/${planId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  })
  .on('response', (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      writePlans(JSON.parse(data));
    });
  });
