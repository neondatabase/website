export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { messages } = await req.json();
  try {
    const r = await fetch(process.env.AI_DOCS_CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
      }),
    });

    const reader = r.body.getReader();

    const response = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();

          // When no more data needs to be consumed, break the reading
          if (done) {
            break;
          }

          // Enqueue the next data chunk into our target stream
          controller.enqueue(value);
        }

        // Close the stream
        controller.close();
        reader.releaseLock();
      },
    });

    if (r.status === 429) {
      return new Response(response, {
        status: 429,
      });
    }

    return new Response(response);
  } catch (e) {
    console.error(e);
    return new Response('Something went wrong', { status: 500 });
  }
}
