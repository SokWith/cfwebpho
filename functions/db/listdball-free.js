//functions/db/listdb-free.js
export async function onRequest(context) {
  // 从环境变量中获取数据库连接
  const database = context.env.webpho_db;
  const url = new URL(context.request.url);
  const ms = url.searchParams.get('m');
  const ns = url.searchParams.get('n');

  const m = parseInt(ms, 10); // 第二个参数10表示十进制
  const n = parseInt(ns, 10);

// 检查数据库连接是否已定义
  if (!database) {
    return new Response('Database connection not found.', { status: 500 });
  }

// 获取数据库中所有表的列表
 // const tablesListsq = await database.prepare('PRAGMA table_list');
 // const tablesList  =  await tablesListsq.raw();


  // 获取数据库中所有表的列表
const tablesListsq = await database.prepare('PRAGMA table_list');
const tablesListMultiDimensional = await tablesListsq.raw();

// 提取表名，创建一个一维数组
const tablist = tablesListMultiDimensional.map(table => table[1]);
const excludeData = ["_cf_KV", "sqlite_schema", "sqlite_temp_schema"];
const tablesList = tablist.filter(table => !excludeData.includes(table));

//console.log(tablesList);

// 初始化一个数组来存储所有结果
let allResults = [];

// 遍历所有表，查询imgURL列数据
for (const tableName of tablesList) {
  // 获取表的架构信息
  const  tableInfosq = await database.prepare(`PRAGMA table_info(${tableName})`);
   const  tableInfo = await tableInfosq.raw();
  // 检查是否存在imgURL列
  const   hasImgURLColumn = tableInfo.some(column => column.includes('imgURL'));
  if (hasImgURLColumn) {
    // 构建查询imgURL列数据的SQL语句
     const   queryImgURL = `SELECT imgURL FROM ${tableName} ORDER BY udatatime DESC LIMIT ?`; //ORDER BY udatatime DESC LIMIT m
    // 执行查询并获取结果
     const   imgURLsq = await database.prepare(queryImgURL).bind(m);
    const    imgURLs = await imgURLsq.raw();
    console.log(imgURLs);
    // 将结果添加到allResults数组
   // allResults.push(tableName);
      allResults.push(imgURLs);
  }
}


//console.log(allResults);
 //allResults.push(tablesList);
 //  return new Response(JSON.stringify(allResults), {
 //   headers: { 'Content-Type': 'application/json' },
 //   status: 200
 // });

  // 对所有结果按udatatime降序排列并取最大m行
//allResults.sort((a, b) => b.udatatime - a.udatatime);
//allResults = allResults.slice(0, m);

// 返回查询结果
//return new Response(JSON.stringify(allResults), {
//  headers: { 'content-type': 'application/json' },
//});
// 提取imgURL的值，构成1维数组
//const imgURLsArray = allResults.map(result => result[0]);
    
 //   let photosString  = imgURLsArray.map(item => item[0]); // 假设字符串在数组的第一个位置
  // 使用 join() 方法将数组元素连接成一个字符串，然后用 split() 方法以回车符分割
    const allurls = allResults.flat(Infinity).join().split(/,|\n/);
    // 使用 filter() 方法移除所有空字符串
    const urls = allurls.filter(url => url.trim() !== '');
 //  return new Response(JSON.stringify(urls), {
 //   headers: { 'Content-Type': 'application/json' },
 //   status: 200
//  });
  // 如果获取的URL数量不足n个，则使用所获取的最大数量
  const maxUrls = urls.length < n ? urls.length : n;

  // 随机抽取n个URL
  const selectedUrls = urls.sort(() => Math.random() - 0.5).slice(0, maxUrls);

  return new Response(JSON.stringify(selectedUrls), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
  

}
