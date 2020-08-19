---
title: Time Complexity：CPython 实现的 Python 操作的时间复杂度
date: 2020-08-19T23:00:00+08:00
published: false
slug: cpython-implemented-python-time-complexity
tags:
- Algorithm
- Python
cover_image: "./images/cpython-implemented-python-time-complexity.png"
canonical_url: false
description: 要对自己写的代码的性能敏感起来！

---
> 🧊 我算法实在太菜了，本文部分内容可能是小学二年级就应该知道的东西，所以如果各位大佬看到这篇文章的话，就当看个乐呵，还请不要嫌弃 555。(⊙﹏⊙)

这篇文章起源于各大 OJ 平台可能是最经典的第一题：[TwoSums（两数之和）](https://leetcode.com/problems/two-sum)。我已经**很久很久**（可能已经有两年了）没做算法题了，由于我之前的项目里面其实很少涉及到一些比较复杂的算法，各个语言和框架的封装也让我对具体逻辑的优化放松了警惕，导致我对我写的代码的性能非常不敏感。于是我在前几天准备秒掉 TwoSums 的时候，出现极为尴尬的情况：

![嗯，第一发正式比赛应该直接就 TLE 了，真实的菜](https://cdn.spencer.felinae98.cn/blog/2020/08/200819_223330.png)

感觉自己被自己的水平羞辱到之后，我开始仔细找到 Python 官方文档里面对各个 native 数据结构操作的时间复杂度介绍，并也着手尝试通过巧妙的办法寻找时间优化方法，于是便有了这篇文章。

## 基础知识

### CPython

先来介绍一些基础知识。Python 是一门动态语言（Dynamic language），也就是说：Python 在执行过程中是 Python 解释器对每一条 Python 代码进行翻译再运行，而不是像静态语言，比如 C、C++ 等，被编译为 native binary 后再执行的。其中，CPython 就是一个用 C 语言实现的 Python 解释器，也就是我们默认从官网安装 Python 时得到的那个最传统、最经典的 Python 解释器（但是性能表现并不算优秀）。

### 时间复杂度

为了准确的表达或衡量我们算法的执行时间，我们常常采用大 O 表示法，也就是 Big-O notation，来表达时间复杂度。比如 $O(1)$ 表示常数时间、$O(\log n)$ 表示对数时间、$O(n)$ 表示线性时间，等等。

![来自：https://www.bigocheatsheet.com](https://cdn.spencer.felinae98.cn/blog/2020/08/200819_230352.png)

## CPython 实现的 Python 操作的时间复杂度

CPython 是 Python 官方的解释器，也是我们最为常用的 Python 解释器。我重点研究了官方给出的 CPython 实现的几个 Python 原生数据结构操作的时间复杂度[^1]，本文我把重点放在列表 `list` 和字典 `dict` 这两种数据结构上。

### 列表 `list`

Python 中的列表 `list` 是一个非常典型的数据结构，也是我们在 Python 里面最常用的一个数据结构。内部实现中，Python 的列表是用动态数组 — dynamic array[^2]来实现的（而非链表）。在 CPython 中，Python 的列表实际上这样的一个 C 语言结构体：

```c
typedef struct {
    PyObject_VAR_HEAD;
    PyObject **ob_item;
    Py_ssize_t allocated;
} PyListObject;
```

其中，`**ob_item` 是指向列表中每个项目的一组指针，`allocated` 是为列表在内存中分配的空间格数（可以理解为一个列表项目一格）。

CPython 实现的 Python 列表数据结构决定了 Python 列表各种操作的时间复杂度。很容易理解下面常见的「列表操作」的时间复杂度：

* 向列表末尾插入元素 `.append(x)`、移除列表末尾元素 `.pop()` 的时间复杂度为 $O(1)$；
* 向列表中任意位置插入元素 `.insert(idx)`，移除列表中**任意元素** `.remove(x)`，移除列表中**任意位置的元素** `.pop(idx)` 的时间复杂度为 $O(n)$；
* 查询列表是否包含 / 不包含元素：`x in/not in l` 时间复杂度为 $O(n)$（线性查找）；
* 典型的列表排序 `.sort()` 的时间复杂度为 $O(n\log n)$。

### 字典 `dict`

字典，也就是 Python 的 dictionaries —— `dict`，是一种索引数据结构，且是通过 `dict` 的键 —— `keys` 进行索引，我们可以将其看作是关联性数组（Associative arrays）。在 CPython 内部，`dict` 是利用 Hash Table（哈希表）来实现的，也就是说：Python 字典是一个数组，其索引是使用每个 `key` 上的哈希函数获得的。

另外，实际上，在使用 Hash Table 时，我们使用一些较为复杂的随机哈希函数时主要目的是为了让设定的 `key` 的哈希能够在数组中均匀分布，同时最小化哈希冲突（Hash collisions），避免多个 `key` 对应同一个哈希值。然而 Python 的哈希函数实现则比较简单，实际也并不具备这种特性，我们可以尝试：

```python
# Hash integers
list(map(hash, (0, 1, 2, 3)))
# Hash strings
list(map(hash, ("a", "b", "c", "d")))
```

![Python 默认哈希函数对整数和字符串的处理](https://cdn.spencer.felinae98.cn/blog/2020/08/200820_000117.png)

不过，Python 在 `dict` 中所使用的这样的 `hash` 函数，对于常见的具有连续 `key` 的 `dict` 则是被证明非常高效，不容易产生冲突的。当然，冲突还是避免不了，因此 Python 在 `dict` 实现中为了解决冲突（Collision resolution），会通过「开放地址法」来为冲突地址重新分配[^3]。

好了，讲了这么多，我们的重点还是在于 Python 字典数据结构存储「键值对」的**哈希表 Hash Table 实现**。在实际 CPython（以及 PyPy[^4]）中，Python 字典是使用如下的 C 语言结构体定义的：

```c
struct dict {
    long num_items;
    variable_int *sparse_array;
    dict_entry* compact_array;
}

struct dict_entry {
    long hash;
    PyObject *key;
    PyObject *value;
}
```

其中的 `dict_entry` 就是存储我们字典中「键值对」的数据结构了。使用 Hash Table 实现的 `dict` 字典能够极为高效的实现数据存取，也就是说：

* 根据 `key` 获取字典中的 `value` 的 `d[k]` 或 `d.get(k)` 时间复杂度均为 $O(1)$；
* 设定某个 `key` 的值 `value` 的 `d[k] = v` 的时间复杂度也为 $O(1)$；
* 查询字典中是否包括某个 `key` 的 `k in/not in d` 的时间复杂度依旧为 $O(1)$；
* 甚至于获取整个字典的全部 `keys` 的 `d.keys()` 的时间复杂度还是 $O(1)$！

大部分 Python 字典的操作时间复杂度都是 $O(1)$ 的，因此使用「字典」作为我们的数据载体往往能够极大的提升我们算法的执行效率，当然，其他语言的 Hash Table（比如 Java 的 `HashSet`、JavaScript 的 Object）实现同样也有类似的效果。

### 其他

## 我遇到的性能问题和解决措施

### 用 `index()` 寻找列表中的元素序号

### 用 `.get()` 与 `[]` 对字典进行访问

[^1]: https://wiki.python.org/moin/TimeComplexity
[^2]: https://stackoverflow.com/questions/3917574/how-is-pythons-list-implemented
[^3]: https://github.com/python/cpython/blob/master/Objects/dictobject.c
[^4]: https://morepypy.blogspot.com/2015/01/faster-more-memory-efficient-and-more.html