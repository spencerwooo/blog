---
title: VS Code Math to Image：在不支持 LaTeX 的地方插入数学公式
date: 2020-08-04T13:50:00+08:00
published: true
slug: vscode-math-to-image
tags:
- Automation
- Tech
- VS Code
cover_image: "./images/vscode-math-to-image.png"
canonical_url: false
description: 为了解决 GitHub 无法渲染 LaTeX 数学公式的问题，我们编写了一个 VS Code 插件。

---
:::note 🛹 同步发布
* **在少数派上阅读本文** — [不支持 LaTeX 也能插入数学公式，这个小插件帮你实现「徒手渲染」](https://sspai.com/post/61877)。
* **Read the English version on Medium** — [VS Code Math to Image: Write LaTeX Math Equations in GitHub Markdown the Easy Way!](https://medium.com/spencerweekly/vs-code-math-to-image-write-latex-math-equations-in-github-markdown-the-easy-way-9fa8b81dc910?source=friends_link&sk=cff035b443fb81f5b20a47370f23aed3)
:::

作为每天都在跟数学公式打交道的工程师、数学家，如果我们想要将自己的学术成果开源并发布在网络平台上，那么这个平台至少要支持在 Markdown 里面用 LaTeX 撰写公式。可惜，想要直接在 Markdown 里面撰写数学公式就必须借助第三方库的帮助：比如 MathJax 和 KaTeX。

因此很多常见的平台都尚未支持 LaTeX 数学公式的渲染，GitHub 就是其中一员——作为可能是世界上最大、最受欢迎的代码开源平台，GitHub 是很多研究人员开源自己学术成果的首选。如果我们想要在 GitHub 的 README 等 Markdown 文件里面撰写数学公式，就必须寻找别的办法。

非常幸运的是：GitHub 允许我们在 Markdown 里面直接插入 SVG 图片（以及 HTML）。这也就意味着，我们可以先将手上的 LaTeX 数学公式渲染成 SVG，再手动将原来的数学公式替换成 SVG 图片，**达成「徒手渲染 LaTeX 公式」的成就。**💪

![将 LaTeX 公式渲染为 SVG 后在 GitHub 上面的显示效果](https://cdn.spencer.felinae98.cn/blog/2020/08/200804_132840.png)

如何才能实现并自动化整个过程呢？为了尽量减少各位的麻烦，提升工作效率，我和同学专门编写了一个 VS Code 插件，用来自动将我们在 VS Code 里面选择的数学公式转换成 SVG 图片，并自动嵌入原位置 —— **VS Code Math to Image：**

* 目前，项目已经开源在 GitHub 上面：[GitHub — vscode-math-to-image](https://github.com/TeamMeow/vscode-math-to-image)；
* 同时 VS Code 插件也发布到了 Visual Studio Marketplace：[VS Marketplace — Math to Image](https://marketplace.visualstudio.com/items?itemName=MeowTeam.vscode-math-to-image)；

## 插件安装

我们在 VS Code 的插件市场搜索 `vscode-math-to-image`，找到 Math to Image 点击安装即可。直接访问 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=MeowTeam.vscode-math-to-image) 点击 Install 也可以安装。

![VS Code 插件市场搜索：vscode-math-to-image](https://cdn.spencer.felinae98.cn/blog/2020/08/200804_134114.png)

## 插件使用

我们成功安装插件之后，就可以直接非常方便地用插件将公式转换成可以显示在 GitHub 里面的 SVG 图片啦：

![使用 VSCode Math to Image 插件将公式渲染为 SVG](https://cdn.spencer.felinae98.cn/blog/2020/08/200804_133321.gif)

具体来讲，比如上面演示动画里面的公式：

```latex
$$
\ell = \sum_{i}^{N}(y_i - \hat{y}_i)^2 - ||w||_2^2
$$
```

$$
\ell = \sum_{i}^{N}(y_i - \hat{y}_i)^2 - ||w||_2^2
$$

正常在 Markdown 中我们是会直接用上面的语法让支持渲染 LaTeX 的编辑器渲染公式的，比如 VS Code 默认的 Markdown 预览视图就支持 LaTeX 数学公式的渲染。如果这一 Markdown 文件里面的公式需要在 GitHub 上显示，那么我们就需要用插件将公式渲染成 SVG。我们直接选择这三行 LaTeX 公式代码（包含第一行和第三行的 `$$`），右键并在菜单中选择「Math » Image: Insert rendered equation (local)」或者「Math » Image: Insert rendered equation (remote)」，之后插件就会将我们选中的公式自动注释掉，并在下方添加相应的 SVG 图片引用。（插件里面 `local` 和 `remote` 两个选项工作原理不同，请见后文。）

![选择公式右键后在菜单中选择渲染选项](https://cdn.spencer.felinae98.cn/blog/2020/08/200804_133228.png)

此时，我们可以发现在 VS Code 的 Markdown 预览界面里面，SVG 图片形式的 LaTeX 公式依旧能够成功渲染，同时这一公式在 GitHub 等仍然不支持 LaTeX 的平台也能正常展现，nice！

## 工作原理

所以，我们插件是如何将一个纯文本格式的 LaTeX 数学公式渲染为 SVG 图片的呢？前面提到的 `remote` 和 `local` 又有怎样的区别呢？这里，我就简单讲解一下插件的渲染和工作原理。

首先，插件的工作原理非常简单、极易理解，我们实际上就是通过某种方式，解析 LaTeX 撰写的数学公式并将之渲染为 SVG， `remote` 和 `local` 的不同之处就在于：

* 前者是借助服务器渲染公式，生成的 SVG 存在于云端；
* 后者是直接在本地渲染公式，生成的 SVG 当然也保存于本地；

![VSCode Math to Image 插件的简单工作原理](https://cdn.spencer.felinae98.cn/blog/2020/08/200804_133452.png)

### 将公式借助服务器渲染为云端 SVG 图片

虽然 GitHub 的 README 等 Markdown 文件里面并不支持 LaTeX 数学公式的渲染，但是：**GitHub 确实会在 Jupyter notebook 里面解析并正常渲染 LaTeX 数学公式！**那既然 GitHub 并没有引用第三方的渲染服务，它们究竟是怎样渲染数学公式的呢？答案是：GitHub 有自己的 LaTeX 渲染服务器，我们给这一服务器一个格式正确的 LaTeX 公式，服务器会直接给我们返回渲染好的 SVG 图片。

嚯，我们要的正好就是这个服务啊！所以，我们插件的 `remote` 选项，就是借助 GitHub 官方的 LaTeX 渲染服务器，将我们的 LaTeX 数学公式转换为云端 SVG 图片。简单来说，比如下面这个标准正态分布公式：

```latex
$$
P(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{\frac{-(x-\mu)^2}{2\sigma^2}}
$$
```

$$
\Large P(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{\frac{-(x-\mu)^2}{2\sigma^2}}
$$

我们可以借助插件直接将其转换为用 GitHub 服务器渲染的 SVG 图片，并用 `<img>` 标签插入 Markdown 之中：

```html
<div align="center"><img src="https://render.githubusercontent.com/render/math?math=P(x)%20%3D%20%5Cfrac%7B1%7D%7B%5Csigma%5Csqrt%7B2%5Cpi%7D%7D%20e%5E%7B%5Cfrac%7B-(x-%5Cmu)%5E2%7D%7B2%5Csigma%5E2%7D%7D%0D"></div>
```

这样，我们原公式就被替换为用 GitHub 服务器渲染好的 SVG 图片：

<figure>
  <img src="https://cdn.spencer.felinae98.cn/blog/2020/08/200804_134758.png" alt="标准正态分布公式（GitHub LaTeX 渲染服务器渲染得到的 SVG 图片）" width="300px" >
  <figcaption>标准正态分布公式（GitHub LaTeX 渲染服务器渲染得到的 SVG 图片）</figcaption>
</figure>

同时，由于渲染服务器正好是 GitHub 自己的，所以肯定不会出现被屏蔽、无法访问的现象，非常靠谱。

### 将公式在本地渲染并直接保存为 SVG 图片

SVG 这一格式非常强大，不仅是矢量图的格式标准，我们还可以在其中添加动画等高级功能。所以实际上，SVG 格式的图片会给网站带来一些安全隐患，也正因为 SVG 的这一特点，导致并非所有的地方都支持外部 SVG 的引用。为了规避这一问题，也为了让 SVG 文件的存在更可控（服务器还是有宕机的风险），我们也实现了 LaTeX 公式「本地渲染」的功能。

我们插件的 `local` 功能实际上就是借助 MathJax 在本地直接将 LaTeX 公式渲染为本地 SVG 图片。这样，我们就可以将这个保存于本地的 SVG 直接在 Markdown 文件里面引用显示，同样方便。

继续用上面标准正态分布的公式，我们可以将公式渲染为存储于本地的 SVG：`svg/e40qQ5G9jw.svg`，并直接保存在 Markdown 文件相邻的一个 `svg` 文件夹中。这样，我们就可以继续用 `<img>` 标签将这个本地 SVG 插入我们的 Markdown 之中：

```html
<div align="center"><img src="svg/e40qQ5G9jw.svg"/></div>
```

<figure>
  <img src="https://cdn.spencer.felinae98.cn/blog/2020/08/200804_134658.png" alt="标准正态分布（本地使用 MathJax 渲染得到的 SVG 图片）" width="300px" >
  <figcaption>标准正态分布（本地使用 MathJax 渲染得到的 SVG 图片）</figcaption>
</figure>

## 小结

以上就是 VS Code Math to Image 这个 VS Code 插件的简单介绍，两种方法（`remote` 和 `local`）都可以帮我们渲染出高质量的 SVG 公式图片，这样我们就可以解决 GitHub 等平台不支持数学公式渲染的一大难题啦！如果你觉得我们的插件非常有用，那么 [一定要去 GitHub 给我们点上一个 Star](https://github.com/TeamMeow/vscode-math-to-image)，如果 [能去 VS Marketplace 给我们个五星好评](https://marketplace.visualstudio.com/items?itemName=MeowTeam.vscode-math-to-image&ssr=false#review-details) 那就更棒啦。
