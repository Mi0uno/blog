---
title: Markdown示例文章1
date: 2023-10-01
tags: [markdown, tutorial, example]
star: true
---
# Markdown示例文章1

这是第一篇示例文章，展示Markdown的各种功能。

## 代码块

这是一个JavaScript代码块：

```javascript
function hello() {
    console.log('Hello, World!');
}
hello();
```

## 数学公式

爱因斯坦的质能方程：$E = mc^2$

或者更复杂的：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}

$$



```mermaid
flowchart TB
  A[主流 AI 应用框架]

  A --> B[LangChain]
  A --> C[AutoGen]
  A --> D[ReAct / CoT]
  A --> E[Function Calling]
  A --> F[Claude Skills]

  B --> B1[链式编排]
  B --> B2[工具一次性注入]

  C --> C1[多 Agent 协作对话]
  C --> C2[角色需手动定义]

  D --> D1[提示策略驱动]
  D --> D2[难以复用能力]

  E --> E1[结构化参数调用]
  E --> E2[不擅长复杂流程推理]

  F --> F1[技能包可复用]
  F --> F2[按需加载上下文]
  F --> F3[可组合与自主触发]
  F --> F4[推理 + 代码执行结合]

```

## 表格

| 名称 | 年龄 | 职业   |
| ---- | ---- | ------ |
| 张三 | 25   | 工程师 |
| 李四 | 30   | 设计师 |

## 图片链接

![示例图片](https://example.com/image.jpg)

## 列表

- 项目1
- 项目2
  - 子项目

## 引用

> 这是一个引用块。

## 链接

[百度](https://www.baidu.com)
