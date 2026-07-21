---
title: 恶意 npm 包盯上 Claude：AI 工具链正在变成供应链攻击的新入口
title_en: 恶意 npm 包盯上 Claude：AI 工具链正在变成供应链攻击的新入口
date: 2026-05-29
category: Security
tags:
  - 网络安全
  - AI
  - 博客
draft: false
star: false
blog_status: unpublished
blog_category: Security
blog_slug: 恶意 npm 包盯上 Claude：AI 工具链正在变成供应链攻击的新入口.md
published_path: D:\nextcloud\Blog\mi0blog\public\articles\恶意 npm 包盯上 Claude：AI 工具链正在变成供应链攻击的新入口.md
published_at: 2026-07-21T13:28:33.957Z
updated_at: 2026-07-21T13:38:46.132Z
unpublished_at: 2026-07-21T13:38:46.132Z
last_publish_hash: b39dd4296d8744667785fce059288aa1a2262276c1618f55090ea6bc11b6ffe4
---
# 恶意 npm 包盯上 Claude：AI 工具链正在变成供应链攻击的新入口

## 摘要
`mouse5212-super-formatter` 这个恶意 npm 包不算精巧，甚至有点粗糙：偷 Claude 用户目录里的文件，还把自己的 GitHub token 留在包里。但它提醒了一件更麻烦的事：AI 编程工具旁边，正在堆起一批很适合被偷的上下文、配置和凭据。

## 样本最刺眼的地方
这个样本并不高级。关键点在于它的目标：Claude 用户目录。

2026 年 5 月 27 日，OX Security 披露了一个恶意 npm 包：`mouse5212-super-formatter`。名字像一个随手生成的格式化工具，实际行为是信息窃取。研究人员称它会在安装后读取 `/mnt/user-data` 下的文件，再通过 GitHub Contents API 上传到攻击者控制的仓库里。这个包被下载了 676 次，研究人员还观察到约 7 次活跃外传记录，其中多数看起来像攻击者自己的测试。

更荒诞的是，它把自己的 GitHub 私有 token 硬编码进了包里。偷东西的人把自己的钥匙也落在了现场。这个细节有点滑稽，但不能因此把风险看轻。

![OX Security 对 mouse5212-super-formatter 的披露页面](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/01-ox-malware-slop.png)

图：OX Security 披露的 Malware-Slop 样本。这个标题里的 “Slop” 很准确，粗糙，但足够危险。

截至 2026 年 5 月 29 日复核，npm 上的这个包已经不可访问，页面返回 404。这个结果当然是好事，但它也说明另一件事：这种攻击的窗口可以很短，短到事后只能在 lockfile、缓存、CI 日志和终端历史里找痕迹。

![npm 上的 mouse5212-super-formatter 已经不可访问](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/05-npm-package-removed.png)

图：npm 当前返回 not found。包被下架不等于本地影响自动消失。

## 它到底做了什么
按 OX 的分析，这个包的关键路径并不复杂：

安装包时，npm 生命周期脚本触发。恶意代码拿到 GitHub token 后检查目标仓库是否存在，不存在就创建；然后递归读取本地目录，把文件按随机目录名上传到 GitHub。为了让行为看起来更像正常诊断，它还会写一些伪装成网络连接检查的日志。

卡点就在这里：用户不需要 `import` 它，不需要在业务代码里调用它，也不需要跑某个奇怪命令。只要安装动作发生，风险就已经开始了。

npm 供应链里这种洞并不新：`preinstall`、`install`、`postinstall`、`prepare` 这些脚本，本来是为编译、生成代码、安装原生依赖准备的。npm 官方文档也明确写了，`npm install` 和 `npm ci` 都会触发一组生命周期脚本。便利是真的便利，危险也是真的危险。

过去讨论这种风险，常说“不要装奇怪的包”。这句话现在有点不够用了。因为 AI 编程时代的“奇怪”变得更难判断：一个 formatter、一个 MCP helper、一个 Claude/Gemini/Cursor 辅助插件、一个看似修复提示词的小工具，都可能被包装成“为了更好地和 AI 协作”。

攻击面不是变玄学了，是变贴身了。

