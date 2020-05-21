---
title: 论文阅读：Nesterov Accelerated Gradient And Scale Invariance For Adversarial Attacks
date: 2020-05-21T16:00:00+08:00
published: false
slug: nifgsm-sim-adversarial-attack
tags:
- Literature Notes
- Neural Network
- Machine Learning
cover_image: "./images/nifgsm-sim-adversarial-attack.png"
canonical_url: false
description: ICLR 2020 的一篇论文，主要提出了 NI-FGSM 和 SIM 两种高性能基于迁移的黑盒攻击。

---
这周组会分享了一篇论文：[Nesterov Accelerated Gradient And Scale Invariance For Adversarial Attacks](https://arxiv.org/abs/1908.06281)。这篇论文是一篇 ICLR 2020 的文章，作者是华中科技大学、北京大学和康奈尔大学的实验室。主要提出了 NI-FGSM 和 SIM 两种 Transfer-based 黑盒攻击。

## 论文贡献

:::note 🍗 主要贡献
In this work, from the perspective of regarding the adversarial example generation as an optimization process, we propose two new methods to improve the transferability of adversarial examples, namely Nesterov Iterative Fast Gradient Sign Method (NI-FGSM) and Scale-Invariant attack Method (SIM).
:::

论文在将对抗攻击过程看作是一个「优化的过程」，基于提升对抗样本可迁移性的考虑，提出了 NI-FGSM 和 SIM 两种对抗攻击方法：

* 论文在基于梯度的迭代对抗攻击中，使用 NAG 进行优化，从而更有效的实现 Lookahead，使得对抗样本的 transferability 增强。论文认为：NI-FGSM 最终能够有效代替 MI-FGSM（或者 MIM — Momentum Iterative Method）
* 论文认为深度学习模型具有 Scale-invariant 的特性，因此提出 Scale-Invariant Method：用多组尺度缩放的输入图像来优化对抗扰动，有效抑制白盒模型过拟合问题，从而得到针对黑盒模型易迁移的对抗样本
* 将 NI-FGSM 和 SIM 与现有基于梯度的攻击方法（比如 TIM、DIM）结合，可以有效提升对抗攻击成功率

论文实验表明，在这两种方法和已有方法结合之中，**SI-NI-TI-DIM 这种方法的攻击性能最好，平均攻击成功率能够达到 93.5%。**

## 对抗算法设计

### 算法设计思路

首先，论文将「Transfer-based 黑盒对抗攻击」的过程和「常规训练图像分类模型」的过程，看作是一致的优化过程 — Optimization process。在常规训练模型的过程中，我们通常有这样的步骤：

![常规图像分类模型训练过程](https://i.loli.net/2020/05/21/mpCSdHKG9ZvrX46.png)

那么，与之相对应的，在 Transfer-based 黑盒对抗攻击中，我们同样有这样的步骤：

![Transfer-based 黑盒攻击过程](https://i.loli.net/2020/05/21/W6zUSHRFg2tcoIX.png)

非常容易发现，在这两个过程中：

* 「模型训练」过程中的「训练数据集」就相当于「Transfer-based 对抗攻击」中的「白盒模型」
* 「模型训练」过程中「根据训练数据优化待训练参数」就相当于「Transfer-based 对抗攻击」中「根据白盒模型优化生成对抗样本」
* 那么，「模型训练」过程中的「测试数据集」就相当于「Transfer-based 对抗攻击」中的「黑盒模型」，依次用于「评估模型的性能」和「评估攻击的性能」

那么，从同样「优化」的角度来看，提升对抗样本 transferability 和增强被训练模型的 generalization ability（泛化能力）的方法应该是类似的，因此论文考虑使用增强模型泛化能力同样的方法来增强对抗样本的可迁移性。

增强模型泛化能力的方法通常有这样的两种：

1. 使用更好的优化算法，比如使用 Adam Optimizer 实施优化
2. 对输入数据进行数据增强：Data Augmentation

与之相应的，增强对抗样本可迁移性的方法就有这样的两种：

1. 寻找更好的**优化算法**，比如在 MI-FGSM 攻击中，设计者就是通过引入 Momentum 帮助优化，从而大幅度提升对抗攻击性能的
2. 通过模型增强 Model Augmentation：比如同时攻击多个模型的 ensemble attack

基于以上的论断，论文考虑以下两种改进，以增强对抗样本的可迁移性：

1. NI-FGSM：使用更好的优化算法。论文使用 NAG — Nesterov accelerated gradient 来优化基于梯度的迭代攻击
2. SIM：实施模型增强。论文考虑使用一系列被缩放的图像训练模型，从而达到 Model Augmentation 的效果

### NI-FGSM

Nesterov Accelerated Gradient 是普通梯度下降法的轻微修改，可以有效加速训练过程，大幅度增强收敛能力。NAG 可以看作是基于 Momentum 的优化的改良版：

$$
v_{t+1}=\mu \cdot v_t + \nabla_{\theta_t}\mathcal{J}(\theta_t-\alpha\cdot\mu\cdot v_t)\\
\theta_{t+1}=\theta_t-\alpha\cdot v_{t+1}
$$

论文发现普通基于梯度的迭代攻击（I-FGSM）非常容易陷入局部最优，导致比单步攻击（FGSM）可迁移性差。实验表明向迭代攻击中引入 Momentum 可以有效解决这一问题（MI-FGSM）。

那么，论文考虑向迭代过程中引入 NAG 实施优化过程：

* NAG 除了可以帮助稳定迭代更新的具体方向，NAG 的预期更新还可以给先前积累的梯度以纠正，进而**实现 lookahead 特性。**
* 借助 lookahead，**NI-FGSM 能更快逃离局部最优，大幅加强攻击性能和可迁移性。**

### SIM

## 评估方法与实验数据

## 进一步分析

## 结论