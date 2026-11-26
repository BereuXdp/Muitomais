// Muito Mais — comportamento compartilhado das páginas internas (planos, entrar)
(() => {
  document.documentElement.classList.add('js');

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // títulos palavra por palavra
  document.querySelectorAll('[data-aos="words"]').forEach(el => {
    let i = 0;
    const split = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.style.setProperty('--i', i++); w.textContent = part;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') split(n);
      });
    };
    split(el);
    el.style.setProperty('--aos-total', (0.9 + i * 0.075 + 0.3).toFixed(2) + 's');
  });

  // revelar ao rolar (mesmo visual do site principal)
  const reveal = el => {
    const k = el.dataset.aos;
    el.classList.add(...(k === 'words' ? ['aos-words'] : ['aos-in', 'aos-' + k]));
    el.style.opacity = '1';
  };
  const items = document.querySelectorAll('[data-aos]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
  } else items.forEach(reveal);
  // as palavras não podem disparar o fim da animação do bloco pai
  document.addEventListener('animationend', e => { if (e.target.classList.contains('w')) e.stopPropagation(); }, true);

  // menu
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('menuToggle'), menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // voltar ao topo + estado do menu
  const toTop = document.getElementById('toTop'), ring = toTop && toTop.querySelector('.ring circle');
  const onScroll = () => {
    const y = scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    document.body.classList.toggle('scrolled-page', y > 40);
    if (toTop) {
      toTop.classList.toggle('show', y > 500);
      const max = document.documentElement.scrollHeight - innerHeight;
      ring.style.strokeDashoffset = (151 * (1 - (max > 0 ? y / max : 0))).toFixed(1);
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });
})();
