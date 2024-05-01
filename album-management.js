// album-management.js
function uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file, callback) {
    const formData = new FormData();
    formData.append('file', file);

    // 显示加载动画
    // ...省略加载动画代码...

    // 图片压缩和上传的逻辑
    const uphostUrl = 'https://testupimg.wook.eu.org';
    imageCompression(file, { maxSizeMB: 1 })
        .then(compressedFile => {
            formData.set('file', compressedFile);
            return fetch(`${uphostUrl}${uploadEndpoint}`, {
                method: 'POST',
                body: formData
            });
        })
        .then(response => {
            // 移除加载动画
            if (!response.ok) {
                throw new Error('网络响应不是OK状态');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            callback(`${hostUrl}${data.path}`);
        })
        .catch(error => {
            console.error('上传失败:', error);
        });
}

function setupFileInputAndUpload(uploadEndpoint, hostUrl) {
    const photoUrlInput = document.getElementById('photoUrl');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file, function(fullUrl) {
                photoUrlInput.value = fullUrl;
                // 这里可以添加提交表单的逻辑
            });
        }
    });

    photoUrlInput.addEventListener('click', function() {
        if (!photoUrlInput.value) {
            fileInput.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupFileInputAndUpload('/upload', 'https://imghost.wook.eu.org');
});
