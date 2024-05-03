export async function onRequest(context) {
  // 直接从环境变量中获取数据库连接
  const database = context.env.webpho_db;

  // 构建SQL查询语句
  const query = 'SELECT * FROM webphostore WHERE ad_name LIKE ?';

  // 执行查询并等待结果
  const result = await database.query(query, ['aaaaaa_%']);

  // 返回查询结果
  return new Response(JSON.stringify(result), { status: 200 });
}
