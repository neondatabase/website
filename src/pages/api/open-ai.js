import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const response = await fetch(process.env.AI_DOCS_CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });
    if (response.ok) {
      response.body.pipe(res); // Pipe the response stream directly to the client
    } else {
      throw Error('Something went wrong. Please reopen and try again!');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
