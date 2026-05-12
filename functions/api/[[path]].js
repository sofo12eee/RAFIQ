export async function onRequest(context) {
  const url = new URL(context.request.url);
  const RAILWAY_URL = context.env.RAILWAY_URL || 'https://rafiq-production.up.railway.app';
  const apiPath = url.pathname + url.search;
  
  const response = await fetch(RAILWAY_URL + apiPath, {
    method: context.request.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: context.request.method !== 'GET' ? context.request.body : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
