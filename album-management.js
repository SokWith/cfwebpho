// album-management.js
function uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

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

        // 检查文件大小，如果大于5MB，则压缩
        const uphostUrl = 'https://testupimg.wook.eu.org';
        if (file.size > 5242880) { // 1MB
            imageCompression(file, { maxSizeMB: 5 })
                .then(compressedFile => {
                    formData.set('file', compressedFile);
                    return fetch(`${uphostUrl}${uploadEndpoint}`, {
                        method: 'POST',
                        body: formData
                    });
                })
                .then(response => response.json())
                .then(data => {
                    document.body.removeChild(loadingElement); // 移除加载动画
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    resolve(`${hostUrl}${data[0].src}`);
                })
                .catch(error => {
                    document.body.removeChild(loadingElement); // 移除加载动画
                    reject(error);
                });
        } else {
            fetch(`${hostUrl}${uploadEndpoint}`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                document.body.removeChild(loadingElement); // 移除加载动画
                if (data.error) {
                    throw new Error(data.error);
                }
                resolve(`${hostUrl}${data[0].src}`);
            })
            .catch(error => {
                document.body.removeChild(loadingElement); // 移除加载动画
                reject(error);
            });
        }
    });
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
    if (files.length > 0) {
        // 处理文件上传的逻辑
            const uploadPromises = Array.from(files).map(file => {
            return uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file);
    } 

        Promise.all(uploadPromises)
            .then(fullUrls => {
                photoUrlInput.value = fullUrls.join('\n');
                // 这里可以添加提交表单的逻辑
            })
            .catch(error => {
                console.error('上传失败:', error);
            });
    }else {
        // 如果没有选择文件，确保不会执行其他操作
        event.preventDefault();
    }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    setupFileInputAndUpload('/upload', 'https://imghost.example.com');
});