## 复现实验：只模拟链路，不模拟外传
以下为本地实际终端运行记录。为了避开 Windows `cmd.exe` 对中文路径的编码问题，截图运行目录放在纯 ASCII 路径：

```text
D:\npm-claude-terminal-screens
```

跑完后，完整目录已复制回文章素材目录：

```text
assets/claude-npm-supply-chain/actual-runs/run-2026-05-29-terminal-screens
```

该目录下分成两组安装环境：`default-install` 用来观察默认安装行为，`ignore-scripts-install` 用来验证 `--ignore-scripts` 阻断效果。原始输出保存在 `evidence/` 目录里。

这个实验不读取真实用户目录，不联网，不上传任何数据。脚本只在实验目录里放了 6 个假文件：`.claude/settings.json`、`.claude.json`、`.mcp.json`、`notes.md`、`project-a/.env.local`、`secrets-demo.env`。token 全部是假的。

第一步先确认环境和 `package.json` 里的生命周期脚本。截图里可以看到 Node `v22.15.0`、npm `11.6.2`，以及 `postinstall` 指向 `node ./scripts/postinstall-safe-demo.js`。

![步骤 1：检查 Node/npm 版本和 package scripts](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/step-01-scripts.png)

图：这是实际终端窗口截图，不是整理后的页面。`evidence/03-package-scripts.txt` 保存了同一份输出。

一个 formatter 包如果带 `postinstall`，不代表一定有问题。很多原生模块也要在安装时编译。但从安全分析角度，这已经足够让人停一下：它不是“安装后等业务 import 才运行”，而是“安装过程中先运行一段 Node 脚本”。

第二步看打包内容：

```powershell
npm pack .\safe-formatter-demo --dry-run --json
```

这一步确认包里只有 `package.json` 和 `scripts/postinstall-safe-demo.js` 两个文件，并记录了 tarball 的 `shasum`。随后用 `certutil` 对 `postinstall-safe-demo.js` 做 SHA256，哈希也保存在 `evidence/05-postinstall-script-sha256.txt`。

![步骤 2：npm pack dry-run 和 postinstall 脚本哈希](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/step-02-pack-dry-run.png)

图：`npm pack --dry-run --json` 是安装前很便宜的一步。它不会安装包，但能先看到包里到底带了什么。

确认脚本和包内容后，再做默认安装：

```powershell
cd D:\npm-claude-terminal-screens\default-install
npm install ..\safe-formatter-demo --foreground-scripts --no-audit --no-fund
```

`--foreground-scripts` 用来让生命周期脚本的输出直接出现在终端里，避免关键信息被 npm 后台输出吞掉。截图里可以看到 `postinstall` 被 npm 调起，脚本枚举了 6 个假文件，并写出本地报告。

![步骤 3：默认安装触发 postinstall](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/step-03-default-install.png)

图：这一步对应的原始输出在 `evidence/06-default-install-output.txt`。

默认安装后，`default-install/artifacts/postinstall-observation.json` 确实生成。下面节选自同步保存的 `evidence/07-default-postinstall-observation.json`。它只记录文件名、大小、哈希，以及一个本地的“拟上传清单”。`localOnlyUploadPlan` 只是一份本地报告字段，不会发起网络连接。

```json
{
  "mode": "safe local simulation",
  "lifecycle": "postinstall",
  "packageName": "safe-formatter-demo",
  "targetDir": "D:\\npm-claude-terminal-screens\\default-install\\fake-claude-user-data",
  "network": "disabled",
  "observedFiles": [
    { "relativePath": ".claude/settings.json", "size": 223 },
    { "relativePath": ".claude.json", "size": 137 },
    { "relativePath": ".mcp.json", "size": 128 },
    { "relativePath": "notes.md", "size": 47 },
    { "relativePath": "project-a/.env.local", "size": 131 },
    { "relativePath": "secrets-demo.env", "size": 96 }
  ],
  "localOnlyUploadPlan": [
    {
      "source": ".mcp.json",
      "wouldUploadTo": "github-contents-api://demo-repo/safe-run/.mcp.json"
    },
    {
      "source": "project-a/.env.local",
      "wouldUploadTo": "github-contents-api://demo-repo/safe-run/project-a/.env.local"
    }
  ]
}
```

