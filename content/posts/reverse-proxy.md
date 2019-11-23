---
title: "Reverse Proxy | 反向代理是什么？"
date: 2019-11-22T21:14:00+08:00
draft: true
show_in_homepage: true
show_description: true
tags:
- Tech
- Server
categories:
- 技术
featured_image: https://i.loli.net/2019/11/22/qgB3MXVk1ThExIw.png
featured_image_preview: ''
comment: true
toc: true
autoCollapseToc: true
---

[Tiny Tiny RSS | 最速部署私有 RSS 服务器](https://blog.spencerwoo.com/2019/11/tiny-tiny-rss/) 这篇文章里面，我们提到了「利用 Nginx 作为反向代理」来为 Tiny Tiny RSS 服务加上 SSL 支持。事实上，我经常都能在各个和 Nginx、Apache Server 等相关文档里面看到「反向代理」这个术语。今天我们就来看看，到底什么是反向代理？「反向代理」的工作原理，以及我们都可以用「反向代理」来干什么？

## Proxy：什么是代理？

首先，反向代理（Reverse Proxy）是一种代理（Proxy）服务。为了搞清楚「反向代理」，我们首先来说一说「代理 - Proxy」。

相信阅读这篇文章的同学一定对 Proxy 这个名词不陌生，~~Mainland China 互联网现状让大部分同学的计算机网络知识突飞猛进~~😂。简单来说，Proxy 服务器的主要功能就是在客户端 Client 和服务端 Server 之间搭建一个桥梁，从客户端访问服务端的网络流量、以及从服务端返回客户端的网络流量都会经由这一 Proxy 服务器的转发。

![](https://i.loli.net/2019/11/23/SX6GjARx5eKpfEI.png)

为了方便表述，我们就叫我们的 Proxy 服务器：咕咕，一只鸽子。🐦

## 正向代理和反向代理

### Forward Proxy：正向代理

飞鸽传书嘛，信鸽主要功能就是通风报信，我们这里的咕咕也不例外。咕咕在正常情况下是我们自己（客户端）的，也就意味着：咕咕会在 Client 前面等待送信。当 Client 准备发送一个请求的时候，咕咕会拿着这个请求，在公共互联网上面，将请求准确送达至对应的 Server。同理，Server 返回 response 给 Client，response 也会先被咕咕拿到，之后再转交给 Client。

![](https://i.loli.net/2019/11/23/agNBpxLzSoIAFhi.png)

上面就是「正向代理」的基本工作流程，咕咕就是我们这个例子里面的正向代理服务器，负责转发和接受从 Client 发出或收到的网络请求。我们用正向代理（Forward Proxy），~~除了大家人尽皆知的目的以外~~😂，还可以：

- 有效屏蔽广告、追踪脚本等有害请求。咕咕可以选择性的将 Server 发来的内容进行屏蔽，也就是：咕咕知道这次发来的是个广告，不给我们看也无妨大碍，那为了让我们浏览体验更加纯净，咕咕就非常体贴的丢掉了这一广告。爱了 ❤️
- 有效的隐藏我们的身份。因为咕咕在你没有用到它的时候，可以并行的为其他同学传递请求。这时候，Server 是无从知道请求的真正来源的，只知道是由咕咕转手的，从而保证我们身份匿名性。

### Reverse Proxy：反向代理

那么反向代理是怎样工作的呢？在反向代理中，我们的咕咕现在由服务器 Server 养活（部署），也就是说，咕咕在服务器端通风报信。

![](https://i.loli.net/2019/11/23/hUC5TGactx16AJM.png)

## Nginx 反向代理的实际应用

## 推荐阅读

- [What Is A Reverse Proxy? | Proxy Servers Explained - Cloudflare](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/)
