---
title: "Tiny Tiny RSS | 最速部署私有 RSS 服务器"
date: 2019-11-18T12:23:07+08:00
draft: false
show_in_homepage: true
show_description: true
tags:
- RSS
- Tech
- Server
categories:
- Play with servers
featured_image: https://i.loli.net/2019/11/20/hbFSq6CwI1VNfJL.png
featured_image_preview: ''
comment: true
toc: true
autoCollapseToc: true
---

9012 年了，别的小朋友们服务器上面跑着各式各样的东西：博客、云盘、监控脚本……再看看我们那台闲（bai）置（piao）很久的阿里云 Server，里面的 Git 竟然还是 1.8 的上古版本。🤦‍♂️ 不如把那台服务器拿出来，部署一个属于自己的 RSS 服务器，甚至可以跟同学们一起用呢～

## RSS

首先我们来说一说 RSS。RSS 的全称是 Really Simple Syndication（简易信息聚合），它是一种消息来源的格式规范，网站可以按照这种格式规范提供文章的标题、摘要、全文等信息给订阅用户，用户可以通过订阅不同网站 RSS 链接的方式将不同的信息源进行聚合，在一个工具里阅读这些内容。

对于第一次接触 RSS 的同学，推荐大家阅读：[高效获取信息，你需要这份 RSS 入门指南](https://sspai.com/post/56391)，进行扫盲。

市面上有非常多的 RSS 聚合服务，来帮助我们统一管理、订阅、更新、筛选 RSS 源推送给我们的更新信息，避免我们被海量的文章淹没，也能保证我们多个设备上 RSS 的阅读进度一致。Feedly、Inoreader 等等都是非常不错的 RSS 服务，但是它们的免费版本都有着一定的限制，有时候无法满足我们的全部功能需求，而动辄一个月数十刀的订阅费用又让人望而却步。不慌，开源的 RSS 服务：Tiny Tiny RSS 可以满足我们 RSS 订阅的全部需求！

## Tiny Tiny RSS 的搭建

![使用 Feedly 主题的 Tiny Tiny RSS 服务端](https://i.loli.net/2019/11/19/aCty2KspU5f1gHr.jpg)

Tiny Tiny RSS 是一个非常优秀的开源免费 RSS 服务引擎，可以直接部署在我们自己的服务器上面，借助于 Docker 优秀方便的容器技术和 Let’s Encrypt 异常简单的 SSL 证书签署机器人 `certbot`，我们几分钟之内就可以部署上线属于我们自己的 RSS 服务，运行在我们可控的服务器上，环境稳定，刷新及时，并且完全免费。👍（当然，除了服务器需要一定的费用。）

在容器、HTTPS 证书自动签署和虚拟化技术极度发达的今天，整个部署过程非常方便简单。我接下来只利用 iPad 进行讲解演示我们的部署过程。请大家坐和放宽，我们立刻开始。

### 准备工作

在开始之前，首先我们需要准备一个位于公网的服务器，以及一个可以通过 SSH 连接到服务器上的本地设备。这里我使用我同（bai）学（piao）的已经备案的阿里云服务器作为运行 Tiny Tiny RSS 的服务器，并使用 iPad 和 Blink Shell（一个支持 SSH 协议的 iOS 终端 App）作为我的操作设备。Blink Shell 是 iPad 上面最好用的 SSH/Mosh 工具，推荐大家使用。我们在 Blink Shell 中配置好服务器私钥，通过 SSH 登录服务器。

![利用 Blink Shell 登录至服务器](https://i.loli.net/2019/11/19/iyk8KrUBYzodPqS.jpg)

### 利用 Docker 部署 Tiny Tiny RSS

Docker 是非常优秀的虚拟化容器，借助于 Docker 我们可以方便的部署 Tiny Tiny RSS，首先我们在服务器上安装 Docker 本体。在服务器上面执行下面命令来安装 Docker：

```bash
curl -fsSL https://get.docker.com/ | sh
```

然后启动 Docker 服务：

```bash
sudo systemctl start docker
```

然后，我们检查一下 Docker 是否启动成功。我们执行命令：`sudo systemctl status docker`：

![检查 Docker 服务状态](https://i.loli.net/2019/11/20/L6VicoJy8OCBpxq.jpg)

看到如上的输出，说明我们 Docker 服务启动成功。

*参考资料：[Get Docker Engine - Community for CentOS | Docker Documentation](https://docs.docker.com/install/linux/docker-ce/centos/)*

接下来我们安装 `docker-compose`：一个管理和启动多个 Docker 容器的工具。由于 Tiny Tiny RSS 依赖有 PostgreSQL 的数据库服务以及 [mercury_fulltext](https://github.com/HenryQW/mercury_fulltext) 的全文抓取服务等等，这些服务我们都借助于 Docker 部署，因此利用 `docker-compose` 就会大大降低我们的部署难度。

我们继续，在服务器上面执行下面的命令来安装 `docker-compose`：

```bash
curl -L https://github.com/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

之后给予安装好的 `docker-compose` 可执行权限：

```bash
chmod +x /usr/local/bin/docker-compose
```

*参考资料：[Install Docker Compose | Docker Documentation](https://docs.docker.com/compose/install/)*

最后我们运行 `docker-compose --version` 来检查安装是否成功。如果有如下输出，说明我们的 `docker-compose` 安装成功：

![检查 docker-compose 安装情况](https://i.loli.net/2019/11/20/6j3QgG1FszTPp5Y.jpg)

准备工作已经全部完成，接下来我们下载由 Awesome-TTRSS 配置的 Tiny Tiny RSS 服务的 docker-compose 配置文件：

```bash
# 创建 ttrss 目录并进入
mkdir ttrss && cd ttrss

# 利用 curl 下载 ttrss 的 docker-compose 配置文件至服务器
curl -fLo docker-compose.yml https://github.com/HenryQW/Awesome-TTRSS/raw/master/docker-compose.yml
```

修改 docker-compose.yml 里面的内容：

![修改 docker-compose 配置文件](https://i.loli.net/2019/11/20/sn4MP8uvb3WIzDt.png)

- 在配置文件的第 7 行和第 23 行，将 PostgreSQL 数据库的默认密码进行修改。暴露在公网的数据库使用默认密码非常危险。
- 在配置文件的第 18 行，将 Tiny Tiny RSS 服务的部署网址修改。比如我的部署网址是 `https://ttrss.tenkeyseven.com/`
	- 注意，如果你的部署 URL 包含端口（比如默认部署端口为 181 端口），那么这里的 URL 也需要加上端口号，格式为 `{网址}:{端口}`
	- 不过不必担心，如果你这里的 URL 配置不正确，那么访问 Tiny Tiny RSS 的时候，Tiny Tiny RSS 会提醒你修改这里的值为正确的 URL，按照提醒进行配置即可

之后，我们保存配置文件，启动 Tiny Tiny RSS 服务。在刚刚的 `ttrss` 目录下执行：

```bash
docker-compose up -d
```

等待脚本执行完成，如果一切没有问题，那么接下来输入 `docker ps`，我们应该看到类似下面的结果：

![查看正在运行的 Docker 容器](https://i.loli.net/2019/11/20/AxTdoa7YJCgI5i4.jpg)

上面内容表示我们开启了四个 Docker 容器，分别是：

- Tiny Tiny RSS 本身，监听端口为 `0.0.0.0:181 -> 80`，同时暴露给外网
- PostgreSQL 数据库，仅供内部使用
- Mercury 全文抓取服务，仅供内部使用
- OpenCC 简体、繁体中文转换服务，仅供内部使用

如果发现问题，修改 docker-compose 配置文件后，需要执行下面的命令重启 Docker 容器们：

```bash
# 关闭 Docker 容器们
docker-compose down

# 删除已停止的 Docker 容器
docker-compose rm

# ……
# 修改 docker-compose 配置文件
# ……

# 再次开启 Docker 服务
docker-compose up -d
```

### 安装 Nginx 作为 Docker 容器的反向代理

事实上，到上一步，如果我们访问 `{服务器 IP}:181`，应该可以直接看到 Tiny Tiny RSS 的 Web 前端，但是 Tiny Tiny RSS 并不能直接配置 SSL 证书，也就没法添加 HTTPS 支持。我们利用 Nginx 作为反向代理服务器，即可方便的给 Tiny Tiny RSS 单独绑定一个我们希望的域名，并利用 Let’s Encrypt 来部署 HTTPS。

首先我们来安装 Nginx，以 CentOS 为例，我们直接执行下面命令即可：

```bash
sudo yum install nginx
```

之后开启 Nginx 服务：

```bash
sudo systemctl start nginx
```

检查 Nginx 是否启动成功：

```bash
sudo systemctl status nginx
```

![检查 Nginx 运行状态](https://i.loli.net/2019/11/20/gakiyznx5NhXT16.jpg)

之后，我们利用 Let’s Encrypt 提供的 `certbot` 直接为 Nginx 配置 SSL 证书。首先，我们执行下面的命令安装 `certbot`：

```bash
sudo yum install certbot python2-certbot-nginx
```

然后运行 `certbot` 来签署 SSL 证书并自动配置 Nginx 服务：

```bash
sudo certbot --nginx
```

*参考资料：[Certbot | Nginx on CentOS/RHEL 7](https://certbot.eff.org/lets-encrypt/centosrhel7-nginx)*

在这里，certbot 会要求我们输入我们希望签署 SSL 证书的域名，我们选择为 Tiny Tiny RSS 分配的域名（比如我的就是 `ttrss.tenkeyseven.com`）即可。另外，如果 certbot 询问是否需要将访问该网址的全部流量重定向至 HTTPS，那么选择「是」即可。我们等待脚本执行签署任务完毕，然后重启 Nginx 服务：

```bash
sudo systemctl restart nginx
```

此时我们如果直接访问这一域名，应该就可以看到带有 HTTPS 的 Nginx 默认网站：

![HTTPS 配置成功的 Nginx 默认网站](https://i.loli.net/2019/11/20/jWwRplvBD8oOczJ.jpg)

接下来，我们修改 Nginx 的配置文件，配置 Nginx 反向代理，将访问 `https://ttrss.tenkeyseven.com` 的请求指向我们刚刚部署好的 Tiny Tiny RSS 服务，对服务器来说，也就是 `127.0.0.1:181` 这一地址。（如果你没有更改 Tiny Tiny RSS 的端口号的话。）

Nginx 的配置文件位于 `/etc/nginx/nginx.conf`，我们打开这一文件：

![Nginx 配置文件](https://i.loli.net/2019/11/20/J9yaSejPN1iLnkO.png)

- 在 `http` 项下，`server` 项前定义 `upstream` 服务：

	```
	upstream ttrssdev {
		server 127.0.0.1:181;
		keepalive 64;
	}
	```

	![Nginx upstream 服务声明](https://i.loli.net/2019/11/20/XLAlTsegadr5cPE.jpg)

- 在刚刚 `certbot` 为我们生成好的响应域名 `server` 项下，注释掉第一行定义 `root` 的内容，并将 `location /` 项修改为：
	
	```
	location / {
		proxy_redirect off;
		proxy_pass http://ttrssdev;
		
		proxy_set_header  Host                $http_host;
		proxy_set_header  X-Real-IP           $remote_addr;
		proxy_set_header  X-Forwarded-Ssl     on;
		proxy_set_header  X-Forwarded-For     $proxy_add_x_forwarded_for;
		proxy_set_header  X-Forwarded-Proto   $scheme;
		proxy_set_header  X-Frame-Options     SAMEORIGIN;
		
		client_max_body_size        100m;
		client_body_buffer_size     128k;
		
		proxy_buffer_size           4k;
		proxy_buffers               4 32k;
		proxy_busy_buffers_size     64k;
		proxy_temp_file_write_size  64k;
	}
	```
	
	![Nginx 配置文件：反向代理配置](https://i.loli.net/2019/11/20/LVXAFOfywRB2inr.jpg)

这样，我们再次执行 `sudo systemctl restart nginx` 重启 Nginx 服务，一切顺利的话，我们就可以通过我们刚刚签署 SSL 证书的域名访问我们部署好的 Tiny Tiny RSS 服务了！鼓掌 👏

Tiny Tiny RSS 的默认管理员账户密码是 admin 和 password，请在第一时间进行修改。

## 尾巴

![Tiny Tiny RSS 配置、主题](https://i.loli.net/2019/11/20/cis6yUboY2KStEn.jpg)

Tiny Tiny RSS 的配置到这里就基本结束了，我相信你通过上面的配置一定已经在自己的服务器上部署成功了 Tiny Tiny RSS 服务，并为它添加了 HTTPS 的支持。Tiny Tiny RSS 的功能非常丰富，主题、过滤器、Mercury 以及其他插件的配置，我们另外进行介绍。感谢阅读。

📖 关联阅读：

- [🐋 Awesome TTRSS](https://ttrss.henry.wang/zh/#关于)
- [少数派 sspai - Docker 的入门「指北」](https://sspai.com/post/56893)
- [少数派 sspai - 如何搭建属于自己的 RSS 服务，高效精准获取信息](https://sspai.com/post/41302)