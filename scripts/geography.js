/**
 * 地理交通页面增强脚本 - 显示五个区县卡片
 */
(function() {
  'use strict';
  
  const path = window.location.pathname;
  const isGeographyPage = path.includes('/geography');
  
  if (!isGeographyPage) return;
  
  const lang = localStorage.getItem('language') || 'zh';
  const isZh = lang === 'zh';
  
  const DISTRICTS = {
    yuncheng: { name: '云城区', nameEn: 'Yuncheng', color: '#d97706', bg: './images/scenic/chanyu-town-new.jpg', desc: '中国石都核心', descEn: 'Stone Capital' },
    yunanqu: { name: '云安区', nameEn: "Yun'an", color: '#8b5cf6', bg: './images/culture/stone-mountain.jpg', desc: '中国硫都', descEn: 'Sulfur Capital' },
    xinxing: { name: '新兴县', nameEn: 'Xinxing', color: '#10b981', bg: './images/scenic/guoen-temple2.jpg', desc: '六祖故里', descEn: 'Huineng Hometown' },
    luoding: { name: '罗定市', nameEn: 'Luoding', color: '#06b6d4', bg: './images/scenic/changgangpo-new.jpg', desc: '历史文化名城', descEn: 'Historic City' },
    yunan: { name: '郁南县', nameEn: 'Yunan', color: '#f43f5e', bg: './images/scenic/lanzhai2.jpg', desc: '无核黄皮之乡', descEn: 'Wampee Hometown' }
  };
  
  function addDistrictCards() {
    // 查找是否已有区县section，有则替换，无则创建
    let existingSection = null;
    const sections = document.querySelectorAll('section, [class*="districts"], [class*="overview"]');
    
    for (const section of sections) {
      const text = section.textContent;
      if (text.includes('各区县') || text.includes('Districts') || text.includes('各区县概况')) {
        existingSection = section;
        break;
      }
    }
    
    // 如果找到原有section，清空它并用新内容替换
    if (existingSection) {
      existingSection.innerHTML = '';
      existingSection.style.cssText = 'padding: 40px 20px; max-width: 1200px; margin: 0 auto;';
    }
    
    const container = existingSection || document.querySelector('#root');
    if (!container) return;
    
    let html = '';
    Object.values(DISTRICTS).forEach(d => {
      const name = isZh ? d.name : d.nameEn;
      const desc = isZh ? d.desc : d.descEn;
      
      html += `
        <div style="
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          min-height: 200px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        " onmouseenter="this.querySelector('.geo-bg').style.transform='scale(1.08)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'" 
           onmouseleave="this.querySelector('.geo-bg').style.transform='scale(1)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'">
          <div class="geo-bg" style="
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
            padding: 20px;
            height: 100%;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            color: white;
          ">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
              <h4 style="font-size: 18px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin: 0;">${name}</h4>
            </div>
            <p style="font-size: 13px; opacity: 0.9; margin: 0;">${desc}</p>
          </div>
        </div>
      `;
    });
    
    const section = document.createElement('div');
    section.style.cssText = 'padding: 40px 20px; max-width: 1200px; margin: 0 auto;';
    section.innerHTML = `
      <h2 style="text-align: center; font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 24px;">
        ${isZh ? '云浮市各区县' : 'Districts of Yunfu'}
      </h2>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;" class="geo-grid">
        ${html}
      </div>
    `;
    
    // 如果是替换原有section，直接append到container；否则append到#root
    if (existingSection) {
      container.appendChild(section);
    } else {
      container.appendChild(section);
    }
    
    // 响应式
    const style = document.createElement('style');
    style.textContent = `
      @media(max-width: 1024px) { .geo-grid { grid-template-columns: repeat(3, 1fr) !important; } }
      @media(max-width: 768px) { .geo-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
      @media(max-width: 768px) { .geo-grid > div { min-height: 160px !important; } }
      @media(max-width: 768px) { .geo-grid p { display: none !important; } }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(addDistrictCards, 800);
})();
