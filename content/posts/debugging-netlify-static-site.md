---
title: Netlify or VuePress：大型悬疑推理篇之——报错到底是谁的锅？
date: 2020-05-08T16:23:00.000+00:00
published: true
slug: debugging-netlify-static-site
tags:
- Debug
- VuePress
- Netlify
- Frontend
cover_image: "./images/debugging-netlify-static-site.png"
canonical_url: false
description: 记录一次横跨一个月的 debug 之路，还要千万分感谢帮我精准 debug 的 @geekdada。

---
Dev on Windows with WSL 是我目前维护比较频繁的一个文档，它介绍了在 Windows 上使用 WSL 进行开发的环境配置、注意事项以及高阶操作等，我们称它为 `dowww`。我使用的是非常优秀的基于 Vue 的静态文档生成器：VuePress，来构建 `dowww` 的文档网站，并（曾经）借助于 Netlify 来将文档的静态页面部署在网络上，让大家可以访问参考。

随着 WSL 的不断更新，我们的 `dowww` 文档也在不断迭代，为了让 `dowww` 文档网站能够回溯历史版本，我参考了在 VuePress 项目的 issue 区中 [Docs versioning mechanism](https://github.com/vuejs/vuepress/issues/1018) 这一 issue 提到的一种方案，自定义实现了「多版本文档」这一 VuePress 尚未实现的功能。随后，在 Netlify 上部署的静态网站便出现了非常奇特的 bug。

## 问题复现

为了方便各位同学来亲身经历（~~不是~~）这一奇妙的 bug，我并没有删除 Netlify 当时的部署版本，同学们可以直接访问：[Netlify Deploy Preview 54/dowww](https://deploy-preview-54--dowww.netlify.app)，进入任意一个文档内部页面（比如：[Dev on Windows with WSL - LxRunOffline](https://deploy-preview-54--dowww.netlify.app/1.1/4-Advanced/4-2-LxRunOffline.html)），刷新页面，然后我们就可以看到浏览器 Console 中出现了那红红的报错信息：

    DOMException: Failed to execute 'appendChild' on 'Node': This node type does not support this method.
        at Object.appendChild (https://deploy-preview-54--dowww.netlify.app/a...

![刷新页面，即可看到 Console 报错](https://i.loli.net/2020/05/12/ELSOZk4YmoHn81h.png)

另外，在这一状态下，点击左侧的导航侧边栏，VuePress 不仅无法渲染出顺滑滚动的效果，我们甚至无法直接进行页面导航，点不开下拉菜单，偶尔也根本打不开任何其他页面，我们只能手动再次进入文档主页，重新定位刚刚的位置才能正常阅读。🎃

其实，我在今年 1 月初更新完成大部分 1.1 版本的 `dowww` 之后，就发现了这一问题。同时，@InsulationJustf 大佬在 2 月左右也跟我反馈了侧边栏无法点击的问题。拖延症的我，在搜索了全网的相关问题之后，发现：

* 有可能是 VuePress 自己的问题
* 也有可能是我手动给 VuePress 添加 versioning 功能导致的 bug
* 还有可能是我部署到 Netlify 上面之后，Netlify 做了些 undocumented 的操作
* 甚至有可能是 Cloudflare 在将网站 serve 出来的时候动了动静态文件，压缩了空白字符等等

最终我解决问题无果，在 4 月的时候去 Netlify Community 寻求帮助，各位可以去 [VuePress deployment on Netlify succeeds, but experience errors when reloading specific pages](https://community.netlify.com/t/vuepress-deployment-on-netlify-succeeds-but-experience-errors-when-reloading-specific-pages/12606) 这一问题下进行围观。

## 定位 bug

其实，在去 Netlify Community 寻求帮助之前，我就已经自己在本地和远程环境中进行多次 debug 尝试。我用 Chrome Debugger 寻找到报错的具体原因，并将前面的猜想一一进行了排除。

### 使用 Chrome Debugger 找到报错根源

在 Production 环境下进行 debug 异常艰辛，因为 Production 环境中所有的相关文件都已经被 minify 了，即使在 Chrome 的 console 中报出错误，我们点击进入报错代码行，映入眼帘的也只有以 `e`、`t`、`p` 等为名的反人类变量。我们只能寄希望于 Chrome Debugger 能够捕获 Exception，并给我们有用的信息。

报错只发生于部署得到的 Netlify 网站上面，所以我们直接进入文档内部一页，点击刷新，待页面加载成功之后开启 Chrome Debugger 捕获 Exception。在这一状态下，bug 的复现非常简单，只需要点击任意一个侧边栏链接，我们就可以看到 Chrome Debugger 捕获到了相应的错误：

![使用 Chrome Debugger 捕获出错位置](https://i.loli.net/2020/05/12/CsaWuSQ3k4rvAnt.png)

可以看到，出错的代码是：

```javascript
appendChild: function(t, e) {
  t.appendChild(e)
}
```

当 `t` 是一个 `#comment` 类型的节点（node）时，强行给这一节点添加子节点（即调用 `appendChild()` 方法）就会报出 `DOMException: Failed to execute 'appendChild' on 'Node'` 的错误。我们这里的 `t` 刚好是一段空注释 `<!---->`，自然不是合法的 HTML 节点，报错合情合理。

### 排除是 VuePress 本身的原因

为了排除是 VuePress 本身的问题，我首先确认了网站在本地的 Dev 环境下是没有问题的，也就是 `yarn docs:dev` 开启 development server 后的网站时没问题的。当然，也确实没有问题，我完全无法复现在服务器上部署出现的 bug。

接下来，我尝试在本地 build 网站的静态文件，并用一个简单的 http server 在本地部署进行尝试。我使用 `yarn docs:build` 将全站进行编译，生成静态文件位于 VuePress 编译后静态文件的默认位置（也就是 `docs/.vuepress/dist` 目录下）。之后，我简单使用 Python 的 `http.server` 来 serve 得到的静态文件夹：

```bash
# 进入编译得到的静态文件目录
cd docs/.vuepress/dist

# 运行 Python http.server 模块来 serve 整个网站
python -m http.server
```

这样我们就可以在 `localhost:8000` 访问 Production 环境下的网站，如果我们直接将这一网站部署到自己的服务器上，得到的效果也是如此。但是，我依旧没能够复现在 Netlify 上面部署出现的 bug。所以我们基本可以确定我们自己的网站本身是没有问题的，问题应该出现在第三方静态网站托管服务上，也就是 Netlify 或者 Cloudflare 上面。

### 罪魁祸首竟然是……

上面我们找到了报错的原因，也排除了 VuePress 本身导致的报错，因此，前两个推断都被我们一一排除掉，出错只可能是由于 Netlify 或者 Cloudflare 导致。为了验证，我将网站重新用和 Netlify 类似的 Vercel（前身是 ZEIT）进行了部署，整个部署非常简单，项目导入之后几乎零配置就完成了网站的迁移。

之后，令人震惊的事情发生了：**在 Vercel 上部署的 `dowww` 竟然没有任何问题，和本地部署的版本近乎一致，bug 也销声匿迹！**

:::important 罪魁祸首
**🌚 Netlify！想不到你这个浓眉大眼的！竟然是因为你！**
:::

## 解决方案

好吧，确实是因为 Netlify 出了点偏差，但是虽然我已经找到了问题是 Netlify 导致的，网站迁移到 Vercel 就没有问题了，但是我还是没有找到到底为什么 Netlify 部署的网站会和本地不一致。

就在我在 Telegram 频道发布迁移投票之后，[@geekdada](https://twitter.com/geekdada) 通过 Twitter 私信找到了我，一针见血，精确定位问题所在！（[@geekdada](https://twitter.com/geekdada) 是 Surgio 的作者，[Surgio](https://github.com/geekdada/surgio) 是**支持自部署的一站式规则解析生成器**，身处国内的你一定用得到 🚀）

@geekdada 告诉我，Netlify 有一个非常蛋疼的设定：所有包含有大写字母的 URL 路径都会被处理成小写，这一规则是默认添加且不能 opt out 的，也就是所有在 Netlify 上部署的静态网站，如果包含有 case-sensitive 的路径，就有可能出错。

> This is an intended feature of our platform from which you cannot opt out. We’ll serve any combination of case (e.g. `FiLe.HtMl` or `file.html` or `FILE.HTML`) correctly, though the mixed-case ones will be redirected to the “canonical” lowercase definition.
>
> We found that most people deploy from a non-case-sensitive filesystem (Windows/Mac) and this was the best way to make things work as most folks intended.
>
> 🚩 _Source: [My URL paths are forced into lowercase](https://community.netlify.com/t/my-url-paths-are-forced-into-lowercase/1659/2)_

Netlify 强制使用小写 URL 路径的方法是将直接访问包含有大写字母的 http 请求通过 301 转发至小写 URL。比如，我们尝试直接请求 `https://deploy-preview-54--dowww.netlify.app/1.1/4-Advanced/4-2-LxRunOffline.html` 这一包含有大写字母的 URL：

```bash
curl -I https://deploy-preview-54--dowww.netlify.app/1.1/4-Advanced/4-2-LxRunOffline.html
```

![请求 Netlify 上包含有大写字母 URL 的路径](https://i.loli.net/2020/05/08/sLYNtWo7D16wU3q.png)

可以看到 Netlify 是返回了一个 HTTP 301，并转发到了相应的小写字母 URL 对应的 location。而当我们直接请求小写字母版本的 URL 时：

```bash
curl -I https://deploy-preview-54--dowww.netlify.app/1.1/4-advanced/4-2-lxrunoffline.html
```

![请求对应只有小写字母的 URL 路径](https://i.loli.net/2020/05/08/q5RBnexLKyUzNQO.png)

一切都恢复正常了。由于 VuePress 生成的静态文件的文件名都是按照我 Markdown 文件名来的，所以当我们直接的访问一个包含大写字母 URL 的内部页面时，由于 Netlify 的处理，我们实际上进入了一个全为小写字母 URL 的页面，此时 VuePress 自己就迷惑了，也就出现导航至其他页面时可能触发的 bug。

所以……看来如果我将我项目中所有的路径中的大写字母改为小写，问题在 Netlify 平台上就解决了？事实上也确实如此。上面刚刚提到，VuePress 在进行 Markdown 文件解析时，会按照 Markdown 文件本身的文件名进行处理，每一个 Markdown 文件都是一个单独的路径，因此我需要将所有的 Markdown 文件名称、包含 Markdown 文件的路径、以及在 VuePress 配置文件 `config.js` 与我自己自定义 versioning 实现中所使用的 `sidebar.js` 里定义的全部文件名、路径名中的大写字母更换成小写字母。

看似比较复杂的问题，其实也不过是一行命令的事情：

```bash
find my_root_dir -depth -exec rename 's/(.*)\/([^\/]*)/$1\/\L$2/' {} \;
```

上面这一命令非常巧妙，用 `rename` 工具先重命名目录中包含的文件，再重命名目录本身，有效的避免了命令错误导致文件路径失效的问题[^1]。我直接在项目的 `/docs` 目录下运行上面这一命令，之后手动修改了 `config.js`、`sidebar.js` 中内容，重新部署到 Netlify 上面……问题解决！

那么，历时四个月（~~并没有，只是因为我拖延~~）的 bug 总算解决了，我们 `dowww` 文档也正式支持上了多版本 versioning，非常开心。不过，虽然 Netlify 上面确实问题解决了，但是由于 Vercel 的管理后台实在太好看，所以我还是把我的大部分网站都迁移了过去。喜新厌旧本人了 🤭

这篇文章主要想记录一下我艰（tuo）难（yan）的 debug 经历，为同在使用 Netlify 和 Vercel 等第三方静态网站托管平台的你提供一些参考，不再重蹈覆辙。希望本文能够帮到你解决问题，感谢阅读。

[^1]: 这一命令来自 Stack Overflow 的这一问题：[How do I rename all folders and files to lowercase on Linux?](https://stackoverflow.com/questions/152514/how-do-i-rename-all-folders-and-files-to-lowercase-on-linux)
