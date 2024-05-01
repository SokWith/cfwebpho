// functions/submit-photos.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, directory, photoUrlsString } = await request.json();
  // 将新提交的URL添加到现有的URL列表中
  let existingUrls = await env.webphostore.get(`${username}_${directory}`);
  existingUrls = existingUrls ? existingUrls + '\n' + photoUrlsString : photoUrlsString;
  // 更新KV空间中的密钥值
  await env.webphostore.put(`${username}_${directory}`, existingUrls);
  return new Response('Photos submitted', { status: 200 });
}
