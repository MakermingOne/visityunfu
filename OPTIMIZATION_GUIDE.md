# 🚀 图片加载性能优化指南

本文档详细说明了针对 Visit Yunfu 项目的图片加载速度优化方案。

## 📊 问题分析

优化前项目状态：
- **图片总大小**: ~17 MB
- **图片数量**: 71 张
- **最大单张**: 1.7 MB
- **格式**: 全部为 JPG/PNG，未使用现代压缩格式

### 影响性能的主要因素

1. **图片过大**：多张图片超过 500KB，移动端加载缓慢
2. **格式落后**：JPG 压缩效率低于 WebP/AVIF
3. **无懒加载**：所有图片在页面加载时同时请求
4. **无预加载策略**：首屏关键图片没有优先加载

---

## ✅ 已实施的优化

### 1. HTML 层面优化

#### 1.1 DNS 预解析与预连接
```html
<link rel="dns-prefetch" href="https://github.com">
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
```

**效果**: 减少 DNS 查询和连接建立时间。

#### 1.2 关键资源预加载
```html
<link rel="preload" as="image" href="./images/common/hero-1.jpg" fetchpriority="high">
```

**效果**: 首屏 Hero 图片优先加载，提升感知性能。

#### 1.3 关键 CSS 内联
将首屏渲染所需的关键 CSS 直接内联到 HTML 中，避免渲染阻塞。

**效果**: 减少首次内容绘制 (FCP) 时间。

---

### 2. JavaScript 懒加载

实现了 `lazy-load.min.js` 脚本，功能包括：

- **首屏优先加载**：Hero 图片优先获取
- **IntersectionObserver 懒加载**：图片进入视口前不加载
- **加载动画**：骨架屏 + 淡入效果
- **错误处理**：加载失败时显示占位图
- **降级处理**：不支持 IntersectionObserver 的浏览器直接加载

#### 使用方法

在 React/Vue 组件中使用 data-src 属性：

```jsx
// 优化前
<img src="./images/scenic/mountain.jpg" alt="山景" />

// 优化后 - 首屏图片（优先加载）
<img 
  src="./images/scenic/mountain.jpg" 
  alt="山景"
  fetchpriority="high"
/>

// 优化后 - 非首屏图片（懒加载）
<img 
  data-src="./images/food/local-dish.jpg" 
  alt="当地美食"
  className="lazy-image"
/>
```

---

### 3. 图片压缩脚本

提供了 `scripts/optimize-images.js` 用于批量优化图片：

#### 功能
- 将 JPG/PNG 转换为 **WebP** 格式
- 自动压缩，质量设为 75%
- 生成优化报告

#### 使用方法

```bash
# 安装依赖（首次运行）
npm install sharp --save-dev

# 运行优化脚本
node scripts/optimize-images.js
```

#### 预期效果
- 图片体积减少 **60-80%**
- 17MB → 4-7MB（预估）
- 生成 `images/optimized/` 目录存放 WebP 图片

---

## 🛠️ 进一步优化建议

### 阶段一：快速优化（立即实施）

1. **压缩现有图片**
   ```bash
   node scripts/optimize-images.js
   ```

2. **在源代码中使用 WebP**
   ```jsx
   // 使用 picture 标签提供降级方案
   <picture>
     <source srcSet="./images/optimized/hero-1.webp" type="image/webp" />
     <img src="./images/common/hero-1.jpg" alt="云浮风光" />
   </picture>
   ```

3. **配置构建工具自动优化**
   
   **Vite 配置示例** (`vite.config.ts`):
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

   export default defineConfig({
     plugins: [
       react(),
       ViteImageOptimizer({
         png: {
           quality: 80,
         },
         jpeg: {
           quality: 80,
         },
         webp: {
           quality: 75,
         },
       }),
     ],
   });
   ```

### 阶段二：深度优化

1. **响应式图片**
   ```jsx
   <img 
     srcSet="
       ./images/optimized/hero-1-320w.webp 320w,
       ./images/optimized/hero-1-640w.webp 640w,
       ./images/optimized/hero-1-960w.webp 960w,
       ./images/optimized/hero-1-1280w.webp 1280w
     "
     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
     src="./images/optimized/hero-1.webp"
     alt="云浮风光"
   />
   ```

2. **使用 CDN 加速**
   - 将图片托管到 CDN (如 Cloudflare, jsDelivr)
   - 或使用 GitHub raw + CDN 加速

3. **Service Worker 缓存**
   ```javascript
   // 缓存图片资源
   workbox.routing.registerRoute(
     ({ request }) => request.destination === 'image',
     new workbox.strategies.CacheFirst({
       cacheName: 'images',
       plugins: [
         new workbox.expiration.ExpirationPlugin({
           maxEntries: 100,
           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
         }),
       ],
     })
   );
   ```

4. **渐进式 JPEG**
   对于必须使用 JPEG 的场景，使用渐进式 JPEG：
   ```bash
   # 使用 imagemagick 转换
   convert input.jpg -interlace Plane output-progressive.jpg
   ```

### 阶段三：高级优化

1. **AVIF 格式支持**
   WebP 的继任者，压缩率更高：
   ```html
   <picture>
     <source srcSet="image.avif" type="image/avif">
     <source srcSet="image.webp" type="image/webp">
     <img src="image.jpg" alt="描述">
   </picture>
   ```

2. **低质量图片占位 (LQIP)**
   先加载极小模糊图，再加载高清图。

3. **模糊哈希占位 (BlurHash)**
   使用 BlurHash 生成优雅的加载占位图。

---

## 📈 性能指标目标

| 指标 | 优化前 | 目标 |
|------|--------|------|
| 首次内容绘制 (FCP) | ~3s | < 1.5s |
| 最大内容绘制 (LCP) | ~5s | < 2.5s |
| 总图片大小 | 17 MB | < 5 MB |
| Lighthouse 性能分 | ~40 | > 80 |

---

## 🔧 推荐工具

### 图片压缩
- [Squoosh](https://squoosh.app/) - Google 出品，Web 端批量压缩
- [TinyPNG](https://tinypng.com/) - 在线智能压缩
- [ImageOptim](https://imageoptim.com/mac) - Mac 桌面工具

### 构建工具插件
- `vite-plugin-image-optimizer` - Vite 图片优化
- `image-webpack-loader` - Webpack 图片优化
- `next/image` - Next.js 内置优化

---

## 📝 更新记录

### v2.1 - 性能优化更新
- ✅ 添加 DNS 预解析和预连接
- ✅ 实现图片懒加载脚本
- ✅ 添加关键资源预加载
- ✅ 内联关键 CSS
- ✅ 创建图片压缩工具脚本

---

## 🤝 贡献

欢迎提交 PR 进一步优化！重点关注：
- 减小图片体积
- 提升加载速度
- 改善用户体验
