#!/bin/bash
# 云浮文旅网站一键部署脚本

echo "🚀 云浮文旅网站部署脚本"
echo "========================"

# 检查分支
echo ""
echo "📋 当前分支: $(git branch --show-current)"
echo ""

# 选择部署方式
echo "请选择部署方式:"
echo "1) Vercel (推荐，全球访问快)"
echo "2) Netlify (简单拖拽)"
echo "3) GitHub Pages (当前方式)"
echo "4) 打包下载 (用于其他平台)"
echo ""
read -p "输入选项 (1-4): " choice

case $choice in
  1)
    echo ""
    echo "📦 部署到 Vercel..."
    
    # 检查是否安装 Vercel CLI
    if ! command -v vercel &> /dev/null; then
      echo "正在安装 Vercel CLI..."
      npm install -g vercel
    fi
    
    # 部署
    vercel --prod
    echo "✅ 部署完成！"
    ;;
    
  2)
    echo ""
    echo "📦 部署到 Netlify..."
    
    # 检查是否安装 Netlify CLI
    if ! command -v netlify &> /dev/null; then
      echo "正在安装 Netlify CLI..."
      npm install -g netlify-cli
    fi
    
    # 部署
    netlify deploy --prod --dir=.
    echo "✅ 部署完成！"
    ;;
    
  3)
    echo ""
    echo "📦 推送到 GitHub Pages..."
    
    # 确保在 main 分支
    if [ "$(git branch --show-current)" != "main" ]; then
      echo "切换到 main 分支..."
      git checkout main
    fi
    
    # 提交更改
    git add -A
    git commit -m "update: 更新网站内容 $(date +%Y-%m-%d)" || echo "无更改需要提交"
    git push origin main
    
    echo ""
    echo "✅ 已推送到 GitHub"
    echo "🌐 访问地址: https://makermingone.github.io/visityunfu/"
    echo "⏱️  等待 2-3 分钟后刷新"
    ;;
    
  4)
    echo ""
    echo "📦 打包网站..."
    
    # 创建打包目录
    mkdir -p dist
    cp -r assets dist/
    cp -r images dist/ 2>/dev/null || echo "无 images 目录"
    cp index.html dist/
    cp 404.html dist/
    
    # 压缩
    zip -r website.zip dist/
    
    echo "✅ 打包完成: website.zip"
    echo "📁 包含文件:"
    ls -lh dist/
    ;;
    
  *)
    echo "❌ 无效选项"
    exit 1
    ;;
esac

echo ""
echo "🎉 完成！"
