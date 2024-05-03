// functions/get-directories.js
export async function onRequestGet(context) {
  // 解构环境变量和请求对象
  const { D1_DATABASE, request } = context;
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  // 构建查询D1数据库的SQL语句
  const query = `SELECT ad_name FROM webphostore WHERE username = ?`;

  // 执行查询并获取结果
  const result = await D1_DATABASE.query(query, [username]);

  // 提取目录名
  const directories = result.rows.map(row => row.ad_name);

  return new Response(JSON.stringify(directories), { status: 200 });
}
