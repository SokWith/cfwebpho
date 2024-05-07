export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  //const database = context.env.db_phostore;
  const url = new URL(context.request.url);
  //let username = url.searchParams.get('username') + '_%';
 // console.log(username);

  // 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }

 // 从URL参数中获取表名
const tableName = url.searchParams.get('username');

// 使用PRAGMA table_info来检查表是否存在
//const ckps = await database.prepare(`PRAGMA table_info(${tableName})`);

 // const checkTableExists = await ckps.raw();
  //return new Response(JSON.stringify(checkTableExists), { status: 200 });

       // 验证表名
  if (!/^[a-zA-Z0-9]+$/.test(tableName)) {
    return new Response('Invalid table name.', { status: 400 });
  }

  // 构建创建表的SQL语句
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ad_name TEXT,
      imgURL TEXT,
      udatatime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  //  const createTableStmt = await database.prepare(`CREATE TABLE ${tableName} (ad_name TEXT, imgURL TEXT, udatatime TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  const createTableStmt = await database.prepare(createTableQuery);
  await createTableStmt.run();



  // 使用PRAGMA table_info来检查表是否存在
  //const reckps = await database.prepare(`PRAGMA table_info(${tableName})`);
  //const recheckTableExists = await reckps.all();
  // return new Response(JSON.stringify(recheckTableExists), { status: 200 });
  
   // 构建SQL查询语句
  const query = `SELECT ad_name FROM ${tableName}`;

  // 执行查询并等待结果
  try {
    const ps = await database.prepare(query);
    const result = await ps.raw();
    const formattedResult = result.map(row => row[0]);
    return new Response(JSON.stringify(formattedResult), { status: 200 });
  } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }
  
  
 
}
