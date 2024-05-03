// functions/db/getdir.js
export async function onRequestGet(context) {
  // 解构环境变量和请求对象
  const { webpho_db, request } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  // 构建查询D1数据库的SQL语句，以匹配以username_开头的ad_name列的值
  const query = `SELECT ad_name FROM webphostore WHERE ad_name LIKE ?`;

  // 执行查询并获取结果
  const result = await context.env.webpho_db.query(query, [`${username}_%`]);

  // 提取目录名
  const directories = result.rows.map(row => row.ad_name);

  return new Response(JSON.stringify(directories), { status: 200 });
}catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }
}