![步骤 4：查看 postinstall 生成的观察报告和假数据目录](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/step-04-observation-json.png)

图：报告里列出的 `.claude/settings.json`、`.claude.json`、`.mcp.json`、`.env.local` 等文件，全部来自本地实验目录里的假数据。

这段 JSON 比终端输出更能说明问题：如果把 `network: disabled` 换成真实 GitHub API，把假目录换成真实 Claude 用户目录，结构上就很接近 OX 披露的那类行为。复现只停在安全边界内，演示“安装脚本能看见什么”，不提供外传代码，也不把真实恶意样本改写成教程。

再跑阻断对照：

```powershell
cd D:\npm-claude-terminal-screens\ignore-scripts-install
npm install ..\safe-formatter-demo --ignore-scripts --no-audit --no-fund
```

这次终端里没有 `postinstall` 输出。随后检查 `ignore-scripts-install` 目录，`postinstall` 报告和假数据目录都不存在。`evidence/10-ignore-scripts-check.txt` 记录如下：

```text
PostinstallReportExists : False
FakeDataDirExists       : False
```

![步骤 5：ignore-scripts 阻断 postinstall 执行](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/step-05-ignore-scripts.png)

图：`--ignore-scripts` 不是万能防御，但它能直接阻断安装阶段的生命周期脚本。

完整证据文件保存在 `assets/claude-npm-supply-chain/actual-runs/run-2026-05-29-terminal-screens/evidence/` 下面，包括 `03-package-scripts.txt`、`04-pack-dry-run.json`、`05-postinstall-script-sha256.txt`、`06-default-install-output.txt`、`07-default-postinstall-observation.json`、`09-ignore-scripts-install-output.txt` 和 `10-ignore-scripts-check.txt`。该实验的用途不是“复刻攻击”，而是把排查顺序固定下来：先看 scripts，再看包内容，再隔离运行，再检查安装脚本产生了什么，收尾用 `ignore-scripts` 做对照。真实排查时也该这么走。

它解释了为什么供应链攻击总爱盯 npm。开发者安装依赖时，心理模型通常是“把代码放进项目里”。实际发生的可能是“给了一个陌生包一次执行机会”。如果 shell 里有环境变量，项目里有 `.env`，用户目录里有 SSH key、npm token、云厂商凭据、AI 工具配置，这一次执行机会就不是小事。

## 为什么是 Claude 用户目录
攻击者盯上 Claude，不一定因为 Claude 本身有漏洞。更像是因为 Claude Code 这类工具已经贴到了开发者工作台上。

这个工作台很杂。里面有项目代码、设计文档、历史对话、`.env`、MCP 配置、hooks、agents、内部仓库地址、云厂商 token。再往外一点，还有 shell、git、npm、浏览器和本地文件系统。平时这些东西散在 IDE、终端、CI、密码管理器和 wiki 里，现在 AI 编程工具为了“理解项目”和“帮你动手”，把它们重新聚到了一起。

这正是 `mouse5212-super-formatter` 值得警惕的地方。它的技术含量有限，但选的位置很准。它偷的不是某个抽象的“AI 数据”，而是开发者在 AI 工具旁边留下的上下文、配置和凭据痕迹。攻击者跟着权限走，这一点一直没变。

## Claude Code hooks 让问题拖得更长
另一个更值得警惕的案例来自 SafeDep。2026 年 5 月 13 日，SafeDep 披露了 5 个 typosquatting npm 包：`iceberg-javascript`、`supabase-javascript`、`auth-javascript`、`microsoft-applicationinsights-common`、`ms-graph-types`。发布者名称也很像正常组织，比如 `superbase`、`micresoft`。

这些包会带一个隐藏的 ELF 二进制文件，安装时先跑一遍。更麻烦的是，它还会借 Claude Code 的 `SessionStart` hook，让恶意逻辑在每次 Claude Code 会话开始时重新执行。也就是说，这不只是“一次 npm install 触发一次脚本”，而是把 AI 工具的生命周期事件也接上了。

![SafeDep 披露的 Claude Code hooks 后门案例](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/02-safedep-claude-hooks.png)

图：SafeDep 的案例更像是把 npm 安装脚本和 Claude Code 会话启动事件串了起来。

