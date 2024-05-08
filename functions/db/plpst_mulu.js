export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const { username, dirName } = await context.request.json();
  const fullname = `${username}_${dirName}`;
  const imgUrl = '';
  
   // 检测目录是否存在
  // 构建SQL查询语句
  const fquery = `SELECT ad_name FROM ${username} WHERE ad_name = ?`;

  // 执行查询并等待结果
  let result;
  try {
    const ps = await database.prepare(fquery).bind(dirName);
    result = await ps.raw();
     } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }

  // 如果目录存在，返回确认信息
  if (result[0] && result[0].length > 0){
    return new Response('Dir is here!', { status: 209 });
  } else {
    const query = `INSERT INTO ${username} (ad_name, imgURL) VALUES (?, ?)`;
    try {
      const dps = await database.prepare(query).bind(dirName, imgUrl);
      await dps.run();
      return new Response('Data inserted successfully.', { status: 200 }); 
      } catch (error) {
         return new Response(error.message, { status: 500 });
      }
   }
  }
