---
title: Quit using nvm：快删掉这个占据 Zsh 启动时间一半的怪物！
date: 2020-07-28T14:30:00+08:00
published: true
slug: remove-nvm-to-speed-up-zsh
tags:
- Shell
- Dev Environment
- CLI
cover_image: "./images/remove-nvm-to-speed-up-zsh.gif"
canonical_url: false
description: 没想到啊 nvm，竟然是你这个浓眉大眼的让我 Zsh 开一次足足等 2 秒！

---
我实在是受不了了。我这 10 代 i7 的顶配 ThinkPad 在 WSL 2 里面打开一个 Shell，竟然每次都需要在心里面默念 2 个数才能敲进去字。淦啊 (╬▔皿▔)╯

## 我管理 Zsh 配置的方法

对了，得先跟大家说说，我还在用 Zsh，但是我丢掉了 Oh My Zsh 这个好像大家都在用的 Zsh 框架，转而使用更加灵活的 [zplug](https://github.com/zplug/zplug) 来管理我的 Zsh 配置。如果你用 Vim 和 `vim-plug`，那么 `zplug` 用起来的感觉将非常熟悉：`zplug` 跟 `vim-plug` 的设计风格就非常相似。当然，`zplug` 最吸引我的一点还是「高度的可自定义」。不像 Oh My Zsh 把 Zsh 所有配置都为我们设定好了，`zplug` 支持用「插件」的方式安装、配置 Zsh 的各项功能，甚至可以像安装插件一样安装 Oh My Zsh 的部分功能。

比如，Oh My Zsh 的 Git 插件和预设 alias 们就很好用啊，那我直接就能用 `zplug` 装上：

```bash
zplug "plugins/git", from:oh-my-zsh
zplug "plugins/common-aliases", from:oh-my-zsh
```

自动补全 `zsh-completions` 和类似 Fish shell 的自动命令建议 `zsh-auto-suggestions` 也非常有用啊，那我也立刻拿 `zplug` 装上：

```bash
zplug "zsh-users/zsh-completions"
zplug "zsh-users/zsh-autosuggestions"
```

可以看到，`zplug` 胜在灵活，自定义程度高，所以我才舍 Oh My Zsh 而取 `zplug`。另外，`zplug` 还支持 parallel update，这点也非常讨我欢心：

![zplug update 支持多个插件同时并行更新](https://cdn.spencer.felinae98.cn/blog/2020/07/20200727-221325.gif)

好了，这篇文章不光是吹 `zplug` 多好，而是为了找到到底哪个混蛋在耽误我 Zsh 的启动速度。

## 对 Zsh 启动时间进行测量

为了定量的衡量 Zsh 的启动过程，我们先建立一个 baseline：测量在当前没有任何插件调整情况下 Zsh 的「冷启动」时间。

我使用了下面的命令来测量 Zsh 启动时间：

```bash
time zsh -i -c exit
```

未经调整的 Zsh 启动时间数据如下：

![初始 Zsh 启动时间](https://cdn.spencer.felinae98.cn/blog/2020/07/20200727-221927.png)

最后一行可以看到，总时间用了 1.93s，多次启动得到的数据类似，1.93s 也符合上面我人肉感知的「心中默念两个数」的时间。

要知道，为了让 Zsh 更快的显示，我可是直接用上了 Powerlevel10k 这个地表最快，连作者都疯狂优化的 Zsh prompt 主题框架。用 Powerlevel10k 渲染的 Zsh prompt 显示速度可以说是优化到了极致，[**提供 uncompromising performance**](https://github.com/romkatv/powerlevel10k#uncompromising-performance)。但是接近 2s 的冷启动时间还是令人难受，而这显然不是 Powerlevel10k 的锅。

## 深入评估 Zsh 冷启动过程中的时间使用

经过一番搜索，我发现 Zsh 内部就有一个能够 benchmark 并 profile Zsh 自己启动过程时间使用的工具：`zprof`。如果你学过软件工程，你应该知道评价软件质量的一个重要工具：Profiler，用于衡量软件各个部分各个模块具体执行时间的评测工具。

> A _profile_ is a set of statistics that describes how often and for how long various parts of the program executed. [^1]

常见的语言环境都有原生的 Profiler，比如 Python 内置的 `cProfile`、Node.js 内置的功能 `node --prof`……部分 IDE 比如 Visual Studio 也有类似的工具，这些 Profiler 在优化软件的执行速度上起到了举足轻重的作用。

我们用 `zprof` 来对 Zsh 进行 Profile 评估：

* 在 `.zshrc` 的最开头新增一行并写入 `zmodload zsh/zprof`；
* 在 `.zshrc` 文件末尾添加一行再写入 `zprof`；
* 保存 `.zshrc` 再重启我们的 Zsh Shell（关闭再打开终端）；

添加了 `zprof` 必要命令后，重新打开 Zsh 时 `zprof` 会开始自动对 Zsh 启动过程中各个过程所用时间进行测算，最终得到类似这样的报告：

![zprof 测量 Zsh 冷启动过程各个功能模块执行所用时间报告](https://cdn.spencer.felinae98.cn/blog/2020/07/20200727-224130.png)

看前几行的 `nvm_die_on_prefix`、`nvm`、`nvm_auto` 和 `nvm_ensure_version_installed`，它们依次占用了 17.82%、16.34%、15.18% 和 4.80% 的启动时间，`nvm` 相关的模块一共占据了我 Zsh 启动时间的一半以上。原来是你，`nvm`！(ノ｀Д)ノ

## 删掉 `nvm`？

显然，删掉 `nvm` 看起来应该是我们最显而易见、一劳永逸的解决方案，根据上面的数据，删掉 `nvm` 或者不让 `nvm` 在 Zsh 启动时加载大概率能节省一半的启动时间。后者被称为「懒加载」，也就是我们常说的 lazy loading。不过我 Node.js 环境用的还是挺多的，同时 `nvm` 也是出了名的慢，而 `nvm` 市面上的替代品还是挺多的，所以咱们先删掉再说。

`nvm` 实际上仅是一个帮我们管理 Node.js 版本的 Bash 脚本，`.zshrc` 中 `nvm` 相关的加载不多，只有这些：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[[ -r $NVM_DIR/bash_completion ]] && \. $NVM_DIR/bash_completion
```

将我 `.zshrc` 中加载 `nvm` 的这部分删掉后，重新对 Zsh 的冷启动时间进行测量，得到这样的结果：

![删除 nvm 优化后 Zsh 启动时间](https://cdn.spencer.felinae98.cn/blog/2020/07/20200727-221837.png)

哟，直接降到 1s 以内了，跟我们设想预期完全一致。拜拜了您嘞 `nvm`！

```bash
rm -rf ~/.nvm
```

## 那我后面用什么来管理安装 Node.js？

好了，删掉了 `nvm`，我们后面用什么呢？这里我推荐一个设计更精良，安装更合理的 Node.js version manager：[n - Interactively Manage Your Node.js Versions](https://github.com/tj/n)。基本的使用方法跟 `nvm` 其实非常相似，但是 `n` 不用往我们 `.zshrc` 里面加一些奇奇怪怪的执行命令，最多只需要一个 `N_PREFIX` 的环境变量来定义 `n` 安装目录。轻量简便，推荐使用！

推荐大家用 [n-install](https://github.com/mklement0/n-install) 来在 Linux 和 macOS 上安装 `n`：

```bash
curl -L https://git.io/n-install | bash
```

`n-install` 可以自动帮我们在 `$HOME` 文件夹下创建 `n` 所使用的安装目录，并将环境变量替我们设定完整，应该是目前为止最方便的 `n` 安装方法。

:::important 🎍 阅读更多
有关 `n-install` 的更多使用细节（包括安装、更新、卸载……）请参考 `n-install` 官方仓库：[mklement0/n-install](https://github.com/mklement0/n-install)。
:::

安装成功 `n` 之后，我们就可以像往常一样，安装使用多个版本的 Node.js 啦。

## 使用 WSL 同学的注意事项

在上面用 `n-install` 安装 `n` 的时候，在 WSL 里面执行时，我发现了一个很憨批的问题。`n-install` 会检测当前系统 `$PATH` 中是否已经有 `n`、Node.js 或者其他相关的二进制文件，如果发现就会报错：

```
Aborting, because n and/or Node.js-related binaries are already in the $PATH.
```

而 WSL 默认情况下会将 Windows 的 `$PATH` 一并 append 到自己的 `$PATH` 里面，当然这样做无可厚非，毕竟这样可以让我们直接在 WSL 里面调用比如 `clip.exe`、`explorer.exe` 等 Windows 可执行文件。但是，由于我 Windows 里面也安装了 Node.js、yarn 等等，导致 `n-install` 检测到 WSL 的 `$PATH` 包含这些内容，拒绝安装。（在 WSL 中我们可以用 `echo $PATH` 来查看当前 `$PATH` 中包含哪些路径，大概率包含许多 `/mnt/c/xxx` 的路径，这些就是 Windows 的可执行文件路径。）

这一情况就要我们自己来修改 WSL 的 `$PATH` 了。为了后续工作的顺利开展，我直接利用 `/etc/wsl.conf` 来设定 WSL 的 `$PATH` 中默认不包含 Windows `$PATH`：

```
[interop]
appendWindowsPath = false
```

重启 WSL 环境（在 Windows 中用命令 `wsl --shutdown`），再次 `echo $PATH`，我们就会得到非常干净的纯 WSL 的 `$PATH`。这样我们即可用 `n-install` 顺利安装 `n` 了。

不过，这样设定后，我们就无法继续在 WSL 中直接运行 Windows 的可执行文件了。别慌！我们手动将 Windows 中所需要的几个可执行文件添加到 WSL 的 `$PATH` 里面即可。常见的几个 Windows 系统可执行文件的目录位于：

| 工具名称 | 可执行文件 | WSL 路径 |
|:--------|:---------|:---------|
| Windows 剪贴板 | `clip.exe` | `/mnt/c/WINDOWS/system32` |
| Windows 资源管理器 | `explorer.exe` | `/mnt/c/WINDOWS` |
| VS Code 的 `code` 命令 | `code.exe` | `/mnt/c/Users/<YOUR WINDOWS USERNAME>/AppData/Local/Programs/Microsoft VS Code/bin` |

我们依次将我们所需要的这些路径在 `.zshrc` 中重新添加到 WSL 的 `$PATH` 即可：

```bash
# Manually add Windows explorer and clipboard executables etc. to Linux $PATH
export PATH="$PATH:/mnt/c/WINDOWS:/mnt/c/WINDOWS/system32"
export PATH="$PATH:/mnt/c/Users/Spencer/AppData/Local/Programs/Microsoft VS Code/bin"
```

## 小结

文章到这里就介绍完毕啦，**这里我只是为大家提供给 Zsh 启动过程进行时间测量和 profile benchmark 的标准方法**，如果各位也想加速自己 Zsh 的启动过程，那么可能除了删掉 `nvm` 换用 `n`，还需要结合自己的实际情况，删除、懒加载部分插件或工具。个人认为优化到 1s 以内就是比较合理的、可以接受的冷启动时间啦。就酱，感谢阅读。(*/ω＼*)

[^1]: <https://docs.python.org/3/library/profile.html>