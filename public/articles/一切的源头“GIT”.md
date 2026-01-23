---
title: 一切的源头“GIT”
date: 2026-01-23
tags:
  - 开发
  - 前置基础
  - git
  - 博客
  - 公众号
category: Talk
cover: ""
---
# 0x00 番外篇-什么是git

---

参考：
https://developer.aliyun.com/article/761663
https://zh.wikipedia.org/zh-hans/Git

![IMG-一切的源头“GIT”-20250824130033573.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033573.png)

这里只是类似于小学生科学课的地方，介绍历史，文件结构，或许我们会有兴趣，如果不想看，可以直接跳跃到第一章节(0x01)我们应该看看伟大的维基百科不是吗
![IMG-一切的源头“GIT”-20250824130033606.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033606.png)

一个[分布式版本控制](https://zh.wikipedia.org/wiki/%E5%88%86%E6%95%A3%E5%BC%8F%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6 "分布式版本控制")软件，最初由[林纳斯·托瓦兹](https://zh.wikipedia.org/wiki/%E6%9E%97%E7%BA%B3%E6%96%AF%C2%B7%E6%89%98%E7%93%A6%E5%85%B9 "林纳斯·托瓦兹")创作，于2005年以[GPL](https://zh.wikipedia.org/wiki/GPL "GPL")许可协议发布。

一些关于git的小话：
The name "git" was given by Linus Torvalds when he wrote the very first version. He described the tool as "the stupid content tracker" and the name as (depending on your way):

- random three-letter combination that is pronounceable, and not actually used by any common UNIX command. The fact that it is a mispronunciation of "get" may or may not be relevant.
- "global information tracker": you're in a good mood, and it actually works for you. Angels sing, and a light suddenly fills the room.
- stupid. contemptible and despicable. simple. Take your pick from the dictionary of slang.

git和其他[版本控制系统](https://zh.wikipedia.org/wiki/%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%B3%BB%E7%BB%9F "版本控制系统")（如CVS）有不小的差别，git本身关心文件的整体性是否有改变，但多数的版本控制系统如CVS或Subversion系统则在乎文件内容的差异。git拒绝保持每个文件的版本修订关系。因此查看一个文件的历史需要遍历各个history快照；git隐式处理文件更名，即同名文件默认为其前身，如果没有同名文件则在前一个版本中搜索具有类似内容的文件。

git更像一个文件系统，直接在本地上获取资料，不必连线到主机端获取资料。 每个开发者都可有全部开发历史的本地副本，changes从这种本地repository复制给其他开发者。这些changes作为新增的开发分支被导入，可以与本地开发分支合并。

分支是非常轻量级的，一个分支仅是对一个commit的引用。

或许我们到这里，知道这些就足够了，我们又不是历史学家

再看看一些文件夹的用处和说明

- hooks：存储钩子的文件夾
- logs：存储日志的文件夾
- refs：存储指向各个分支的指针（SHA-1标识）文件
- objects：存放git对象
- config：存放各种設置文檔
- HEAD：指向当前所在分支的指针文件路径，一般指向refs下的某文件

1. **hooks（钩子文件夹）**：

   - 想象一下，你有一个工具箱，里面装着各种小工具，每当你做某些事情（比如提交代码）时，这些小工具就会自动跳出来帮你检查一下，确保一切都符合规矩。这个文件夹就是存放这些自动触发的小工具的地方。
2. **logs（日志文件夹）**：

   - 这就像是一个日记本，记录了你（或者你的团队）对代码库做的每一次操作。每次你提交代码或者合并分支，Git都会在这个日记本里记上一笔。
3. **refs（引用文件夹）**：

   - 想象一下，你有很多不同的笔记本（每个笔记本代表一个分支），每个笔记本的第一页都写着“这是我的笔记本”。在Git中，每个分支都有一个这样的“第一页”，用来标记这个分支当前的位置。这个文件夹就是存放这些“第一页”的地方。
4. **objects（对象文件夹）**：

   - 这是Git的仓库，里面保存了所有的代码和数据。你可以把它想象成一个巨大的图书馆，每个书架上都放着不同的书（这里的书就是代码文件），每本书都有一个独一无二的编号（SHA-1标识）。
5. **config（配置文件）**：

   - 这就像是一个设置菜单，你可以在这里调整Git的行为，比如设置用户信息、别名等。就像你调整手机的铃声和壁纸一样。
6. **HEAD（当前分支指针文件）**：

   - 想象一下，你有很多条路（分支），每条路都有一个路标（HEAD文件）。这个路标会告诉你，你现在正站在哪条路上。当你切换分支时，这个路标就会指向新的路。

仓库结构
![IMG-一切的源头“GIT”-20250824130033637.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033637.png)

# 0x01 Git的简单原理

---

我们先来看一个大致的工作结构
![IMG-一切的源头“GIT”-20250824130033667.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033667.png)

啊哈，是不是有点复杂，我们找另一张图，我觉得不能一味的追求简单而不能再简单的结构去学习一个东西，或许更早的接触和学习完整的框架，会更有帮助
index就可以理解为缓存区了
![IMG-一切的源头“GIT”-20250824130033704.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033704.png)

那我们就来简单的操作一下，这个步骤其实完成日常生产生活中的大部分了

# 0x02 git实操

---

其实不管是小型个人项目，还是大型团队大型项目，那我们使用的命令呢就是那些，我们来给大家列举一下子

那么首先的，我们从一个空白项目的建立来讲起，
`命令一览`

```bash
# 我们可以先初始化项目环境
git init
# 接下来创建我们的ssh密钥（主要是在对接自己账户，方便使用仓库的）
ssh-keygen -t rsa -C "github的email"
# 我们读取下密钥
# 一般有提示保存的位置，直接读取留存备用就好，这里拿linux举例一下
cat ~/.ssh/id_rsa.pub

# 接下来可以上传自己的ssh密钥了
# 现在设置下全局变量设置
# 用户
git config --global user.name "githubname"
# 邮箱
git config --global user.email "githubemail"

# 我们尝试第一次的提交
# 我们设置一下我们需要提交的仓库地址
git remote add origin https://....
# 设置下需要提交的分支（注意，这里就设置一个默认的分支，在实际的项目当中可能有多分支的情况出现）
git branch -M main
# 我们添加下需要提交的文件
git add {file}
# 提交，并且设置提交信息
git commit -m 'message'
# 第一次push，让我们试试吧，嘻嘻
git push -u origin main

```

## 0x02.01 具体步骤

---

初始化
![IMG-一切的源头“GIT”-20250824130033735.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033735.png)

创建ssh密钥，我这里之前创建过了，就不覆盖了，大家第一次使用的时候就全部默认是就可以了
![IMG-一切的源头“GIT”-20250824130033771.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033771.png)

接下来，我们上传密钥，选择个人设置的ssh设置
![IMG-一切的源头“GIT”-20250824130033832.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033832.png)

选择右上角的添加位置
![IMG-一切的源头“GIT”-20250824130033861.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033861.png)

自己去一个title然后将密钥写进去添加就行
![IMG-一切的源头“GIT”-20250824130033895.png](https://cdn.jsdelivr.net/gh/klopiop/Picture/blog/IMG-%E4%B8%80%E5%88%87%E7%9A%84%E6%BA%90%E5%A4%B4%E2%80%9CGIT%E2%80%9D-20250824130033895.png)

后续操作跟着命令一步步即可

# 0x03 实用技巧

---

## 回滚

查看提交历史

```git
git log

# 可选参数
--online # 一行显示
--Graph # 图形化
-n <num> # 显示前多少个提交
```

还在工作区内，未提交的修改回滚

```git
git checkout -- <filename>  # 丢弃某个文件的修改
git checkout -- .           # 丢弃全部文件的修改

```

已经add，未commit

```git
git reset HEAD <filename>  # 取消暂存某个文件
git reset HEAD .           # 取消暂存全部文件
```

已commit，未push

```1git
git reset --soft HEAD~1 # 保留改动到工作区
git reset --hard HEAD~1 # 直接丢弃改动
```

已经push的回滚

```gIT
git log  # 查看提交历史，找到要回滚的提交ID
git revert <commit_id>  # 撤销指定的提交
```

## 展示帮助信息

```sh
git help -g
```

The command output as below:

```
The common Git guides are:
   attributes          Defining attributes per path
   cli                 Git command-line interface and conventions
   core-tutorial       A Git core tutorial for developers
   cvs-migration       Git for CVS users
   diffcore            Tweaking diff output
   everyday            A useful minimum set of commands for Everyday Git
   glossary            A Git Glossary
   hooks               Hooks used by Git
   ignore              Specifies intentionally untracked files to ignore
   modules             Defining submodule properties
   namespaces          Git namespaces
   repository-layout    Git Repository Layout
   revisions           Specifying revisions and ranges for Git
   tutorial            A tutorial introduction to Git
   tutorial-2          A tutorial introduction to Git: part two
   workflows           An overview of recommended workflows with Git

'git help -a' and 'git help -g' list available subcommands and some concept guides. See 'git help <command>' or 'git help <concept>' to read about a specific subcommand or concept.
```

## 回到远程仓库的状态

抛弃本地所有的修改，回到远程仓库的状态。

```sh
git fetch --all && git reset --hard origin/master
```

## 重设第一个 commit

也就是把所有的改动都重新放回工作区，并**清空所有的 commit**，这样就可以重新提交第一个 commit 了

```sh
git update-ref -d HEAD
```

## 查看冲突文件列表

展示工作区的冲突文件列表

```sh
git diff --name-only --diff-filter=U
```

## 展示工作区和暂存区的不同

输出**工作区**和**暂存区**的 different (不同)。

```sh
git diff
```

还可以展示本地仓库中任意两个 commit 之间的文件变动：

```sh
git diff <commit-id> <commit-id>
```

## 展示暂存区和最近版本的不同

输出**暂存区**和本地最近的版本 (commit) 的 different (不同)。

```sh
git diff --cached
```

## 展示暂存区、工作区和最近版本的不同

输出**工作区**、**暂存区** 和本地最近的版本 (commit) 的 different (不同)。

```sh
git diff HEAD
```

## 快速切换到上一个分支

```sh
git checkout -
```

## 删除已经合并到 master 的分支

```sh
git branch --merged master | grep -v '^\*\|  master' | xargs -n 1 git branch -d
```

## 展示本地分支关联远程仓库的情况

```sh
git branch -vv
```

## 关联远程分支

关联之后，`git branch -vv` 就可以展示关联的远程分支名了，同时推送到远程仓库直接：`git push`，不需要指定远程仓库了。

```sh
git branch -u origin/mybranch
```

或者在 push 时加上 `-u` 参数

```sh
git push origin/mybranch -u
```

## 列出所有远程分支

-r 参数相当于：remote

```sh
git branch -r
```

## 列出本地和远程分支

-a 参数相当于：all

```sh
git branch -a
```

## 查看远程分支和本地分支的对应关系

```sh
git remote show origin
```

## 远程删除了分支本地也想删除

```sh
git remote prune origin
```

## 创建并切换到本地分支

```sh
git checkout -b <branch-name>
```

## 从远程分支中创建并切换到本地分支

```sh
git checkout -b <branch-name> origin/<branch-name>
```

## 删除本地分支

```sh
git branch -d <local-branchname>
```

## 删除远程分支

```sh
git push origin --delete <remote-branchname>
```

或者

```sh
git push origin :<remote-branchname>
```

## 重命名本地分支

```sh
git branch -m <new-branch-name>
```

## 查看标签

```sh
git tag
```

展示当前分支的最近的 tag

```sh
git describe --tags --abbrev=0
```

## 查看标签详细信息

```sh
git tag -ln
```

## 本地创建标签

```sh
git tag <version-number>
```

默认 tag 是打在最近的一次 commit 上，如果需要指定 commit 打 tag：

```sh
$ git tag -a <version-number> -m "v1.0 发布(描述)" <commit-id>
```

## 推送标签到远程仓库

首先要保证本地创建好了标签才可以推送标签到远程仓库：

```sh
git push origin <local-version-number>
```

一次性推送所有标签，同步到远程仓库：

```sh
git push origin --tags
```

## 删除本地标签

```sh
git tag -d <tag-name>
```

## 删除远程标签

```sh
git push origin --delete tag <tagname>
```

## 切回到某个标签

一般上线之前都会打 tag，就是为了防止上线后出现问题，方便快速回退到上一版本。下面的命令是回到某一标签下的状态：

```sh
git checkout -b branch_name tag_name
```

## 放弃工作区的修改

```sh
git checkout <file-name>
```

放弃所有修改：

```sh
git checkout .
```

## 恢复删除的文件

```sh
git rev-list -n 1 HEAD -- <file_path> #得到 deleting_commit

git checkout <deleting_commit>^ -- <file_path> #回到删除文件 deleting_commit 之前的状态
```

## 以新增一个 commit 的方式还原某一个 commit 的修改

```sh
git revert <commit-id>
```

## 回到某个 commit 的状态，并删除后面的 commit

和 revert 的区别：reset 命令会抹去某个 commit id 之后的所有 commit

```sh
git reset <commit-id>  #默认就是-mixed参数。

git reset --mixed HEAD^  #回退至上个版本，它将重置HEAD到另外一个commit,并且重置暂存区以便和HEAD相匹配，但是也到此为止。工作区不会被更改。

git reset --soft HEAD~3  #回退至三个版本之前，只回退了commit的信息，暂存区和工作区与回退之前保持一致。如果还要提交，直接commit即可  

git reset --hard <commit-id>  #彻底回退到指定commit-id的状态，暂存区和工作区也会变为指定commit-id版本的内容
```

## 修改上一个 commit 的描述

如果暂存区有改动，同时也会将暂存区的改动提交到上一个 commit

```sh
git commit --amend
```

## 查看 commit 历史

```sh
git log
```

## 查看某段代码是谁写的

blame 的意思为‘责怪’，你懂的。

```sh
git blame <file-name>
```

## 显示本地更新过 HEAD 的 git 命令记录

每次更新了 HEAD 的 git 命令比如 commit、amend、cherry-pick、reset、revert 等都会被记录下来（不限分支），就像 shell 的 history 一样。 这样你可以 reset 到任何一次更新了 HEAD 的操作之后，而不仅仅是回到当前分支下的某个 commit 之后的状态。

```sh
git reflog
```

## 修改作者名

```sh
git commit --amend --author='Author Name <email@address.com>'
```

## 修改远程仓库的 url

```sh
git remote set-url origin <URL>
```

## 增加远程仓库

```sh
git remote add origin <remote-url>
```

## 列出所有远程仓库

```sh
git remote
```

## 查看两个星期内的改动

```sh
git whatchanged --since='2 weeks ago'
```

## 把 A 分支的某一个 commit，放到 B 分支上

这个过程需要 `cherry-pick` 命令，[参考](http://sg552.iteye.com/blog/1300713#bc2367928)

```sh
git checkout <branch-name> && git cherry-pick <commit-id>
```

## 给 git 命令起别名

简化命令

```sh
git config --global alias.<handle> <command>

比如：git status 改成 git st，这样可以简化命令

git config --global alias.st status
```

## 存储当前的修改，但不用提交 commit

详解可以参考[廖雪峰老师的 git 教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00137602359178794d966923e5c4134bc8bf98dfb03aea3000)

```sh
git stash
```

## 保存当前状态，包括 untracked 的文件

untracked 文件：新建的文件

```sh
git stash -u
```

## 展示所有 stashes

```sh
git stash list
```

## 回到某个 stash 的状态

```sh
git stash apply <stash@{n}>
```

## 回到最后一个 stash 的状态，并删除这个 stash

```sh
git stash pop
```

## 删除所有的 stash

```sh
git stash clear
```

## 从 stash 中拿出某个文件的修改

```sh
git checkout <stash@{n}> -- <file-path>
```

## 展示所有 tracked 的文件

```sh
git ls-files -t
```

## 展示所有 untracked 的文件

```sh
git ls-files --others
```

## 展示所有忽略的文件

```sh
git ls-files --others -i --exclude-standard
```

## 强制删除 untracked 的文件

可以用来删除新建的文件。如果不指定文件文件名，则清空所有工作的 untracked 文件。`clean` 命令，**注意两点**：

1. clean 后，删除的文件无法找回
2. 不会影响 tracked 的文件的改动，只会删除 untracked 的文件

```sh
git clean <file-name> -f
```

## 强制删除 untracked 的目录

可以用来删除新建的目录，**注意**:这个命令也可以用来删除 untracked 的文件。详情见上一条

```sh
git clean <directory-name> -df
```

## 展示简化的 commit 历史

```sh
git log --pretty=oneline --graph --decorate --all
```

## 把某一个分支导出成一个文件

```sh
git bundle create <file> <branch-name>
```

## 从包中导入分支

新建一个分支，分支内容就是上面 `git bundle create` 命令导出的内容

```sh
git clone repo.bundle <repo-dir> -b <branch-name>
```

## 执行 rebase 之前自动 stash

```sh
git rebase --autostash
```

## 从远程仓库根据 ID，拉下某一状态，到本地分支

```sh
git fetch origin pull/<id>/head:<branch-name>
```

## 详细展示一行中的修改

```sh
git diff --word-diff
```

## 清除 gitignore 文件中记录的文件

```sh
git clean -X -f
```

## 展示所有 alias 和 configs

**注意：** config 分为：当前目录（local）和全局（golbal）的 config，默认为当前目录的 config

```sh
git config --local --list (当前目录)
git config --global --list (全局)
```

## 展示忽略的文件

```sh
git status --ignored
```

## commit 历史中显示 Branch1 有的，但是 Branch2 没有 commit

```sh
git log Branch1 ^Branch2
```

## 在 commit log 中显示 GPG 签名

```sh
git log --show-signature
```

## 删除全局设置

```sh
git config --global --unset <entry-name>
```

## 新建并切换到新分支上，同时这个分支没有任何 commit

相当于保存修改，但是重写 commit 历史

```sh
git checkout --orphan <branch-name>
```

## 展示任意分支某一文件的内容

```sh
git show <branch-name>:<file-name>
```

## clone 下来指定的单一分支

```sh
git clone -b <branch-name> --single-branch https://github.com/user/repo.git
```

## clone 最新一次提交

只会 clone 最近一次提交，将减少 clone 时间

```sh
git clone --depth=1 https://github.com/user/repo.git
```

## 忽略某个文件的改动

关闭 track 指定文件的改动，也就是 Git 将不会在记录这个文件的改动

```sh
git update-index --assume-unchanged path/to/file
```

恢复 track 指定文件的改动

```sh
git update-index --no-assume-unchanged path/to/file
```

## 忽略文件的权限变化

不再将文件的权限变化视作改动

```sh
git config core.fileMode false
```

## 以最后提交的顺序列出所有 Git 分支

最新的放在最上面

```sh
git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/heads/
```

## 在 commit log 中查找相关内容

通过 grep 查找，given-text：所需要查找的字段

```sh
git log --all --grep='<given-text>'
```

## 把暂存区的指定 file 放到工作区中

不添加参数，默认是 `-mixed`

```sh
git reset <file-name>
```

## 强制推送

```sh
git push -f <remote-name> <branch-name>
```

## git 配置 http 和 socks 代理

```sh
git config --global https.proxy 'http://127.0.0.1:8001'   # 适用于 privoxy 将 socks 协议转为 http 协议的 http 端口
git config --global http.proxy 'http://127.0.0.1:8001'
git config --global socks.proxy "127.0.0.1:1080"
```

## git 配置 ssh 代理

```sh
$ cat ~/.ssh/config
Host gitlab.com
ProxyCommand nc -X 5 -x 127.0.0.1:1080 %h %p    # 直接使用 shadowsocks 提供的 socks5 代理端口

Host github.com
ProxyCommand nc -X 5 -x 127.0.0.1:1080 %h %p  
```

## 脑图

## 优雅的Commit信息

使用[Angular团队提交规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

主要有以下组成

- 标题行: 必填, 描述主要修改类型和内容
- 主题内容: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等
- 页脚注释: 放 Breaking Changes 或 Closed Issues

常用的修改项

- type: commit 的类型
- feat: 新特性
- fix: 修改问题
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理.
- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述
- body: commit 具体修改内容, 可以分为多行
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.
