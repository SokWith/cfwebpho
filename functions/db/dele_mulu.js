export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const { username, dirName } = await context.request.json();
  const fullname = `${username}_${dirName}`;
  
  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }

  // 检测目录是否存在
  // 构建SQL查询语句
  const fquery = `SELECT ad_name FROM ${username} WHERE ad_name = ?`;

  // 执行查询并等待结果
  let result;
  try {
    const ps = await database.prepare(fquery).bind(dirName);
    result = await ps.all();
  } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }

  // 如果目录存在，则执行删除操作
  if (result.results && result.results.length > 0){
    // 构建SQL删除语句
    const dquery = `DELETE FROM ${username} WHERE ad_name = ?`;

    // 执行删除并等待结果
    try {
      const ps = await database.prepare(dquery).bind(dirName);
      await ps.run();
      return new Response('Directory deleted successfully.', { status: 200 });
    } catch (error) {
      // 如果删除过程中出现错误，返回错误信息
      return new Response(error.message, { status: 500 });
    }
  } else {
    // 如果目录不存在，返回信息
    return new Response('Directory does not exist.', { status: 404 });
  }
}
