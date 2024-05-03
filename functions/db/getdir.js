export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;

  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }

  // 构建SQL查询语句
  const query = 'SELECT ad_name FROM webphostore WHERE ad_name LIKE ?';

  // 准备SQL查询语句
  const stmt = database.prepare(query);

  // 绑定参数
  stmt.bind(['aaaaaa_%']);

  // 执行查询并等待结果
  try {
    const result = await stmt.execute();
    const rows = await result.toArray();

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }
}
