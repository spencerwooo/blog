---
title: "Tiny Tiny RSS | 最速部署私有 RSS 服务器"
date: 2019-11-18T12:23:07+08:00
draft: true
show_in_homepage: true
show_description: true
tags:
- RSS
- Tech
- Server
categories:
- Play with servers
featured_image: https://i.loli.net/2019/10/29/ZqySW1DFQvUs7G8.png
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

### 利用 Docker 安装 Tiny Tiny RSS

首先安装 Docker 本体，在服务器上面执行下面命令来安装 Docker：

```bash
curl -fsSL https://get.docker.com/ | sh
```

然后启动 Docker 服务：

```bash
sudo systemctl start docker
```

安装 docker-compose：

```bash
curl -L https://github.com/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

```bash
chmod +x /usr/local/bin/docker-compose
```

下载 Awesome-TTRSS 配置的 Tiny Tiny RSS 服务的 docker-compose 配置文件：

```bash
mkdir ttrss && cd ttrss
```

```bash
curl -fLo docker-compose.yml https://github.com/HenryQW/Awesome-TTRSS/raw/master/docker-compose.yml
```

修改 docker-compose.yml 里面的内容，比如密码、端口等等。

启动 Tiny Tiny RSS 服务：

```bash
docker-compose up -d
```

### 配置 HTTPS 证书

## 定制 Tiny Tiny RSS

## 尾巴