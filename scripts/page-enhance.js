/**
 * 页面增强脚本
 * 1. 首页交通网络简化 - 仅保留"查看详细地图"按钮
 * 2. 各区县卡片美化 - 不同颜色+地标背景
 * 3. 手机端排版优化 - 各区县简略显示
 */
(function() {
  'use strict';
  
  // 区县配置 - 颜色、背景图、描述
  const DISTRICTS_CONFIG = {
    yuncheng: {
      name: '云城区',
      nameEn: 'Yuncheng',
      color: '#d97706',
      bgImage: './images/scenic/chanyu-town.jpg',
      desc: '中国石都核心 · 禅域小镇',
      descEn: 'Stone Capital · Zen Town'
    },
    yunanqu: {
      name: '云安区', 
      nameEn: "Yun'an",
      color: '#8b5cf6',
      bgImage: './images/culture/stone-mountain.jpg',
      desc: '中国硫都 · 绿色建材',
      descEn: 'Sulfur Capital · Green Building'
    },
    xinxing: {
      name: '新兴县',
      nameEn: 'Xinxing', 
      color: '#10b981',
      bgImage: './images/scenic/guoen-temple.jpg',
      desc: '六祖故里 · 禅茶温泉',
      descEn: 'Huineng Hometown · Zen Tea'
    },
    luoding: {
      name: '罗定市',
      nameEn: 'Luoding',
      color: '#06b6d4', 
      bgImage: './images/scenic/changgangpo.jpg',
      desc: '历史文化名城 · 长岗坡',
      descEn: 'Historic City · Aqueduct'
    },
    yunan: {
      name: '郁南县',
      nameEn: 'Yunan',
      color: '#f43f5e',
      bgImage: './images/scenic/lanzhai-village.jpg',
      desc: '无核黄皮之乡 · 南江文化',
      descEn: 'Wampee Hometown · Nanjiang Culture'
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

  // 1. 简化首页交通网络
  function simplifyTransport() {
    // 查找交通网络区块
    const transportSelectors = [
      '.transport-section',
      '[class*="transport-section"]',
      '[class*="Transport"]'
    ];
    
    transportSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(section => {
        const lang = getLang();
        const isZh = lang === 'zh';
        
        // 保留容器但替换内容为简化版
        const wrapper = document.createElement('div');
        wrapper.className = 'transport-simplified bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 text-center my-8';
        wrapper.innerHTML = `
          <h3 class="text-2xl font-bold text-gray-900 mb-3">${isZh ? '交通网络' : 'Transportation'}</h3>
          <p class="text-gray-600 mb-6 max-w-lg mx-auto">${isZh 
            ? '南广高铁贯穿全境，1小时直达广州、南宁。多条高速交汇，交通便捷。' 
            : 'High-speed rail connecting Guangzhou and Nanning in 1 hour. Multiple highways intersect.'}</p>
          <a href="${isZh ? '/geography' : '/geography'}" 
             class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
             onclick="window.navigateTo && window.navigateTo('/geography');return false;">
            <span>${isZh ? '查看详细地图' : 'View Map Details'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
          .transport-simplified { transition: transform 0.3s ease; }
          .transport-simplified:hover { transform: translateY(-2px); }
        `;
        document.head.appendChild(style);
        
        section.parentNode.replaceChild(wrapper, section);
      });
    });
  }

  // 2. 美化各区县卡片
  function beautifyDistricts() {
    // 查找区县网格
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
        const desc = isZh ? district.desc : district.descEn;
        
        cardsHTML += `
          <div class="district-card-enhanced" style="
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            min-height: 180px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          " onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'" 
             onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'">
            <div style="
              position: absolute;
              inset: 0;
              background-image: url('${district.bgImage}');
              background-size: cover;
              background-position: center;
              transition: transform 0.5s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"></div>
            <div style="
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, ${district.color}40 0%, ${district.color}90 100%);
            "></div>
            <div style="
              position: relative;
              z-index: 1;
              padding: 20px;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              color: white;
            ">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="width:12px;height:12px;border-radius:50%;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></span>
                <h4 style="font-size:18px;font-weight:700;text-shadow:0 2px 4px rgba(0,0,0,0.3);">${name}</h4>
              </div>
              <p style="font-size:13px;opacity:0.95;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${desc}</p>
            </div>
          </div>
        `;
      });
      
      // 替换网格内容
      const parent = grid.parentElement;
      if (parent && cardsHTML) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
          <h3 style="text-align:center;font-size:24px;font-weight:700;color:#1a1a1a;margin-bottom:24px;">
            ${isZh ? '各区县概况' : 'Districts Overview'}
          </h3>
          <div class="districts-grid-enhanced" style="
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
          ">${cardsHTML}</div>
        `;
        parent.replaceChild(wrapper, grid);
        
        // 添加移动端响应式样式
        const style = document.createElement('style');
        style.textContent = `
          @media (max-width: 1024px) {
            .districts-grid-enhanced { grid-template-columns: repeat(3, 1fr) !important; }
          }
          @media (max-width: 768px) {
            .districts-grid-enhanced { grid-template-columns: repeat(2, 1fr) !important; }
            .district-card-enhanced { min-height: 120px !important; }
            .district-card-enhanced p { display: none !important; } /* 移动端隐藏描述 */
          }
          @media (max-width: 480px) {
            .districts-grid-enhanced { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
            .district-card-enhanced { min-height: 100px !important; border-radius: 12px !important; }
            .district-card-enhanced > div:last-child { padding: 12px !important; }
            .district-card-enhanced h4 { font-size: 14px !important; }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  // 3. 移动端优化 - 各区县简略显示
  function mobileOptimize() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // 为区县卡片添加移动端简略样式
      document.querySelectorAll('.district-card-enhanced').forEach(card => {
        const desc = card.querySelector('p');
        if (desc) {
          desc.style.display = 'none'; // 隐藏详细描述
        }
        card.style.minHeight = '100px';
      });
    }
  }

  // 初始化
  function init() {
    console.log('[PageEnhance] Initializing...');
    
    // 延迟执行，等待React渲染
    setTimeout(() => {
      simplifyTransport();
      beautifyDistricts();
      mobileOptimize();
    }, 800);
    
    // 监听窗口变化
    window.addEventListener('resize', () => {
      mobileOptimize();
    });
    
    // 监听路由变化（简化版）
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
  
  // 暴露 API
  window.PageEnhance = {
    refresh: function() {
      simplifyTransport();
      beautifyDistricts();
    }
  };
})();
