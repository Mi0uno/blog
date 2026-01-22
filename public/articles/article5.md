---
title: CVE-2026-24061：一个“复古味”十足的 Telnetd 远程认证绕过 (附排查与加固清单)
date: 2026-01-22
tags: [security, cve, telnet, vulnerability, wechat]
category: Talk
link: https://mp.weixin.qq.com/s/qxEsiONWBiywQXeBHuvKCg
cover: 
star: true
---
这次的主角就是Telnetd。

CVE-2026-24061 指向 GNU InetUtils 的 telnetd：在某些条件下，攻击者可以远程绕过认证，直接进入系统登录流程，风险等级很难不拉满。

这篇文章只讲原理、影响与防守；不提供可以直接复现的攻击命令/步骤。
