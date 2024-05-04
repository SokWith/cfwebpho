//functions/db/listdb-free.js
export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const url = new URL(context.request.url);
  const m = url.searchParams.get('m');
  const n = url.searchParams.get('n');

// 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }

  // 构建SQL查询语句
  //const query = 'SELECT imgURL FROM webphostore ORDER BY update_timestamp DESC LIMIT ?';
  const query = 'SELECT imgURL FROM webphostore  LIMIT ?';

  // 执行查询并等待结果
  try {
    const ps = await database.prepare(query).bind(m);
    const photosStringArray = await ps.raw();
    return new Response(JSON.stringify(photosStringArray), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
  } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }


}
