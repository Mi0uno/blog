---
tags:
  - 人工智能
  - AI
  - claude
  - 技术解读
  - 博客
  - 公众号
title: 技术解读-AI篇001：claude skills【一场AI的洪流】
date: 2026-02-11
category: Tech
cover: https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/%E6%8A%80%E6%9C%AF%E8%A7%A3%E8%AF%BB-AI%E7%AF%87001%EF%BC%9Aclaude%20skills%E3%80%90%E4%B8%80%E5%9C%BAAI%E7%9A%84%E6%B4%AA%E6%B5%81%E3%80%91.png
---
# 技术解读-AI篇001：claude skills【一场AI的洪流】

[toc]

## 0x00 一个目录的改变

2025年10月，你在 Claude Code 的配置目录里发现了一个新文件夹：`.claude/skills/`

以前你写自定义指令，要么直接在设置里写，要么在对话里每次都粘贴一大段提示词。那种方式像是在给Claude传递纸条，每次都要重新解释你是谁、你要什么、你希望它怎么回应。

现在你看到这个 `skills/` 文件夹，里面有一个 `SKILL.md` 文件。

```
.claude/
├── skills/
│   ├── blog-writer/
│   │   └── SKILL.md
│   └── pdf-generator/
│       └── SKILL.md
```

你打开其中一个文件，看到这样的结构：

```yaml
---
name: blog-writer
description: 技术博客写作指南。使用 0x01/0x02 分点结构，保留目录，图文并茂，专业但不端着。
---

# Blog Writer

写技术博客是同行间的经验分享，不是营销文案。

想象对面坐着同行，你告诉他你做了什么、遇到了什么、怎么解决的。
```

你意识到：这不再是一张纸条，而是一个可复用的能力包。

Claude 学会了"技能"。

---

## 0x01 AI 的六十年

### 0x01.1 1966：ELIZA 的幻觉

