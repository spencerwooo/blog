---
title: "CLI：用 Rust 编写命令行应用"
date: 2020-01-23T00:20:00+08:00
draft: true
show_in_homepage: true
show_description: true
tags:
- Tech
- Rust
- CLI
featured_image: 'https://i.loli.net/2020/01/22/OzrcsukSVqtNAle.png'
comment: true
toc: true
autoCollapseToc: true
---

前几天 Stack Overflow 博客上面有一篇文章[^1]，里面提到了 Rust 已经连续四年位列 Stack Overflow 社区最爱编程语言榜首。的确，Rust 是一门神奇又美丽的语言。Rust 是一门标榜 safe 与 zero-cost abstraction 的语言[^2]，意味着只要你编写的 Rust 代码符合官方标准 —— 能够通过编译 —— 那么你的项目几乎可以肯定地说是内存安全的。

## 初衷

偏向底层的 Rust 让我在之前一直没有机会尝试，毕竟我相信国内高校没有一所是敢直接抛弃 C、C++ 而使用 Rust 作为其主语言进行授课的。最近我重构了 [Dev on Windows with WSL](https://dowww.spencerwoo.com)：一个近 2w 字的 WSL 开发配置文档。我前后用了大概半个月的时间，增加了许多内容，因此我在结束编写工作之后，试图找到一个类似 `cloc`，能帮我统计一个目录下全部 Markdown 文件的命令行工具。很失望，没找到。

我决定自己尝试实现这个命令行工具，当然，我也相信 Python、Node.js、Ruby 等脚本语言一定适合做这些事情，毕竟 `cloc` 本身就是使用 Perl 实现的。不过，Rust 作为一门高效的、静态的、可以直接编译到三个操作系统的底层语言，还是很有吸引力的。因此我才决定使用 Rust 开新坑。

![使用 Rust 实现的 cwim - Count words in Markdown](https://i.loli.net/2020/01/23/g1q5amsOedyE7op.png)

## 如何开始一个 Rust 项目？

Rust 最 beginner friendly 的地方我觉得在于其[官方入门文档](https://www.rust-lang.org/zh-CN/learn/get-started)的简洁易懂。从安装、编译到包管理、打包项目 …… Rust 的官方文档讲解的都比任何其他语言的文档讲解的要易懂不少。我这里简单记录一下 Rust 环境的安装搭建的基本过程。

### 安装 Rust 环境

Rust 语言虽然小众，但是其生态相当完善。Rust 借鉴了其他语言的多种环境配置工具，官方直接提供了一整套完善的闭环 Toolkit，基本能满足我们在使用 Rust 时的安装、构建、编译、发布的整套流程：

- Rustup：Rust 版本管理（类似 Python 的 `pyenv`、Node.js 的 `nvm` 等）
- Cargo：Rust 构建工具与包管理（类似 Python 的 `pip`、Node.js 的 `yarn` 等）
- crates.io：Rust 的 Package Registry

首先，我们安装 Rustup：Rust 安装器与 Rust 版本控制器。使用 Arch Linux（以及 WSL 的 Arch Linux）的同学可以直接在 AUR 中安装 `rustup`：

```bash
yay rustup
```

如果使用 WSL 其他 Linux 发行版，我们也可以用下面的命令安装 `rustup`：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

其他安装方法请参考：[Rust | 安装 Rust](https://www.rust-lang.org/zh-CN/tools/install)

安装了 `rustup` 之后，我们就应该已经安装完成了 Cargo：Rust 的构建工具与包管理工具。Cargo 可以做很多事情：

```bash
cargo build     # 可以构建项目
cargo run       # 可以运行项目
cargo test      # 可以测试项目
cargo doc       # 可以为项目构建文档
cargo publish   # 可以将库发布到 crates.io
```

要检查是否安装了 Rust 和 Cargo，可以在终端中运行：

```bash
cargo --version
```

接下来我们就可以使用 Cargo 来创建一个 Rust 项目，并用它来安装我们必须的 Rust 库等内容。

### 使用 VS Code 编写 Rust 项目

VS Code 是一个通用的文本 / 代码编辑器，能够通过插件支持多种语言环境下代码的编写任务。我们下载 Rust 官方提供的 VS Code 插件：[Visual Studio Code Marketplace | Rust (rls)](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust)

![Visual Studio Code Marketplace | Rust (rls)](https://i.loli.net/2020/01/24/QR4GTfrbq2DCHK8.png)

之后，我们用 Cargo 创建一个新的项目 `hello-rust`：

```bash
cargo new hello-rust
```

或者在已有文件夹 `hello-rust` 下，生成新 Rust 项目：

```bash
cd hello-rust
cargo init
```

新的 Rust 项目目录下应该拥有以下内容：

```bash
hello-rust      # 根目录
|- Cargo.toml   # Rust 的清单文件，其中包含项目的元数据和依赖库
|- src
  |- main.rs    # 主程序入口
```

用 VS Code 打开这一目录，我们即可开始 Rust 项目的编写。

![使用 VS Code 撰写 Rust 项目](https://i.loli.net/2020/01/24/3gZDyvY95UHAtiC.png)

使用下面命令即可运行项目：

```bash
cargo run
```

## Rust 的「语法糖」

在使用 Rust 的时候，令我印象深刻的两个地方：一个是 Rust 语言实际上非常清晰易懂，有 C、C++ 等强类型语言的严谨，也有脚本语言的易读；另一个就是 Rust 编译器给我们的提示实在是相当清楚，方便追溯问题所在，容易 debug。

println!

unwrap()

?

## 小结

[^1]: [What is Rust and why is it so popular? - Stack Overflow Blog](https://stackoverflow.blog/2020/01/20/what-is-rust-and-why-is-it-so-popular/)

[^2]: [What do Rust's buzzwords like "safe" and "zero-cost abstraction" mean?](https://www.reddit.com/r/rust/comments/5lg3ih/what_do_rusts_buzzwords_like_safe_and_zerocost/)