Claude Code 官方文档对 hooks 的解释很直接：它们可以是在特定生命周期事件上自动执行的 shell 命令、HTTP endpoint 或 LLM prompt。`SessionStart`、`PreToolUse`、`PostToolUse`、`UserPromptSubmit` 这些事件，本来是给自动化工作流准备的。

但官方文档也直接提醒：命令类 hooks 会以当前系统用户的完整权限运行，可以修改、删除或访问该用户能访问的文件。

![Claude Code 官方文档里的 hooks 安全提醒](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/03-claude-hooks-security.png)

图：hook 是强能力，不是普通配置项。它靠近 shell，也就靠近风险。

这一步把供应链攻击从“安装时执行”推进到了“工具会话时执行”。项目里留下一个 `.claude/settings.json`，包删了，风险可能还在。这个尾巴比普通依赖污染更烦。

## 这不是孤例：Nx 和 @antv 都在提示同一个方向
如果只看 `mouse5212-super-formatter`，很容易得出一个轻飘的结论：攻击者很菜，代码像 AI 生成的，还泄露了自己的 token。

问题不能停在“攻击者很菜”这一层。粗糙样本能跑通，反而说明门槛在下降。

Snyk 在 2025 年披露过 Nx 恶意包事件。攻击者把恶意版本推到 npm，时间窗口大约 5 小时 20 分钟。更特别的是，样本会调用本地 AI coding agents，比如 `claude`、`gemini`、`q`，让这些工具去盘点敏感文件并帮助外传。Snyk 特别提到一些危险参数，比如 Claude Code 的 `--dangerously-skip-permissions`、Gemini CLI 的 `--yolo`、Amazon Q 的 `--trust-all-tools`。这些名字本身就已经说明问题：省掉确认，等于扩大攻击半径。

Microsoft 2026 年披露的 Mini Shai-Hulud / `@antv` npm 生态攻击，则把场景拉到了 CI/CD。恶意包在 `npm install` 阶段运行，目标是 GitHub、AWS、Vault、npm、Kubernetes、1Password 等凭据。GitHub 后续移除了 640 个恶意包，并使 61,274 个带写权限和 2FA 绕过能力的 npm granular access token 失效。

这几件事串起来，画面就不只是“npm 又出事了”。一端是 `mouse5212-super-formatter` 这种偷 Claude 用户目录的粗糙包；往前走一点，是 SafeDep 看到的 Claude Code hook 后门；再往前，是 Nx 事件里恶意包直接调用本地 AI agents 帮它盘点敏感文件；到 Microsoft 披露的 `@antv` 事件，目标已经落到 CI/CD 和大批量凭据上。

攻击者不是只对“AI”这个词感兴趣。他们感兴趣的是 AI 工具链附近正在堆起来的权限。

## 防御时别只问“这个包有没有漏洞”
现在更应该问的是：安装它的时候，它能不能动？

对个人开发者来说，有几件事可以立刻落地。

陌生包、一次性工具、AI 辅助插件，先用 `--ignore-scripts`：

```powershell
npm install <package-name> --ignore-scripts
```

如果你希望默认禁用安装脚本，可以在 `.npmrc` 里写：

```ini
ignore-scripts=true
```

npm v11 里还有更细的策略，比如 `allow-scripts`、`strict-allow-scripts`、`dangerously-allow-all-scripts`、`min-release-age`。这几个配置不适合一句话“全开”或“全关”，但思路值得借：默认不要让新依赖随便跑脚本，确实需要构建脚本的包，再显式放行。

安装前看包，而不是安装后后悔：

```powershell
npm view <package-name>
npm pack <package-name> --dry-run
```

重点看 `package.json` 里的 `scripts`，看包里有没有异常的 `.claude/`、大体积二进制文件、混淆 JS、奇怪的网络请求、相似拼写的包名和发布者。这个动作很烦，但比事后轮换 token 轻松。

不要把 AI CLI 的危险模式当日常快捷方式。`--dangerously-skip-permissions`、`--yolo`、`--trust-all-tools` 这类参数，在临时沙箱里偶尔调试可以理解，放到真实项目和带凭据的终端里，就太大胆了。

Claude 相关配置也要翻一遍。至少看这些位置：

