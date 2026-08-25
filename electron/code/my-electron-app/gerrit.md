Gerrit 是一个基于 Git 的代码审查（Code Review）系统。很多大型公司（如华为、腾讯、阿里、字节、运营商设备厂商等）都会使用 Gerrit 管理代码提交流程。

简单来说：

**Git 负责管理代码版本，Gerrit 负责管理代码审核。**

你不能直接把代码提交到主分支，而是先提交到 Gerrit，由其他开发者审核通过后再合并。

---

## 一、为什么需要 Gerrit

如果团队成员直接向主分支提交代码：

```text
开发A ---> main
开发B ---> main
开发C ---> main
```

可能出现：

- Bug 代码进入主干
- 代码风格不统一
- 安全问题无人检查
- 新人代码质量难保证

因此增加审核流程：

```text
开发者
   ↓
提交到 Gerrit
   ↓
Code Review
   ↓
审核通过
   ↓
自动合并到主分支
```

---

## 二、Gerrit核心概念

### 1. Change

Gerrit最核心的对象。

一次代码评审就是一个 Change。

例如：

```text
Change #12345

标题：
Fix login timeout issue

状态：
Reviewing
```

审核人会在这个 Change 上评论。

---

### 2. Patch Set

如果审核后发现问题：

```text
Reviewer:
这里有空指针风险
```

你不需要重新创建PR。

而是修改代码后再次提交：

```text
Patch Set 1
Patch Set 2
Patch Set 3
```

所有版本都挂在同一个 Change 下。

例如：

```text
Change #12345
├── Patch Set 1
├── Patch Set 2
└── Patch Set 3
```

Reviewer直接看新旧差异即可。

---

### 3. Change-Id

Gerrit识别同一个评审的关键。

提交信息中会有：

```text
Change-Id: Iabc123456789
```

例如：

```text
Fix login timeout issue

Change-Id: Iabc123456789
```

以后即使重新提交：

```bash
git commit --amend
git push
```

因为 Change-Id 不变：

```text
Patch Set 2
```

而不是创建新的 Change。

---

### 4. Reviewer

审核人。

例如：

```text
作者：
Tom

Reviewer：
Jerry
Alice
```

Reviewer负责：

- 看代码
- 提意见
- 打分

---

## 三、Gerrit评分机制

常见：

### Code-Review

```text
+2 通过
+1 基本通过
 0 不评价
-1 需要修改
-2 禁止提交
```

例如：

```text
Alice +2
Bob   +1
```

达到要求后：

```text
Ready to submit
```

---

### Verified

通常由CI自动打分。

例如：

```text
Jenkins
GitLab CI
Zuul
```

编译成功：

```text
Verified +1
```

编译失败：

```text
Verified -1
```

---

最终可能看到：

```text
Code-Review +2
Verified    +1
```

然后允许合并。

---

## 四、Gerrit与GitHub PR的区别

GitHub：

```text
提交代码
↓
创建PR
↓
Review
↓
Merge
```

Gerrit：

```text
提交代码
↓
push到refs/for分支
↓
自动生成Change
↓
Review
↓
Submit
```

最大区别：

GitHub：

```text
PR
```

Gerrit：

```text
Change + Patch Set
```

Gerrit对多轮修改的管理更强。

---

## 五、基本工作流程

### 1. 拉代码

```bash
git clone xxx.git
```

---

### 2. 创建分支

```bash
git checkout -b feature-login
```

---

### 3. 修改代码

```bash
vim login.go
```

---

### 4. 提交

```bash
git add .
git commit
```

提交信息：

```text
Fix login timeout issue

Change-Id: Iabc123456789
```

很多公司会自动生成 Change-Id。

---

### 5. 推送到 Gerrit

不是：

```bash
git push origin master
```

而是：

```bash
git push origin HEAD:refs/for/master
```

这里最容易让新人困惑。

---

意思是：

```text
refs/for/master
```

不是master分支。

而是：

```text
"请帮我创建一个Review"
```

Gerrit收到后：

```text
Change #12345
```

自动生成评审任务。

---

### 6. 根据Review修改

Reviewer：

```text
变量名不规范
```

修改：

```bash
git add .
git commit --amend
```

然后：

```bash
git push origin HEAD:refs/for/master
```

因为：

```text
Change-Id相同
```

于是：

```text
Patch Set 2
```

生成。

---

### 7. 审核通过

例如：

```text
Code-Review +2
Verified +1
```

点击：

```text
Submit
```

或者维护者提交。

---

### 8. 自动合并

最终：

```text
master
```

获得你的代码。

---

## 六、实习中最常用的命令

### 查看远程

```bash
git remote -v
```

---

### 拉取最新代码

```bash
git pull
```

---

### 查看当前分支

```bash
git branch
```

---

### 提交

```bash
git add .
git commit
```

---

### 修改已有提交

```bash
git commit --amend
```

Gerrit开发中非常常见。

---

### 提交Review

```bash
git push origin HEAD:refs/for/master
```

或：

```bash
git push origin HEAD:refs/for/main
```

具体看项目主分支名称。

---

## 七、你作为实习生最需要掌握的部分

如果你是第一次接触 Gerrit，实际上先掌握下面这些就够用了：

```bash
git pull

git checkout -b my-feature

# 修改代码

git add .
git commit

git push origin HEAD:refs/for/master
```

收到 Review 意见后：

```bash
# 修改代码

git add .
git commit --amend

git push origin HEAD:refs/for/master
```

理解这两个概念：

1. Change = 一次代码评审
2. Patch Set = 同一次评审的后续修改版本

很多实习生刚接触 Gerrit 时最大的困惑是：“为什么我修改代码后还要 `commit --amend` 而不是重新 commit？”答案就是为了保持同一个 Change-Id，让 Gerrit 生成新的 Patch Set，而不是创建一个新的评审任务。
