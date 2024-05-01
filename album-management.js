// JavaScript代码，用于管理相册页面的功能

// 解析URL参数
const params = new URLSearchParams(window.location.search);
const username = params.get('username');
const directory = params.get('directory');
document.getElementById('albumTitle').textContent = `管理${directory}相册`;

// 页面加载时获取照片
async function getPhotos() {
    const response = await fetch(`./get-photos?username=${username}&directory=${directory}`);
    const photoUrls = await response.json();
    const photoWall = document.getElementById('photoWall');
    photoUrls.forEach(url => {
        let imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');

        let img = document.createElement('img');
        img.src = url;
        img.style.width = '100px'; // 设置图片大小
        img.onclick = function() {
            document.getElementById('myModal').style.display = "block";
            document.getElementById('img01').src = this.src;
        }
        imgContainer.appendChild(img);

        // 添加删除按钮
        let deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function() {
            // 执行删除操作
            deletePhoto(url);
        };
        imgContainer.appendChild(deleteButton);

        photoWall.appendChild(imgContainer);
    });
}

// 删除照片的函数
async function deletePhoto(photoUrl) {
    const response = await fetch('./delete-photo', {
        method: 'POST',
        body: JSON.stringify({ username, directory, photoUrl }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        window.location.reload();
    } else {
        console.error('Failed to delete photo');
    }
}

// 提交图片的函数
async function submitPhoto() {
    const photoUrls = document.getElementById('photoUrl').value.trim().split('\n');
    const validPhotoUrls = photoUrls.filter(url => url.trim() !== '');
    const photoUrlsString = validPhotoUrls.join('\n');
    const response = await fetch('./submit-photos', {
        method: 'POST',
        body: JSON.stringify({ username, directory, photoUrlsString }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        window.location.reload();
    } else {
        console.error('Failed to submit photo');
    }
}

// 获取模态窗口元素
var modal = document.getElementById('myModal');
// 获取 <span> 元素，用于关闭模态窗口
var span = document.getElementsByClassName("close")[0];

// 当用户点击 <span> (x), 关闭模态窗口
span.onclick = function() {
    modal.style.display = "none";
}

// 图片上传和压缩的JavaScript代码
function uploadImageAndGetFullUrl(uploadEndpoint, hostUrl, file) {
    const formData = new FormData();
    formData.append('file', file);

    // 显示加载动画
    const loadingElement = document.createElement('div');
    loadingElement.textContent = '图片加载中...';
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

    // 图片压缩功能
    return imageCompression(file, { maxSizeMB: 1 })
        .then(compressedFile => {
            formData.set('file', compressedFile);
            return fetch(`${hostUrl}${uploadEndpoint}`, {
                method: 'POST',
                body: formData
            });
        })
        .then(response => {
            // 移除加载动画
            document.body.removeChild(loadingElement);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            return `${hostUrl}${data.path}`;
        })
        .catch(error => {
            console.error('上传失败:', error);
        });
}

// 文档加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitPhoto');
    const photoUrlInput = document.getElementById('photoUrl');

    submitButton.addEventListener('click', function(event) {
        if (!photoUrlInput.value.trim()) {
            event.preventDefault();
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.onchange = function(e) {
                const file = e.target.files[0];
                uploadImageAndGetFullUrl('/upload', 'https://imghost.example.com', file)
                    .then(fullUrl => {
                        photoUrlInput.value = fullUrl;
                        // 可以在这里添加提交表单的代码
                    });
            };
            fileInput.click();
        }
    });
});

// 确认删除图片的函数
function confirmDelete() {
    return confirm('确定要删除这张图片吗？');
}

// 页面加载时执行获取照片的函数
getPhotos();
