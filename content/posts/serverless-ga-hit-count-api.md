---
title: Hit count：用 Google Analytics + Vercel Serverless 为文章添加浏览量统计
date: 2020-06-25T23:00:00+08:00
published: true
slug: serverless-ga-hit-count-api
tags:
- Tech
- Server
- Vercel
- Serverless
cover_image: "./images/serverless-ga-hit-count-api.png"
canonical_url: false
description: 借助 Google Analytics 为数据支撑，使用 Vercel Serverless 为静态博客添加文章阅读数量统计 API。

---
:::note 🍍 编者按
本文灵感和部分方法极大程度来源于 @printempw 的文章：[使用 Google Analytics API 实现博客阅读量统计](https://printempw.github.io/google-analytics-api-page-views-counter/)，感谢。(　o=^•ェ•)o
:::

静态网站是没有后端服务的，仅有一个前端页面用来渲染网站的全部内容。虽然从部署、管理和访问速度的角度来说，静态网站还是有点优势的，但是没有后端就意味着没有「评论系统」、「浏览量统计」、「登录鉴权」等等功能。如果想要实现这些功能，就必须依赖第三方的服务，才能实现类似的需要。许多同学都像我一样：在自己的博客网站里使用 Google Analytics 用来统计访问量和阅读数，因此对于「浏览量统计」这个功能来说，我们其实可以借助 Google Analytics API 来将我们在管理后台看到的部分数据显示在网站前端里面，从而实现「文章访问、阅读数量」显示的功能。

## 工作原理

Google Analytics 非常强大，能够从非常多的维度来解读你网站的访客来源、浏览量、浏览设备等多种数据。这里当我们进入 Google Analytics 管理后台，在首页我们就可以看到我们网站每个路径在特定时间段之中的浏览数量。

![Google Analytics 管理后台中我的博客上周 7 天的每个路径浏览数](https://i.loli.net/2020/06/25/1pqWdOxtTLK9fsv.png)

实际上我们需要的就是这个数据。幸好，Google Analytics 提供了类似的 API，可以让我们根据页面路径、时间起止等参数来查询浏览数量。不过 Google Analytics 的原始 API 其实还是比较复杂的，而且其本身在国内访问还是不太顺畅，所以为了减轻我们静态网站前端的负担，**我们可以在 Vercel 上面用 Serverless 方案部署一个 API 中转站**，方便我们静态网站调用，从而实现「文章浏览量显示」的功能。

## 开启 Google Analytics API

我们在 Google Analytics 中调用自己网站的分析数据时，需要首先开启 Google Analytics API，获取到鉴权密钥，才可以正常调用 API。我们可以根据 Google 官方教程：[Analytics Reporting API v4 - Enable the API](https://developers.google.com/analytics/devguides/reporting/core/v4/quickstart/service-py#1_enable_the_api)，或按照下面的办法来开启我们账户的 Google Analytics API：

* 首先，前往官方 API 的 [setup tools](https://console.developers.google.com/start/api?id=analyticsreporting.googleapis.com&credential=client_key) 并根据提示进行设置，选择一个项目（或创建新的项目，比如 `ga-hit-count`），之后选择 Continue，就可以为我们这一项目开启 Google API 了；
  ![为我们的项目开启 Google API](https://i.loli.net/2020/06/25/p1gf3sRLmWQn7N4.png)
* 接下来，我们会进入 Google API 的 Credentials 设置页面，这里我们首先设置 API 为 Analytics Reporting API，并选择 API 调用方为 Web server，再选择调用数据类型为 Application data，最后选择「不会使用 App Engine 或 Compute Engine」即可；
  ![设置 Google API 类型](https://i.loli.net/2020/06/25/cH614VBCxrKnOPR.png)
* 最后，我们设置基本信息，获取 Credentials 文件。我们设置 Service account name 的名字（比如 `blog-analytics`），设置 Role 为 `Service Account User`，选择 Key type 为 JSON，即可获取 API 凭证，点击 Continue 之后你就可以下载到这一 JSON 格式的 API 凭证文件了。 ![设置 API 凭证信息](https://i.loli.net/2020/06/25/AO8t72E4FV1YpSG.png)

我们获取到的 JSON 文件里面应该包含有以下的重要信息：

```json
{
  // ...
  "project_id": "ga-hit-count",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxx-----END PRIVATE KEY-----\n",
  "client_email": "blog-hit-count@ga-hit-count.iam.gserviceaccount.com",
  // ...
}
```

其中，我们重点关注的就是这三个 API 凭证信息：项目 ID `project_id`、凭证私钥 `private_key` 以及客户邮箱 `client_email`。其中 `private_key` 是我们 API 访问的重要凭证，需要妥善保管，也一定不能签入 `git`。另外，我们需要将 `client_email` 定义的邮箱**作为新用户加入 Google Analytics 后台**，从而让这一邮箱访问到我们 Google Analytics 的数据。详见：[Add, edit, and delete users and user groups](https://support.google.com/analytics/answer/1009702)。

![将 client_email 的邮箱加入 Google Analytics 后台](https://i.loli.net/2020/06/25/bjGvsiwk1c7UHhI.png)

## 使用 Vercel 自己部署 Serverless API 用于前端显示

最后，我们就可以借助 Google Analytics API 在 Vercel 上部署中转 API 用于前端静态网站的调用。这里我使用 Node.js 和 Typescript 写好了一个非常简单的基础 Serverless API 项目，位于：[spencerwooo/ga-hit-count-serverless](https://github.com/spencerwooo/ga-hit-count-serverless)，同学们可以直接 Fork 我的这一项目用来自己部署。其中，如果自己没有特殊需要，那么 Fork 项目之后我们仅需要修改 `api/config.ts` 里面的配置即可导入 Vercel 一键部署。

### 修改 `ga-hit-count-serverless` 的配置

同学们将这一项目 Fork 至自己的 GitHub 账户上后，进入 `api/config.ts` 即可看到我自己的 API 配置，大致如下：

```typescript
export default {
  viewId: '{Google Analytics view ID}',
  auth: {
    projectId: '{Google API project ID}',
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: '{Google API client email}',
  },
  allFilter: ['{Post path filter}'],
  startDate: '{Google API query start date}',
}
```

其中，这些内容我们都需要一一进行设置：

* `viewId`：是你的 Google Analytics 视图 ID，可以在 Google Analytics 后台的 Admin » View » View Settings 中找到；
  ![Google Analytics 视图 ID 的设定位置](https://i.loli.net/2020/06/25/VIWUvCqSyX23jed.png)
* `projectId`：是刚刚凭证 JSON 文件中的 `project_id`，直接按照刚刚的凭证填写即可；
* `privateKey`：是通过 Vercel 环境变量获取到的 API 凭证私钥，**这里不要更改**；
* `clientEmail`：是刚刚凭证 JSON 文件中的 `client_email`，直接按照刚刚的凭证填写即可；
* `allFilter`：是通过 Google API 查询时的前缀过滤器，比如你的网站中文章路径以 `/post` 开头，那么就可以设置为 `['/post']`。默认为 `['/20']`（因为我的文章路径是以 `/2020` 或 `/2019` 开头的）；
* `startDate`：是通过 Google API 查询时设定时间段的开始时间，设定一个比较久远的时间即可，默认为 `2010-01-01`。

:::warning 🚨 请注意！
这里千万千万不要直接将刚刚凭证中获取到的私钥直接粘贴进入 `privateKey` 一项之中，因为这样当我们将 `config.ts` 签入 `git` 之后，`privateKey` 将以明文形式保存，非常危险。
:::

### 将项目导入 Vercel

Vercel（曾经的 ZEIT Now）是一个专注于部署 Jamstack 静态网页和 Serverless API 的服务，其官网位于 [Develop. Preview. Ship. - Vercel](https://vercel.com/)。我们使用 GitHub 注册登录 Vercel 之后，仅需将刚刚 Fork 并修改好配置文件版本的 `ga-hit-count-serverless` 导入 Vercel 即可。Vercel 会自动的识别我们项目的环境，生成合适的编译、部署命令，自动将我们的 API 部署到 Vercel 的全球 CDN 上面，方便全世界随时随地的访问。

但是此时我们并不能正常的使用我们自己部署的 API，因为 `privateKey` 尚未设置。我们需要进入刚刚在 Vercel 上部署好的项目设置中，选择 General » Environment Variables，向其中新增一个环境变量 `PRIVATE_KEY`。之后，我们将刚刚的 Google API JSON 凭证文件里面的私钥，**复制其中的字符串部分，将 `\n` 全部删掉并更换为换行**，得到类似如下的多行私钥形式：

```
-----BEGIN PRIVATE KEY-----
dageWvAIBADANBAokdP8WgkqhkiGkk
...
afROdsafbliOjPA==1Hk3mdsafEdBa
-----END PRIVATE KEY-----
```

我们复制这一私钥，再粘贴进入刚刚新建的 `PRIVATE_KEY` 的值。

![在 Vercel 项目的设置中添加环境变量 PRIVATE_KEY，并存入我们的私钥凭证](https://i.loli.net/2020/06/25/XbiO8D1q34NTFPm.png)

之后，我们需要重新触发一次部署（比如随便向 GitHub 仓库中 commit 并 push 一些东西），完成后我们即可通过 Vercel 给我们提供的域名 `https://{VERCEL_DOMAIN_NAME}.vercel.app` 访问我们的 API。

### 使用 Vercel Serverless 版 API

默认情况下，当我们直接访问 `https://{VERCEL_DOMAIN_NAME}.vercel.app` 时，因为没有设定 `index.html`，所以 Vercel 会将当前列表下的文件列出。

![默认情况下直接访问 Vercel 上部署的 Serverless API 域名](https://i.loli.net/2020/06/25/QFWT31dfj6ClvaO.png)

我们 API 的根域名实际上就是 `https://{VERCEL_DOMAIN_NAME}.vercel.app`。我们可以通过下面的默认请求（添加在 API 根域名后面）来访问 API：

```
/api/ga
```

没有添加任何参数的情况下，默认这一 API 会将你的 Google Analytics 里面全部路径与访问量拉取并给出。以我自己博客为例，访问这一 API 会得到类似下面的 JSON response：

```json
[
  {
    "page": "/2019/11/tiny-tiny-rss/",
    "hit": "698"
  },
  {
    "page": "/2019/11/weibo-to-twitter/",
    "hit": "531"
  },
  {
    "page": "/2020/03/ttrss-noteworthy/",
    "hit": "357"
  },
  // ...
]
```

其中，我们可以看到返回的 response 中包含有我们网站中所有路径的 `hit` 阅读量数据，并且数据是按照阅读量递减来排列的。

当我们需要直接请求网站中某一页面或某个特定路径的数据时，我们可以用这样的语法构造我们的请求：

```
/api/ga?page={WEBSITE_PAGE_PATH}
```

其中请求的 field 为 `page`，参数为目标路径。比如这样的请求：

```
/api/ga?page=/2020/03/substats/
```

将直接返回路径 `/2020/03/substats/` 的阅读量：

```
[
  {
    "page": "/2020/03/substats/",
    "hit": "311"
  }
]
```

那么在此基础上，我们即可借助自己在 Vercel 上面部署的 API，来请求 Google Analytics 给我们当前路径的浏览量记录了。利用 `axios` 或者类似的前端 HTTP 请求库，我们可以非常轻松的请求我们部署的 Serverless API，并将结果进行处理，显示在我们的网站里面。你正在浏览的我的博客，就是利用这样的原理实现访问数据的显示。

![用这样的方法在我自己博客上面显示文章的浏览量](https://i.loli.net/2020/06/25/uqOC3P5HTg9VG1W.png)

到此，我们借助 Google Analytics 和 Vercel Serverless 为文章添加浏览量统计的功能就大功告成了。希望大家能用上本文的办法，为自己的静态博客网站快速添加上文章阅读量统计。感谢阅读 🍒
