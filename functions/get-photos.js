// functions/get-photos.js
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const directory = url.searchParams.get('directory');
  // 从KV空间获取对应的密钥值
  const photosString = await context.env.webphostore.get(`${username}_${directory}`);
  // 将字符串按换行符分割成数组，每个元素是一个图片URL
  const photoUrls = photosString ? photosString.split('\n') : [];
  return new Response(JSON.stringify(photoUrls), { status: 200 });
}

