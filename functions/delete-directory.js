// functions/delete-directory.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, dirName } = await request.json();
  await context.env.webphostore.delete(`${username}_${dirName}`);
  return new Response('Directory deleted', { status: 200 });
}
