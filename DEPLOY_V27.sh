#!/bin/bash
# 使用 V27 编译版本（功能最完善）

echo "1. 备份当前版本..."
cp assets/index-DRhF-XhE.js assets/index-DRhF-XhE.js.v23
cp assets/index-DWFOa5Ul.css assets/index-DWFOa5Ul.css.v23

echo "2. 复制 V27 最新编译版本..."
cp /Users/mingwen/v27_check/app/dist/assets/index-CGw2pFWM.js assets/index-DRhF-XhE.js
cp /Users/mingwen/v27_check/app/dist/assets/index-Cf6qasZl.css assets/index-DWFOa5Ul.css

echo "3. 修复路径为 GitHub Pages 兼容..."
# V27 使用相对路径 ./assets/，需要改为绝对路径
sed -i '' 's|"./assets/|"/visityunfu/assets/|g' assets/index-DRhF-XhE.js
sed -i '' 's|"./|"/visityunfu/|g' assets/index-DRhF-XhE.js

echo "4. 更新 index.html 标题..."
sed -i '' 's|<title>.*</title>|<title>Visit Yunfu - 云浮文旅</title>|' index.html

echo "5. 提交更改..."
git add -A
git commit -m "deploy: 使用 V27 完整版本

- 17个美食（完整版）
- 双语支持完善
- 详情页组件完整
- 修复 GitHub Pages 路径"
git push origin main

echo "完成！"
