---
title: LaTeX 渲染测试
date: 2026-02-20
category: 技术解读
tags: [测试, LaTeX, 数学公式]
---

# LaTeX 渲染测试

本文用于测试 LaTeX 数学公式的渲染效果。

## 行内公式

爱因斯坦质能方程：$E=mc^2$

勾股定理：$a^2 + b^2 = c^2$

欧拉公式：$e^{i\pi} + 1 = 0$

## 块级公式

### 积分公式

$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

### 求和公式

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

### 矩阵

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}
=
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

### 微分方程

$$
\frac{d^2y}{dx^2} + \omega^2 y = 0
$$

### 极限

$$
\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e
$$

## 复杂公式

傅里叶变换：

$$
F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt
$$

薛定谔方程：

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$

麦克斯韦方程组：

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

## 测试完成

如果以上公式都能正常渲染，说明 LaTeX 支持已正常工作。
