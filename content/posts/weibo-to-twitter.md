---
title: "IFTTT x Integromat：微博 to Twitter 自动转发的最佳实践"
date: 2019-11-26T11:46:00+08:00
draft: false
show_in_homepage: true
show_description: true
tags:
- Automation
- IFTTT
- Weibo
- Twitter
categories:
- Automation
featured_image: 'https://i.loli.net/2019/11/26/WHF6PDRzq8tEJZr.png'
comment: true
toc: true
autoCollapseToc: true
---

IFTTT 网络自动化平台实际上是一个缩写，完全展开的 IFTTT 是「IF this THEN that」- 如果「这」，那么「那」。既然如此，我们利用 IFTTT 就可以实现非常完善的自动化事件处理流程，比如这篇文章我要介绍的就是一个例子：「利用 IFTTT 自动将微博发布的信息同步到 Twitter 上面」的最佳实践。

> **🎫 附注：**
>
> 本文介绍方法高度借鉴于这篇文章：[微博同步至 Twitter，这里有更好的方式 - 少数派](https://sspai.com/post/51942)，但是本文的介绍方式更为清晰易懂，配置简洁明了，同时也解决了一些如果按照原文直接配置的话会出现的意外问题。

## 背景与工作原理

首先，IFTTT 上面已经有非常多的微博、Twitter 互相自动转发分享的 Applet（就是 IFTTT 的动作），官方甚至都有一个专门的分类，包含了一些基本的微博 → Twitter、Twitter → 微博的动作：[Connect Sina Weibo to Twitter to unlock powerful experiences](https://ifttt.com/connect/sina_weibo/twitter)。

![IFTTT 官方微博 Twitter 同步 Applet](https://i.loli.net/2019/11/26/1W6XTByKsDHpZYe.png)

但是单独由 IFTTT 进行「微博 → Twitter」的自动转发有着非常的局限性。IFTTT 无法区分：纯文本原创微博、带图原创微博、以及转发微博这三种微博。如果我们只依赖于 IFTTT 来帮我们进行「微博 → Twitter」转发的话：要么我们只能转发文字 + 原微博链接；要么我们转的带图，但是对于纯文本微博 IFTTT 会发送一张「找不到原图」的 Twitter。因此，今天我们所要介绍的方法，就是利用 Integromat 对 IFTTT 获取到的微博进行路由分流，实现对纯文本微博自动发 IFTTT 纯文本微博转发 Applet、对带图微博自动发 IFTTT 带图微博转发 Applet，并自动过滤掉非原创微博的内容。

![仅靠 IFTTT 只能单独执行某个转发策略，这不够](https://i.loli.net/2019/11/29/KrjZGPt8zgpQqNF.png)

## 利用 IFTTT 和 Integromat 配合实现路由转发

### 流程原理

目前和微博平台整合最好、最方便的自动化平台就是 IFTTT，因此我们不能丢掉 IFTTT。利用 IFTTT 获取到微博的信息包括：微博文本、微博原链接以及微博图片链接。因此，我们需要做的就是：

1. 先利用 IFTTT 获取最新发送的微博，包括微博文本、微博原链接和微博图片这三项参数
2. 通过 HTTP 请求在 Integromat 中触发 Webhook，利用 Integromat 解析 IFTTT 发送来的数据，根据「图片的有无」进行路由分配，调用合适的 IFTTT 动作
3. Integromat 调用合适的 IFTTT 动作之后，IFTTT 执行发送 Twitter 的 Applet
4. 结束 👍

![利用 IFTTT 和 Integromat 配合实现微博 Twitter 转发流程](https://i.loli.net/2019/11/27/hX6GfquxD15Kpoy.png)

我们接下来的基本工作就是按步骤对上面介绍的功能在相应的平台上一一进行实现。

### 准备工作

在一切开始之前，我们需要在 IFTTT 和 Integromat 两个平台上做一些准备工作。

#### 在 Integromat 平台创建 Scenario

在 [Integromat](https://www.integromat.com) 平台注册登录，在 Scenarios 处点击创建：Create a new scenario，搜索 Webhook 并选择，之后点击 Continue 即可。

![Integromat 创建新 Scenario 并选择 Webhook](https://i.loli.net/2019/11/29/i6zSfaJx4u7kovc.png)

进入创建 Scenario 的界面，我们首先点击中心的问号，选择 Webhooks > Custom Webhooks 作为我们 Scenario 的起点。之后我们配置 Webhook：

- 点击 Webhook 设置窗口中的 Add，在弹出的 Add a hook 界面将 Webhook 名称设置为 **IFTTT weibo webhook**
- 点击左下角的 Show advanced settings，在 Data structure 处添加抓取自微博的数据结构：点击 Add，在弹出的窗口中将数据结构名称命名为 **Weibo data structure**。这就是我们从 IFTTT 获取到的微博博文的三个关键数据的存储方式（微博文本、微博链接和微博图片）

![配置 Webhook、添加 Data structure](https://i.loli.net/2019/11/29/8xmh1FfwK9SLRvy.png)

- 下面我们开始设置微博数据结构：
   - 点击右侧 Generator，在弹出的窗口中将 Content type 选择为 **Query String**
   - 在下方 Sample Data 中填入：`text=weiboText&url=weiboUrl&image=imageUrl`，点击保存之后，我们就得到了一个合适的 Data Structure
   - 可以看到，上面 Sample Data 实际上就是我们利用 IFTTT 获取到微博数据的一个传递，其中 `text` 字段保存「微博文本内容：weiboText」、`url` 字段保存「微博链接：weiboUrl」、`image` 字段保存「微博图片：imageUrl」

![配置微博 Data structure](https://i.loli.net/2019/11/29/9EwG8oaXptnMThs.png)

- 将上面步骤配置的内容全部保存，我们得到这样的一个界面：

![Integromat Webhook API 地址](https://i.loli.net/2019/11/29/R86yFxQpsDWGP1o.png)

- 上图里面我框出来的地方就是 Integromat 的 Webhook API 地址。接下来，将上图中的 API 地址复制，在后面添加上我们刚刚声明的数据结构的请求，并在浏览器中访问一下，让 Integromat 对收到的请求进行判断，自动确定数据结构的数据类型
- 需要注意的是，我们需要让这一步中的 URL 跟我们 IFTTT 发送给 Integromat 的请求一致，也就是在刚刚复制的 Integromat 请求地址后面，需要正确的拼接上我们的请求数据，这里给出一个示范：
  - 如果我们的 Integromat Webhook API 地址为：`https://hook.integromat.com/{integromat_api_key}`
  - 我们请求的微博文本内容为：`TestingMyWebhook`
  - 我们请求的微博原文链接为：`https://m.weibo.cn/detail/4444027372221130`
  - 我们请求的微博图片链接为：`https://wx4.sinaimg.cn/orj360/63e5c1e1ly1g9f2lmag8hj20k00qoac8.jpg`
  - 那么我们最终拼接出来的 URL 请求为（没有换行，换行方便阅读）：

    ```
    https://hook.integromat.com/{integromat_api_key}
    ?text=TestingMyWebhook
    &url=https://m.weibo.cn/detail/4444027372221130
    &image=https://wx4.sinaimg.cn/orj360/63e5c1e1ly1g9f2lmag8hj20k00qoac8.jpg
    ```

- 将上面的 URL 复制到浏览器中访问，加载完成之后，如果我们得到了正确的数据结构，那么 Integromat 那边会自动显示 Successfully Determined，同时浏览器中会显示 Accepted 字样

![成功确定数据结构](https://i.loli.net/2019/11/29/yPjM2fTUav8ldwr.png)

到这里，我们先将 Integromat 的全部配置保存妥当，将上面 Integromat 的 URL 请求保存，不要关闭标签页，我们继续准备 IFTTT 的配置项目。

> **🐖 注意：**
>
> 如果这里 Integromat 平台未提示 Successfully Determined，或浏览器中未显示 Accepted，那么说明 URL 请求拼接有问题，请再次尝试保证数据结构确定无误，否则会对接下来的配置造成很大影响。

#### 在 IFTTT 平台找到 Webhook 接口

在 IFTTT 平台，我们进入 [Webhook 的动作界面](https://ifttt.com/maker_webhooks)，点击右侧的 Documentation，不出意外的话，你会看到专属于你自己的 Webhook Key，我们在 Integromat 中最后就会向这个地址发出 HTTP 请求，传递相应的微博博文数据，触发正确的 IFTTT 动作。因此，请记下这一请求的具体方式，包括请求 URL 以及请求 body 格式：

```json
{ "value1" : "...", "value2" : "...", "value3" : "..." }
```

![Webhook Documentation](https://i.loli.net/2019/11/29/U7bolMJ13aZD45Y.png)

接下来，我们在刚刚对两个平台的配置的基础之上，对两个平台进行连接，实现自动化的微博 → Twitter 转发过程。

### IFTTT 触发 Webhook，调用 Integromat

首先，我们在 IFTTT 平台创建一个新的 Applet，作为检测到新微博的起始动作。IFTTT 在检测到我们发送一条新微博之后，会向 Integromat 发送一个 HTTP 请求，告知 Integromat 我们的新微博的文本消息、图片内容和原文链接。

![This 选择 Sina Weibo 触发](https://i.loli.net/2019/11/29/4Iry8JbMqHD97aY.png)

在 IFTTT 上面，点击右上角 [头像 > Create](https://ifttt.com/create)，进入创建 Applet 的界面。在 This 处选择 Sina Weibo，选择 New post by you 的触发器。如果要求登录微博那么选择链接即可。

![That 选择 Webhook 服务](https://i.loli.net/2019/11/29/9O6GfAsYrVbTtM7.png)

在 That 处选择 Webhooks，选择 Make a web request，之后进入配置 Webhook 的界面。**我们在 URL 处填写刚刚 Integromat 的 Webhook API 地址（不包含测试用的拼接部分，即只填入 Integromat 显示的 URL），在 Method 处选择 POST，在 Content Type 处选择 `application/x-www-form-urlencode`，最后在 Body 处填写：**

```
text={{Text}}&url={{WeiboURL}}&image={{PhotoURL}}
```

![填写 Webhook 请求地址，触发 Integromat 动作](https://i.loli.net/2019/12/02/knthILgj7M1cuOd.png)

点击 Create action 保存动作，这样，我们 IFTTT 的起手触发动作就制作完成了。

### IFTTT 自动发送 Twitter 动作

接下来，我们在 IFTTT 平台继续创建两个不同的 Applet，分别用来处理带图微博和纯文本微博的转发。我们和之前一样，选择 Create，配置 This 和 That。

对带图微博：

- This 处选择 Webhooks，选择 Receive a web request，并给 Event name 起名为 `image_weibo`
- That 处选择 Twitter，选择 Post a tweet，并将 Tweet text 设置为：`{{Value1}} via Weibo: {{Value2}}`

对纯文本微博：

- This 处选择 Webhooks，选择 Receive a web request，并给 Event name 起名为 `text_weibo`
- That 处选择 Twitter，选择 Post a tweet with image，并将 Tweet text 设置为：`{{Value1}} via Weibo: {{Value2}}`，将 Image URL 设置为：`{{Value3}}`

> **🍧 注意：**
>
> 这里，我们将从 Integromat 中收到即将发送的推特的三个参数，分别为原微博的文本内容、原微博链接以及（如果有）原微博的图片。在 IFTTT 中，我们分别设置这三个参数：
>
> - `{{Value1}}`：原微博文本
> - `{{Value2}}`：原微博链接
> - `{{Value3}}`：原微博图片（如果有）
>
> 这里的三个 Key 就是 `{{ ... }}` 所包含的内容，这里的配置会和接下来 Integromat 的请求一致。

这样，我们 IFTTT 平台的配置就基本完成了。接下来我们对 Integromat 的动作进行完善。

### Integromat 路由判断树

![Integromat 路由判断树](https://i.loli.net/2019/12/02/6v5qX2zT1Hcde9n.png)

在我们刚刚创建的 Scenario 里面，Webhook 后面，添加一个路由选择：Router。（点击右侧突出的半圆即可添加新的元素，搜索 Router，点击 Flow control 并选择 Router 即可添加。）

在 Router 中第一条分支上面点击，选择设置 Filter，在 Label 处为分支起名为：ImageWeibo，用来专门处理带图片的微博。**在 Condition 里配置 Image contains `http` 的判断条件**，用来正确的调用合适的 IFTTT 动作。

![第一条分支的 Filter 过滤器](https://i.loli.net/2019/12/02/kHB45v3TtJxcnhC.png)

> **🍳 注意：**
>
> 在最初少数派的文章介绍之中，原作者用「Image exists」作为判断条件。经过我的调试发现：即使是并没有包含图片的纯文本微博，在 IFTTT 抓取微博信息并传到 Integromat 之后，Integromat 判断树并不能正确的判断这条微博没有图片，而是会自动触发默认路径，导致我们依旧发出一条带有「IFTTT 找不到图片」的推特。因此，这里我使用的判断条件为：「Image contains `http`」。

在分支末端点击问号，搜索 HTTP，选择 Make a request。之后：

- 在 URL 中填入 IFTTT 带图微博转发的 Applet Webhook 请求地址：`https://maker.ifttt.com/trigger/image_weibo/with/key/{IFTTT API Key}`（将 `{IFTTT API Key}` 更换为上面在 IFTTT Webhook Documentation 中配置的 Key。）
- 在下面的 Method 中选择 POST
- Body type 中选择 `application/x-www-form-urlencode`
- 在 Fields 中点击 Add item：
  - Key 填入 `value1`，Value 选择 `text`
  - Key 填入 `value2`，Value 选择 `url`
  - Key 填入 `value3`，Value 选择 `image`

![触发 IFTTT 带图微博转发 Applet](https://i.loli.net/2019/12/02/A7Cam4tQzJBfu5b.png)

在第二条分支上面点击，选择设置 Filter 并填入 Label 为 PureTextWeibo，在 Condition 处设置筛选条件为：

- Image *Does not contain* `http` **AND**
- Text *Does not match pattern (case insensitive)* `(Repost)|(转发微博)|(\/\/)|(轉發微博)`

两个判断条件进行「与」运算，保证满足两条内容才能触发本条规则。

![第二条分支的 Filter 过滤器](https://i.loli.net/2019/12/02/T1cpRHlqawrdi84.png)

在分支末端点击问号，搜索 HTTP，选择 Make a request。之后：

- 在 URL 中填入 IFTTT 纯文本微博转发的 Applet Webhook 请求地址：`https://maker.ifttt.com/trigger/text_weibo/with/key/{IFTTT API Key}`（将 `{IFTTT API Key}` 更换为上面在 IFTTT Webhook Documentation 中配置的 Key。）
- 在下面的 Method 中选择 POST
- Body type 中选择 `application/x-www-form-urlencode`
- 在 Fields 中点击 Add item：
  - Key 填入 `value1`，Value 选择 `text`
  - Key 填入 `value2`，Value 选择 `url`

![触发 IFTTT 纯文本微博转发 Applet](https://i.loli.net/2019/12/02/h9GcBaOuexkiUSI.png)

到这里，保存 Scenario，我们基本配置任务就完成了。( •̀ ω •́ )y

## 最终的转发效果以及局限性

如果一些顺利，那么我们就应该可以直接让 IFTTT 和 Integromat 配合在云端默默监控我们的最新微博，并自动的根据合适的方式帮我们转发至 Twitter。

![](https://i.loli.net/2019/12/07/F8Pgq2keAU3Sfw5.png)

但是，这种转发方式还是有一定的限制，其中最为致命的实际上就是：IFTTT 只能捕获微博的第一张图片，多于一张的图片我们就只能将第一张图片转发到 Twitter。同时 Integromat 的同步次数也有一定的限制，每个月相当于最多能转发 500 条原创微博。不过这些对我来说还是足够的，如果有更多的需求，我推荐大家购买完整版的「奇点」微博客户端，能够自动每次发微博的同时发送推特，更为方便。这篇文章的介绍就到这里，感谢阅读。
