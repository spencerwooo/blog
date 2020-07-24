---
title: Yadm：我是如何同步并管理我的 Dotfiles 的？
date: 2020-07-24T21:45:00+08:00
published: true
slug: how-i-manage-my-dotfiles
tags:
- CLI
- Dev Environment
- Terminal
cover_image: "./images/how-i-manage-my-dotfiles.gif"
canonical_url: false
description: Yet Another Dotfiles Manager，基于 Git 的 Dotfiles 管理器。

---
没想到啊，[我的 dotfiles 仓库](https://github.com/spencerwooo/dotfiles "我的 dotfiles 仓库")竟然是目前我 GitHub 上面星星数量最多的单仓库。

Dotfiles 顾名思义，就是我们在使用软件的时候，软件为了存储我们个人偏好设置而建立的一个以 `.` 开头的文件。

> User-specific application configuration is traditionally stored in so called **_dotfiles._** [^1]

比如，编辑器 Vim 有 `.vimrc`，常用的 Zsh、Bash 等 Shell 分别有 `.zshrc`、`.bashrc` 等等。另外，广义的 dotfiles 也包括 `JSON`、`TOML` 等常规配置文件（当然也包含 Neovim 的 `init.vim` 等等）。总之，这么多的 dotfiles 都是我们第一次配置安装好系统、软件之后存在于我们电脑上面的个性化配置文件。但是这些 dotfiles 往往都只存在于我们电脑上独一份，一旦重置系统、更新换代，新电脑上就有需要重新配置一遍所有的 dotfiles 才能还原我们原本的设置。手动配置这些内容一想就非常繁琐，为了最快让新电脑能够用上我们熟悉的工具和配置，也为了对我们自己的配置进行版本控制，我们需要用工具来管理我们的 dotfiles。

## 用 Git 的思想来管理 dotfiles

如果说要管理 dotfiles，我的第一反应就是用 Git 来管理，**毕竟专业的版本控制工具，用来管理纯文本文件的修改和同步再合适不过了。**现在前面提到的那个星星数量最多的 repo 就是我最初用 Git 来将我的 dotfiles 集合到一个 GitHub 仓库里面时所做的尝试。那个仓库现在来看其实比较混乱，由于是一个标准的 Git 仓库，所有的文件都在当前文件夹下，因此为了三个系统的 dotfiles 都同步于一个仓库里，我建立了三个不同的文件夹：macOS、Windows 和 Linux。同时我也得手动将我本地的实际修改复制粘贴到这一 dotfiles 仓库之中。

![我之前利用 Git 手动同步的 Dotfiles 仓库](https://cdn.spencer.felinae98.cn/blog/2020/07/20200724-173035.png)

那么这样管理的弊端显而易见：这一仓库仅仅算是「一个配置参考」，**而非实际意义上的 portable dotfiles repository。**多机同步靠粘贴，版本控制靠脑袋，有时候我的工具或者配置更换了，只能徒手把原来的配置移动到 `/archive` 文件夹下……这样管理一点也不优雅！如果我们可以直接在每个 dotfile 所在的原本位置就将其签入 Git 系统进行版本控制和远程同步就好了。🎈

## Yet Another Dotfiles Manager

`yadm` —— Yet Another Dotfiles Manager，恰好就是为管理 dotfiles 而生的一个工具。利用 `yadm`，我们可以在每个 dotfile 的原始位置，用超出原生 Git 所支持的功能，来任意的管理、同步我们的 dotfiles。

* `yadm` 的官方 GitHub 地址位于：[TheLocehiliosan/yadm](https://github.com/TheLocehiliosan/yadm)
* `yadm` 的官方介绍于文档位于：[Yet Another Dotfiles Manager](https://yadm.io/)

首先，实际上 `yadm` 的底层依旧是 Git，也就是说，我们在用 `yadm` 管理 dotfiles 的时候，实际上依旧是用 Git 来进行版本控制、远程同步等等操作的。但是，`yadm` 在 Git 的基础之上，进行了合理的功能拓展：`yadm` 能够让我们不必被一个 Git 仓库文件夹所限制，不必将 `$HOME` 目录下的全部非相关文件放入 `.gitignore`，能够直接管理同步 dotfile 文件。

总之，如果我们使用 `yadm` 而不是直接用 Git 来管理 dotfiles 的话：

* 我们不必关心当前目录是否是 Git 目录（非 Git 初始化的目录原版 Git 是拒绝工作的：`fatal: not a git repository`）；
* 我们不必将原 dotfile 的位置进行移动，也不必将原 dotfile 通过软链接 symlink 到其他位置来统一管理；
* 但我们依旧可以直接使用 Git 的全部功力，包括 Git 分支、merge、rebase、使用 submodules 等等；

不过，`yadm` 是一个 *NIX 工具，如果你使用 macOS 或者 Linux，那么没问题，你可以直接用 `yadm` 管理 dotfiles；但是如果你用 Windows，那么很遗憾，`yadm` 只能在 WSL 里面进行安装。（不过没事！还是有解决办法的！）

## 用 yadm 管理、同步并自动部署 dotfiles

到这里，我们终于正式开始用 `yadm` 管理同步 dotfiles 了。首先，如果你还没有安装，那么根据你使用的操作系统，先[按照官方安装文档](https://yadm.io/docs/install)安装 `yadm`。接下来，我按照「我已经有大量 dotfiles，但是还没有统一进行系统管理」的情况，来简单介绍 `yadm` 的使用和功能。

### 用 GitHub 仓库同步 dotfiles 文件

第一步，在 GitHub 上创建一个**空的私有仓库**（建议除非特别自信，还是用私有仓库比较保险），用作我们整个系统 dotfiles 的同步仓库。

:::caution 🍌 注意
建议这里如果是从头开始，**直接创建完全空白，不带 README 或 LICENSE 的仓库为宜。**
:::

之后，在我们的根目录（即 `~/`、`$HOME`）下，直接初始化 `yadm` 仓库并添加我们需要管理的 dotfile 文件：

```bash
# 初始化 yadm 仓库（在哪里都一样噢！）
yadm init

# 用 yadm 添加 dotfile 文件至仓库
yadm add <某个 dotfile 文件>

# 继续添加……

# 最后，将添加好的 dotfile 签入 Git
yadm commit -m "<写个 commit 信息>"
```

这样，本地的 `yadm` 仓库就已经用 Git 存储好了我们 dotfile 文件的全部信息，以及最重要的：相对于 `$HOME` 的文件路径（实际上就是绝对路径）。接下来，我们将本地仓库跟刚刚 GitHub 上面创建好的远程仓库进行关联，并将本地更新推送至远程：

```bash
yadm remote add origin <刚刚建立的 GitHub 远程仓库地址>
yadm push -u origin master
```

至此，我们就像平日里用 Git 一样将我们分散在系统各个地方的 dotfiles 统一签入了 `yadm` 管理的「专属 dotfiles 仓库」里面。我们也可以直接将 `yadm` 理解成一个在任意目录下都可以直接使用的 dotfiles 专属 Git 版本控制工具。用 `yadm list` 可以看到我们使用 `yadm` 管理的全部 dotfiles 列表，当然，`yadm status` 跟 `git status` 一样可以查看每个 dotfile 文件的修改情况。

![命令：yadm list 和 yadm status](https://cdn.spencer.felinae98.cn/blog/2020/07/20200724-202658.png)

### 借助 yadm 的 bootstrap 功能自动配置环境

很多情况下，光用 `yadm` 将 dotfiles 同步到本地是不够的，拿到新电脑我们还得安装许多工具。这时候，我们即可借助 `yadm` 的 bootstrap 功能，自动将任务脚本的执行 hook 在 `yadm` 克隆之后，完成环境的全自动部署。不过，`yadm` 的 bootstrap 脚本是需要我们自己撰写的，默认位于 `$HOME/.config/yadm/bootstrap`，这里不论是 Bash 脚本、Python 脚本还是什么别的，只要是可执行文件就可以。

这里我给我自己简单写了一个 Bash 脚本，自动安装 Zsh、[zplug](https://github.com/zplug/zplug) 和 Neovim 三个软件 / 插件。具体代码如下：

```bash
#!/bin/sh

system_type=$(uname -s)

if [ "$system_type" = "Linux" ]; then
  # install zsh, zplug, neovim
  if ! command -v zsh > /dev/null 2>&1; then
    echo "Installing zsh..."
    sudo apt install zsh
  elif [ ! -f ${HOME}/.zplug/init.zsh ]; then
    echo "Installing zplug..."
    curl -sL --proto-redir -all,https https://cdn.jsdelivr.net/gh/zplug/installer/installer.zsh | zsh
  elif ! command -v nvim > /dev/null 2>&1; then
    echo "Installing neovim..."
    sudo apt install neovim
    # sudo apt install python-neovim
    # sudo apt install python3-neovim
    echo "Installing neovim plugins with vim-plug..."
    nvim "+PlugUpdate" "+PlugClean!" "+PlugUpdate" "+qall"
  else
    echo "All packages are installed."
  fi
fi
```

这里必须注意的是：

* 我们所编写的自动 bootstrap 脚本最好是「幂等」的，简单来讲就是有对软件当前存在状态的检测，以免发生重复安装、覆盖原始配置的问题；
* 我们最好先对当前操作系统进行检测，比如 macOS 和 Linux 实际上环境有很大不同，需要区别处理；

我们可以用 `yadm bootstrap` 命令来手动执行与测试这一脚本。当然，我们编写的 bootstrap 可执行文件，同样可以用 `yadm` 签入并进行同步，和普通 dotfile 文件一样处理即可。

更多有关 `yadm` 的 bootstrap 功能请参考：[yadm Docs - Bootstrap](https://yadm.io/docs/bootstrap).

### 其他功能

除了上面简单的 dotfiles 同步与版本管理、bootstrap 自动环境部署等功能外，`yadm` 还可以：

* 对敏感文件（比如 SSH 密钥、SSH `config` 文件……）进行加密、解密，提供私有仓库以外的额外一层保护：[yadm Docs - Encryption](https://yadm.io/docs/encryption)；
* 针对不同的操作系统、不同的环境以及不同的电脑维护不同种类的同一软件 / 插件的 dotfile 文件：[yadm Docs - Alternate Files](https://yadm.io/docs/alternates)、[yadm Docs - Templates](https://yadm.io/docs/templates)；

这两个功能我还有待体验与开发，有兴趣的同学可以前往官方文档进行研究使用。

## FAQ

### 但是我想让 yadm 管理 `$HOME` 以外的文件怎么办？

前面的表述中，我们可能已经发现了，`yadm` 默认情况下仅管理 `$HOME` 目录下的文件，也就是我们个人用户的文件。`yadm` 不会去管理系统文件，比如 `/etc`、`/mnt` 下的文件。这里的 `$HOME` 实际上就是 `yadm` 的默认工作树，其真实文件路径位于 `/home/<你的用户名>`，`yadm` 也「根据设计」仅管理这一目录下的文件，而大部分情况下这也是完全合理、够用的。

但是，如果我们想要继续管理 `/home/xxx` 以外地方的文件，那么我们需要「扩大文件树的范围」，或者「选择使用其他目录作为主文件树」。首先，其他地方的文件 `yadm` 很可能没有读写权限，所以我们需要先设置一个专门用来管理系统文件的 `yadm` alias 命令：

```bash
# 使用 /etc/yadm 作为 yadm 系统文件管理的目录
alias sysyadm="sudo yadm -Y /etc/yadm"
```

之后，我们可以直接使用 `sysyadm` 命令，并使用一个单独的远程仓库，来单独管理系统文件：

```bash
# 将 / 目录初始化为 sysyadm 的文件树
sysyadm init -w /

# 和 yadm 一样，添加文件、签入版本控制系统、同步远程仓库
sysyadm add <某个 / 路径下的系统文件>
sysyadm commit -m "<啊，我签入了一个系统文件耶>"
# ……
```

当然，你仅使用 `sysyadm` 管理整个系统里面的全部 dotfiles 也可以，但是你可能每次都需要申请 sudo 权限，不太优雅。

更多使用细节请见：[yadm Docs - FAQ #Unconventional Cases](https://yadm.io/docs/faq#unconventional-cases).

### 我们这些 Windows 用户怎么办？

什么时候我们 Windows 用户才能站起来！气抖冷。

实际上，如果你像我一样使用 WSL，那么我们用上文的方法其实也可以直接进行 Windows 的 dotfiles 管理。在 WSL 环境下，我们 `yadm` 拿到的 Windows 文件一般位于 `/mnt/c/Users/<你的用户名>` 里面。因此，这一情况需要我们将 `yadm` 的工作树设定在 `/` 或 `/mnt` 目录下，才可以有效管理 Windows 文件。

但是，我还是觉得有点别扭，特别是当我需要给 `yadm` 权限直接管理整个 `/` 目录下的文件的时候。因此，为了方便（并不方便），我还是在 WSL 的 `$HOME` 里面创建了一个 `~/Dotfiles/Windows` 目录，用传统办法，手动复制粘贴 Windows 里面的 dotfiles 作为「配置文件参考」。

![在 WSL 里面手动管理 Windows 中的 Dotfiles](https://cdn.spencer.felinae98.cn/blog/2020/07/20200724-211554.png)

当然，还好 Windows 需要同步的文件不算太复杂，而且主要为了同步一下 Windows Terminal 的自定义图标，还好还好。

## 小结

说到这里，我其实发现自己已经算是不太管曾经那个用笨方法管理的 [spencerwooo/dotfiles](https://github.com/spencerwooo/dotfiles) 仓库了，即使标星的人那么多。（啊这，写着写着还发现[有个老哥发了个 issue](https://github.com/spencerwooo/dotfiles/issues/9)，人傻了。）好了，本文到这里就结束啦，感谢阅读。(＠_＠;)

[^1]: [https://wiki.archlinux.org/index.php/Dotfiles](https://wiki.archlinux.org/index.php/Dotfiles)
