/* ============================================================
   نبوية رجب — بورتفوليو | script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------- سنة الفوتر -------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------- الناف بار عند السكرول -------------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* -------------------- قائمة الموبايل -------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------- شريط البحث المتحرك (Typing Effect) -------------------- */
  const phrases = [
    'بكتب سكريبت ريل لعيادة نسائية متكاملة…',
    'بصمم كابشن يبيع مجوهرات من غير ما يصرخ…',
    'بخطط حملة 28 يوم لستائر فاخرة…',
    'بحول الزي الموحد لهوية بصرية قوية…',
    'بكتب وصف منتج يقنع العميل يضغط اشتري…'
  ];
  const briefText = document.getElementById('briefText');

  if (briefText) {
    const cursor = briefText.querySelector('.cursor');
    let pIndex = 0, charIndex = 0, deleting = false;

    const type = () => {
      const current = phrases[pIndex];
      if (!deleting) {
        charIndex++;
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(type, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
          charIndex = 0;
        }
      }
      briefText.textContent = current.slice(0, charIndex);
      briefText.appendChild(cursor);
      setTimeout(type, deleting ? 28 : 55);
    };

    if (prefersReduced) {
      briefText.textContent = phrases[0];
      briefText.appendChild(cursor);
    } else {
      type();
    }
  }

  /* -------------------- Reveal on Scroll -------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* -------------------- كارت الإحصائيات: Stroke + Count Up -------------------- */
  const statCards = document.querySelectorAll('.stat-card');
  const animateCount = (el, target) => {
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add('drawn');
          const counters = card.querySelectorAll('[data-count]');
          counters.forEach(c => {
            const target = parseInt(c.getAttribute('data-count'), 10);
            if (prefersReduced) c.textContent = target;
            else animateCount(c, target);
          });
          statIo.unobserve(card);
        }
      });
    }, { threshold: 0.4 });
    statCards.forEach(card => statIo.observe(card));
  }

  /* -------------------- فتح/قفل السكريبتات -------------------- */
  document.querySelectorAll('.script-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.toggle);
      if (!panel) return;
      const isOpen = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.firstChild.textContent = isOpen ? 'اقفلي السكريبت ' : btn.dataset.label || btn.textContent.trim();
    });
  });

  /* حفظ نص الزر الأصلي لإعادة استخدامه عند القفل */
  document.querySelectorAll('.script-toggle').forEach(btn => {
    const originalText = btn.childNodes[0].textContent.trim();
    btn.dataset.label = originalText;
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.toggle);
      if (!panel) return;
      const isOpen = panel.classList.contains('open');
      btn.childNodes[0].textContent = (isOpen ? 'اقفلي السكريبت' : originalText) + ' ';
    });
  });

  /* -------------------- تابات مركز برج الأطباء -------------------- */
  document.querySelectorAll('.reel-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.reel-tab');
    const panelWrap = tabGroup.parentElement;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        panelWrap.querySelectorAll('.reel-content').forEach(c => c.classList.remove('active'));
        const target = panelWrap.querySelector('#' + tab.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });

  /* -------------------- سلايدر فيديوهات وتين -------------------- */
  document.querySelectorAll('.video-slider').forEach(slider => {
    const slides = slider.querySelectorAll('.video-slide');
    const dots = slider.querySelectorAll('.video-dot');

    const goTo = (index) => {
      slides.forEach((s, i) => {
        const isActive = i === index;
        s.classList.toggle('active', isActive);
        if (!isActive) {
          const vid = s.querySelector('video');
          if (vid && !vid.paused) vid.pause();
        }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    };

    dots.forEach(dot => {
      dot.addEventListener('click', () => goTo(parseInt(dot.dataset.go, 10)));
    });
  });

  /* -------------------- سكرول ناعم لأزرار الناف -------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });

});
