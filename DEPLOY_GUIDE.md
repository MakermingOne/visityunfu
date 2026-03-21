# 云浮文旅网站部署指南

## 方案一：Vercel 部署（推荐 ⭐⭐⭐）

### 优点
- ✅ 完全免费
- ✅ 自动部署（代码推送后自动更新）
- ✅ 全球 CDN 加速
- ✅ 支持自定义域名
- ✅ 自动处理 SPA 路由

### 部署步骤

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 点击 "Sign Up" 用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 选择你的 `visityunfu` 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: 选择 "Other"
   - Build Command: 留空（纯静态网站）
   - Output Directory: 留空（根目录）
   - 点击 "Deploy"

4. **等待部署**
   - 约 1-2 分钟后完成
   - 获得类似 `https://visit-yunfu.vercel.app` 的域名

5. **配置自定义域名（可选）**
   - 在 Vercel 项目设置中添加自己的域名
   - 如: `www.visityunfu.com`

---

## 方案二：Netlify 部署（推荐 ⭐⭐）

### 优点
- ✅ 完全免费
- ✅ 拖拽式部署
- ✅ 支持表单处理
- ✅ 支持自定义域名

### 部署步骤

1. **注册 Netlify 账号**
   - 访问 https://www.netlify.com
   - 用 GitHub 登录

2. **部署方式 A: 拖拽部署**
   - 下载仓库 ZIP 文件
   - 解压后拖拽到 Netlify 网站
   - 自动部署

3. **部署方式 B: Git 部署**
   - 点击 "New site from Git"
   - 选择 GitHub → visityunfu 仓库
   - Build settings 留空
   - 点击 "Deploy site"

4. **获得域名**
   - 类似 `https://visit-yunfu-xxx.netlify.app`

---

## 方案三：腾讯云/阿里云 OSS（国内推荐 ⭐⭐⭐）

### 优点
- ✅ 国内访问速度快
- ✅ 支持自定义域名
- ✅ 费用低（约 0.1-0.2元/GB/月）

### 部署步骤（以腾讯云为例）

1. **创建 COS 存储桶**
   - 登录腾讯云控制台
   - 进入对象存储 COS
   - 创建存储桶（选择公有读私有写）

2. **开启静态网站**
   - 在存储桶设置中开启 "静态网站"
   - 索引文档: index.html
   - 错误文档: 404.html

3. **上传文件**
   - 使用 COSBrowser 客户端
   - 或直接在网页控制台上传
   - 上传所有文件到根目录

4. **绑定域名**
   - 在存储桶的 "域名管理" 中添加自定义域名
   - 配置 CDN 加速

---

## 方案四：GitHub Pages + 自定义域名

### 当前状态
- ✅ 已部署到 https://makermingone.github.io/visityunfu/
- ⚠️ 但只能部署 main 分支

### 添加自定义域名

1. **购买域名**
   - 在阿里云/腾讯云/GoDaddy 购买域名
   - 如: `visityunfu.com`

2. **配置 DNS**
   - 添加 CNAME 记录: `www` → `makermingone.github.io`
   - 或 A 记录指向 GitHub Pages IP

3. **配置 GitHub**
   - 在仓库 Settings → Pages → Custom domain
   - 输入: `www.visityunfu.com`
   - 勾选 Enforce HTTPS

4. **添加 CNAME 文件**
   - 在仓库根目录创建 `CNAME` 文件
   - 内容: `www.visityunfu.com`

---

## 快速部署脚本

### 一键部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 一键部署到 Netlify
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod --dir=.
```

---

## 推荐选择

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 快速部署、全球访问 | Vercel | 最简单，自动部署 |
| 国内访问为主 | 腾讯云 COS | 国内速度快 |
| 已有域名 | GitHub Pages + 自定义域名 | 免费且稳定 |
| 需要表单等功能 | Netlify | 功能更丰富 |

---

## V23 vs V27 部署建议

### 推荐部署 V23 (main 分支)
- ✅ 更稳定
- ✅ 图片路径已正确配置
- ✅ 适合生产环境

### V27 (v27-full 分支)
- ⚠️ 功能更丰富但配置复杂
- ⚠️ 需要额外检查路径
- 💡 建议作为开发分支，完善后再部署

