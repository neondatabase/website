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
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const streamResponse = new Blob(chunks);
      const responseData = await streamResponse.text();
      res.status(200).json(responseData);
    } else {
      throw Error('Something went wrong. Please, reopen and try again!');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
