// functions/submit-photos.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, directory, photoUrl } = await request.json();
  let currentValue = await context.env.webphostore.get(`${username}_${directory}`);
  currentValue = currentValue ? currentValue + ';' + photoUrl : photoUrl;
  await context.env.webphostore.put(`${username}_${directory}`, currentValue);
  return new Response('Photo submitted', { status: 200 });
}
