---
title: "Batch Git Pull：分享一个维护多个 Git 仓库的小脚本"
date: 2019-11-13T11:29:53+08:00
draft: true
featured_image: https://i.loli.net/2019/10/29/ZqySW1DFQvUs7G8.png
---

不废话，放脚本：

```bash
find . -maxdepth 3 -name .git -type d | rev | cut -c 6- | rev | xargs -I {} git -C {} pull
```

更为方便的，直接将这部分加入你的 `.zshrc` 或者 `.bash_profile`：

```bash
alias gpall="find . -maxdepth 3 -name .git -type d | rev | cut -c 6- | rev | xargs -I {} git -C {} pull"
```

之后，直接执行 `gpall` 即可。

好了，我们进入正题。

## 维护多个 Git 仓库的需求

维护多个 Git 仓库不容易。我在我存放 GitHub 仓库的目录下运行了一下 `tree`：

```
.
├── AIP_BackEnd
├── Evaluation_BackEnd
| ... ...
├── SchoolProjects
│   ├── Distance-Vector-Algorithm
│   ├── cartoonize-images
| ... ...
│   ├── zanpress-blog
│   └── zanpress-diagram
| ... ...
└── wechat-format

103 directories
```

103 个目录……我自己 `Documents/GitHub` 文件夹下就有这么多 Git 仓库，一个一个去更新真的很费事情。如何批量更新 GitHub 本地仓库呢？其实就是一个遍历目录，对匹配到的 Git 仓库在其当前分支下执行 `git pull` 的需求嘛，很简单。

## 解决方法

在 Medium 上面，我找到了一个相当优雅的脚本。前面这个脚本已经分享给各位了，我们重新看一下：

```bash
find . -maxdepth 3 -name .git -type d | rev | cut -c 6- | rev | xargs -I {} git -C {} pull
```

可以发现，这一长串命令，事实上就是前面的命令执行结果通过「管道」输出至后面的命令作为输入，也就是命令中 `|` 的功能。我们一段一段看一下这个命令具体都干了什么。

### 用 `find` 搜索目录下全部 `.git/` 文件夹

```bash
find . -maxdepth 3 -name .git -type d
```

![搜索 .git 文件夹](https://i.loli.net/2019/10/29/IVMEzwDqGpXK8me.png)

### 裁剪出我们要的 `.git` 文件夹所在路径

```bash
... | rev | cut -c 6- | rev | ...
```

![裁剪路径](https://i.loli.net/2019/10/29/KDFIBpGXTmcz8qv.png)

### 利用 `xargs` 执行带参数的 `git pull`

```bash
xargs -I {} git -C {} pull
```

最后，我们来看一看效果：

![脚本效果](https://i.loli.net/2019/10/29/oCxk1O9SEP34RhW.gif)

**📚References**

- [Updating Multiple Repos With One Command](https://medium.com/@codenameyau/updating-multiple-repos-with-one-command-9768c8cdfe46)
- [xargs 命令教程](http://www.ruanyifeng.com/blog/2019/08/xargs-tutorial.html)
