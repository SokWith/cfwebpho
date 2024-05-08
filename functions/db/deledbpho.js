// functions/db/deledbpho.js
export async function onRequest(context) {
 // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const { username, dirName, photoUrl } = await context.request.json();
  const fullname = `${username}_${dirName}`;
  const fphotoUrl = `${photoUrl}`;
  
  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }
  // 构建SQL查询语句
  const query = `SELECT imgURL FROM ${username} WHERE ad_name = ?`;

  // 执行查询并等待结果
    const ps = await database.prepare(query).bind(dirName);
    const photosStringArray = await ps.raw();  
    const photosString  = photosStringArray[0][0]; // 假设字符串在数组的第一个位置

 // 将字符串按换行符分割成数组，每个元素是一个图片URL
  let photoUrls = photosString ? photosString.split('\n') : [];
   // 移除指定的图片URL
   photoUrls = photoUrls.filter(url => url !== fphotoUrl);
   const upphotoUrl = photoUrls.join('\n');

   // 构建SQL更新语句
const upquery = `UPDATE ${username} SET imgURL = ? WHERE ad_name = ?`;
 // 执行删除并等待结果
    try {
      const upps = await database.prepare(upquery).bind(upphotoUrl, dirName);
      await upps.run();
      return new Response('Directory deleted successfully.', { status: 200 });
    } catch (error) {
      // 如果删除过程中出现错误，返回错误信息
      return new Response(error.message, { status: 500 });
    }
 
}
