// functions/get-photos.js
export async function onRequestGet(context) {
 // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const { username, dirName } = await context.request.json();
  const fullname = `${username}_${dirName}`;
  const imgUrl = '';
  
  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }
  // 从KV空间获取对应的密钥值
  const photosString = await context.env.webphostore.get(`${username}_${directory}`);
  // 将字符串按换行符分割成数组，每个元素是一个图片URL
  const photoUrls = photosString ? photosString.split('\n') : [];
  return new Response(JSON.stringify(photoUrls), { status: 200 });
}
