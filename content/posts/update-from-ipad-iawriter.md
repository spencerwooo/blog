---
title: Working Copy + iA Writer：第二次尝试从我的 iPad 上面更新博客
date: 2019-11-14T06:24:53+00:00
show_in_homepage: true
show_description: true
tags:
- iPad
- Git
categories:
- 用 iPad 学习的一天
featured_image: https://i.loli.net/2019/11/14/zE2BNisaexXb6JL.png
comment: true
toc: true
autoCollapseToc: true
---

之前，我就曾经介绍过我是如何利用 iPad 对部署在 GitHub 上面的静态博客进行更新的。这篇文章即使到现在也有一定的借鉴意义，文章归档于：[使用 Working Copy 在 iPad 上面更新博客 | 一次随缘的更新](https://archive.spencerwoo.com/posts/2019/06/09/from-my-ipad.html)。

现在，我重新部署了我的静态博客，利用 Hugo 进行构建。宣称全球最快的静态网站渲染引擎 —— Hugo 着实让我博客的编译和部署过程快人一步。借助于方便的 Netlify，只要配置好 CI 的编译命令和环境变量，我们就只需要专注于博客本身的撰写，而不必对博客其他属性进行过多的担心。这样的部署方法，让 iPad 都可以直接发表博文。

## 前言

为什么我又换回了静态博客？Listed 确实不错，但是我在给与之配套的笔记应用 Standard Notes 充值一年会员之后，发现 Standard Notes 真的不行。不论是应用本身的响应还是界面的设计，Standard Notes 都和 Bear 等一众笔记应用相距甚远。Listed 博客需要会员才能自定义域名，并且 Listed 本身也没有评论系统，只有一个类似留言板的 Guestbook，难过。

另外，我还专门问了问开发者为什么 Listed 不支持评论：

![和 Listed/Standard Notes 作者的交流](https://i.loli.net/2019/11/14/Cm4Lc78TPbZrkBe.png)

// 我猜是开发者被垃圾评论骂怕了 😂

就这样，Hugo 就变成了目前我的博客部署引擎首选。

## 设备和工具

更新博客我试用了下面的设备：

- iPad Air (3rd Gen)
- Logitech K380：键盘
- Logitech M558：鼠标

在 iPad 上面，我尝试使用 iA Writer 来编辑 Markdown 文档，利用 Working Copy 来更新 GitHub 仓库。由于 Working Copy 支持 **Edit in place**，因此我们在 iA Writer 中可以导入 Working Copy 的某个文件夹（比如博文文件夹 `posts`），从而直接编辑其中的 Markdown 文件。

![在 iA Writer 中直接编辑 Working Copy 文件](https://i.loli.net/2019/11/14/jIKmWkgZ1nGwORq.png)

## 更新流程

- 利用 Working Copy 将博客源文件克隆至 iPad 上面

![Working Copy 上面克隆仓库](https://i.loli.net/2019/11/14/cDnlHYPjMryvq3V.png)

- 利用 iA Writer 打开 Working Copy 中的博客 `posts` 文件夹
- 在 iA Writer 中创建新文章、编辑旧博客文章
- 在 iA Writer 中通过快捷键 `Command + R` 直接预览文章

![iA Writer 编辑文章](https://i.loli.net/2019/11/13/B4Xb32uxqg9cyaZ.png)

- 在 Working Copy 中通过 Git 直接将博客同步至 GitHub

iPad 胜在方便，不需要过多的配置即可直接撰写文章。爱了，❤️。

## 另外

除了上面的方法，Forestry.io 也是一个可以的选择。Forestry.io 是一个极度完善的静态博客 CMS 统一管理平台，支持 Hugo、VuePress、Gatsby 等诸多博客引擎。利用 Forestry 在线网页版本的后台管理，我们甚至可以直接的撰写文章内容，并在 Forestry 服务器上面渲染文章并预览。

![Forestry 的文章编辑界面](https://i.loli.net/2019/11/14/XTa63nLopB2KQAR.png)

Forestry 虽然好用，但是 Forestry 在 iPad 上面的编辑体验并不太好，因为相对小的屏幕，Forestry 的文章编辑界面相当狭窄，令人遗憾。

总之，Working Copy 是 iPad 的最佳搭档，而 iA Writer 是 iPad 上面最纯粹的 Markdown 编辑器。这二者结合，确实能让我随时随地发布博客。爱了！❤️
