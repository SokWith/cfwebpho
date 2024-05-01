// functions/create-directory.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, dirName } = await request.json();
  await context.env.webphostore.put(`${username}_${dirName}`, '');
  return new Response('Directory created', { status: 200 });
}
