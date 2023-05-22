export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { message } = await req.json();
  try {
    const r = await fetch(process.env.AI_DOCS_CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
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

    return new Response(response);
  } catch {
    return new Response(null, { status: 500 });
  }
}
