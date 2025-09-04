import { NextResponse } from 'next/server';

import { HUBSPOT_FORM_PORTAL_ID } from 'constants/forms';

export async function POST(request) {
  try {
    const body = await request.json();
    const { formId, context, values } = body;

    if (!formId || !Array.isArray(values)) {
      return NextResponse.json(
        { error: 'Invalid request data. formId and values are required.' },
        { status: 400 }
      );
    }

    const hubspotResponse = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_FORM_PORTAL_ID}/${formId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          fields: values,
        }),
      }
    );

    if (hubspotResponse.ok) {
      const responseData = await hubspotResponse.json();
      return NextResponse.json(responseData, { status: 200 });
    }
    const errorData = await hubspotResponse.text();
    console.error('HubSpot API error:', errorData);
    return NextResponse.json(
      { error: 'Failed to submit form to HubSpot' },
      { status: hubspotResponse.status }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
