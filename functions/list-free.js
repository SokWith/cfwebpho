export async function list-free(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const m = url.searchParams.get('m');
  const n = url.searchParams.get('n');

 //const KV_NAMESPACE = 'webphostore';
  // 获取KV空间中最近m个密钥的列表
  const keysList = await context.env.webphostore.list({ limit: m });
  const keys = keysList.keys.map(key => key.name);
  console.log(keys);

  let urls = [];
  for (const key of keys) {
    const value = await context.env.webphostore.get(key);
    if (value) {
      // 假设每个密钥的值都是以换行符分隔的URL字符串
      urls.push(...value.split('\n'));
    }
  }

  // 如果获取的URL数量不足n个，则使用所获取的最大数量
  const maxUrls = urls.length < n ? urls.length : n;

  // 随机抽取n个URL
  const selectedUrls = urls.sort(() => Math.random() - 0.5).slice(0, maxUrls);

  return new Response(JSON.stringify(selectedUrls), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}
