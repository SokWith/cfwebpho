export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const url = new URL(context.request.url);
  const directory = url.searchParams.get('directory');
  let username = url.searchParams.get('username') + '_' + directory;
  const imgURL = url.searchParams.get('imgURL') || '';
  
  

  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }

 // 构建SQL插入语句
  const query = 'INSERT INTO webphostore (ad_name, imgURL) VALUES (?, ?)';

  // 执行插入并等待结果
  try {
    const ps = await database.prepare(query).bind(username, imgUrl);
    await ps.run();
    return new Response('Data inserted successfully.', { status: 200 });
  } catch (error) {
    // 如果插入过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }
}