```text
~/.claude/settings.json
.claude/settings.json
.claude/settings.local.json
.mcp.json
~/.claude.json
```

搜索 `SessionStart`、`PreToolUse`、`PostToolUse`、`UserPromptSubmit`，看有没有陌生命令、陌生路径、HTTP hook、或者项目里突然多出来的 `.claude/settings` 二进制。企业环境可以考虑用 Claude Code 的 managed settings：比如 `disableAllHooks`、`allowManagedHooksOnly`、`strictPluginOnlyCustomization`、`strictKnownMarketplaces`，把 hooks、plugins、MCP server 的来源收紧。

如果你真的装过 `mouse5212-super-formatter`，不要只删包。按 OX 的建议，GitHub access token 应该立即撤销或轮换；`/mnt/user-data` 里放过的敏感文件要按已泄露处理。再继续查 lockfile、npm cache、shell history、CI 日志和 GitHub 仓库里有没有异常上传痕迹。

如果你排查 SafeDep 那组 Claude Code hooks 样本，除了 lockfile 里的包名，还要看项目根目录和 `node_modules` 下的 `.claude/settings`、`.claude/settings.json`。SafeDep 给出的 C2 是 `207[.]90[.]194[.]2:443`，这个可以进网络日志里搜。命中之后，凭据轮换不要省。

## 边界已经挪到安装和工具配置里
过去讲供应链安全，很多检查习惯盯“依赖代码会不会在运行时被业务调用”。这个模型现在不够完整。

npm install 是边界，Claude Code hook 是边界，MCP 配置是边界，AI agent 的工具权限也是边界。它们都不一定出现在业务代码路径里，却可能拥有比业务代码更靠近开发者的权限。

这就是 AI 工具链会成为新目标的原因。

AI 没有凭空制造供应链攻击。`postinstall` 很早就存在，typosquatting 也不新，token 泄露更是老问题。AI 改变的是权力的聚合方式：越来越多的上下文、工具调用、项目知识和自动化入口，被放进同一个工作流里。攻击者不需要理解你的全部系统，只要在你“为了效率”打开的一条小门上等着。

这件事最讽刺的地方在于，很多 AI 工具都是为了减少开发者的机械劳动。可安全上，机械劳动不能完全消失。安装前看一眼脚本，跑陌生包时开一个干净环境，定期翻一下 hooks，给 token 最小权限，别把 `.env` 和长期凭据随手丢进项目目录。这些动作不酷，也不智能。

但它们现在更值钱了。

## 参考
- OX Security: [Malware-Slop: New Malicious npm Package Leaks Its Own GitHub Private Token](https://www.ox.security/blog/malware-slop-new-malicious-npm-package-leaks-its-own-github-private-token/)
- The Hacker News: [Malicious npm Package Stole Files From Claude AI User Directory via GitHub](https://thehackernews.com/2026/05/malicious-npm-package-stole-files-from.html)
- The Register: [Supply chain brain drain: npm attacker foolishly leaks own GitHub private token](https://www.theregister.com/cyber-crime/2026/05/27/supply-chain-brain-drain-npm-attacker-foolishly-leaks-own-github-private-token/5247424)
- npm package page: [mouse5212-super-formatter](https://www.npmjs.com/package/mouse5212-super-formatter)
- npm Docs: [Scripts](https://docs.npmjs.com/cli/using-npm/scripts/) / [Config: ignore-scripts](https://docs.npmjs.com/cli/v11/using-npm/config#ignore-scripts)
- Claude Code Docs: [Hooks reference](https://code.claude.com/docs/en/hooks) / [Settings](https://code.claude.com/docs/en/settings)
- SafeDep: [Malicious npm Packages Backdoor Claude Code Sessions](https://safedep.io/malicious-npm-packages-claude-code-hooks)
- Microsoft Security Blog: [Mini Shai Hulud: Compromised @antv npm packages enable CI/CD credential theft](https://www.microsoft.com/en-us/security/blog/2026/05/20/mini-shai-hulud-compromised-antv-npm-packages-enable-ci-cd-credential-theft/)
- Snyk: [Weaponizing AI Coding Agents for Malware in the Nx Malicious Package Security Incident](https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/)
