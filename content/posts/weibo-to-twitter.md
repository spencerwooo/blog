---
title: "IFTTT x Integromat：微博 to Twitter 自动转发的最佳实践"
date: 2019-11-26T11:46:00+08:00
draft: true
show_in_homepage: true
show_description: true
tags:
- Automation
- IFTTT
- Weibo
- Twitter
categories:
- 自动化
featured_image: 'https://i.loli.net/2019/11/26/WHF6PDRzq8tEJZr.png'
comment: true
toc: true
autoCollapseToc: true
---

IFTTT 网络自动化平台实际上是一个缩写，完全展开的 IFTTT 是「IF this THEN that」- 如果「这」，那么「那」。既然如此，我们利用 IFTTT 就可以实现非常完善的自动化事件处理流程，比如这篇文章我要介绍的就是一个例子：「利用 IFTTT 自动将微博发布的信息同步到 Twitter 上面」的最佳实践。

> **🎫 附注：**
>
> 本文介绍方法高度借鉴于这篇文章：[微博同步至 Twitter，这里有更好的方式 - 少数派](https://sspai.com/post/51942)，但是本文的介绍方式更为清晰易懂，配置简洁明了，同时也解决了一些如果按照原文直接配置的话会出现的意外问题。

## 背景

首先，IFTTT 上面已经有非常多的微博、Twitter 互相自动转发分享的 Applet（就是 IFTTT 的动作），官方甚至都有一个专门的分类，包含了一些基本的微博 → Twitter、Twitter → 微博的动作：[Connect Sina Weibo to Twitter to unlock powerful experiences](https://ifttt.com/connect/sina_weibo/twitter)。

![IFTTT 官方微博 Twitter 同步 Applet](https://i.loli.net/2019/11/26/1W6XTByKsDHpZYe.png)

但是单独由 IFTTT 进行「微博 → Twitter」的自动转发有着非常的局限性。IFTTT 无法区分：纯文本原创微博、带图原创微博、以及转发微博这三种微博。如果我们只依赖于 IFTTT 来帮我们进行「微博 → Twitter」转发的话：要么我们只能转发文字 + 原微博链接；要么我们转的带图，但是对于纯文本微博 IFTTT 会发送一张「找不到原图」的 Twitter。因此，今天我们所要介绍的方法，就是利用 Integromat 对 IFTTT 获取到的微博进行路由分流，实现对纯文本微博自动发 IFTTT 纯文本微博转发 Applet、对带图微博自动发 IFTTT 带图微博转发 Applet，并自动过滤掉非原创微博的内容。

![仅靠 IFTTT 只能单独执行某个转发策略，这不够](https://i.loli.net/2019/11/27/7Xcp5VjzQTAriPk.png)

## 利用 IFTTT 和 Integromat 配合实现路由转发

### 流程原理

目前和微博平台整合最好、最方便的自动化平台就是 IFTTT，因此我们不能丢掉 IFTTT。利用 IFTTT 获取到微博的信息包括：微博文本、微博原链接以及微博图片链接。因此，我们需要做的就是：

1. 先利用 IFTTT 获取最新发送的微博，包括微博文本、微博原链接和微博图片这三项参数
2. 通过 HTTP 请求在 Integromat 中触发 Web Hook，利用 Integromat 解析 IFTTT 发送来的数据，根据「图片的有无」进行路由分配，调用合适的 IFTTT 动作
3. Integromat 调用合适的 IFTTT 动作之后，IFTTT 执行发送 Twitter 的 Applet
4. 结束 👍

![利用 IFTTT 和 Integromat 配合实现微博 Twitter 转发流程](https://i.loli.net/2019/11/27/hX6GfquxD15Kpoy.png)

我们接下来的基本工作就是按步骤对上面介绍的功能在相应的平台上一一进行实现。

### IFTTT 触发 Web Hook 动作

### Integromat 路由判断树

### IFTTT 自动发送 Twitter 动作

## 效果

## 小结
