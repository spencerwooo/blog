---
title: 'Tiny Tiny RSS：部署中的普遍问题与注意事项总结'
date: 2020-03-13
published: true
slug: ttrss-noteworthy
tags: ['Server', 'RSS', 'Tech']
cover_image: ./images/ttrss-noteworthy.png
canonical_url: false
description: 'Tiny Tiny RSS 部署踩坑'
---

最近一直在折腾 Tiny Tiny RSS，包括升级、添加样式和持久化。由于我是直接使用了 Awesome TTRSS 项目提供的 `docker-compose.yml` 部署的 Docker 版本 Tiny Tiny RSS，所以一些经验还是具有普遍性、值得分享的。这里我总结一下我在部署 Tiny Tiny RSS 过程中遇到的一些「普遍问题」和「注意事项」。

关于如何在自己的服务器上面部署 Tiny Tiny RSS：

- [Tiny Tiny RSS | 最速部署私有 RSS 服务器](https://blog.spencerwoo.com/2019/11/tiny-tiny-rss/)：我的博客
- [找不到满意的 RSS 服务？你可以自己搭建一个](https://sspai.com/post/57498)：我的少数派文章

:::warning RSS 订阅
另外，订阅我博客 RSS 的同学（来自 Feedly 的数据）已经达到了惊人的 10 个！谢谢各位的关注，没有用 RSS 订阅的同学可以点击下方徽章直接在 Feedly 中订阅。🙇‍♂️

<a href="https://blog.spencerwoo.com/posts/index.xml"><img src="https://img.shields.io/badge/subscribe%20via-RSS-ffa500?logo=rss&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>
<a href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"><img src="https://img.shields.io/badge/dynamic/json?color=2bb24c&amp;label=subscribers&amp;query=%24.source.subscribers&amp;url=https%3A%2F%2Ffeedly.com%2Fv3%2Frecommendations%2Ffeeds%2Ffeed%252Fhttps%253A%252F%252Fblog.spencerwoo.com%252Fposts%252Findex.xml&amp;logo=feedly&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>
:::

## 如何直接更新最新版本的 Tiny Tiny RSS

首先明确一下，更新 Awesome TTRSS 至最新版时，实际上更新了全部组件，包括 Tiny Tiny RSS 本体、主题、插件等等。比如这次更新（2020 年 2 月更新）就将 [Feedly 主题](https://github.com/levito/tt-rss-feedly-theme) 最新的更新中加入的 `feedly-cozy.css`、`feedly-sepia.css` 等等主题全部加入了。

![更新之后加入的最新的 Feedly 主题](https://i.loli.net/2020/03/13/N2rpKWhFJ7RuUMa.png)

我推荐大家手动执行更新。更新 Tiny Tiny RSS 本体：

```bash
docker pull wangqiru/ttrss:latest
```

更新 Mercury 和 OpenCC 服务：

```bash
docker pull wangqiru/mercury-parser-api:latest
docker pull wangqiru/opencc-api-server:latest
```

之后，重启 Tiny Tiny RSS 服务即可：

```bash
docker-compose up -d
```

Awesome TTRSS 项目中提供了 Watch Tower 项目，但是我并不推荐大家通过这一工具进行自动更新，因为 Watch Tower 会将你的全部 Docker 容器更新，可能会导致其他环境的不兼容。

## 如何在编辑 docker-compose 文件之后重启 Tiny Tiny RSS

无论是重新配置了何种环境，是重新映射的 Volume 还是添加了 `docker-compose.yml` 设置，我都推荐直接用这一命令重启 Tiny Tiny RSS 服务：

```bash
docker-compose up -d
```

如果你先运行停止 Docker 容器（`docker-compose down`、`docker-compose rm`）的命令，我都遇到过数据库丢失的情况，因此只要没有特殊需要，**我们都可以只使用上面的命令重启 Tiny Tiny RSS 服务。**

## 如何正确的配置 Fever Emulation API

通常，为了适配第三方 RSS 阅读器比如 Reeder，我们需要使用 Fever Emulation API 进行「登录」。首先我们必须开启 Tiny Tiny RSS 外部 API 访问的权限。在 Preference » General » Enable API 处开启：

![设置允许通过外部 API 访问 Tiny Tiny RSS](https://i.loli.net/2020/03/13/XjfVUsYgFc89eAN.png)

Fever Emulation 的 API 包含有三个部分：

- 你的 Fever API 地址（通常是你的服务器域名 + `/plugins/fever/`）
- 你的登录用户名
- 你的 Fever API 密码

在 Preferences » Personal data / Authentication » Personal data » Full name 处设置的用户名就是你 **Fever API 的用户名**：

![找到你的用户名](https://i.loli.net/2020/03/13/VMza6fixXUPs3g2.png)

在 Preferences » Fever Emulation 处你可以找到：

1. Fever API 地址
2. 设置 Fever API 密码的地方

![获取 Fever API 地址并设置 Fever Emulation 密码](https://i.loli.net/2020/03/13/NXdxu4rbYR3vklc.png)

要知道，设置 Fever API 的密码时点击 Set Password 并不会提示「成功」，不过你可以从 XHR 请求中看到 Password saved 的 response，**所以其实你的密码已经保存啦**。用这里设置的 API 地址、用户名和密码，我们就能成功登录 Reeder 等 RSS 阅读器了。

## 如何设置分栏视图

「分栏视图」就是类似笔记应用的一个侧边栏显示订阅文章列表，另一侧显示文章内容的视图。你可以：

1. 在 Preferences » Preferences » Articles 中关闭 Combined mode 的设置：

   ![关闭 Combined mode](https://i.loli.net/2020/03/13/5onYuC3lBRbja4y.png)

2. 回到主界面，在右上角的汉堡键 » Toggle widescreen mode 处点击打开宽屏模式：

   ![打开宽屏模式](https://i.loli.net/2020/03/13/pTdZRzKOHmMjoru.png)

这样 Tiny Tiny RSS 就会以分栏视图显示文章列表和文章内容了。

![Tiny Tiny RSS 分栏视图](https://i.loli.net/2020/03/13/2wLi7d1hn5SjRtE.png)

另外，我的基于 Feedly 修改的主题配置文件：[GitHub - Gist](https://gist.github.com/spencerwooo/7a373a3c921a50953ec12f329452ee27)

## 如何正确设置 Mercury 全文抓取和 OpenCC 繁简转换 API

如果你使用了 Awesome TTRSS 中包含的 Mercury 全文抓取和 OpenCC 繁简转换 API，那么你应该在 `docker ps` 的输出中看到这两个服务的身影：

![docker ps 的输出](https://i.loli.net/2020/03/13/1gqOBVUvX5h7M63.png)

如果你这两个服务的配置和原配置一致：

```yaml
service.mercury:
  image: wangqiru/mercury-parser-api:latest
  container_name: mercury
  expose:
    - 3000
  restart: always

service.opencc:
  image: wangqiru/opencc-api-server:latest
  container_name: opencc
  environment:
    NODE_ENV: production
  expose:
    - 3000
  restart: always
```

那么，你只需要在 Tiny Tiny RSS 的 Preferences 中开启这两个插件，并将 API 地址依次设置为如下即可。（Docker 会自动探索相应的服务 API 地址。）

|        Mercury         |        OpenCC         |
| :--------------------: | :-------------------: |
| `service.mercury:3000` | `service.opencc:3000` |

![Mercury 全文抓取和 OpenCC 繁简转换 API 设置](https://i.loli.net/2020/03/13/Svf5Kc6wHu8kPLz.png)

注意，你需要在每一个订阅源中明确指定使用 Mercury 或 OpenCC 服务（右键编辑），才可以真正保证服务的准确运行。

![编辑订阅源，开启 Mercury 或 OpenCC 服务](https://i.loli.net/2020/03/13/8Y6uIm3Wi1flDqJ.png)

## 如何调试、查看 Tiny Tiny RSS 与其他容器服务的 log

Docker 容器的 log 查看非常简单。如果我们想用 `docker-compose` 查看整个 Awesome TTRSS 的 log：

```bash
# 查看 docker-compose 的 log 后 5 条
docker-compose logs --tail 5
```

![查看 docker-compose 启动的全部服务的 log](https://i.loli.net/2020/03/13/yQkgol9RceNnJXA.png)

我们可以用下面的命令查看单个服务的 log：

```bash
# 查看 Mercury 服务后 5 条
docker logs mercury --tail 5
```

![查看 Mercury 全文抓取的 log](https://i.loli.net/2020/03/13/czJECQs8nrIU5qm.png)

另外，我们也可以用下面的命令查看实时更新的 log：

```bash
# 查看实时更新的 Mercury 服务（显示 10 条）
docker logs mercury --tail 10 -f
```

![查看实时更新的 Mercury 服务](https://i.loli.net/2020/03/13/yiaoMZ8QnI91hzc.png)

## 如何持久化 Tiny Tiny RSS 图标

升级更新了 Tiny Tiny RSS 服务之后，每次订阅源的图标都会丢失。我们可以通过将 Tiny Tiny RSS 的图标文件夹挂载到 Docker 容器之外来「持久化」图标存储。

在 `docker-compose.yml` 中，将 Tiny Tiny RSS 的 Docker 容器配置 `service.rss` 中添加如下的配置：

```yaml
volumes:
  - ~/awesome-ttrss/feed-icons/:/var/www/feed-icons/ # mount feed icons to local machine
```

这样即可将 Docker 容器里面 `/var/www/feed-icons/` 文件夹里面的内容挂载到外面服务器上的 `~/awesome-ttrss/feed-icons/` 文件夹。

另外，我们还需要给 `~/awesome-ttrss/feed-icons/` 文件赋予合适的权限：

```bash
sudo chmod -R 777 feed-icons
```

这样，Tiny Tiny RSS 下载的 favicon 就全部挂载到本机，更新 Docker 容器也不会对这些内容造成任何影响了。

![将订阅源的 icon 挂载到容器外部](https://i.loli.net/2020/03/13/tkAfWmMXYLITcS9.png)

感谢阅读。🙇‍♂️
