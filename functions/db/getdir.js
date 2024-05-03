export async function onRequest(context) {
  // Create a prepared statement with our query
  const ps = context.env.webphostore.prepare('SELECT ad_name FROM webphostore WHERE ad_name LIKE 'aaaaaa_%';
');
  const data = await ps.first();

  return Response.json(data);
}
