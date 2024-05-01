// functions/get-directories.js
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const keys = await context.env.webphostore.list({ prefix: `${username}_` });
  const directories = keys.keys.map(key => key.name.split('_')[1]);
  return new Response(JSON.stringify(directories), { status: 200 });
}
