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

为了方便表述，我们就叫我们的 Proxy 服务器：咕咕，一只鸽子。🐦

## 正向代理和反向代理

## Nginx 反向代理的实际应用
