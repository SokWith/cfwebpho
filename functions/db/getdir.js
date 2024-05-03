export async function onRequest(context) {
  // Create a prepared statement with our query
  const ps = context.env.webphostore.prepare('SELECT * from webphostore');
  const data = await ps.first();

  return Response.json(data);
}
