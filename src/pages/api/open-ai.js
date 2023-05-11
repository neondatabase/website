export default async function handler(req, res) {
  const { messages } = req.body;
  try {
    const response = await fetch('https://chatbot-two-khaki.vercel.app/api/edge/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
      }),
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
