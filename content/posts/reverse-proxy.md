---
title: "Reverse Proxy | 反向代理是什么？"
date: 2019-11-22T21:14:00+08:00
draft: false
show_in_homepage: true
show_description: true
tags:
- Tech
- Server
categories:
- 技术
featured_image: https://i.loli.net/2019/11/22/qgB3MXVk1ThExIw.png
comment: true
toc: true
autoCollapseToc: true
---

[Tiny Tiny RSS | 最速部署私有 RSS 服务器](https://blog.spencerwoo.com/2019/11/tiny-tiny-rss/) 这篇文章里面，我们提到了「利用 Nginx 作为反向代理」来为 Tiny Tiny RSS 服务加上 SSL 支持。事实上，我经常都能在各个和 Nginx、Apache Server 等相关文档里面看到「反向代理」这个术语。今天我们就来看看，到底什么是反向代理？「反向代理」的工作原理，以及我们都可以用「反向代理」来干什么？

## Proxy：什么是代理？

首先，反向代理（Reverse Proxy）是一种代理（Proxy）服务。为了搞清楚「反向代理」，我们首先来说一说「代理 - Proxy」。

相信阅读这篇文章的同学一定对 Proxy 这个名词不陌生，~~Mainland China 互联网现状让大部分同学的计算机网络知识突飞猛进~~😂。简单来说，Proxy 服务器的主要功能就是在客户端 Client 和服务端 Server 之间搭建一个桥梁，从客户端访问服务端的网络流量、以及从服务端返回客户端的网络流量都会经由这一 Proxy 服务器的转发。[^Cloudflare]

![功能示意](https://i.loli.net/2019/11/23/SX6GjARx5eKpfEI.png)

为了方便表述，我们就叫我们的 Proxy 服务器：咕咕，一只鸽子。🐦

## 正向代理和反向代理

### Forward Proxy：正向代理

飞鸽传书嘛，信鸽主要功能就是通风报信，我们这里的咕咕也不例外。咕咕在正常情况下是我们自己（客户端）的，也就意味着：咕咕会在 Client 前面等待送信。当 Client 准备发送一个请求的时候，咕咕会拿着这个请求，在公共互联网上面，将请求准确送达至对应的 Server。同理，Server 返回 response 给 Client，response 也会先被咕咕拿到，之后再转交给 Client。

![Forward Proxy 的工作原理](https://i.loli.net/2019/11/23/agNBpxLzSoIAFhi.png)

上面就是「正向代理」的基本工作流程，咕咕就是我们这个例子里面的正向代理服务器，负责转发和接受从 Client 发出或收到的网络请求。我们用正向代理（Forward Proxy），~~除了大家人尽皆知的目的以外~~😂，还可以：

- 有效屏蔽广告、追踪脚本等有害请求。咕咕可以选择性的将 Server 发来的内容进行屏蔽，也就是：咕咕知道这次发来的是个广告，不给我们看也无妨大碍，那为了让我们浏览体验更加纯净，咕咕就非常体贴的丢掉了这一广告。爱了 ❤️ [^LTT]
- 有效的隐藏我们的身份。因为咕咕在你没有用到它的时候，可以并行的为其他同学传递请求。这时候，Server 是无从知道请求的真正来源的，只知道是由咕咕转手的，从而保证我们身份匿名性。

### Reverse Proxy：反向代理

那么反向代理是怎样工作的呢？在反向代理中，我们的咕咕现在由服务器 Server 养活（部署），也就是说，咕咕在服务器端通风报信。每个从 Client 经由互联网发过来的请求会先到达咕咕这里，咕咕再将每个请求分发给相应的服务器。反之亦然。这就是「反向代理」的基本工作原理，我们在这个例子里面的「咕咕」，就是我们的反向代理服务器。（Reverse Proxy Server）

![Reverse Proxy 的工作原理](https://i.loli.net/2019/11/23/hUC5TGactx16AJM.png)

为什么我们服务端也需要一个这样的咕咕呢？因为我们的咕咕不仅勤劳，还很坚强。要知道，不是所有的目标服务器都像我们咕咕那么坚强，目标服务器很多时候会因为直接收到的信件过多（收到过多的请求）而被淹没，甚至宕机。如果有咕咕的帮助，目标服务器就不会因为请求过多而无法处理，同时如果咕咕发现一个服务的请求太多，我们可以将这一服务增加多个服务器共同处理，咕咕这时候就可以将服务的请求进行分流，从而减轻单个服务器的处理负担。**这也就是「反向代理」在「负载均衡」方面的应用。**

事实上，反向代理服务器有更多的应用，我们接下来就具体说一说我在服务器上面都利用 Nginx 反向代理服务器做了哪些有用的事情。

## Nginx 反向代理的实际应用

在我的（[@TenkeySeven](https://blog.tenkeyseven.com) 的）服务器上面，有这样的几个服务：

- [Tiny Tiny RSS 服务](https://tt-rss.org/)
- [Netdata 服务器监控服务](https://github.com/netdata/netdata)
- Nginx 直接 serve 的一个默认静态页面

事实上，这三个服务都运行在这样的一个服务器上面，但是绑定了不同的域名。比如：

- Tiny Tiny RSS 服务对应域名：<https://ttrss.tenkeyseven.com>（需要登录）
- Netdata 服务对应域名：<https://stats.tenkeyseven.com>（可以公开访问）
- Nginx 测试静态页面对应域名：<https://tenkeyseven.com>（可以公开访问）

我们连接到服务器上面，执行下面的命令来查看端口占用情况：

```bash
sudo netstat -tulpn | grep LISTEN
```

![端口占用情况](https://i.loli.net/2019/11/23/XrHv2C5xA8liF3Z.png)

通过查看端口占用情况，我们可以非常清晰的看到：

- Tiny Tiny RSS 运行于 Docker 容器中，对外的 exposed 端口是 181
- Netdata 前端服务直接监听的端口是 19999
- Nginx 默认 serve 的静态页面直接监听 80 端口（HTTP）

[@TenkeySeven](https://blog.tenkeyseven.com) 将主域名和上面提到的两个子域名的 DNS 解析均设置为我们的服务器，因此，当我们访问上面任意一个域名的时候，请求均直接发给服务器上面运行的 Nginx 反向代理服务。

对 Nginx 来说，只需要识别这些域名对应的请求应该转发给具体哪个服务，就可以让请求被正确处理，这样也就实现了我们多个域名对应一个服务器上的多个服务的需求。

Nginx 全部功能均由配置文件 `nginx.conf` 来设置，这一配置文件通常位于 `/etc/nginx/nginx.conf`，我们仔细看一下 Nginx 的配置文件。

### 对 upstream 服务器的定义

![对 upstream 服务器的声明](https://i.loli.net/2019/11/23/X4Dzh9fBL8NeRGa.png)

首先，我们在 Nginx 的 `http` 项目下，定义了我们可能需要用到的 upstream 服务器。比如，对 Tiny Tiny RSS 来说，就是 181 端口的服务，用下面的语法进行声明：

```nginx
upstream ttrssdev {
    server 127.0.0.1:181;
    keepalive 64;
}
```

这样，下面 `ttrss.tenkeyseven.com` 域名的 Proxy 转发规则就可以直接用 `http://ttrssdev` 的格式进行声明了。

### 默认 Web Root 的定义

![默认访问 Web Root 的配置](https://i.loli.net/2019/11/23/6jpCBPVJNc9SQIY.png)

可以发现，当我们服务并不绑定任何上游服务器，而是直接由 Nginx 来提供服务的时候，Nginx 可以直接 serve 一个目标路径里面的 HTML 文件，比如这里的 `/usr/share/nginx/html`。此时，直接访问默认主域名 `tenkeyseven.com`，我们就能直接看到一个默认的静态网页。具体来说，Nginx 就是下面这部分内容的配置，知道当请求匹配到 `server_name` 定义的域名时，serve `root` 处定义的 HTML 静态网站。

```nginx
server {
   server_name tenkeyseven.com; # managed by Certbot
       root         /usr/share/nginx/html;
       # ...
}
```

### Proxy 转发规则的定义

![反向代理 Tiny Tiny RSS 转发规则的定义](https://i.loli.net/2019/11/23/yYojgkwLaAUfGM4.png)

当我们需要让 Nginx 反向代理转发我们的请求至 upstream 服务的时候，就是类似这样的配置。此时，当请求匹配到 `server_name` 定义的 `ttrss.tenkeyseven.com` 时，Nginx 不 serve `root` 处定义的页面，而是在 `location / { ... }` 处找到 `proxy_pass` 的定义，将请求对应的转发到目标服务那里。可以看到，这里我们直接声明了 `proxy_pass http://ttrssdev;`，于是，当我们访问 `https://ttrss.tenkeyseven.com` 的时候，Nginx 反向代理服务会直接将请求转发至我们部署的 Tiny Tiny RSS 服务，在服务器上就是 `localhost:181` 的服务。

Nginx 反向代理具体的配置如下 `location / { ... }` 里面的配置：

```nginx
server {
   server_name ttrss.tenkeyseven.com; # managed by Certbot
       # root         /usr/share/nginx/html;

       # Load configuration files for the default server block.
       include /etc/nginx/default.d/*.conf;

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
    
    # ...
}
```

事实上，这部分的配置非常简单。得益于 Let's Encrypt 的存在，我们可以利用 Certbot 在签署每个域名的 SSL 证书时，自动生成对应服务的转发配置。因此，事实上我们只需要声明前面介绍的 upstream 服务，并在 Certbot 生成的对应域名下的 location 子项处将服务器对应到反向代理的配置项处即可。

## 小结

最后，我们可以看到，经过这样的配置，我们从外界互联网访问我们服务器的请求，就被 Nginx 反向代理分别导向了对应的服务器，从而实现了多个域名对应多个服务，并部署在同一个服务器上面的功能。同时，Nginx 反向代理服务统一帮我们管理了 SSL 证书的签署，因此无论是从外界来访问我们服务器的请求，还是我们服务器里面某个服务返回给外界的请求，都是经过加密的 HTTPS 请求。

![Nginx 反向代理在上文中的功能](https://i.loli.net/2019/11/23/2zKHFZmQXShLRAC.png)

Nginx 反向代理服务器还有更多的功能，比如：

- 前文提到的负载均衡（Load balance）
- 用反向代理来作为 CDN，cache 一部分资源，加快访问速度
- 在请求到达目标服务器之前，反向代理服务器事先过滤掉一部分恶意请求，保证提供服务的目标服务器的稳定工作
- ……

抛砖引玉，感谢阅读。

[^Cloudflare]: [What Is A Reverse Proxy? | Proxy Servers Explained - Cloudflare](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/)

[^LTT]: [Block EVERY Online Ad with THIS / Linus Tech Tips](https://www.youtube.com/watch?v=KBXTnrD_Zs4)
