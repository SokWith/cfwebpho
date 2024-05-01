// functions/get-photos.js
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const directory = url.searchParams.get('directory');
  const photosString = await env.webphostore.get(`${username}_${directory}`);
  const photos = photosString.split(';').map(entry => {
    const [url, name] = entry.split(',');
    return { url, name };
  });
  return new Response(JSON.stringify(photos), { status: 200 });
}
