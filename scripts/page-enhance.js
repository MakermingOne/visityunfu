/**
 * 页面增强脚本
 * 1. 首页交通网络简化 - 仅保留"查看详细地图"按钮
 * 2. 各区县卡片美化 - 地标特色背景图
 * 3. 手机端排版优化 - 各区县简略显示
 */
(function() {
  'use strict';
  
  // 区县配置 - 颜色、背景图
  const DISTRICTS_CONFIG = {
    yuncheng: {
      name: '云城区',
      nameEn: 'Yuncheng',
      color: '#d97706',
      bgImage: './images/scenic/chanyu-town.jpg'
    },
    yunanqu: {
      name: '云安区', 
      nameEn: "Yun'an",
      color: '#8b5cf6',
      bgImage: './images/culture/stone-mountain.jpg'
    },
    xinxing: {
      name: '新兴县',
      nameEn: 'Xinxing', 
      color: '#10b981',
      bgImage: './images/scenic/guoen-temple.jpg'
    },
    luoding: {
      name: '罗定市',
      nameEn: 'Luoding',
      color: '#06b6d4', 
      bgImage: './images/scenic/changgangpo.jpg'
    },
    yunan: {
      name: '郁南县',
      nameEn: 'Yunan',
      color: '#f43f5e',
      bgImage: './images/scenic/lanzhai-village.jpg'
    }
  };

  // 获取当前语言
  function getLang() {
    return localStorage.getItem('language') || 'zh';
  }

  // 等待元素出现
  function waitForElement(selector, callback, maxAttempts = 50) {
    let attempts = 0;
    const check = () => {
      const el = typeof selector === 'string' 
        ? document.querySelector(selector)
        : document.querySelectorAll(selector)[0];
      if (el) {
        callback(el);
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(check, 100);
      }
    };
    check();
  }

  // 1. 简化首页交通网络 - 只保留"查看详细地图"按钮
  function simplifyTransport() {
    const transportSelectors = [
      '.transport-section',
      '[class*="transport-section"]',
      '[class*="Transport"]'
    ];
    
    transportSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(section => {
        const lang = getLang();
        const isZh = lang === 'zh';
        
        // 只保留按钮，去掉标题和描述
        const wrapper = document.createElement('div');
        wrapper.className = 'transport-simple';
        wrapper.style.cssText = 'text-align: center; padding: 24px 0;';
        wrapper.innerHTML = `
          <a href="/geography" 
             style="
               display: inline-flex;
               align-items: center;
               gap: 8px;
               padding: 14px 28px;
               background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
               color: white;
               text-decoration: none;
               border-radius: 8px;
               font-weight: 500;
               font-size: 15px;
               transition: all 0.3s ease;
               box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
             "
             onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(217, 119, 6, 0.4)'"
             onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(217, 119, 6, 0.3)'"
             onclick="window.navigateTo && window.navigateTo('/geography');return false;">
            <span>${isZh ? '查看详细地图' : 'View Map Details'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        `;
        
        section.parentNode.replaceChild(wrapper, section);
      });
    });
  }

  // 2. 美化各区县卡片 - 使用地标特色背景图
  function beautifyDistricts() {
    waitForElement('[class*="grid-cols-"]', (grid) => {
      // 检查是否是区县网格
      const html = grid.innerHTML;
      const isDistrictGrid = html.includes('云城区') || html.includes('yuncheng') || 
                            html.includes('z4') || html.includes('Districts');
      
      if (!isDistrictGrid) return;
      
      const lang = getLang();
      const isZh = lang === 'zh';
      
      // 创建新的美化卡片HTML
      let cardsHTML = '';
      Object.entries(DISTRICTS_CONFIG).forEach(([key, district]) => {
        const name = isZh ? district.name : district.nameEn;
        
        cardsHTML += `
          <div class="district-card" style="
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            min-height: 160px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          ">
            <!-- 背景图 -->
            <div style="
              position: absolute;
              inset: 0;
              background-image: url('${district.bgImage}');
              background-size: cover;
              background-position: center;
              transition: transform 0.5s ease;
            " class="district-bg"></div>
            
            <!-- 渐变遮罩 -->
            <div style="
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, transparent 0%, ${district.color}dd 100%);
            "></div>
            
            <!-- 内容 -->
            <div style="
              position: relative;
              z-index: 1;
              padding: 16px;
              height: 100%;
              min-height: 160px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              color: white;
            ">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="width:10px;height:10px;border-radius:50%;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></span>
                <h4 style="font-size:16px;font-weight:700;text-shadow:0 2px 4px rgba(0,0,0,0.3);margin:0;">${name}</h4>
              </div>
            </div>
          </div>
        `;
      });
      
      // 替换网格内容
      const parent = grid.parentElement;
      if (parent && cardsHTML) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
          <h3 style="text-align:center;font-size:22px;font-weight:700;color:#1a1a1a;margin-bottom:20px;">
            ${isZh ? '各区县概况' : 'Districts Overview'}
          </h3>
          <div class="districts-grid" style="
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
          ">${cardsHTML}</div>
        `;
        parent.replaceChild(wrapper, grid);
        
        // 添加悬停效果和响应式样式
        const style = document.createElement('style');
        style.textContent = `
          .district-card:hover .district-bg { transform: scale(1.08); }
          .district-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .district-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
          
          /* 平板 */
          @media (max-width: 1024px) {
            .districts-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
          /* 手机 */
          @media (max-width: 768px) {
            .districts-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
            .district-card { min-height: 100px !important; border-radius: 12px !important; }
            .district-card > div:last-child { min-height: 100px !important; padding: 12px !important; }
            .districts-grid h3 { font-size: 18px !important; margin-bottom: 12px !important; }
          }
        `;
        document.head.appendChild(style);
        
        // 绑定悬停事件（内联样式无法处理伪类）
        setTimeout(() => {
          document.querySelectorAll('.district-card').forEach(card => {
            const bg = card.querySelector('.district-bg');
            if (bg) {
              card.addEventListener('mouseenter', () => bg.style.transform = 'scale(1.08)');
              card.addEventListener('mouseleave', () => bg.style.transform = 'scale(1)');
            }
          });
        }, 100);
      }
    });
  }

  // 初始化
  function init() {
    console.log('[PageEnhance] Initializing...');
    
    setTimeout(() => {
      simplifyTransport();
      beautifyDistricts();
    }, 600);
    
    // 监听路由变化
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(() => {
        simplifyTransport();
        beautifyDistricts();
      }, 300);
    };
  }

  // DOM 就绪
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
