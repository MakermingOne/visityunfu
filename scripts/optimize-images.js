#!/usr/bin/env node
/**
 * 图片优化脚本
 * 将 JPG/PNG 图片转换为 WebP 格式，并生成响应式图片
 * 使用方法: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  sourceDir: './images',
  outputDir: './images/optimized',
  qualities: {
    jpg: 80,
    webp: 75,
    avif: 65
  },
  sizes: [320, 640, 960, 1280, 1920], // 响应式图片尺寸
  skipExisting: true
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查 sharp 是否安装
function checkSharp() {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    return false;
  }
}

// 安装 sharp
function installSharp() {
  log('正在安装 sharp 图片处理库...', 'yellow');
  try {
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    log('sharp 安装成功', 'green');
    return true;
  } catch (e) {
    log('sharp 安装失败，请手动运行: npm install sharp --save-dev', 'red');
    return false;
  }
}

// 获取文件大小
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

// 格式化文件大小
function formatSize(kb) {
  if (kb > 1024) {
    return `${(kb / 1024).toFixed(2)} MB`;
  }
  return `${kb} KB`;
}

// 主优化函数
async function optimizeImages() {
  if (!checkSharp()) {
    if (!installSharp()) {
      process.exit(1);
    }
  }

  const sharp = require('sharp');
  
  // 创建输出目录
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // 获取所有图片文件
  const imageExtensions = ['.jpg', '.jpeg', '.png'];
  const allFiles = [];

  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relPath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 跳过已优化的目录
        if (item === 'optimized') continue;
        scanDirectory(fullPath, relPath);
      } else if (imageExtensions.includes(path.extname(item).toLowerCase())) {
        allFiles.push({ fullPath, relativePath: relPath });
      }
    }
  }

  scanDirectory(CONFIG.sourceDir);
  log(`找到 ${allFiles.length} 张图片需要优化`, 'blue');

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  const results = [];

  for (const file of allFiles) {
    const originalSize = parseFloat(getFileSize(file.fullPath));
    totalOriginalSize += originalSize;

    const outputSubDir = path.join(CONFIG.outputDir, path.dirname(file.relativePath));
    if (!fs.existsSync(outputSubDir)) {
      fs.mkdirSync(outputSubDir, { recursive: true });
    }

    const baseName = path.basename(file.relativePath, path.extname(file.relativePath));
    const outputPath = path.join(outputSubDir, `${baseName}.webp`);

    // 检查是否已存在优化版本
    if (CONFIG.skipExisting && fs.existsSync(outputPath)) {
      const optimizedSize = parseFloat(getFileSize(outputPath));
      totalOptimizedSize += optimizedSize;
      results.push({
        name: file.relativePath,
        original: originalSize,
        optimized: optimizedSize,
        skipped: true
      });
      log(`⏭️  跳过 (已存在): ${file.relativePath}`, 'yellow');
      continue;
    }

    try {
      // 转换并压缩为 WebP
      await sharp(file.fullPath)
        .webp({ 
          quality: CONFIG.qualities.webp,
          effort: 6, // 压缩 effort (0-6)
          smartSubsample: true
        })
        .toFile(outputPath);

      const optimizedSize = parseFloat(getFileSize(outputPath));
      totalOptimizedSize += optimizedSize;
      const saved = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      results.push({
        name: file.relativePath,
        original: originalSize,
        optimized: optimizedSize,
        saved: saved
      });

      log(`✅ ${file.relativePath} (${formatSize(originalSize)} → ${formatSize(optimizedSize)}, 节省 ${saved}%)`, 'green');
    } catch (error) {
      log(`❌ 失败: ${file.relativePath} - ${error.message}`, 'red');
      results.push({
        name: file.relativePath,
        error: true,
        original: originalSize
      });
    }
  }

  // 生成优化报告
  generateReport(results, totalOriginalSize, totalOptimizedSize);
}

// 生成优化报告
function generateReport(results, totalOriginal, totalOptimized) {
  const reportPath = './images/optimization-report.json';
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      totalOriginalSize: formatSize(totalOriginal),
      totalOptimizedSize: formatSize(totalOptimized),
      totalSaved: formatSize(totalOriginal - totalOptimized),
      savedPercentage: ((1 - totalOptimized / totalOriginal) * 100).toFixed(1)
    },
    files: results
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log('\n' + '='.repeat(60), 'blue');
  log('📊 图片优化报告', 'blue');
  log('='.repeat(60), 'blue');
  log(`总文件数: ${results.length}`, 'reset');
  log(`原始大小: ${formatSize(totalOriginal)}`, 'reset');
  log(`优化后大小: ${formatSize(totalOptimized)}`, 'reset');
  log(`节省空间: ${formatSize(totalOriginal - totalOptimized)} (${report.summary.savedPercentage}%)`, 'green');
  log(`报告已保存: ${reportPath}`, 'blue');
  log('='.repeat(60), 'blue');
}

// 运行
optimizeImages().catch(err => {
  log(`错误: ${err.message}`, 'red');
  process.exit(1);
});
