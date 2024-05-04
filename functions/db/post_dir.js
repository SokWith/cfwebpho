export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database1 = context.env.webpho_db;
  const database = context.env.db_phostore;
  const { username, dirName } = await request.json();
  const fullname = username + '_' + dirName;
  const imgUrl = '';

  return new Response(JSON.stringify(fullname), { status: 200 });
  

  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }

 // 检测目录是否存在
  // 构建SQL查询语句
  const fquery = 'SELECT ad_name FROM webphostore WHERE ad_name = ?';

  // 执行查询并等待结果
  let result;
  try {
    const ps = await database.prepare(fquery).bind(fullname);
    //await ps.bind(fullname);
    result = await ps.all();
   // return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }

  // 如果目录存在，返回确认信息
  if (result.results && result.results.length > 0){
    return new Response('Dir is here!', { status: 209 });
  } else {
    // 构建SQL插入语句
    const query = 'INSERT INTO webphostore (ad_name, imgURL) VALUES (?, ?)';

    // 执行插入并等待结果
    try {
      const ps = await database.prepare(query).bind(fullname, imgUrl);
      await ps.run();
      return new Response('Data inserted successfully.', { status: 200 });
    } catch (error) {
      // 如果插入过程中出现错误，返回错误信息
      return new Response(error.message, { status: 500 });
    }
  }
}
