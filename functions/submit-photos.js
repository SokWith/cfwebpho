// functions/submit-photos.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, directory, photoData } = await request.json();
  let currentValue = await context.env.webphostore.get(`${username}_${directory}`);
  currentValue = currentValue ? currentValue + ';' + photoData : photoData;
  await context.env.webphostore.put(`${username}_${directory}`, currentValue);
  return new Response('Photos submitted', { status: 200 });
}
