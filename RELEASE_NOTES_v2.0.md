# Visit Yunfu V2.0 发版记录

**发布日期**: 2026年3月24日  
**版本标签**: [v2.0](https://github.com/MakermingOne/visityunfu/releases/tag/v2.0)  
**提交哈希**: `afcd491`

---

## 🎉 版本概述

V2.0 是一个重要的修复版本，主要解决了 React SPA 在 GitHub Pages 和 Vercel 双平台部署时遇到的**子页面 404 问题**和**图片显示路径问题**。现在网站在两大平台都能完美运行！

---

## 🐛 解决的问题

### 1. 子页面 404 问题 ✅

**问题描述**:
- 首页可以正常访问
- 从首页导航到子页面（如 `/about`）正常
- 直接访问子页面或刷新子页面时出现 404 错误

**根本原因**:
React Router 使用 History 模式，而 GitHub Pages 和 Vercel 默认情况下对未知路径返回 404，而不是返回 `index.html` 让前端路由处理。

**解决方案**:
- **GitHub Pages**: 使用 `404.html` 配合 `sessionStorage` 重定向方案
  - 保存当前路径到 sessionStorage
  - 重定向到首页并恢复原始路径
  
- **Vercel**: 使用 `vercel.json` 配置路由重写规则
  - 所有未知路径都指向 `index.html`
  - 静态资源优先从文件系统获取

**修改文件**:
- `404.html` - 重定向逻辑优化
- `vercel.json` - 添加路由配置
- `index.html` - 处理重定向回来的逻辑

---

### 2. 图片显示路径问题 ✅

**问题描述**:
- 子页面（如 `/about`）中的图片无法显示
- 浏览器控制台报 404 错误

**根本原因**:
- 图片路径使用绝对路径 `/visityunfu/images/...`
- 在 Vercel 上此路径不存在导致 404
- 使用相对路径 `images/...` 时，子页面会错误解析为 `/about/images/...`

**解决方案**:
- **步骤 1**: 修改 `assets/index-DRhF-XhE.js`，将所有图片路径从 `/visityunfu/images/` 改为相对路径 `images/`
- **步骤 2**: 在 `index.html` 中添加动态 `<base>` 标签
  ```javascript
  (function() {
    var path = window.location.pathname;
    var base = document.createElement('base');
    if (path.indexOf('/visityunfu') === 0) {
      base.href = '/visityunfu/';
    } else {
      base.href = '/';
    }
    document.head.appendChild(base);
  })();
  ```

**修改文件**:
- `index.html` - 添加动态 base 标签
- `assets/index-DRhF-XhE.js` - 175 处图片路径改为相对路径

---

## 📁 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|---------|------|
| `404.html` | 重写 | SPA 重定向逻辑，支持 GitHub Pages |
| `index.html` | 修改 | 添加动态 base 标签和重定向处理 |
| `vercel.json` | 修改 | 添加路由重写规则 |
| `assets/index-DRhF-XhE.js` | 修改 | 175 处图片路径改为相对路径 |

---

## 🚀 部署平台支持

| 平台 | 状态 | 访问地址 |
|------|------|---------|
| GitHub Pages | ✅ 已修复 | https://makermingone.github.io/visityunfu/ |
| Vercel | ✅ 已修复 | （自动部署） |

---

## ✅ 验证清单

### GitHub Pages 测试
- [x] 首页正常访问
- [x] 点击导航到子页面正常
- [x] 直接访问子页面不 404
- [x] 刷新子页面不 404
- [x] 子页面图片正常显示

### Vercel 测试
- [x] 首页正常访问
- [x] 点击导航到子页面正常
- [x] 直接访问子页面不 404
- [x] 刷新子页面不 404
- [x] 子页面图片正常显示

---

## 📌 技术要点总结

### SPA 404 修复原理
1. 用户访问 `/about`
2. GitHub Pages 返回 `404.html`
3. `404.html` 保存当前路径到 `sessionStorage`
4. 重定向到首页 `/?redirect=/about`
5. `index.html` 读取 `sessionStorage` 并恢复 URL
6. React Router 接管渲染 `/about` 页面

### 图片路径修复原理
1. 动态检测当前域名（是否包含 `/visityunfu`）
2. 自动设置 `<base>` 标签
3. 相对路径 `images/xxx.jpg` 自动拼接为正确绝对路径
4. GitHub Pages: `/visityunfu/images/xxx.jpg`
5. Vercel: `/images/xxx.jpg`

---

## 🙏 致谢

感谢使用 Visit Yunfu 云浮文旅网站！如有问题欢迎提交 Issue。

---

**完整变更对比**: [v1.0...v2.0](https://github.com/MakermingOne/visityunfu/compare/v1.0...v2.0)
