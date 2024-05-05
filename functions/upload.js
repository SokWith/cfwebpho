addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'POST') {
    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('file');
    
    // 使用提供的API地址和方法上传文件
    const uploadResponse = await fetch('https://telegra.ph/upload', {
      method: 'POST',
      body: formData
    });

    // 返回上传结果
    return new Response(await uploadResponse.text(), {
      headers: { 'content-type': 'text/plain' }
    });
  } else if (request.url.endsWith('/upload')) {
    // 返回一个简单的文件上传表单
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
      headers: { 'content-type': 'text/html' }
    });
  } else {
    // 处理其他GET请求
    return new Response('This worker responds to POST requests at /upload', {
      headers: { 'content-type': 'text/plain' }
    });
  }
}
