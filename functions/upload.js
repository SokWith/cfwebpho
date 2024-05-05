// functions/upload.js
export async function onRequest(context) {
  const { request, env } = context;
  // 设置CORS头部
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // 允许所有域的访问
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // 允许的方法
    'Access-Control-Allow-Headers': 'Content-Type', // 允许的请求头
    'Access-Control-Max-Age': '86400', // 预检请求的有效期
  };

  // 处理OPTIONS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  if (request.method === 'POST') {
    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('file');
    
    // 使用提供的API地址和方法上传文件https://telegra.ph
    const uploadResponse = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: formData
    });

    // 返回上传结果，并添加CORS头部
    return new Response(await uploadResponse.text(), {
      headers: {
        ...corsHeaders,
        'content-type': 'text/plain'
      }
    });
  } else {
    // 返回一个简单的文件上传表单，并添加CORS头部
    const form = `
      <html>
        <body>
          <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <input type="submit" value="Upload" />
          </form>
        </body>
      </html>
    `;

    return new Response(form, {
      headers: {
        ...corsHeaders,
        'content-type': 'text/html'
      }
    });
  }
}
