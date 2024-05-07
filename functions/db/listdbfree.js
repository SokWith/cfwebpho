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
  const query = 'SELECT imgURL FROM webphonstore_all ORDER BY udatatime DESC LIMIT ?';
 // const query = 'SELECT imgURL FROM webphostore  LIMIT ?';

  // 执行查询并等待结果
  try {
    const ps = await database.prepare(query).bind(m);
    const photosStringArray = await ps.raw();
    
    let photosString  = photosStringArray.map(item => item[0]); // 假设字符串在数组的第一个位置
  // 使用 join() 方法将数组元素连接成一个字符串，然后用 split() 方法以回车符分割
    const allurls = photosString.join('\n').split('\n'); 
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

    
  } catch (error) {
    // 如果查询过程中出现错误，返回错误信息
    return new Response(error.message, { status: 500 });
  }


}
