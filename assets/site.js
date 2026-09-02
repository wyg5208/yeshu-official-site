/* ═══════════════════════════════════════════════════════════
   耶数智能官网 · 交互脚本
   - 滚动导航栏状态
   - 移动端菜单
   - IntersectionObserver 淡入
   - Hero 关键数字滚动动画
   - 产品卡跟随鼠标的柔光
   - 平滑锚点跳转（考虑 sticky header 偏移）
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ───────── 滚动导航栏状态切换 ─────────
  const header = document.getElementById('siteHeader');
  const setHeaderState = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  // ───────── 移动端汉堡菜单 ─────────
  const navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      header.classList.toggle('menu-open');
    });
    // 点击导航链接后自动收起
    header.querySelectorAll('.primary-nav a').forEach(a => {
      a.addEventListener('click', () => header.classList.remove('menu-open'));
    });
  }

  // ───────── Reveal 淡入 ─────────
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    : null;
  document.querySelectorAll('.reveal').forEach(el => {
    if (io) io.observe(el); else el.classList.add('in');
  });

  // ───────── Hero 数字滚动 ─────────
  const animateNum = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  const statsEl = document.getElementById('heroStats');
  if (statsEl) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.num').forEach(animateNum);
          statIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    statIO.observe(statsEl);
  }

  // ───────── 产品卡跟随鼠标柔光 ─────────
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '20%');
    });
  });

  // ───────── 平滑锚点跳转（考虑 header 遮挡）─────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight + 10 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ───────── 视差 Hero（减弱动效偏好下自动关闭）─────────
  const hero = document.querySelector('.hero');
  const glowA = document.querySelector('.glow-a');
  const glowB = document.querySelector('.glow-b');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && glowA && glowB && !prefersReduced) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          glowA.style.transform = `translate(${y * 0.08}px, ${y * 0.14}px)`;
          glowB.style.transform = `translate(${-y * 0.06}px, ${-y * 0.1}px)`;
        }
        ticking = false;
      });
    }, { passive: true });
  }

  // ───────── 品牌角标 · 键盘快捷键 G 回顶部（彩蛋）─────────
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const t = document.activeElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  console.log('%cYESHU INTELLIGENCE · 2026–2027', 'background:linear-gradient(135deg,#E5C462,#C9A961);color:#0A1128;padding:6px 14px;border-radius:4px;font-weight:700;letter-spacing:0.1em;');
  console.log('科技普惠每一个人，AI 服务每一个家庭。');
})();
