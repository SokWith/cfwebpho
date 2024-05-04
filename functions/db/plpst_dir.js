export async function onRequest(context) {
  // 从环境变量中获取数据库连接
 // const database = context.env.webpho_db;
 // const database = context.env.db_phostore;
  const { username, dirName } = await context.request.json();
//  const fullname = username + '_' + dirName;
 // const imgUrl = '';

  return new Response(JSON.stringify(username,dirName), { status: 200 });
 
