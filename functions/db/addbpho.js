// functions/db/deledbpho.js
export async function onRequest(context) {
 // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const { username, dirName, photoUrlsString } = await context.request.json();
  const fullname = `${username}_${dirName}`;
  const fphotoUrl = `${photoUrlsString}`;
  
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

// 追加URL
  let upphotoUrl = photosString ? photosString + '\n' + fphotoUrl : fphotoUrl;

   // 构建SQL更新语句
const upquery = `UPDATE ${username} SET imgURL = ? WHERE ad_name = ?`;
  // 准备你的 allADD SQL 语句
 const addallq = `INSERT INTO webphonstore_all (ad_name, imgURL) VALUES (?, ?)
ON CONFLICT(ad_name) DO UPDATE SET imgURL = excluded.imgURL`;

 // 执行删除并等待结果
    try {
      const upps = await database.prepare(upquery).bind(upphotoUrl, dirName);
      await upps.run();
      // 准备你的 allADD SQL 语句
     const stmt = await database.prepare(addallq).bind(fullname,upphotoUrl);
     // 执行 SQL 语句
     await stmt.run();
      return new Response('Directory deleted successfully.', { status: 200 });
    } catch (error) {
      // 如果删除过程中出现错误，返回错误信息
      return new Response(error.message, { status: 500 });
    }
 
}
