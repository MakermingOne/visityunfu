/**
 * 首页增强脚本 - 仅在首页执行
 */
(function() {
  'use strict';
  
  // 只在首页执行
  const path = window.location.pathname;
  const isHomePage = path === '/' || path === '/visityunfu/' || path === '/visityunfu' || path === '';
  
  if (!isHomePage) {
    console.log('[PageEnhance] Not homepage, skipping');
    return;
  }
  
  console.log('[PageEnhance] Homepage detected, initializing...');
  
  // 区县配置
  const DISTRICTS = {
    yuncheng: { name: '云城区', nameEn: 'Yuncheng', color: '#d97706', bg: './images/scenic/chanyu-town.jpg' },
    yunanqu: { name: '云安区', nameEn: "Yun'an", color: '#8b5cf6', bg: './images/culture/stone-mountain.jpg' },
    xinxing: { name: '新兴县', nameEn: 'Xinxing', color: '#10b981', bg: './images/scenic/guoen-temple.jpg' },
    luoding: { name: '罗定市', nameEn: 'Luoding', color: '#06b6d4', bg: './images/scenic/changgangpo.jpg' },
    yunan: { name: '郁南县', nameEn: 'Yunan', color: '#f43f5e', bg: './images/scenic/lanzhai-village.jpg' }
  };
  
  const lang = localStorage.getItem('language') || 'zh';
  const isZh = lang === 'zh';
  
  // 简化交通网络 - 只保留按钮
  function initTransport() {
    document.querySelectorAll('.transport-section, [class*="transport-section"]').forEach(el => {
      el.innerHTML = `
        <div style="text-align:center;padding:20px 0;">
          <button onclick="window.location.href='/geography'" 
                  style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg,#d97706 0%,#f59e0b 100%);color:white;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;box-shadow:0 4px 12px rgba(217,119,6,0.3);transition:all 0.3s;"
                  onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(217,119,6,0.4)'"
                  onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(217,119,6,0.3)'">
            <span>${isZh ? '查看详细地图' : 'View Map Details'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      `;
    });
  }
  
  // 美化区县卡片
  function initDistricts() {
    document.querySelectorAll('[class*="grid-cols-"]').forEach(grid => {
      // 检查是否是区县网格
      if (!grid.textContent.includes('云城区') && !grid.textContent.includes('yuncheng')) return;
      
      let html = '';
      Object.values(DISTRICTS).forEach(d => {
        const name = isZh ? d.name : d.nameEn;
        html += `
          <div style="position:relative;border-radius:12px;overflow:hidden;min-height:140px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.1);transition:transform 0.3s,box-shadow 0.3s;" 
               onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'" 
               onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'">
            <div style="position:absolute;inset:0;background:url('${d.bg}') center/cover;transition:transform 0.5s;"
                 onmouseover="this.style.transform='scale(1.08)'"></div>
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,${d.color}dd 100%);"></div>
            <div style="position:relative;z-index:1;padding:16px;height:100%;min-height:140px;display:flex;flex-direction:column;justify-content:flex-end;color:white;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="width:10px;height:10px;border-radius:50%;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></span>
                <h4 style="font-size:16px;font-weight:700;text-shadow:0 2px 4px rgba(0,0,0,0.3);margin:0;">${name}</h4>
              </div>
            </div>
          </div>
        `;
      });
      
      const parent = grid.parentElement;
      if (parent) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
          <h3 style="text-align:center;font-size:20px;font-weight:700;color:#1a1a1a;margin-bottom:16px;">${isZh ? '各区县概况' : 'Districts Overview'}</h3>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;" class="districts-grid">${html}</div>
        `;
        parent.replaceChild(wrapper, grid);
        
        // 响应式
        const style = document.createElement('style');
        style.textContent = `
          @media(max-width:1024px){.districts-grid{grid-template-columns:repeat(3,1fr)!important}}
          @media(max-width:768px){.districts-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}}
          @media(max-width:768px){.districts-grid>div{min-height:100px!important}}
          @media(max-width:768px){.districts-grid h3{font-size:18px!important}}
        `;
        document.head.appendChild(style);
      }
    });
  }
  
  // 执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => { initTransport(); initDistricts(); }, 500);
    });
  } else {
    setTimeout(() => { initTransport(); initDistricts(); }, 500);
  }
})();
