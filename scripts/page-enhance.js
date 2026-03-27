/**
 * 首页增强脚本 - 仅在首页执行
 * 1. 交通网络简化 -> 查看详细地图按钮
 * 2. 显示五个区县卡片
 */
(function() {
  'use strict';
  
  const path = window.location.pathname;
  const isHomePage = path === '/' || path === '/visityunfu/' || path === '/visityunfu' || path === '';
  
  if (!isHomePage) return;
  
  const lang = localStorage.getItem('language') || 'zh';
  const isZh = lang === 'zh';
  
  const DISTRICTS = {
    yuncheng: { name: '云城区', nameEn: 'Yuncheng', color: '#d97706', bg: './images/scenic/chanyu-town.jpg' },
    yunanqu: { name: '云安区', nameEn: "Yun'an", color: '#8b5cf6', bg: './images/culture/stone-mountain.jpg' },
    xinxing: { name: '新兴县', nameEn: 'Xinxing', color: '#10b981', bg: './images/scenic/guoen-temple.jpg' },
    luoding: { name: '罗定市', nameEn: 'Luoding', color: '#06b6d4', bg: './images/scenic/changgangpo.jpg' },
    yunan: { name: '郁南县', nameEn: 'Yunan', color: '#f43f5e', bg: './images/scenic/lanzhai-village.jpg' }
  };
  
  // 统一的按钮样式
  const buttonStyle = `
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
    transition: all 0.3s ease;
    text-decoration: none;
  `;
  
  // 1. 简化交通网络 - 统一格式按钮
  function initTransport() {
    document.querySelectorAll('.transport-section, [class*="transport-section"]').forEach(el => {
      el.innerHTML = `
        <div style="text-align: center; padding: 24px 0;">
          <button onclick="window.location.href='/geography'" 
                  style="${buttonStyle}"
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(217, 119, 6, 0.4)'"
                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(217, 119, 6, 0.3)'">
            <span>${isZh ? '查看详细地图' : 'View Map Details'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      `;
    });
  }
  
  // 2. 首页显示五个区县卡片 - 全局标记确保只执行一次
  let districtsAdded = false;
  
  function initDistricts() {
    // 如果已经添加过，直接返回
    if (districtsAdded || document.querySelector('.home-districts-grid')) return;
    
    // 查找概览区域或合适位置 - 优先查找概览 section
    let targetSection = null;
    const sections = document.querySelectorAll('section, [class*="overview"], [class*="districts"]');
    
    // 先尝试找到明确的概览区域
    for (const section of sections) {
      const text = section.textContent;
      const className = section.className || '';
      // 优先匹配概览/Overview 区域
      if ((className.toLowerCase().includes('overview') || text.includes('概览')) && 
          (text.includes('各区县') || text.includes('Districts') || text.includes('云城区'))) {
        targetSection = section;
        break;
      }
    }
    
    // 如果没找到，再找包含区县信息的第一个 section
    if (!targetSection) {
      for (const section of sections) {
        const text = section.textContent;
        if (text.includes('各区县') || text.includes('Districts') || 
            text.includes('云城区') || text.includes('yuncheng')) {
          targetSection = section;
          break;
        }
      }
    }
    
    if (!targetSection) return;
    
    let html = '';
      Object.values(DISTRICTS).forEach(d => {
        const name = isZh ? d.name : d.nameEn;
        html += `
          <div class="district-card" style="
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            min-height: 140px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          " onmouseenter="this.querySelector('.district-bg').style.transform='scale(1.08)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'" 
             onmouseleave="this.querySelector('.district-bg').style.transform='scale(1)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'">
            <div class="district-bg" style="
              position: absolute;
              inset: 0;
              background: url('${d.bg}') center/cover;
              transition: transform 0.5s ease;
            "></div>
            <div style="
              position: absolute;
              inset: 0;
              background: linear-gradient(180deg, transparent 0%, ${d.color}dd 100%);
            "></div>
            <div style="
              position: relative;
              z-index: 1;
              padding: 16px;
              height: 100%;
              min-height: 140px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              color: white;
            ">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                <h4 style="font-size: 16px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin: 0;">${name}</h4>
              </div>
            </div>
          </div>
        `;
      });
      
      // 创建或更新区县网格
      const grid = targetSection.querySelector('[class*="grid"]') || targetSection;
      if (grid) {
        const wrapper = document.createElement('div');
        wrapper.className = 'home-districts-grid';
        wrapper.innerHTML = `
          <h3 style="text-align: center; font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px;">
            ${isZh ? '云浮市各区县' : 'Districts of Yunfu'}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;" class="districts-grid-container">
            ${html}
          </div>
        `;
        
        // 替换或追加
        if (grid.children.length > 0) {
          grid.appendChild(wrapper);
        } else {
          grid.innerHTML = wrapper.outerHTML;
        }
        
        // 响应式 - 优化卡片比例
        const style = document.createElement('style');
        style.textContent = `
          .districts-grid-container { 
            grid-template-columns: repeat(5, 1fr) !important;
            gap: 16px !important;
          }
          .district-card { 
            aspect-ratio: 4/3 !important;
            min-height: auto !important;
          }
          @media(max-width: 1200px) { 
            .districts-grid-container { grid-template-columns: repeat(5, 1fr) !important; gap: 14px !important; } 
          }
          @media(max-width: 1024px) { 
            .districts-grid-container { grid-template-columns: repeat(3, 1fr) !important; gap: 12px !important; } 
          }
          @media(max-width: 768px) { 
            .districts-grid-container { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; } 
            .district-card { aspect-ratio: 16/9 !important; }
          }
          @media(max-width: 480px) { 
            .districts-grid-container { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; } 
            .district-card { aspect-ratio: 3/2 !important; }
          }
        `;
        document.head.appendChild(style);
        
        // 标记已添加
        districtsAdded = true;
      }
  }
  
  // 执行
  setTimeout(() => {
    initTransport();
    initDistricts();
  }, 600);
})();
