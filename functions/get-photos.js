// functions/get-photos.js
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const directory = url.searchParams.get('directory');
  const photosString = await context.env.webphostore.get(`${username}_${directory}`);
  const photos = photosString ? photosString.split(';') : [];
  return new Response(JSON.stringify(photos), { status: 200 });
}
