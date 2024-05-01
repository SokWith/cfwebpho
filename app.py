import os

# 以下是一个详细的cf pages应用的伪代码示例：

# 欢迎页面
username = input("请输入用户名（6个以上普通字符或数值的组合）：")
if len(username) < 6:
    print("用户名长度需大于等于6个字符")
else:
    # 进入相册界面
    kv_space_name = os.getenv("cfwebstore")
    directory_list = get_directory_list(kv_space_name, username)
    display_directory_list(directory_list)
    
    # 创建目录
    create_directory_input = input("请输入目录名：")
    create_directory_button = Button("创建目录")
    if create_directory_button.clicked:
        create_directory(kv_space_name, username, create_directory_input)
        refresh_page()

# 相册管理界面
def open_album(kv_space_name, username, directory_name):
    album_data = get_album_data(kv_space_name, username, directory_name)
    display_album(album_data)
    
    # 添加照片
    add_photo_input = input("请输入图片URL地址，图片名称：")
    add_photo_button = Button("批量提交图片")
    if add_photo_button.clicked:
        add_photos_to_directory(kv_space_name, username, directory_name, add_photo_input)
        refresh_page()

# 从KV空间提取密钥和值的操作
def get_directory_list(kv_space_name, username):
    keys = get_keys_from_kv(kv_space_name, username)
    directory_list = []
    for key in keys:
        directory_name = key.split("_", 1)[1]
        directory_list.append(directory_name)
    return directory_list

def get_album_data(kv_space_name, username, directory_name):
    key = username + "_" + directory_name
    album_data = get_value_from_kv(kv_space_name, key)
    return album_data

def create_directory(kv_space_name, username, directory_name):
    key = username + "_" + directory_name
    create_key_in_kv(kv_space_name, key, "")

def add_photos_to_directory(kv_space_name, username, directory_name, photo_input):
    key = username + "_" + directory_name
    photos = photo_input.split(";")
    for photo in photos:
        add_photo_to_kv(kv_space_name, key, photo)

# 显示照片墙
def display_album(album_data):
    for photo_info in album_data.split(";"):
        photo_url, photo_name = photo_info.split(":")
        display_photo(photo_url, photo_name)

def display_photo(photo_url, photo_name):
    # 在页面上以照片墙的形式展示图片URL和名称
    print(f"<img src='{photo_url}' alt='{photo_name}'>")
