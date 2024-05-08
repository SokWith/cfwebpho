// 在文档的<head>中添加样式
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
`;
document.head.appendChild(style);

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
    loadingElement.style.animation = 'blink 1s linear infinite';

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
    const uphostUrl = '.';
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

// 定义host URL和上传端点
const hostUrl = 'https://' + window.location.hostname;
const uploadEndpoint = '/upload';

// 在文档加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitPhoto');
    const urlTextArea = document.getElementById('photoUrl');
    const realFileInput = document.createElement('input');
    realFileInput.type = 'file';
    realFileInput.multiple = true;
    realFileInput.style.display = 'none';

    // 将文件输入元素添加到DOM中，但不显示
    document.body.appendChild(realFileInput);

    // 当点击“批量添加图片”按钮时触发文件输入元素的点击事件
    submitButton.addEventListener('click', function(event) {
        if (urlTextArea.value.trim() === '') {
            event.preventDefault();
            realFileInput.click();
        } else {
            AsubmitPhoto();
        }
    });

    // 处理文件选择
    realFileInput.addEventListener('change', function() {
        const uploadPromises = Array.from(realFileInput.files).map(file => {
            // 调用函数上传图片并获取URL
            return uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不是OK状态');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    // 创建一个变量来存储完整的图片URL
                    const imageUrl = `${hostUrl}${data[0].src}`;
                    // 在控制台输出完整的图片URL
                    console.log(imageUrl);
                    // 返回完整的图片URL
                    return imageUrl;
                });
        });

        Promise.all(uploadPromises)
            .then(fullUrls => {
                // 将获取到的URLs添加到文本区域
                urlTextArea.value = fullUrls.join('\n');

                // 使用新的URLs重新提交表单
                //form.submit();
                // 模拟点击“add”按钮
                submitButton.click();
            })
            .catch(error => {
                console.error('上传失败:', error);
            });
    });
});
