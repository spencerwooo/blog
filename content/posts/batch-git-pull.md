---
title: Batch Git Pull：分享一个维护多个 Git 仓库的小脚本
date: 2019-11-13
published: true
slug: batch-git-pull
tags: ['Git', 'Tech']
cover_image: "./images/batch-git-pull.png"
canonical_url: false
description: "如何一次更新多个 Git 仓库"
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

103 个目录……我自己 `Documents/GitHub` 文件夹下就有这么多 Git 仓库，一个一个去更新真的很费事情。如何批量更新 GitHub 本地仓库呢？其实就是一个遍历目录，对匹配到的 Git 仓库在其当前分支下执行 `git pull` 的需求嘛，很简单。

## 解决方法

在 Medium 上面，我找到了一个相当优雅的脚本。前面这个脚本已经分享给各位了，我们重新看一下：

```bash
find . -maxdepth 3 -name .git -type d | rev | cut -c 6- | rev | xargs -I {} git -C {} pull
```

可以发现，这一长串命令，事实上就是前面的命令执行结果通过「管道」输出至后面的命令作为输入，也就是命令中 `|` 的功能。我们一段一段看一下这个命令具体都干了什么。

### 用 `find` 搜索目录下全部 `.git/` 文件夹

每个 Git 文件夹里面一定有 `.git` 的目录，我们只需要找到 `.git` 文件夹既可以找到 Git 目录。

```bash
find . -maxdepth 3 -name .git -type d
```

这里，我们就使用了 `find` 的命令，详见：[GNU - Finding Files](https://www.gnu.org/software/findutils/manual/html_mono/find.html)。我们将命令分解来看：

* `.` 表示匹配命令执行路径下的全部文件与文件夹
* `-maxdepth 3` 表示向下搜索最多三层级目录
* `-name .git` 就是搜索名称为 `.git` 的内容
* `-type d` 则指明了我们搜索的范畴：Directories（目录）

![搜索 .git 文件夹](https://cdn.spencer.felinae98.cn/blog/2020/07/20200722-214839.png)

一目了然，我们下面就这样对每个命令进行分解和解释。

### 裁剪出我们要的 `.git` 文件夹所在路径

上面我们解析出来的路径，每个路径后面都包含一个 `.git`，我们需要统一将这个 `.git` 从字符串中删掉，这样才能一起对给定目录执行 `git pull`。第二步我们进行目录的裁剪。

```bash
... | rev | cut -c 6- | rev | ...
```

可以发现，这里我们有三部分命令。我们依次对命令进行解析：

1. `rev`：首先对搜索到的目录（字符串）进行反转
2. `cut -c 6-`：我们利用 `cut` 工具将路径进行裁剪，`-c` 表示删减的是字符（Characters），`6-` 表示我们删去路径的前 6 个字符（即：`.git`）
3. `rev`：将处理好的字符串反转回来

![裁剪路径](https://cdn.spencer.felinae98.cn/blog/2020/07/20200722-214839-1.png)

### 利用 `xargs` 执行带参数的 `git pull`

上一步，我们已经提取出来所有包含 `.git` 的文件夹，现在我们需要批量的执行 `git pull` 来统一拉取仓库。

```bash
xargs -I {} git -C {} pull
```

由于 `git` 并不支持传入目录等参数，因此我们需要借助于 `xargs` 来给 `git` 传入拉取路径。上面的命令简明易懂，就相当于 `xargs` 告诉 `git` 拉取以上目录下的全部 Git 仓库。我们来看一看效果：

![脚本效果](https://cdn.spencer.felinae98.cn/blog/2020/07/20200722-214839-2.gif)

b(￣▽￣)d 👍 成功\~

## 📚 References

* [Updating Multiple Repos With One Command](https://medium.com/@codenameyau/updating-multiple-repos-with-one-command-9768c8cdfe46)
* [xargs 命令教程](http://www.ruanyifeng.com/blog/2019/08/xargs-tutorial.html)
