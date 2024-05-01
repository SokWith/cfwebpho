// functions/delete-photo.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, directory, photoUrl } = await request.json();
  
  // 从KV空间获取当前目录下的所有图片URL
  let photosString = await env.webphostore.get(`${username}_${directory}`);
  let photoUrls = photosString ? photosString.split('\n') : [];
  
  // 移除指定的图片URL
  photoUrls = photoUrls.filter(url => url !== photoUrl);
  
  // 更新KV空间中的密钥值
  await env.webphostore.put(`${username}_${directory}`, photoUrls.join('\n'));
  
  return new Response('Photo deleted', { status: 200 });
}
