// album-management.js
// JavaScript函数，用于上传单个图片并返回完整的URL地址
function uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file) {
    const formData = new FormData();
    // 动态创建加载动画元素并添加到页面中
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.textContent = '图片加载中......';
    document.body.appendChild(loadingElement);

    // 应用加载动画的样式
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';
    loadingElement.style.fontSize = '20px';
    loadingElement.style.color = '#333';
    loadingElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    loadingElement.style.padding = '10px';
    loadingElement.style.borderRadius = '5px';
    loadingElement.style.zIndex = '1000';
    //loadingElement.style.animation = 'blink 1s linear infinite';

    // 图片压缩功能
  function handleCompressFile(file) {
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  return new Promise((resolve) => {
    if (file.size <= maxFileSize || !file.type.startsWith("image")) {
      resolve(file);
    } else {
      imageCompression(file, { maxSizeMB: 5 })
        .then((compressedFile) => {
          resolve(compressedFile);
        })
        .catch((error) => {
          console.error(">> imageCompression error", error);
          resolve(file);
        });
    }
  });
}

  

    // 压缩图片并上传
  const uphostUrl = 'https://testupimg.wook.eu.org';
    //'https://testupimg.sokwith.workers.dev'
    return handleCompressFile(file).then(compressedFile => {
        formData.append("file", compressedFile);
        return fetch(`${uphostUrl}${uploadEndpoint}`, {
            method: 'POST',
            body: formData
        }).finally(() => {
            // 移除加载动画元素
            document.body.removeChild(loadingElement);
        });
    });
}

  

    // 压缩图片并上传
  const uphostUrl = 'https://testupimg.wook.eu.org';
    //'https://testupimg.sokwith.workers.dev'
    return handleCompressFile(file).then(compressedFile => {
        formData.append("file", compressedFile);
        return fetch(`${uphostUrl}${uploadEndpoint}`, {
            method: 'POST',
            body: formData
        }).finally(() => {
            // 移除加载动画元素
            document.body.removeChild(loadingElement);
        });
    });
}

}

function setupFileInputAndUpload(uploadEndpoint, hostUrl) {
    const submitButton = document.getElementById('submitPhoto');
    const photoUrlInput = document.getElementById('photoUrl');
    const realFileInput = document.createElement('input');
    realFileInput.type = 'file';
    realFileInput.multiple = true;
    realFileInput.style.display = 'none';
    document.body.appendChild(realFileInput); // 将文件输入元素添加到DOM中

    submitButton.addEventListener('click', function(event) {
        if (!photoUrlInput.value) {
            event.preventDefault(); // 阻止表单提交
            realFileInput.click(); // 打开文件选择对话框
        } else {
            // 这里可以添加提交表单的逻辑
        }
    });

    realFileInput.addEventListener('change', function(event) {
    const files = event.target.files;
    const uploadPromises = Array.from(files).map(file => {
        return uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file);
    });

    Promise.all(uploadPromises)
        .then(responses => {
            const fullUrls = responses.map(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                return `${hostUrl}${data[0].src}`; // 使用 data[0].src 获取第一个图片的URL
            });
            photoUrlInput.value = fullUrls.join('\n');
            // 这里可以添加提交表单的逻辑
        })
        .catch(error => {
            console.error('上传失败:', error);
        });
});

}

document.addEventListener('DOMContentLoaded', function() {
    setupFileInputAndUpload('/upload', 'https://imghost.wook.eu.org');
});
