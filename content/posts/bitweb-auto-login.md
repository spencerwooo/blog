---
title: "BIT-Web Automation：如何利用 iOS 快捷指令自动化登录 BIT-Web 校园网"
date: 2019-12-03T16:27:00+08:00
draft: true
show_in_homepage: true
show_description: true
tags:
- Automation
- Shortcuts
- BIT
categories:
- Automation
featured_image: 'https://i.loli.net/2019/11/26/WHF6PDRzq8tEJZr.png'
comment: true
toc: true
autoCollapseToc: true
---

BIT-Web 是北京理工大学校园 Wi-Fi，专门用于笔记本等桌面设备，另外还有 BIT-Mobile 用于移动设备。但是，BIT-Mobile 有时候并没有 BIT-Web 稳定，自动登录不是那么靠谱，我们也不能通过 BIT-Mobile 登录使用免费中国移动宽带，这些场景下我们都需要在移动设备上连接至 BIT-Web 进行手动登录。

![BIT-Web 和 BIT-Mobile 的对比](https://i.loli.net/2019/12/03/3V7DesynEPc4zdk.png)

最近我的同学跟我说，BIT-Web 的登录页面在移动端（尤其是 Android 平台）上不能正常的显示「密码管理器」，也就不能直接填充密码，每次都需要手动输入。这令人非常烦恼，如何才能实现在连接到 BIT-Web 上之后自动发送登录认证请求来连接至校园网呢？

## 实现思路

对于我的学校来说，登录至校园网的基本操作就是：

- 连接到 BIT-Web
- 在浏览器中打开网址 `t.cn` 来重定向至登录页面 `10.0.0.55`
- 输入账号密码并点击登录

在这背后，我们事实上是给学校校园网登录认证服务器发送了一个带有我们「账号」和「密码」的登录请求（实际来说可能是账号密码组合出的加密认证令牌），之后校园网认证服务器核实我们的身份，并反馈我们认证结果，给予上网权限。

这样来说，我们事实上就只需要在每次连接至 BIT-Web 网络时，自动发送这一请求，即可实现自动登录校园网的功能。在 iOS 平台，我们有相当方便的工具来制作发送请求的脚本：快捷指令 Shortcuts，利用 Shortcuts 我们可以定制一个「动作」，实现自动登录的功能。

另外，iOS 13 里面的 Shortcuts 加入了全新的 **Automation**：基于场景的动作自动化执行功能。利用这一特性，我们就可以定义「连接到 Wi-Fi 名称为 BIT-Web 的网络」这一「触发器」，从而实现自动触发动作的能力。

好啦，万事俱备，我们开始实现吧～

## 操作步骤

接下来，我会以 iOS 的 Shortcuts 中「自动登录校园网」的实现为例，详细介绍我们具体如何实现这样的自动化操作功能。

首先需要说明的是，iOS 的 Shortcuts 里面能够执行的算法有限，但是就今天（2019.12.3）来说，我校校园网服务器的登录认证接口已经升级，需要进行加密运算生成登录令牌才能正确认证。考虑到我们的脚本仅仅在校园网内部可控环境下执行，这里我们退而求其次，使用旧接口：直接发送明文账号密码进行认证的 API 来登录校园网。

## 效果
