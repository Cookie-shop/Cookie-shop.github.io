export async function onRequest(context) {
  const { request } = context;
  
  // Only accept POST
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { targetUrl, data } = body;
  if (!targetUrl) {
    return new Response('Missing targetUrl', { status: 400 });
  }

  // Forward the request to your Google Apps Script
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseBody = await response.text();
  const newResponse = new Response(responseBody, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  return newResponse;
}
