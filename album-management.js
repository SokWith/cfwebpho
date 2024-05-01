// album-management.js
function uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        // 显示加载动画
        const loadingElement = document.createElement('div');
        loadingElement.textContent = '图片加载中...';
        // ...省略其他加载动画样式代码...

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
                    resolve(`${hostUrl}${data.path}`);
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
                resolve(`${hostUrl}${data.path}`);
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
        const uploadPromises = Array.from(files).map(file => {
            return uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file);
        });

        Promise.all(uploadPromises)
            .then(fullUrls => {
                photoUrlInput.value = fullUrls.join('\n');
                // 这里可以添加提交表单的逻辑
            })
            .catch(error => {
                console.error('上传失败:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupFileInputAndUpload('/upload', 'https://imghost.example.com');
});
