---
title: "BIT-Web Automation：如何利用 iOS 快捷指令自动化登录 BIT-Web 校园网"
date: 2019-12-29
published: true
slug: bitweb-auto-login
tags: ['Automation', 'Shortcuts', 'BIT']
cover_image: ./images/bitweb-auto-login.png
canonical_url: false
description: "自动化登录 BIT-Web 的最佳实践"
---

BIT-Web 是北京理工大学校园 Wi-Fi，专门用于笔记本等桌面设备，另外还有 BIT-Mobile 用于移动设备。但是，BIT-Mobile 有时候并没有 BIT-Web 稳定，自动登录不是那么靠谱，我们也不能通过 BIT-Mobile 登录使用免费运营商宽带，这些场景下我们都需要在移动设备上连接至 BIT-Web 进行手动登录。

![BIT-Web 和 BIT-Mobile 的对比](https://i.loli.net/2019/12/03/3V7DesynEPc4zdk.png)

最近我的同学跟我说，BIT-Web 的登录页面在移动端（尤其是 Android 平台）上不能正常的显示「密码管理器」，也就不能直接填充密码，每次都需要手动输入。这令人非常烦恼，如何才能实现在连接到 BIT-Web 上之后自动发送登录认证请求来连接至校园网呢？

## 实现思路

对于我的学校来说，登录至校园网的基本操作就是：

- 连接到 BIT-Web
- 在浏览器中打开网址 `t.cn` 来重定向至登录页面 `10.0.0.55`
- 输入账号密码并点击登录

在这背后，我们事实上是给学校校园网登录认证服务器发送了一个带有我们「账号」和「密码」的登录请求（实际来说可能是账号密码组合出的加密认证令牌），之后校园网认证服务器核实我们的身份，并反馈我们认证结果，给予上网权限。

![连接至 BIT-Web 并进行认证过程发送的网络请求](https://i.loli.net/2019/12/29/LzhZjYvgDCxVHby.png)

这样来说，我们事实上就只需要在每次连接至 BIT-Web 网络时，自动发送这一请求，即可实现自动登录校园网的功能。在 iOS 平台，我们有相当方便的工具来制作发送请求的脚本：快捷指令 Shortcuts，利用 Shortcuts 我们可以定制一个「动作」，实现自动登录的功能。

另外，iOS 13 里面的 Shortcuts 加入了全新的 **Automation**：基于场景的动作自动化执行功能。利用这一特性，我们就可以定义「连接到 Wi-Fi 名称为 BIT-Web 的网络」这一「触发器」，从而实现自动触发动作的能力。

好啦，万事俱备，我们开始实现吧～

## 操作步骤

接下来，我会以 iOS 的 Shortcuts 中「自动登录校园网」的实现为例，详细介绍我们具体如何实现这样的自动化操作功能。

首先需要说明的是，iOS 的 Shortcuts 里面能够执行的算法有限，但是就今天（2019.12.25）来说，我校校园网服务器的登录认证接口已经升级，需要进行加密运算生成登录令牌才能正确认证。考虑到我们的脚本仅仅在校园网内部可控环境下执行，这里我们退而求其次，使用旧接口：**直接发送明文账号密码进行认证的 API 来登录校园网。**

### 明确网络请求参数

BIT-Web 的旧登录请求接口是如下配置的：

```http
POST /include/auth_action.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Host: 10.0.0.55:801
Content-Length: 75

action=login&username={YOUR_USERNAME}&password={YOUR_PASSWORD}&ac_id=8&save_me=1&ajax=1
```

其中 `{YOUR_USERNAME}` 以及 `{YOUR_PASSWORD}` 均为明文账密，我校曾经就是这样简单粗暴。简单在终端中用 cURL 工具进行测试，在连接 BIT-Web 且尚未登录的情况下，在终端中输入如下的命令：

```bash
curl --request POST \
  --url http://10.0.0.55:801/include/auth_action.php \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data action=login \
  --data username={YOUR_USERNAME} \
  --data password={YOUR_PASSWORD} \
  --data ac_id=8 \
  --data save_me=1 \
  --data ajax=1
```

将你自己的账号密码带入其中，如果得到类似下面的包含有 `login_ok` 的结果，同时你可以连接互联网，那么说明你的认证成功。

> **💡 注意：**
>
> 这里如果登录失败，校园网认证服务器会直接返回登录失败的原因。比如：已欠费、密码错误等。按照错误信息进行相应的调试即可。

![cURL 测试登录 BIT-Web 效果](https://i.loli.net/2019/12/29/4LtWYlVFU6fpnAb.png)

上面的 HTTP 请求我来简单分解介绍一下。首先，请求是 `POST` 的方法，格式为 `application/x-www-form-urlencoded`，请求地址（即 url 地址）为 `http://10.0.0.55:801/include/auth_action.php`，参数分别为：

| 参数       | 值                | 功能                                                     |
| :--------- | :---------------- | :------------------------------------------------------- |
| `action`   | `login`           | 设置动作为登录                                           |
| `username` | `{YOUR_USERNAME}` | 发送账户（即学号）                                       |
| `password` | `{YOUR_PASSWORD}` | 发送校园网密码                                           |
| `ac_id`    | 8                 | 代表登录 BIT-Web（BIT-Mobile 登录请求的 `ac_id` 不一样） |
| `save_me`  | 1                 | 保存当前登录 session                                     |
| `ajax`     | 1                 | （猜测）表示异步发送请求                                 |

搞清楚我们具体的发送信息之后，接下来我们开始着手在 iOS 上面制作 Shortcuts 动作。

### 制作 Shortcuts 动作

首先，在 Shortcuts 里面创建新动作，并搜索加入模块「Get contents of URL」。点击模块下部的 Show More，在其中按下图进行配置：

<!-- ![BIT-Web 登录认证请求模块](https://i.loli.net/2019/12/29/dKnXm2GWcAeRHrD.png) -->

<p><img src="https://i.loli.net/2019/12/29/dKnXm2GWcAeRHrD.png" alt="BIT-Web 登录认证请求模块" width="500px"></p>

- URL 设置为：`http://10.0.0.55:801/include/auth_action.php`
- Method 设置为：`POST`
- 之后会出现 Request Body 的设置字段：
  - 选择 Request Body 为 **Form**
  - 点击 Add new field，选择 Text 类型。将 Key 字段设置为 `action`，Text 设置为字段设置为 `login`
  - 继续点击 Add new field 并选择 Text 类型。将 Key 字段设置为 `username`，Text 设置为字段设置为**你的校园网用户名（学号）**
  - 继续点击 Add new field 并选择 Text 类型。将 Key 字段设置为 `password`，Text 设置为字段设置为**你的校园网账户密码**
  - 继续点击 Add new field 并选择 Text 类型。将 Key 字段设置为 `ac_id`，Text 设置为字段设置为 8
  - 继续点击 Add new field 并选择 Text 类型。将 Key 字段设置为 `save_me`，Text 设置为字段设置为 1
  - 继续点击 Add new field 并选择 Text 类型。将 Key 字段设置为 `ajax`，Text 设置为字段设置为 1

在模块「Get contents of URL」下方添加模块「Text」，**将「Text」的值设置为「Contents of URL」**，也就是上一步网络请求的返回结果。

<!-- ![将返回数据用 Text 模块规格化](https://i.loli.net/2019/12/29/c1DTOqN8vQJgpGL.jpg) -->

<p><img src="https://i.loli.net/2019/12/29/c1DTOqN8vQJgpGL.jpg" alt="将返回数据用 Text 模块规格化" width="500px"></p>

继续，在下面添加模块「If」，用来判断我们登录成功与否。将 If 模块的判断条件设置为「contains」，包含字符设置为 `login_ok`：

- 如果匹配成功：说明登录 BIT-Web 成功，发送登录成功通知
- 如果匹配失败（进入 Otherwise 部分）：说明登录 BIT-Web 失败，发送登录失败通知以及失败的请求返回的数据

<!-- ![BIT-Web 登录返回数据处理模块](https://i.loli.net/2019/12/29/W3ePoZXzOkjsqpQ.jpg) -->

<p><img src="https://i.loli.net/2019/12/29/W3ePoZXzOkjsqpQ.jpg" alt="BIT-Web 登录返回数据处理模块" width="500px"></p>

之后，我们测试。将手机连接至校园网 BIT-Web，尝试执行这一 Shortcuts 动作。如果一切顺利，那么你应该可以登录成功，得到如下通知：

<!-- ![BIT-Web 登录成功](https://i.loli.net/2019/12/29/KRnBAS9ygtz4lQb.jpg) -->

<p><img src="https://i.loli.net/2019/12/29/KRnBAS9ygtz4lQb.jpg" alt="BIT-Web 登录成功" width="500px"></p>

### 定义动作触发条件

接下来，我们在 Shortcuts 中设置连接至 BIT-Web 之后自动触发这一动作的功能。在今年秋天 iOS 13 的更新中，Shortcuts 同样更新了其 Automation 的功能。这里我们所要做的就是设置一个「触发器」使得 iPhone 能够自动连接到 WiFi SSID 为 BIT-Web 的网络之后提醒我们执行上面创建的 Shortcuts 动作。

我们点击 Shortcuts 中间菜单「Automation」，点击上方加号，选择 Create Personal Automation。之后，在菜单中选择 WLAN，在下方菜单中点击 Choose 并选择 BIT-Web。

![配置连接至 BIT-Web 的自动触发器](https://i.loli.net/2019/12/29/as4dlTP6xqKHieG.png)

之后，点击右上角 Next，在添加动作模块的页面点击加号，添加一个「Run Shortcut」的模块。

![添加 Run Shortcut 的模块](https://i.loli.net/2019/12/29/U7QO8EF5J1gNRca.jpg)

接下来，将「Run Shortcut」模块的执行动作设置为我们刚刚制作的 BIT-Web Shortcut 动作。其他内容无需改动。

![配置自动执行上一步制作的 BIT-Web Shortcut 动作](https://i.loli.net/2019/12/29/GhiWC1arb9uwQeV.png)

之后，点击 Next > Done 保存动作。

## 效果

如果一切顺利，那么你的 iPhone 连接至 BIT-Web 之后，Shortcuts 应用就会自动弹出提醒请求执行 BIT-Web 登录的动作。在通知提醒上面点击执行，我们就可以直接登录至 BIT-Web。

> **🤔 注意：**
>
> 这一快捷指令以及利用快捷指令登录 BIT-Web 是上个月的思路和想法，在上个月这一功能一直完好可用，但是最近我注意到 Wifi 触发器总是无法正确的触发动作的运行，同时在 Reddit 社区里面也有不下 5 条抱怨 WiFi 触发器不工作的内容。因此我怀疑确实是 iOS 出现的 bug 导致的。

另外，如果上面的触发总是无法成功，那么你也可以直接将 BIT-Web Shortcut 动作固定在主屏幕，每次连接到 BIT-Web 之后手动点击执行快捷指令即可。这肯定比跳转登录认证页面输入账号密码登录方便许多。

![直接将 BIT-Web 登录快捷指令固定到主屏幕](https://i.loli.net/2019/12/29/uEm2ZR5gdKXW9iL.jpg)

自动化的操作比人力重复无效劳动要方便许多，打卡、签到，日复一日的登录、提醒，都可以利用「自动化」的思路进行完成。本文就介绍到这里，感谢阅读。
