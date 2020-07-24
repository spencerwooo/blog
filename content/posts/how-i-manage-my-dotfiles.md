---
title: YADM：我是如何同步并管理我的 Dotfiles 的？
date: 2020-07-24T17:00:00+08:00
published: false
slug: how-i-manage-my-dotfiles
tags:
- CLI
- Dev Environment
- Terminal
cover_image: "./images/how-i-manage-my-dotfiles.gif"
canonical_url: false
description: Yet Another Dotfiles Manager，基于 Git 的 Dotfile 管理器。

---
没想到啊，[我的 dotfiles 仓库](https://github.com/spencerwooo/dotfiles "我的 dotfiles 仓库")是目前我 GitHub 上面星星数量最多的单仓库。Dotfiles 顾名思义，就是我们在使用软件的时候，软件为了存储我们个人偏好设置而建立的一个以 `.` 开头的文件。

> User-specific application configuration is traditionally stored in so called **_dotfiles._** [^1](\[https://wiki.archlinux.org/index.php/Dotfiles\](https://wiki.archlinux.org/index.php/Dotfiles))

比如，编辑器 Vim 有 `.vimrc`，常用的 Zsh、Bash 等 Shell 分别有 `.zshrc`、`.bashrc` 等等。另外，广义的 dotfile 也包括 `JSON`、`TOML` 等常规配置文件（当然也包含 Neovim 的 `init.vim` 等等）。总之，这么多的 dotfiles 都是我们第一次配置安装好系统、软件之后存在于我们电脑上面的个性化配置文件。但是这些 dotfiles 往往都只存在于我们电脑上独一份，一旦重置系统、更新换代，新电脑上就有需要重新配置一遍所有的 dotfiles 才能还原我们原本的设置。手动配置这些内容一想就非常繁琐，为了最快让新电脑能够用上我们熟悉的工具和配置，也为了对我们自己的配置进行版本控制，我们需要用工具来管理我们的 dotfiles。

## 用 Git 的思想来管理 dotfiles

如果说要管理 dotfiles，我的第一反应就是用 Git 来管理，**毕竟专业的版本控制工具，用来管理纯文本文件的修改和同步再合适不过了**。现在前面提到的那个星星数量最多的 repo 就是我最初用 Git 来将我的 dotfiles 集合到一个 GitHub 仓库里面时所做的尝试。那个仓库现在来看其实比较混乱，由于是一个标准的 Git 仓库，所有的文件都在当前文件夹下，因此为了三个系统的 dotfiles 都同步于一个仓库里，我建立了三个不同的文件夹：macOS、Windows 和 Linux。同时我也得手动将我本地的实际修改复制粘贴到这一 Dotfiles 仓库之中。

![我之前利用 Git 手动同步的 Dotfiles 仓库](https://cdn.spencer.felinae98.cn/blog/2020/07/20200724-173035.png)

那么这样管理的弊端显而易见：这一仓库仅仅算是「一个配置参考」，而非实际意义上的「便携 dotfile 仓库」。多机同步靠粘贴，版本控制靠脑袋，有时候我的工具或者配置更换了，只能徒手把原来的配置移动到 `/archive` 文件夹下……这样管理一点也不优雅！如果我们可以直接在每个 dotfile 所在的原本位置就将其签入 Git 系统进行版本控制和远程同步就好了。🎈

## Yet Another Dotfiles Manager

## 借助 yadm 配合 GitHub 来对 dotfiles 进行版本控制