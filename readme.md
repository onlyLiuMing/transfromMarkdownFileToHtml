使用说明
=====

- markdown文件夹中必须有list.md和content.md两个文件
- list.md是左侧导航栏
- content.md是右侧内容
- list中的名字必须与content中的内容相对应

环境
-----
- 需要node > 9.0（安装最新的就行了）
- 可以选择用yarn管理包，自带的npm也可以

安装步骤
-----
1. 去node官网下载最新的node（https://nodejs.org/zh-cn/ ）
2. 将node中的/node_path/bin/node 和 /node_path/bin/npm 链接到/usr/local/bin目录下（设为全局变量也可以）
3. 在此目录下（项目目录）执行 `npm install`

使用
-----
1. 将所需的markdown文件放置./markdown/文件夹下
2. 执行 `npm run start`
3. 目标文件将输出在./output文件夹下