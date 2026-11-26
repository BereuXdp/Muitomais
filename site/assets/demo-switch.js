// DEMONSTRAÇÃO: botão flutuante para trocar de conta (admin, caixa, garçom, cliente) sem passar pelo login.
// TODO: remover antes de publicar para clientes de verdade (ou carregar só em ambiente de teste).
(() => {
  const perfil = new URLSearchParams(location.search).get('perfil');
  const atual = /cliente\.html/.test(location.pathname) ? 'cliente' : perfil === 'caixa' ? 'caixa' : perfil === 'garcom' ? 'garcom' : 'admin';
  const CONTAS = [
    ['admin', 'Admin', 'Vê e configura tudo', 'empresa.html#painel'],
    ['caixa', 'Caixa', 'Aprova o uso de cashback', 'empresa.html?perfil=caixa#aprovar'],
    ['garcom', 'Garçom', 'Mesa + leitor de QR Code', 'empresa.html?perfil=garcom#caixa'],
    ['cliente', 'Cliente', 'App do cliente', 'cliente.html#inicio']
  ];
  const nome = CONTAS.find(c => c[0] === atual)[1];
  const css = `
  .dsw { position: fixed; z-index: 85; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); font-family: inherit; }
  body::after { content: ""; display: block; height: 64px; }   /* espaço para o botão não cobrir o fim da página */
  .dsw-btn { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px 0 10px; border-radius: 20px; border: 0; cursor: pointer;
    background: #111827; color: #fff; font: inherit; font-size: 13px; font-weight: 700; box-shadow: 0 10px 28px -10px rgba(0,0,0,.55); }
  .dsw-btn i { font-style: normal; height: 22px; padding: 0 8px; border-radius: 11px; display: inline-grid; place-items: center; background: #47d398; color: #06251d; font-size: 12px; }
  .dsw-btn:focus-visible { outline: 2px solid #47d398; outline-offset: 2px; }
  .dsw-menu { position: absolute; right: 0; bottom: 48px; width: 250px; max-width: calc(100vw - 32px); padding: 8px; border-radius: 18px; background: #fff; border: 1px solid #d5e3dc;
    box-shadow: 0 24px 48px -20px rgba(6,37,29,.45); transform-origin: bottom right; animation: dsw-in .18s ease-out both; }
  .dsw-menu[hidden] { display: none; }
  @keyframes dsw-in { from { opacity: 0; transform: translateY(6px) scale(.97); } }
  @media (prefers-reduced-motion: reduce) { .dsw-menu { animation: none; } }
  .dsw-menu p { margin: 4px 8px 6px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #6b7280; }
  .dsw-menu a { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 2px 8px; padding: 10px 10px; border-radius: 12px; color: #111827; text-decoration: none; }
  .dsw-menu a:hover, .dsw-menu a:focus-visible { background: #f4fbf8; outline: none; }
  .dsw-menu a b { font-size: 14px; }
  .dsw-menu a small { grid-column: 1; font-size: 12.5px; color: #6b7280; }
  .dsw-menu a[aria-current="true"] { background: #d7eee4; }
  .dsw-menu a[aria-current="true"]::after { content: "atual"; grid-column: 2; grid-row: 1 / span 2; font-size: 11px; font-weight: 700; color: #065f46; }
  @media (max-width: 960px) { body.dsw-cliente .dsw { bottom: calc(96px + env(safe-area-inset-bottom)); } }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (atual === 'cliente') document.body.classList.add('dsw-cliente');
  const box = document.createElement('div');
  box.className = 'dsw';
  box.innerHTML = `<div class="dsw-menu" id="dswMenu" role="menu" hidden><p>Trocar conta (teste)</p>${CONTAS.map(([k, n, d, u]) => `<a role="menuitem" href="${u}" aria-current="${k === atual}"><b>${n}</b><small>${d}</small></a>`).join('')}</div>
    <button class="dsw-btn" id="dswBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="dswMenu"><i>Teste</i>${nome} ▾</button>`;
  document.body.appendChild(box);
  const btn = box.querySelector('#dswBtn'), menu = box.querySelector('#dswMenu');
  const set = on => { menu.hidden = !on; btn.setAttribute('aria-expanded', on); if (on) menu.querySelector('a[aria-current="true"]').focus(); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(menu.hidden); });
  document.addEventListener('click', e => { if (!box.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
  // a mesma página com outro perfil: força recarregar (o hash sozinho não troca o perfil)
  menu.addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); location.assign(a.href); if (new URL(a.href).pathname === location.pathname && new URL(a.href).search === location.search) location.reload(); });
})();
