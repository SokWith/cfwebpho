export async function onRequestGet({ request, env, params }) {
  // 使用params获取URL参数
  const name = params.name;
  const response = await fetch(`https://telegra.ph/file/${name}`);

  // 创建新的Response对象并返回
  return new Response(response.body, {
    headers: response.headers,
  });
}
