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

Rust 真是一门神奇又美丽的语言。前几天 Stack Overflow 博客上面就有一篇文章[^1]，里面提到了 Rust 已经连续四年位列 Stack Overflow 社区最爱编程语言榜首。

![位列最爱编程语言榜榜首的 Rust](https://i.loli.net/2020/01/23/Cue176Ba89LGoNY.png)

Rust 是一门标榜 safe 与 zero-cost abstraction 的语言[^2]，意味着只要你编写的 Rust 代码符合官方标准 —— 能够通过编译 —— 那么你的项目几乎可以肯定地说是内存安全的。

## 初衷

偏向底层的 Rust 让我在之前一直没有机会尝试，毕竟我相信国内高校没有一所是敢直接抛弃 C、C++ 而使用 Rust 作为其主语言进行授课的。不过，最近我重构了 Dev on Windows with WSL —— 一个近 2w 字的 WSL 开发配置文档。我前后用了大概半个月的时间，增加了许多内容，因此我在结束编写工作之后，试图找到一个类似 `cloc`，能帮我统计一个目录下全部 Markdown 文件的命令行工具。很失望，没找到。

我决定自己尝试实现这个命令行工具，当然，我也相信 Python、Ruby 等脚本语言非常适合做这些事情，毕竟 `cloc` 本身就是使用 Perl 实现的。不过，Rust 作为一门高效的、静态的、可以直接编译到三个操作系统的底层语言，还是很有吸引力的。因此我才决定使用 Rust 开新坑。

## 如何开始一个 Rust 项目？

rustc

## Rust 的「语法糖」

println!

unwrap()

?

## 小结

[^1]:[What is Rust and why is it so popular? - Stack Overflow Blog](https://stackoverflow.blog/2020/01/20/what-is-rust-and-why-is-it-so-popular/)
[^2]:[What do Rust's buzzwords like "safe" and "zero-cost abstraction" mean?](https://www.reddit.com/r/rust/comments/5lg3ih/what_do_rusts_buzzwords_like_safe_and_zerocost/)
