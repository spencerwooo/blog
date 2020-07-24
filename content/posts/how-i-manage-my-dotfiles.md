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

> User-specific application configuration is traditionally stored in so called **_dotfiles._**

比如，编辑器 Vim 有 `.vimrc`、常用的 Zsh、Bash 等 Shell 分别有 `.zshrc`、`.bashrc` 等等。另外，广义的 dotfile 也包括 `JSON`、`TOML` 等常规配置文件（当然也包含 Neovim 的 `init.vim` 等等）。总之，这么多的 dotfiles 都是我们第一次配置安装好系统、软件之后存在于我们电脑上面的个性化配置文件。但是这些 dotfiles 往往都只存在于我们电脑上独一份，一旦重置系统、更新换代，新电脑上就有需要重新配置一遍所有的 dotfiles 才能还原我们原本的设置。手动配置这些内容一想就非常繁琐，为了最快让新电脑能够用上我们熟悉的工具和配置，也为了对我们自己的配置进行版本控制，我们需要用工具来管理我们的 dotfiles。

## 用 Git 的思想来管理 dotfiles

## Yet Another Dotfiles Manager

## 借助 yadm 配合 GitHub 来对 dotfiles 进行版本控制