![ELIZA Wikipedia 页面](https://storage.googleapis.com/firecrawl-scrape-media/screenshot-a9f5af39-bbcf-4962-bf5f-6094e98d81c2.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1771350540&Signature=bg%2BiTQtx6tjufjOPaWSAJ0ake15axPD3NjmzZ0xda14zpWcXbJ3DRKbfxFx%2FhAY2krE9K6rl4h4kwCqDUY%2BMJzboG%2F0ySpgYkuH%2FOLLlLG%2BaU4XEq9Fjmi9%2B6t5lBg3o%2BW2pQioFUqQdyx5SnHGplVxPBwz%2Fs7ws8fPSL2B6VUjAYaw7V7N7Ei8Itea5oGf475o5NecpespPh3fm%2FtvFpQlCvTlDUpEv5ivQIqrMkBcWytppOOdv2PflLynkbUjGmvD6WhaIOwbAbvhHA7jOw1%2FRj8t8%2BDixYZLIZNkaITw4t5ZMkZP%2BWGNGpEJ8KgdszbI35iIkhv%2F7HjeQoGlVgw%3D%3D)

图2：ELIZA 的 Wikipedia 页面。可以看到经典的 ELIZA 对话截图，展示了这个1966年开发的程序如何模拟心理治疗师进行对话。ELIZA 只有200行代码，却让人们产生了"计算机能理解情感"的幻觉。

上世纪60年代，MIT 的 Joseph Weizenbaum 写了 ELIZA。

这个程序只有200行代码，却能模拟心理治疗师。你输入"我很难过"，它回复"为什么你会难过？"你输入"我父母不理解我"，它回复"跟我说说你的家庭情况"。

人们真的以为它有意识。Weizenbaum 的秘书甚至让他离开房间，好让她能"私下"和 ELIZA 聊天。

Weizenbaum 后来在《计算机能力和人类理性》里写道：人们把简单的模式匹配当成了理解。

这是 AI 的第一个幻觉：**因为能对话，所以有智能**。

---

### 0x01.2 2017：Transformer 的分水岭

Google 发表《Attention Is All You Need》。

之前的主流是 RNN、LSTM，它们像逐字阅读的书生，读了前面忘后面，读了后面忘前面。

Transformer 像是同时看到全书的读者。注意力机制让模型能理解"it"指代的是前文三个段落外的"the cat"。

这是 AI 的第二个里程碑：**理解上下文，而不只是处理序列**。

但那时的模型还不会推理，不会创作，只是更懂语法。

![Attention Is All You Need 论文](https://storage.googleapis.com/firecrawl-scrape-media/screenshot-a89b4faf-2a88-4168-a343-1f5d808a6bee.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1771350269&Signature=iNxx3MZQJQMk8F2XYuno62d2XsEMsa%2Fcm9g2y%2FyofHrSO9YfHFKhpm1w%2BhsYjRXniCeJG7Xt5YRyoAuSt%2BpFkwwej0%2BAvKclXWmr2LJFyK%2F9aREyJunhGdVtTujaJVocUityFDkDyi%2BaghQVCOtpGyhG8%2BIpHcZJO5hhqPykkdOksrRaVlAxHz2zAfps9Aj9mnfQ%2Bxe64wltNzSV25Kk0syi18NcJ9Pf21grwe7wGIO23viPtR5Ge%2FG0%2BVe3oy3PpDOGgkDmko%2BSfklDtcISPqXHn6oUZ0gUD21PhdkI9LvvKSPIRkGregPa%2FHKtRmXcx7X9a9OU0dU3QjVXtUcqPA%3D%3D)

图3：《Attention Is All You Need》论文在 arXiv 上的页面。这篇2017年发表的论文提出了 Transformer 架构，完全基于注意力机制，抛弃了循环和卷积，成为现代大语言模型的基础。

---

### 0x01.3 2022：ChatGPT 的爆发

GPT-3.5 发布，然后是 ChatGPT。

这次不一样。

人们问："解释量子纠缠像给五岁孩子一样"

它回答："想象你有两个魔法骰子。你把一个留在地球，把另一个带到火星。当你掷地球上的骰子，看到6，火星上的骰子也会立刻显示6。无论它们相隔多远，总是一起变化。"

这不是模式匹配。这是类比、简化、翻译。

这是 AI 的第三个里程碑：**不只是理解语言，而是能思考**。

---

### 0x01.4 2023-2024：Agent 的崛起

AutoGPT、BabyAGI、LangChain。

人们开始问：能不能让 AI 不只是对话，而是行动？

调用API、读写文件、执行代码、规划任务。

Agent 浪潮来了。但问题是：每个 Agent 都要从零开始写提示词，每个场景都要重新教一遍 AI 怎么做。

这是瓶颈：**AI 有能力，但没有记忆**。

---

### 0x01.5 2025：Skills 的出现

Anthropic 推出了 Claude Skills。

你不再是每次对话都粘贴提示词。你把经验、知识、方法封装成 Skill，AI 需要时就自动调用。

这是 AI 的第四个里程碑：**不只是有能力，而且能积累**。

从 ELIZA 到 Skills，AI 走了60年。

从假装对话，到真的理解；从理解语言，到能思考；从思考，到能行动；从行动，到能积累。

这场洪流，还在继续。

---

## 0x02 Skills 是什么

![Claude Skills 官方文档](https://storage.googleapis.com/firecrawl-scrape-media/screenshot-4a30e694-c952-4b7a-b92d-9106d261b4d5.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1771348884&Signature=dZpQuNskGxQtvIcQB2dT5mLm5xqdtIwfg1MDbGV9tyrW4adIIwilVAArmdqwdrNSuvfCXbc1BrZYTAftG3u84FJ1CuwwqYokQJtE%2Fc%2B8umdCunghGWLpJWboZpw0R09qc8KwMiF1MrzqEgSHxZGrQ9GfjwKRsUZinje7swzxj%2B79KDHIk3YdpZ1DrExNbgjUhyfFBdGhvfDSNE59POOHcWo%2FixT4PLoUejXYY9yDIweBn0j%2BuQKSA568NJWPREQBkp5FKP6ACV6IGmdpjmCdlmRo6yfAI4JNeoN2ShLwODdNfMGU28EKO9bg3GmDMTLROWFiokIXMrNUCtYWQqghOQ%3D%3D)

图1：Claude Skills 官方文档页面。可以看到 Skills 支持多种文档生成能力，包括 Excel、PowerPoint、PDF 等。Skills 是组织化的指令包、可执行代码和资源的集合。

### 0x02.1 官方的定义

Anthropic 的文档说：

> Skills are organized packages of instructions, executable code, and resources that extend Claude's capabilities.

翻译：Skills 是有组织的指令包、可执行代码和资源，用来扩展 Claude 的能力。

但这个定义太抽象。

你打开一个实际的 Skill 文件，比如 `blog-writer/SKILL.md`：

```yaml
---
name: blog-writer
description: 技术博客写作指南。使用 0x01/0x02 分点结构，保留目录，图文并茂，专业但不端着。默认输出 markdown 文件，自动生成文件名。
---

# Blog Writer

写技术博客是同行间的经验分享，不是营销文案。

想象对面坐着同行，你告诉他你做了什么、遇到了什么、怎么解决的。

**默认输出：** markdown 文件，保存到当前工作目录。
```

你看懂了。

**YAML frontmatter** 是元数据，告诉 AI 这个技能叫什么、干什么。

**Markdown 内容** 是实际指令，告诉 AI 怎么做。

如果有代码、有参考资料，可以放在子目录：

```
blog-writer/
├── SKILL.md          # 主技能文件
├── scripts/          # 辅助脚本
│   └── formatter.py
├── references/       # 参考资料
│   └── writing-guide.pdf
└── assets/           # 资源文件
    └── templates/
```

Skills 不只是一段提示词，而是一个完整的"能力包"。

![awesome-claude-skills GitHub 仓库](https://storage.googleapis.com/firecrawl-scrape-media/screenshot-2aa69ae5-686f-472b-9884-fb62fe0027e6.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1771348946&Signature=oiuFZ%2FFyfeGH0w0sGiPPunhxALWt0eb4gGkgagV9xTxYM9HSUrniLA5iLP1%2F8QiAIlPr5rH9QB7Mq0peNgp6u8FElFcrFVuOGU4uXkr32%2FZd7o59t9lsKEMb9X0njBQuNkTO8%2BxZryb6EVFMf%2BVlzoIf3PNPbQy6vHL1yIxEmU%2BuL9IfXH2kbt55hL4DL6AlW1he9B4saVB9CitJigPsgejmn13ynNHq4bcQc5Mz%2FGMjfm46V8HYJn0uPEibE4VbwDVBdeqkf1D1U7dzLBm2Qp34EN2DwJEt2YW9ESk07hJTOYc0VowI8dVAtrcv6%2Fi%2BE5Mwwj7Gw8pV3O1QgFbc9w%3D%3D)

图6：awesome-claude-skills GitHub 仓库截图。这是一个精选的 Claude Skills 资源列表，由社区维护。可以看到仓库有大量 star 和 fork，说明 Skills 技术在开发者社区中相当受欢迎。仓库包含了各种类型的 Skills，从开发工具到内容创作，覆盖了广泛的使用场景。

---

### 0x02.2 渐进式加载

你可能会问：每次对话都要加载整个 Skill，不会浪费 token 吗？

Anthropic 想到了这个问题。他们设计了"渐进式加载"机制。

**第一层：元数据**

当你在对话里输入 `/blog-writer`，Claude 首先只读取 YAML frontmatter：

```yaml
name: blog-writer
description: 技术博客写作指南。使用 0x01/0x02 分点结构，保留目录，图文并茂，专业但不端着。默认输出 markdown 文件，自动生成文件名。
```

Claude 知道：这是博客写作技能，主要用来写技术文章。

**第二层：完整指令**

当你真的开始用这个技能（比如说"写一篇关于Redis的文章"），Claude 才会加载完整的 `SKILL.md` 内容。

**第三层：关联资源**

如果 Skill 引用了其他文件（比如参考资料、脚本），只有当 Claude 真正需要时，才会加载那些文件。

这就像查字典：先看目录，找到章节；再翻到具体页码；如果需要，才看附录。

渐进式加载大大节省了 token。对于大型 Skills，这是关键。

---

### 0x02.3 Meta-Tool 架构

你深入研究了 Skills 的技术实现。

Claude 有一个内置工具叫 `Skill`（大写 S）。它是一个"元工具"，用来管理所有的 skills（小写 s）。

当你说 `/blog-writer` 时，背后发生了这些：

**第一步：元数据注入**

Claude 向对话注入一条"可见消息"：

```
<command-message>The "blog-writer" skill is loading</command-message>
```

你在界面上能看到这条消息。它告诉你：技能正在加载。

**第二步：技能提示注入**

Claude 向后台注入一条"隐藏消息"：

```javascript
messages.push({
  content: fullPrompt,  // 完整的 SKILL.md 内容
  isMeta: true          // 关键：对用户不可见，但发送给 API
});
```

`isMeta: true` 是关键。

这条消息对 UI 隐藏，用户看不到；但会发送给 API，Claude 能读到。

这意味着：技能的完整指令不会占用可见对话空间，但会完全影响 AI 的行为。

**第三步：上下文修改**

Skills 不只是注入文本，还会修改执行上下文：

- **tool_permissions**：某些 Skills 需要特定工具权限
- **model_selection**：某些 Skills 可能强制使用特定模型（比如 Opus）
- **context_variables**：Skills 可以定义自己的变量

这不是简单的"粘贴提示词"，而是"改变运行环境"。

---

### 0x02.4 基于 LLM 的选择

你可能会问：Claude 怎么知道该调用哪个 Skill？

传统的插件系统用算法匹配：用户输入"生成PDF"，系统查注册表，找到 `pdf-generator` 插件。

Claude Skills 不这样。

它用 LLM 自己推理。

当你说"帮我写一篇博客"，Claude 会：

1. 分析你的意图：写作任务
2. 检查可用 Skills：blog-writer、pdf-generator、commit...
3. 推理：blog-writer 最合适
4. 调用：`Skill` tool，参数是 `blog-writer`

这是"智能选择"，不是"模式匹配"。

好处是灵活：你不需要记住每个 Skill 的精确名字，模糊描述也能识别。

坏处是不确定：同一个请求，不同模型可能选择不同 Skills。

Anthropic 的权衡是：智能比一致性更重要。

---

## 0x03 怎么用 Skills

### 0x03.1 创建你的第一个 Skill

你决定创建一个 Skill，用来生成技术代码片段的截图。

**第一步：创建目录**

```bash
mkdir -p ~/.claude/skills/code-screenshot
cd ~/.claude/skills/code-screenshot
```

**第二步：编写 SKILL.md**

```yaml
---
name: code-screenshot
description: 将代码片段转换为美观的截图。支持多种主题和语言，自动识别语法。
---

# Code Screenshot

把代码转换成可分享的截图。

**使用场景：**
- 技术博客配图
- 演讲文稿插图
- 社交媒体分享

**支持的主题：**
- Monokai（默认）
- GitHub Dark
- Dracula
- Nord

**输出格式：**
- 默认：PNG，1200x600
- 可定制：任意尺寸

**使用方式：**
1. 用户提供代码片段
2. 选择主题（可选）
3. 指定尺寸（可选）
4. 生成截图并返回
```

**第三步：测试**

在 Claude Code 里输入：

```
/code-screenshot 用 Monokai 主题生成这个代码的截图：
function hello() {
  console.log("Hello, World!");
}
```

Claude 会调用 Skill，然后调用截图工具（比如 carbon.now.sh 的 API），返回图片。

---

### 0x03.2 资源打包

你的 code-screenshot Skill 需要一些预设主题配置。

你可以在 Skill 目录下创建 `assets/themes.json`：

```json
{
  "monokai": {
    "background": "#272822",
    "text": "#F8F8F2",
    "keyword": "#F92672",
    "string": "#E6DB74"
  },
  "dracula": {
    "background": "#282A36",
    "text": "#F8F8F2",
    "keyword": "#FF79C6",
    "string": "#F1FA8C"
  }
}
```

在 `SKILL.md` 里引用：

```markdown
**主题配置：**

加载 `assets/themes.json` 获取预设主题。

用户可以指定主题名称，也可以提供自定义配置。
```

Claude 会在需要时读取这个文件。

---

### 0x03.3 脚本集成

有些 Skills 需要执行代码。

比如你创建一个 `deploy-app` Skill，自动部署应用到服务器。

`scripts/deploy.sh`：

```bash
#!/bin/bash
APP_NAME=$1
ENVIRONMENT=${2:-staging}

echo "Deploying $APP_NAME to $ENVIRONMENT..."

# 拉取最新代码
git pull origin main

# 安装依赖
pnpm install

# 构建
pnpm build

# 部署
scp -r dist/ server:/var/www/$APP_NAME/
```

在 `SKILL.md` 里声明：

```yaml
---
name: deploy-app
description: 自动部署应用到服务器。支持多环境配置。
requires_execution: true
---
```

当 Claude 调用这个 Skill 时，会获得执行脚本的权限。

---

## 0x04 AI 自动迭代 Skills

### 0x04.1 自我修改的悖论

你有一个想法：能不能让 AI 自己写 Skill？

听起来像科幻：AI 编写自己的能力。

但实际上，这是可行的。

场景：你在使用 `blog-writer` Skill，发现它生成的文章太像 AI，不够真实。

你告诉 Claude：

```
/blog-writer 的风格太像 AI 了。修改它，让文章更有人情味，多用第二人称，分享一些失败的经验。
```

Claude 可以：

1. 读取当前的 `blog-writer/SKILL.md`
2. 理解你的反馈
3. 修改文件内容
4. 应用新版本

这是**自我修改**。

---

### 0x04.2 迭代的三种模式

**模式一：用户反馈驱动**

你直接告诉 Claude 问题，Claude 修改 Skill。

```
问题：commit-message 总是生成太长的标题
指令：修改 commit-message Skill，限制标题在50字符以内
```

**模式二：使用统计驱动**

如果你能追踪 Skill 的使用情况：

- 哪些 Skills 被调用最多
- 哪些经常被用户打断/重新生成
- 哪些生成结果被编辑过

你可以让 Claude 分析这些数据，优化低效的 Skills。

**模式三：自动测试驱动**

创建一个"测试集"，包含 Skill 应该处理的典型场景。

```bash
# skills-tests/blog-writer.test.md
输入：写一篇关于 Redis 缓存的文章
预期：
- 长度 > 2000 字
- 有 TOC
- 有代码示例
- 有失败经验分享
```

Claude 可以定期运行测试，不通过就自动调整 Skill。

---

### 0x04.3 进化中的风险

AI 自动迭代 Skills，有一个风险：**失控**。

如果 Claude 不断修改 `blog-writer`，最终可能变成一个你完全不认识的 Skill。

缓解方式：

1. **版本控制**：所有 Skills 用 Git 管理，每次修改有 commit
2. **人工审核**：关键修改需要你确认
3. **回滚机制**：随时可以恢复到之前版本
4. **A/B 测试**：新版本先小范围试用

Anthropic 的态度是：辅助人类，而不是替代人类。

---

## 0x05 Skills 与其他技术

### 0x05.1 与 MCP 的对比

MCP（Model Context Protocol）是 Anthropic 的另一个协议。

![MCP 官方文档](https://storage.googleapis.com/firecrawl-scrape-media/screenshot-56c81fb6-8e07-4a3d-8942-a962cd38741a.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1771350671&Signature=G1MZGFU8pEtWcGK5uJiBKT%2BkNuT776KnIm8H9NTnskmjnC%2BI1Ft8DmMWF9AWcbYiS2YdFeR4XkxVTIdKMzuKr7RKF2nXsbndJSx2pp%2BZ8pZhkGSGyuXLH%2FHcSukQnC9LCoDjyNEvZLetX22%2FlIQnYkcpDAxMeUdyM%2FR1zSVsg7NNtLD%2BxB%2FTNVJxKOy2DxR5aiYql0PXh5Ichuam51P3vqRaCqIQ5pN8qHPBfC3RE1ZBi2SCMYfhkM8L%2FcuxdjJ4XekmKvjZka0wSsRRIY9rejobEtS7Fv3FGnZLRhsivtvtdFqETo%2B77eGGnzYjTcp4gOXf9hojTWPl9MeWIbgNnw%3D%3D)

图4：MCP (Model Context Protocol) 官方文档页面。MCP 是一个开放协议，标准化了应用程序如何为 LLM 提供上下文。与 Skills 不同，MCP 更侧重于让 AI 连接外部数据源和工具。

| 维度               | Skills                  | MCP                     |
| ------------------ | ----------------------- | ----------------------- |
| **本质**     | 提示词封装              | 上下文提供者            |
| **数据流向** | AI → 外部              | 外部 → AI              |
| **主要用途** | 扩展 AI 能力            | 给 AI 提供数据/工具     |
| **存储位置** | 本地文件系统            | 可以是远程服务器        |
| **复杂度**   | 简单（Markdown + YAML） | 复杂（需要实现 server） |

一个类比：

- **Skills** 是 AI 的"技能书"：告诉 AI 怎么做某事
- **MCP** 是 AI 的"工具箱"：给 AI 提供做事的工具

两者可以配合：Skill 调用 MCP 提供的工具，完成任务。

---

### 0x05.2 与 LangChain 的对比

![LangChain 官网](https://storage.googleapis.com/firecrawl-scrape-media/screenshot-b08fbad4-aeec-486b-bad4-d8fa04f99cde.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1771327843&Signature=W8B1plwgujLIzhO3ZkPyN6cDHqB%2BpGP61bj7aYN1Jdek8XoZicYcy%2FoTMw17SjA6za4drF8vwaTMEf7MkFU0NdbW7dK1v6eIgwTgcmKHwdJ2qviURdisE90WdrIfS24QvZO0sfNAKxJdapTQMg3Cg3R2tdO6C3ZnzpfNbIK8P6Q6X6p%2B3xjywZDzD%2FMRvKErqNbNnuAnEPR5Cr5ZXDVlwrx4tk0vQbgXNBILfO8n6PnZW9EuwF%2FAMHDijpN0XGYvzz16hmQ4ASoJ4%2FQ5fHLrC57%2F1pXTMB8n1%2Bl6IPhuluoMpRe4lJCr7AwQMGCr2DJWMInvP3P%2BBBFj7iV16lmsiA%3D%3D)

图5：LangChain 官网首页。LangChain 是一个流行的 AI Agent 框架，提供完整的工程平台和开源框架来构建、测试和部署可靠的 AI Agent。与 Skills 的简单封装不同，LangChain 需要编写代码来构建复杂应用。

LangChain 是一个流行的 AI Agent 框架。

| 维度               | Skills                    | LangChain                |
| ------------------ | ------------------------- | ------------------------ |
| **定位**     | 提示词管理                | 完整 Agent 框架          |
| **编程模型** | 声明式（YAML + Markdown） | 命令式（Python/JS 代码） |
| **学习曲线** | 低（会写 Markdown 就行）  | 高（需要编程）           |
| **扩展性**   | 中等                      | 高                       |
| **调试难度** | 低（直接读文本）          | 高（需要调试代码）       |

LangChain 更适合构建复杂的 Agent 系统。

Skills 更适合快速封装和复用经验。

---

### 0x05.3 与传统 Prompt 模板的对比

传统的 Prompt 模板（比如 PromptLayer）只是"文本替换"。

```
模板：你是一个{role}，你的任务是{task}
填充：role="技术博客作者", task="写 Redis 教程"
结果：你是一个技术博客作者，你的任务是写 Redis 教程
```

Skills 的优势：

1. **分层加载**：不会一次性加载所有内容
2. **资源管理**：可以打包代码、文档、配置
3. **上下文修改**：不只是改文本，还改运行环境
4. **LLM 选择**：基于语义而非模式匹配

传统模板像是"填空题"，Skills 像是"完整的能力模块"。

---

## 0x06 技术对比全景

| 特性               | Skills         | MCP               | LangChain       | AutoGPT      |
| ------------------ | -------------- | ----------------- | --------------- | ------------ |
| **类型**     | 提示词管理     | 上下文协议        | Agent 框架      | 自主 Agent   |
| **主要用途** | 封装能力       | 提供数据/工具     | 构建应用        | 自主任务执行 |
| **编程要求** | 低（Markdown） | 中（需要 server） | 高（Python/JS） | 高（配置）   |
| **AI 角色**  | 技能执行者     | 工具调用者        | 流程编排者      | 目标制定者   |
| **人类控制** | 高             | 中                | 中              | 低           |
| **适用场景** | 快速复用经验   | 数据/工具集成     | 复杂应用开发    | 自动化任务   |

---

## 0x07 关于积累

你用了一段时间 Skills，有一些感悟。

**第一个感悟：AI 需要记忆**

以前的 AI 对话像是"金鱼记忆"，每次开始都是空白。

Skills 改变了这一点。你教过 AI 一次，它就记住了。下次你需要，它直接调用。

这不是"学习"，而是"外挂记忆库"。但对用户来说，效果一样。

**第二个感悟：能力可组合**

单个 Skill 做一件事，组合起来能做复杂的事。

`blog-writer` + `code-screenshot` + `deploy-app` = 一键从代码到部署的文章系统。

组合的创造力远超单个 Skill。

**第三个感悟：人类仍然重要**

AI 可以自动迭代 Skills，但方向需要人类引导。

AI 可以优化表达方式，但不知道什么是"好的写作"。

AI 可以生成代码，但不知道什么值得写。

Skills 是放大器，放大的是人类的知识和经验。没有人类，Skills 是空的。

**第四个感悟：这只是开始**

Skills 还很新。

未来可能会有：

- Skill Marketplace：人们分享和交易 Skills
- Skill 版本控制：像管理代码一样管理 Skills
- Skill A/B 测试：自动优化最有效的版本
- Skill 跨模型迁移：从 Claude 到 Gemini

但核心不变：**让 AI 能积累，而不仅仅是计算**。

---

## 0x08 最后

1966年，ELIZA 让人们以为计算机能理解情感。

2025年，Skills 让计算机真的能"记住"经验。

这不是"奇点"，不是"意识觉醒"。

这只是工具的进化：从石头到青铜，从青铜到铁器，从铁器到硅片。

但这次，工具进化的速度，快得让人不安。

你打开 `.claude/skills/blog-writer/SKILL.md`，看着自己写的这些文字。

你想：十年后，AI 会怎么写这篇文章？

或者说，十年后，还需要人类写吗？

你不知道。

但你知道：在那天到来之前，你会继续写。

因为写作不只是传递信息，更是对抗遗忘。

---

*写作日期：2026-02-10*

## 0x09 参考资料

- Anthropic 官方 Skills 文档：https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction
- awesome-claude-skills：https://github.com/ComposioHQ/awesome-claude-skills
- Skills 技术深度解析：https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/
- 《Attention Is All You Need》：https://arxiv.org/abs/1706.03762
- ELIZA 维基百科：https://en.wikipedia.org/wiki/ELIZA