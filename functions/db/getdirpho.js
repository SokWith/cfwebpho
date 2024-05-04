// functions/get-photos.js
export async function onRequestGet(context) {
 // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const { username, dirName, photoUrl } = await context.request.json();
  const fullname = `${username}_${dirName}`;
  const imgUrl = '${photoUrl}';
  
  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }
  // 构建SQL查询语句
  const query = 'SELECT imgURL FROM webphostore WHERE ad_name = ?';

  // 执行查询并等待结果
  try {
    const ps = await database.prepare(query).bind(username);
   // const photosString = await ps.raw();
    const photosStringArray = await ps.raw();
  
  const photosString  = photosStringArray[0][0]; // 假设字符串在数组的第一个位置
  //    const photosStringtp = typeof photosString; 
  //  console.log(photosString);


    // 将字符串按换行符分割成数组，每个元素是一个图片URL
  const result = photosString ? photosString.split('\n') : [];
    return new Response(JSON.stringify(result), { status: 200 });
  // return new Response( photosStringtp, { status: 200 });
  } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }
}
