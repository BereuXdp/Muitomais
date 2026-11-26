// Muito Mais — administração da plataforma (mesmas áreas do admin original, com dados de exemplo)
(() => {
  const $ = id => document.getElementById(id);
  const icon = (n, s = '') => `<svg class="ic"${s ? ` style="${s}"` : ''}><use href="#i-${n}"/></svg>`;
  const brl = v => (v < 0 ? '− ' : '') + 'R$ ' + Math.abs(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const num = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => new Date().toLocaleString('pt-BR').slice(0, 17);

  // ================= dados de exemplo (trocar pela API) =================
  const EMPRESAS = [
    { id: 'e1', n: 'Grupo Bella Mesa', rs: 'Bella Mesa Restaurantes Ltda', slug: 'grupo-bella-mesa', cnpj: '12.345.678/0001-90', st: 'ACTIVE', acc: 'ACTIVE', plan: 'Redes', bill: 'ACTIVE', units: ['Bella Centro', 'Bella Jardins', 'Bella Shopping'], users: [['Ana Ribeiro', 'Proprietária'], ['Marcos Lima', 'Gerente']] },
    { id: 'e2', n: 'Café Aurora', rs: 'Aurora Cafeteria Ltda', slug: 'cafe-aurora', cnpj: '23.456.789/0001-01', st: 'ACTIVE', acc: 'ACTIVE', plan: 'Profissional', bill: 'ACTIVE', units: ['Café Aurora'], users: [['Bruno Alves', 'Proprietário']] },
    { id: 'e3', n: 'Sabor da Vila', rs: 'Vila Sabores Alimentos Ltda', slug: 'sabor-da-vila', cnpj: '34.567.890/0001-12', st: 'ACTIVE', acc: 'ACTIVE', plan: 'Essencial', bill: 'PAST_DUE', units: ['Sabor da Vila'], users: [['Carla Nunes', 'Proprietária'], ['Diego Reis', 'Caixa']] },
    { id: 'e4', n: 'Cantina Nonna', rs: 'Nonna Gastronomia Ltda', slug: 'cantina-nonna', cnpj: '45.678.901/0001-23', st: 'ACTIVE', acc: 'COMPLIMENTARY', plan: '—', bill: 'NONE', units: ['Cantina Nonna'], users: [['Elisa Prado', 'Proprietária']] },
    { id: 'e5', n: 'Ponto do Pastel', rs: 'Pastelaria Ponto Ltda', slug: 'ponto-do-pastel', cnpj: '56.789.012/0001-34', st: 'INACTIVE', acc: 'NONE', plan: '—', bill: 'CANCELED', units: [], users: [['Fábio Costa', 'Proprietário']] },
    { id: 'e6', n: 'Restaurante Demonstração', rs: 'Demo Restaurante Ltda', slug: 'restaurante-demo', cnpj: '67.890.123/0001-45', st: 'ACTIVE', acc: 'NONE', plan: '—', bill: 'NONE', units: [], users: [['Gabriela Torres', 'Proprietária']] }
  ];
  const CLIENTES = [
    { id: 'c1', n: 'Mariana Costa', e: 'mariana.costa@exemplo.com', tel: '1699', cpf: '***.***.***-21', st: 'ACTIVE', wal: [['Grupo Bella Mesa', 37.40, 12.40]] },
    { id: 'c2', n: 'Rafael Souza', e: 'rafael.souza@exemplo.com', tel: '2231', cpf: null, st: 'ACTIVE', wal: [['Café Aurora', 54.20, 0], ['Grupo Bella Mesa', 9.85, 0]] },
    { id: 'c3', n: 'Juliana Alves', e: 'juliana.alves@exemplo.com', tel: '8810', cpf: '***.***.***-07', st: 'ACTIVE', wal: [['Grupo Bella Mesa', 32.41, 32.41]] },
    { id: 'c4', n: 'Pedro Henrique', e: 'pedro.h@exemplo.com', tel: '5521', cpf: null, st: 'ACTIVE', wal: [['Sabor da Vila', 22.80, 0]] },
    { id: 'c5', n: 'Camila Rocha', e: 'camila.rocha@exemplo.com', tel: '0094', cpf: null, st: 'BLOCKED', wal: [] },
    { id: 'c6', n: 'Bruno Martins', e: 'bruno.martins@exemplo.com', tel: '7713', cpf: '***.***.***-55', st: 'ACTIVE', wal: [['Grupo Bella Mesa', 61.30, 0]] },
    { id: 'c7', n: 'Larissa Melo', e: 'larissa.melo@exemplo.com', tel: '3348', cpf: null, st: 'ACTIVE', wal: [['Café Aurora', 26.00, 0]] },
    { id: 'c8', n: 'Thiago Nunes', e: 'thiago.nunes@exemplo.com', tel: '6620', cpf: null, st: 'ACTIVE', wal: [['Sabor da Vila', 18.50, 6.00]] }
  ];
  const USUARIOS = [
    ['Ana Ribeiro', 'ana@bellamesa.com.br', false, true, 'ACTIVE'], ['Marcos Lima', 'marcos@bellamesa.com.br', false, true, 'ACTIVE'],
    ['Bruno Alves', 'bruno@cafeaurora.com.br', false, true, 'ACTIVE'], ['Carla Nunes', 'carla@saborvila.com.br', false, false, 'ACTIVE'],
    ['Diego Reis', 'diego@saborvila.com.br', false, true, 'INVITED'], ['Elisa Prado', 'elisa@nonna.com.br', false, true, 'ACTIVE'],
    ['Fábio Costa', 'fabio@pontopastel.com.br', false, true, 'DISABLED'], ['Equipe de operação', 'operacao@exemplo.com', true, true, 'ACTIVE'],
    ['Suporte', 'suporte@exemplo.com', true, true, 'ACTIVE']
  ];
  const NFCE = [
    ['Grupo Bella Mesa', '27624', '4830', 'VALID', [['Confirmado', 'ok'], ['Sem cashback', ''], ['Abaixo do mínimo', 'warn']], 22.10, '20/10/2026, 19:23'],
    ['Grupo Bella Mesa', '27628', '5011', 'VALID', [['Confirmado', 'ok'], ['Cashback gerado', 'ok']], 324.15, '20/10/2026, 19:22'],
    ['Café Aurora', '10988', '4967', 'PENDING', [['Aguardando SEFAZ', 'warn']], 139.00, '20/10/2026, 18:50'],
    ['Sabor da Vila', '31204', '5043', 'VALID', [['Confirmado', 'ok'], ['Cashback gerado', 'ok']], 87.36, '19/10/2026, 13:10'],
    ['Café Aurora', '10971', '5038', 'REJECTED', [['Rejeitado', 'err'], ['CNPJ fora da empresa', 'err']], 297.92, '19/10/2026, 12:02'],
    ['Grupo Bella Mesa', '27601', '6310', 'VALID', [['Confirmado', 'ok'], ['Cashback no teto', 'info']], 1479.97, '18/10/2026, 21:02'],
    ['Sabor da Vila', '31188', '6374', 'VALID', [['Confirmado', 'ok'], ['Cashback gerado', 'ok']], 63.40, '18/10/2026, 20:05'],
    ['Grupo Bella Mesa', '27588', '6368', 'VALID', [['Confirmado', 'ok'], ['Cashback gerado', 'ok']], 114.00, '17/10/2026, 12:44'],
    ['Cantina Nonna', '00912', '6390', 'VALID', [['Confirmado', 'ok'], ['Sem cashback', ''], ['Empresa sem plano', 'warn']], 199.36, '16/10/2026, 20:31']
  ];
  const VOUCHERS = [
    ['VCH-7F3K', 'Rafael Souza', 'Café Aurora', 22.00, 'Usado', '14/10/2026, 21:40'],
    ['VCH-2M9Q', 'Bruno Martins', 'Grupo Bella Mesa', 35.00, 'Usado', '10/10/2026, 20:11'],
    ['VCH-8P1Z', 'Thiago Nunes', 'Sabor da Vila', 6.00, 'Reservado', '20/10/2026, 12:30'],
    ['VCH-5T6W', 'Pedro Henrique', 'Sabor da Vila', 10.00, 'Expirado', '01/09/2026, 19:05']
  ];
  const FRAUDES = [
    { id: 'f1', emp: 'Grupo Bella Mesa', ev: 'NFCE_BURST', score: 45, sev: 'MEDIUM', st: 'OPEN', mot: 'Muitas NFC-e em curto período', at: '20/10/2026, 19:23' },
    { id: 'f2', emp: 'Grupo Bella Mesa', ev: 'NFCE_BURST', score: 45, sev: 'MEDIUM', st: 'OPEN', mot: 'Muitas NFC-e em curto período', at: '20/10/2026, 19:22' },
    { id: 'f3', emp: 'Café Aurora', ev: 'TICKET_SPIKE', score: 72, sev: 'HIGH', st: 'OPEN', mot: 'Valor muito acima do ticket habitual', at: '19/10/2026, 12:02' },
    { id: 'f4', emp: 'Sabor da Vila', ev: 'SHARED_DEVICE', score: 28, sev: 'LOW', st: 'REVIEW', mot: 'Mesmo aparelho em outra conta', at: '18/10/2026, 20:40' },
    { id: 'f5', emp: 'Grupo Bella Mesa', ev: 'NFCE_BURST', score: 45, sev: 'MEDIUM', st: 'RESOLVED', mot: 'Muitas NFC-e em curto período', at: '12/10/2026, 11:02' }
  ];
  const FEATS = ['Cashback', 'Missões', 'Analytics', 'Missões inteligentes', 'Validação de NFC-e', 'Multiunidade', 'Segmentação'];
  const PLANOS = [
    { id: 'p1', n: 'Essencial', slug: 'essencial', price: 99, per: 'Mensal', st: 'ACTIVE', pub: true, order: 1, hl: false, pid: 'preco_essencial_mensal', sync: true, feats: ['Cashback', 'Missões'], badge: '', cta: '' },
    { id: 'p2', n: 'Profissional', slug: 'profissional', price: 197, per: 'Mensal', st: 'ACTIVE', pub: true, order: 2, hl: true, pid: 'preco_profissional_mensal', sync: true, feats: ['Cashback', 'Missões', 'Analytics', 'Validação de NFC-e', 'Segmentação'], badge: 'Mais completo', cta: '' },
    { id: 'p3', n: 'Redes', slug: 'redes', price: 597, per: 'Mensal', st: 'ACTIVE', pub: true, order: 3, hl: false, pid: 'preco_redes_mensal', sync: true, feats: ['Cashback', 'Missões', 'Analytics', 'Validação de NFC-e', 'Multiunidade', 'Segmentação'], badge: 'Redes e franquias', cta: '' }
  ];
  const PAGAMENTOS = [
    ['05/10/2026', 'Café Aurora', 197, 'Cartão', 'Pago'], ['05/10/2026', 'Sabor da Vila', 99, 'Boleto', 'Falhou'],
    ['05/09/2026', 'Café Aurora', 197, 'Cartão', 'Pago'], ['05/09/2026', 'Sabor da Vila', 99, 'Boleto', 'Pago']
  ];
  const FATURAS = [
    ['MM-000124', 'Café Aurora', 197, '05/10/2026', 'Paga'], ['MM-000125', 'Sabor da Vila', 99, '05/10/2026', 'Em atraso'],
    ['MM-000118', 'Café Aurora', 197, '05/09/2026', 'Paga'], ['MM-000119', 'Sabor da Vila', 99, '05/09/2026', 'Paga']
  ];
  const DIVERG = [{ id: 'd1', emp: 'Sabor da Vila', txt: 'Pagamento recusado na plataforma, mas assinatura ainda ativa aqui.', ok: false }];
  const LANDING = { h: 'Cashback direto no cupom do seu restaurante.', sub: 'Transforme cada cupom em uma nova oportunidade de trazer seu cliente de volta.', cta: 'Começar agora', plans: true, demo: true };
  const FAQ = { email: '', whats: '', items: [
    { q: 'Como usar meu cashback?', a: 'O cashback aparece na tela Início. Para usar, escolha um parceiro e siga as instruções de resgate. As movimentações ficam no Histórico.', o: 0 },
    { q: 'Onde vejo minhas missões?', a: 'Na tela inicial, toque em Missões. A lista mostra o status de cada uma e o valor da recompensa.', o: 1 },
    { q: 'Como informar um voucher?', a: 'Abra Escanear e toque em Informe o voucher. Digite o código recebido e confira o valor antes de confirmar.', o: 2 }
  ] };
  const EMAILS = [
    { id: 'm1', n: 'Ana Ribeiro', e: 'ana@bellamesa.com.br', at: '19/10/2026, 16:53', ok: false },
    { id: 'm2', n: 'Carla Nunes', e: 'carla@saborvila.com.br', at: '18/10/2026, 09:12', ok: false }
  ];
  const AUDIT = [
    ['admin.login', 'operacao@exemplo.com', 'PlatformAdmin', '21/10/2026, 10:18'], ['admin.login.failed', '—', 'PlatformAdmin', '21/10/2026, 10:17'],
    ['company.activate', 'operacao@exemplo.com', 'Company', '20/10/2026, 15:02'], ['plan.update', 'operacao@exemplo.com', 'Plan', '20/10/2026, 14:40'],
    ['auth.login.success', 'ana@bellamesa.com.br', 'User', '20/10/2026, 11:44'], ['auth.logout', 'ana@bellamesa.com.br', 'Session', '20/10/2026, 11:52'],
    ['nfce.validate', 'sistema', 'Receipt', '20/10/2026, 19:23'], ['fraud.review', 'suporte@exemplo.com', 'RiskEvent', '18/10/2026, 20:45'],
    ['auth.login.failed', 'carla@saborvila.com.br', 'User', '18/10/2026, 09:10'], ['voucher.redeem', 'sistema', 'Voucher', '14/10/2026, 21:40']
  ];
  const SVC = [
    ['API da plataforma', 'Respondendo em 120 ms', 'ok'], ['Banco de dados', 'Conexões normais', 'ok'], ['Consulta SEFAZ', 'Fila com 3 notas', 'warn'],
    ['Envio de e-mails', 'SMTP conectado', 'ok'], ['Plataforma de pagamento', 'Integração pendente de configuração', 'warn'], ['Webhooks', 'Último recebido há 2 h', 'ok']
  ];

  // ================= utilidades =================
  let tt;
  const toast = m => { $('toastText').textContent = m; $('toast').classList.add('on'); clearTimeout(tt); tt = setTimeout(() => $('toast').classList.remove('on'), 2800); };
  const sheet = $('sheet'); let lastFocus = null;
  const openSheet = (tone, html) => {
    if (sheet.hidden) lastFocus = document.activeElement;
    $('sheetBox').className = 'sheet t-' + tone; $('shBody').innerHTML = html;
    clearTimeout(sheet._t); sheet.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('on')));
    const f = $('shBody').querySelector('input, select, textarea, .sh-actions .btn'); if (f) f.focus();
  };
  const closeSheet = () => { if (sheet.hidden) return; sheet.classList.remove('on'); sheet._t = setTimeout(() => { sheet.hidden = true; }, 300); if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); };
  $('shClose').addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); setMenu(false); } });
  const sheetHead = (ic, kicker, title, sub) => `<span class="sh-ic">${icon(ic)}</span><p class="sh-kicker">${kicker}</p><h2 class="sh-title" id="shTitle">${title}</h2>${sub ? `<p class="sh-sub">${sub}</p>` : ''}`;
  const pill = (t, k = '') => `<span class="pill ${k}">${t}</span>`;
  const head = (title, sub, acts = '') => `<div class="page-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
  const sel = (id, label, opts, val) => `<label class="field"><span>${label}</span><select class="ctl" id="${id}">${opts.map(([v, t]) => `<option value="${v}" ${v === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
  const table = (cols, rows, empty = 'Nada por aqui.') => `<div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr>${cols.map(c => `<th class="${c[1] || ''}">${c[0]}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${cols.length}"><p class="empty">${empty}</p></td></tr>`}</tbody></table></div></div>`;
  const ST = { ACTIVE: ['Ativo', 'ok'], INACTIVE: ['Inativo', ''], BLOCKED: ['Bloqueado', 'err'], INVITED: ['Convidado', 'warn'], DISABLED: ['Desativado', ''],
    COMPLIMENTARY: ['Cortesia', 'info'], NONE: ['Sem plano', ''], PAST_DUE: ['Em atraso', 'warn'], CANCELED: ['Cancelada', ''],
    VALID: ['Válida', 'ok'], PENDING: ['Pendente', 'warn'], REJECTED: ['Rejeitada', 'err'], OPEN: ['Aberto', 'warn'], REVIEW: ['Em revisão', 'info'], RESOLVED: ['Resolvido', 'ok'],
    LOW: ['Baixa', 'ok'], MEDIUM: ['Média', 'warn'], HIGH: ['Alta', 'err'], DRAFT: ['Rascunho', 'info'] };
  const st = k => pill(...(ST[k] || [k, '']));
  const searchBox = (id, ph, val = '') => `<label class="field" style="flex:1 1 240px"><span>Buscar</span><input class="ctl" id="${id}" placeholder="${ph}" value="${esc(val)}"></label>`;
  const filterRows = (inputId, tbodySel) => { const i = $(inputId); if (!i) return; const go = () => { const q = i.value.toLowerCase(); document.querySelectorAll(tbodySel + ' tr').forEach(tr => { tr.hidden = !!q && !tr.textContent.toLowerCase().includes(q); }); }; i.addEventListener('input', go); go(); };
  const barChart = (vals, labels) => {
    const W = 600, H = 200, P = { l: 6, r: 6, t: 10, b: 22 }, n = vals.length, iw = W - P.l - P.r, ih = H - P.t - P.b, bw = iw / n, max = Math.max(...vals, 1);
    let g = ''; for (let k = 0; k <= 3; k++) { const y = P.t + ih * k / 3; g += `<line class="gl" x1="${P.l}" x2="${W - P.r}" y1="${y}" y2="${y}"/>`; }
    vals.forEach((v, i) => { const h = ih * v / max, x = P.l + i * bw + bw * .2, w = bw * .6; g += `<rect x="${x}" y="${P.t + ih - h}" width="${w}" height="${h}" rx="4" fill="${i === n - 1 ? '#47d398' : '#0fa36e'}"><title>${labels[i]}: ${v}</title></rect>`; if (i % 2 === 0) g += `<text class="ax" x="${x + w / 2}" y="${H - 6}" text-anchor="middle">${labels[i]}</text>`; });
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="NFC-e por dia">${g}</svg>`;
  };

  // ================= telas =================
  const V = {};
  const SEARCH = { q: '' };
  const kpiCount = () => ({
    emp: EMPRESAS.length, empAt: EMPRESAS.filter(e => e.st === 'ACTIVE').length,
    cli: CLIENTES.filter(c => c.st === 'ACTIVE').length, nf: NFCE.length, vres: VOUCHERS.filter(v => v[4] === 'Usado').length,
    mrr: EMPRESAS.filter(e => e.bill === 'ACTIVE').reduce((a, e) => a + (PLANOS.find(p => p.n === e.plan) || { price: 0 }).price * Math.max(1, e.units.length), 0),
    past: EMPRESAS.filter(e => e.bill === 'PAST_DUE').length, fail: PAGAMENTOS.filter(p => p[4] === 'Falhou').length,
    users: USUARIOS.length, vch: VOUCHERS.length, fr: FRAUDES.filter(f => f.st === 'OPEN').length
  });

  V.dashboard = () => {
    const k = kpiCount();
    const kp = [['Empresas', k.emp], ['Empresas ativas', k.empAt], ['Clientes ativos', k.cli], ['NFC-e', k.nf], ['Vouchers resgatados', k.vres], ['Missões ativas', 4],
      ['MRR', brl(k.mrr), true], ['Em atraso', k.past], ['Pagamentos falhos', k.fail], ['Clientes', CLIENTES.length], ['Usuários', k.users], ['Vouchers', k.vch], ['Fraudes abertas', k.fr]];
    const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return d.toLocaleDateString('pt-BR').slice(0, 5); });
    const nf = [12, 18, 9, 22, 30, 41, 26, 15, 21, 19, 33, 47, 38, 24];
    return head('Dashboard geral', 'Visão da plataforma. Busca por CNPJ, nome, e-mail, telefone, chave NFC-e, voucher ou ID.') + `
      <form class="filters" id="dashSearch">${searchBox('dashQ', 'CNPJ, e-mail, telefone, NFC-e, voucher ou ID')}<button class="btn btn-primary" type="submit">${icon('search')}Buscar</button></form>
      <div class="kpis">${kp.map(([l, v, hl]) => `<div class="kpi${hl ? ' hl' : ''}"><small>${l}</small><strong>${typeof v === 'number' ? num(v) : v}</strong></div>`).join('')}<div class="kpi"><small>Cashback acumulado</small><strong>${brl(CLIENTES.reduce((a, c) => a + c.wal.reduce((b, w) => b + w[1], 0), 0))}</strong></div><div class="kpi"><small>Resgates confirmados</small><strong>${brl(VOUCHERS.filter(v => v[4] === 'Usado').reduce((a, v) => a + v[3], 0))}</strong></div></div>
      <div class="grid-2" style="margin-top:16px">
        <div class="card span-2"><div class="card-head"><div><h2>NFC-e por dia</h2><p>Notas recebidas em toda a plataforma nos últimos 14 dias.</p></div><a class="btn btn-ghost btn-sm" href="#nfce">Ver NFC-e</a></div>${barChart(nf, days)}</div>
        <div class="card"><div class="card-head"><div><h2>Fraudes abertas</h2><p>Eventos aguardando revisão.</p></div><a class="btn btn-ghost btn-sm" href="#fraudes">Ver todas</a></div>
          ${FRAUDES.filter(f => f.st === 'OPEN').map(f => `<div class="item"><span class="risk-score ${f.sev === 'HIGH' ? 'high' : f.sev === 'LOW' ? 'low' : ''}" style="width:44px;height:44px;font-size:15px">${f.score}</span><div class="item-body"><b>${esc(f.emp)}</b><p>${f.mot} · ${f.at}</p></div></div>`).join('') || '<p class="empty">Nenhuma fraude aberta.</p>'}</div>
        <div class="card"><div class="card-head"><div><h2>Atividade recente</h2><p>Últimas ações registradas na auditoria.</p></div><a class="btn btn-ghost btn-sm" href="#auditoria">Auditoria</a></div>
          ${AUDIT.slice(0, 5).map(a => `<div class="item"><span class="item-ic">${icon('history')}</span><div class="item-body"><b class="mono">${a[0]}</b><p>${esc(a[1])} · ${a[3]}</p></div></div>`).join('')}</div>
      </div>`;
  };
  V.dashboard.bind = () => $('dashSearch').addEventListener('submit', e => { e.preventDefault(); SEARCH.q = $('dashQ').value.trim(); location.hash = 'busca'; });

  // --- Busca global ---
  V.busca = () => {
    const q = SEARCH.q.toLowerCase().trim(), has = s => String(s).toLowerCase().includes(q);
    const groups = q ? [
      ['Empresas', EMPRESAS.filter(e => [e.n, e.rs, e.slug, e.cnpj, e.id].some(has)).map(e => [`#empresas/${e.id}`, 'store', e.n, `${e.cnpj} · ${e.slug}`])],
      ['Clientes', CLIENTES.filter(c => [c.n, c.e, c.tel, c.id].some(has)).map(c => [`#clientes/${c.id}`, 'users', c.n, `${c.e} · ****${c.tel}`])],
      ['Usuários', USUARIOS.filter(u => [u[0], u[1]].some(has)).map(u => ['#usuarios', 'badge', u[0], u[1]])],
      ['NFC-e', NFCE.filter(n => [n[0], n[1], n[2]].some(has)).map(n => ['#nfce', 'receipt', 'NFC-e ' + n[1], `${n[0]} · ****${n[2]} · ${brl(n[5])}`])],
      ['Vouchers', VOUCHERS.filter(v => [v[0], v[1]].some(has)).map(v => ['#vouchers', 'ticket', v[0], `${v[1]} · ${v[2]} · ${v[4]}`])]
    ].filter(g => g[1].length) : [];
    return head('Busca global', 'CNPJ, nome, e-mail, telefone, chave NFC-e, voucher ou ID.') + `
      <form class="filters" id="bsForm">${searchBox('bsQ', 'Ex.: 12.345.678, mariana, VCH-7F3K, 27624', SEARCH.q)}<button class="btn btn-primary" type="submit">${icon('search')}Buscar</button></form>
      <div class="card">${!q ? '<p class="empty">Digite algo para buscar em toda a plataforma.</p>' : groups.length ? groups.map(([t, rows]) => `<div class="res-group"><h3>${t} (${rows.length})</h3>${rows.map(([href, ic, a, b]) => `<a class="item" href="${href}" style="display:flex"><span class="item-ic">${icon(ic)}</span><div class="item-body"><b>${esc(a)}</b><p>${esc(b)}</p></div>${icon('chev')}</a>`).join('')}</div>`).join('') : `<p class="empty">Nada encontrado para “${esc(SEARCH.q)}”.</p>`}</div>`;
  };
  V.busca.bind = () => { $('bsForm').addEventListener('submit', e => { e.preventDefault(); SEARCH.q = $('bsQ').value; render(); }); if (!SEARCH.q) $('bsQ').focus(); };

  // --- NFC-e ---
  let NF_ST = 'all';
  V.nfce = () => head('NFC-e', 'Chave e CPF mascarados. O QR original não é exibido.') + `
    <div class="filters">${searchBox('nfQ', 'Empresa, número ou final da chave')}${sel('nfSt', 'Status', [['all', 'Todos'], ['VALID', 'Válidas'], ['PENDING', 'Pendentes'], ['REJECTED', 'Rejeitadas']], NF_ST)}</div>` +
    table([['Empresa'], ['Número'], ['Chave'], ['Status'], ['Cashback'], ['Valor', 'num'], ['Quando']],
      NFCE.filter(n => NF_ST === 'all' || n[3] === NF_ST).map(n => `<tr><td><b>${esc(n[0])}</b></td><td>${n[1]}</td><td class="mono">****${n[2]}</td><td>${st(n[3])}</td><td><div class="meta" style="margin:0">${n[4].map(t => pill(...t)).join('')}</div></td><td class="num">${brl(n[5])}</td><td>${n[6]}</td></tr>`), 'Nenhuma NFC-e.');
  V.nfce.bind = () => { $('nfSt').addEventListener('change', e => { NF_ST = e.target.value; render(); }); filterRows('nfQ', '#view tbody'); };

  // --- Vouchers ---
  V.vouchers = () => head('Vouchers', 'Vouchers emitidos na plataforma.') + `<div class="filters">${searchBox('vcQ', 'Código, cliente ou empresa')}</div>` +
    table([['Código'], ['Cliente'], ['Empresa'], ['Valor', 'num'], ['Status'], ['Criado em']],
      VOUCHERS.map(v => `<tr><td><b class="mono">${v[0]}</b></td><td>${esc(v[1])}</td><td>${esc(v[2])}</td><td class="num">${brl(v[3])}</td><td>${pill(v[4], v[4] === 'Usado' ? 'ok' : v[4] === 'Reservado' ? 'info' : '')}</td><td>${v[5]}</td></tr>`), 'Nenhum voucher.');
  V.vouchers.bind = () => filterRows('vcQ', '#view tbody');

  // --- Fraudes ---
  let FR_ST = 'OPEN';
  V.fraudes = () => head('Fraudes', 'Eventos de risco em revisão.') + `
    <div class="filters">${sel('frSt', 'Status', [['all', 'Todos'], ['OPEN', 'Abertos'], ['REVIEW', 'Em revisão'], ['RESOLVED', 'Resolvidos']], FR_ST)}</div>` +
    table([['Empresa'], ['Evento'], ['Score', 'num'], ['Severidade'], ['Status'], ['Motivo'], ['Quando'], ['']],
      FRAUDES.filter(f => FR_ST === 'all' || f.st === FR_ST).map(f => `<tr data-f="${f.id}"><td><b>${esc(f.emp)}</b></td><td class="mono">${f.ev}</td><td class="num"><b>${f.score}</b></td><td>${st(f.sev)}</td><td>${st(f.st)}</td><td>${f.mot}</td><td>${f.at}</td><td>${f.st !== 'RESOLVED' ? '<button class="btn btn-ghost btn-sm" data-fact="1">Revisar</button>' : ''}</td></tr>`), 'Nenhum evento neste filtro.');
  V.fraudes.bind = () => {
    $('frSt').addEventListener('change', e => { FR_ST = e.target.value; render(); });
    document.querySelectorAll('[data-fact]').forEach(b => b.addEventListener('click', () => {
      const f = FRAUDES.find(x => x.id === b.closest('[data-f]').dataset.f);
      openSheet('warn', sheetHead('shield', 'Fraude · ' + f.ev, esc(f.emp), `${f.mot} · score ${f.score}`) + `
        <div class="sh-form"><label class="field"><span>Nota da revisão</span><textarea class="ctl" id="frNote" placeholder="Obrigatória para encerrar"></textarea></label></div>
        <div class="sh-actions"><button class="btn btn-primary" data-go="frResolve" data-id="${f.id}">Marcar como resolvido</button><button class="btn btn-ghost" data-go="frReview" data-id="${f.id}">Manter em revisão</button></div>`);
    }));
  };
  const updFraud = () => { const n = FRAUDES.filter(f => f.st === 'OPEN').length; $('fraudCount').textContent = n; $('fraudCount').hidden = !n; };

  // --- Empresas ---
  V.empresas = () => head('Empresas', 'Cadastro de empresas na plataforma.') + `<div class="filters">${searchBox('emQ', 'Nome, razão social, slug ou CNPJ')}</div>` +
    table([['Nome'], ['Razão social'], ['Slug'], ['Status'], ['Acesso'], ['Plano'], ['Billing']],
      EMPRESAS.map(e => `<tr class="link" data-go-href="#empresas/${e.id}"><td><a class="name" href="#empresas/${e.id}">${esc(e.n)}</a><small>${e.cnpj}</small></td><td>${esc(e.rs)}</td><td class="mono">${e.slug}</td><td>${st(e.st)}</td><td>${st(e.acc)}</td><td>${e.plan}</td><td>${st(e.bill)}</td></tr>`));
  V.empresas.bind = () => { filterRows('emQ', '#view tbody'); rowLinks(); };
  const rowLinks = () => document.querySelectorAll('[data-go-href]').forEach(tr => tr.addEventListener('click', e => { if (!e.target.closest('a,button')) location.hash = tr.dataset.goHref.slice(1); }));
  V.empresa = id => {
    const e = EMPRESAS.find(x => x.id === id); if (!e) return head('Empresa não encontrada') + `<a class="back-link" href="#empresas">${icon('back')}Empresas</a>`;
    return `<a class="back-link" href="#empresas">${icon('back')}Empresas</a>` + head(esc(e.n), `${esc(e.rs)} · ${e.cnpj} · ${st(e.st)}`,
      `<button class="btn btn-primary btn-sm" data-em="ACTIVE" ${e.st === 'ACTIVE' ? 'disabled' : ''}>Ativar</button><button class="btn btn-danger btn-sm" data-em="INACTIVE" ${e.st !== 'ACTIVE' ? 'disabled' : ''}>Desativar</button>`) + `
      <div class="grid-3">
        <div class="card"><div class="card-head"><h2>Billing</h2></div><div class="kv"><div><span>Plano</span><b>${e.plan}</b></div><div><span>Billing</span><b>${st(e.bill)}</b></div><div><span>Acesso</span><b>${st(e.acc)}</b></div><div><span>Slug</span><b class="mono">${e.slug}</b></div></div></div>
        <div class="card"><div class="card-head"><h2>Unidades</h2>${pill(e.units.length)}</div>${e.units.map(u => `<div class="item"><span class="item-ic">${icon('store')}</span><div class="item-body"><b>${esc(u)}</b><p>Cashback ativo</p></div></div>`).join('') || '<p class="empty">Nenhuma unidade.</p>'}</div>
        <div class="card"><div class="card-head"><h2>Usuários</h2>${pill(e.users.length)}</div>${e.users.map(u => `<div class="item"><span class="av">${u[0].split(' ').map(w => w[0]).join('').slice(0, 2)}</span><div class="item-body"><b>${esc(u[0])}</b><p>${u[1]}</p></div></div>`).join('')}</div>
      </div>`;
  };
  V.empresa.bind = id => document.querySelectorAll('[data-em]').forEach(b => b.addEventListener('click', () => {
    const e = EMPRESAS.find(x => x.id === id), to = b.dataset.em;
    if (to === 'ACTIVE') { e.st = 'ACTIVE'; AUDIT.unshift(['company.activate', 'operacao@exemplo.com', 'Company', now()]); render(); toast(e.n + ' ativada.'); return; }
    openSheet('err', sheetHead('alert', 'Empresas', 'Desativar ' + esc(e.n) + '?', 'A empresa perde o acesso ao painel e os cupons deixam de gerar cashback.') +
      `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Cancelar</button><button class="btn btn-err" data-go="emOff" data-id="${e.id}">Desativar</button></div>`);
  }));

  // --- Clientes ---
  V.clientes = () => head('Clientes', 'Telefone e CPF mascarados.') + `<div class="filters">${searchBox('clQ', 'Nome, e-mail ou final do telefone')}</div>` +
    table([['Nome'], ['E-mail'], ['Telefone'], ['CPF'], ['Status']],
      CLIENTES.map(c => `<tr class="link" data-go-href="#clientes/${c.id}"><td><a class="name" href="#clientes/${c.id}">${esc(c.n)}</a></td><td>${esc(c.e)}</td><td class="mono">****${c.tel}</td><td class="mono">${c.cpf || '<span class="muted">sem CPF</span>'}</td><td>${st(c.st)}</td></tr>`));
  V.clientes.bind = () => { filterRows('clQ', '#view tbody'); rowLinks(); };
  V.cliente = id => {
    const c = CLIENTES.find(x => x.id === id); if (!c) return head('Cliente não encontrado') + `<a class="back-link" href="#clientes">${icon('back')}Clientes</a>`;
    return `<a class="back-link" href="#clientes">${icon('back')}Clientes</a>` + head(esc(c.n), `${esc(c.e)} · ****${c.tel} · ${st(c.st)}`,
      `<button class="btn ${c.st === 'BLOCKED' ? 'btn-primary' : 'btn-danger'} btn-sm" id="clBlock">${c.st === 'BLOCKED' ? 'Desbloquear' : 'Bloquear'}</button>`) + `
      <div class="card"><div class="card-head"><div><h2>Carteiras</h2><p>Saldo de cashback em cada empresa.</p></div></div>
        ${c.wal.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Empresa</th><th class="num">Disponível</th><th class="num">A liberar</th></tr></thead><tbody>${c.wal.map(w => `<tr><td><b>${esc(w[0])}</b></td><td class="num val-pos">${brl(w[1])}</td><td class="num">${brl(w[2])}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">Sem carteira.</p>'}</div>`;
  };
  V.cliente.bind = id => $('clBlock').addEventListener('click', () => {
    const c = CLIENTES.find(x => x.id === id);
    if (c.st === 'BLOCKED') { c.st = 'ACTIVE'; render(); toast('Cliente desbloqueado.'); return; }
    openSheet('err', sheetHead('alert', 'Clientes', 'Bloquear ' + esc(c.n) + '?', 'O cliente não consegue registrar cupons nem usar cashback até ser desbloqueado.') +
      `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Cancelar</button><button class="btn btn-err" data-go="clBlock" data-id="${c.id}">Bloquear</button></div>`);
  });

  // --- Usuários ---
  V.usuarios = () => head('Usuários', 'Contas de acesso (empresa e plataforma).') + `<div class="filters">${searchBox('usQ', 'Nome ou e-mail')}</div>` +
    table([['Nome'], ['E-mail'], ['Plataforma'], ['E-mail confirmado'], ['Status']],
      USUARIOS.map(u => `<tr><td><b>${esc(u[0])}</b></td><td>${esc(u[1])}</td><td>${u[2] ? pill('Sim', 'dark') : pill('Não')}</td><td>${u[3] ? pill('Sim', 'ok') : pill('Não', 'warn')}</td><td>${st(u[4])}</td></tr>`));
  V.usuarios.bind = () => filterRows('usQ', '#view tbody');

  // --- Billing ---
  V.billing = () => {
    const c = s => EMPRESAS.filter(e => e.bill === s).length, k = kpiCount();
    const kp = [['MRR estimado', brl(k.mrr), true], ['Ativas', c('ACTIVE')], ['Em atraso', c('PAST_DUE')], ['Não pagas', 0], ['Canceladas', c('CANCELED')],
      ['Recebido (30d)', brl(PAGAMENTOS.filter(p => p[4] === 'Pago').slice(0, 1).reduce((a, p) => a + p[2], 0))], ['Falhos', k.fail], ['Novas (30d)', 3]];
    return head('Billing', 'Visão geral de planos e assinaturas. O pagamento é feito na plataforma de pagamento.', `<a class="btn btn-ghost btn-sm" href="#billing/planos">${icon('crown')}Planos</a>`) +
      `<div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">${kp.map(([l, v, hl]) => `<div class="kpi${hl ? ' hl' : ''}"><small>${l}</small><strong>${typeof v === 'number' ? num(v) : v}</strong></div>`).join('')}</div>
      <div class="grid-2" style="margin-top:16px">
        <div class="card"><div class="card-head"><div><h2>Assinaturas por plano</h2></div><a class="btn btn-ghost btn-sm" href="#billing/assinaturas">Assinaturas</a></div>${hbarsMini(PLANOS.map(p => [p.n, EMPRESAS.filter(e => e.plan === p.n).length]))}</div>
        <div class="card"><div class="card-head"><div><h2>Atenção</h2><p>Itens que precisam de ação.</p></div></div>
          ${EMPRESAS.filter(e => e.bill === 'PAST_DUE').map(e => `<a class="item" href="#empresas/${e.id}" style="display:flex"><span class="item-ic" style="background:#fff6e0;color:#8a5a00;border-color:#f6e3b8">${icon('alert')}</span><div class="item-body"><b>${esc(e.n)}</b><p>Assinatura em atraso · plano ${e.plan}</p></div>${icon('chev')}</a>`).join('') || '<p class="empty">Nada pendente.</p>'}</div>
      </div>`;
  };
  const hbarsMini = rows => { const max = Math.max(...rows.map(r => r[1]), 1); return `<div class="hbars">${rows.map(([l, v]) => `<div class="hbar"><span>${l}</span><span class="track"><i style="--w:${Math.max(3, v / max * 100)}%"></i></span><b>${v}</b></div>`).join('')}</div>`; };

  // --- Planos ---
  V.planos = () => head('Planos', 'Catálogo de planos. O plano nasce como rascunho; depois use Ativar e Publicar na landing.', `<button class="btn btn-primary" id="plNew">${icon('plus')}Criar plano</button>`) + `
    <div class="stack">${PLANOS.slice().sort((a, b) => a.order - b.order).map(p => `<div class="item" style="margin:0" data-p="${p.id}"><span class="item-ic">${icon('crown')}</span><div class="item-body">
      <b>${esc(p.n)} · ${brl(p.price)} / ${p.per === 'Anual' ? 'ano' : 'mês'}</b>
      <div class="meta">${st(p.st)}${p.pub ? pill('Publicado', 'ok') : pill('Oculto da landing')}${pill('Ordem ' + p.order)}${p.hl ? pill('Destacado', 'dark') : ''}${pill(p.pid ? 'ID de preço ok' : 'Sem ID de preço', p.pid ? 'ok' : 'warn')}</div>
      <p style="margin-top:8px">${p.feats.join(' · ')}${p.badge ? ' · selo “' + esc(p.badge) + '”' : ''}</p>
      <div class="item-acts">
        <button class="btn btn-ghost btn-sm" data-pa="status">${p.st === 'ACTIVE' ? 'Voltar a rascunho' : 'Ativar'}</button>
        <button class="btn btn-ghost btn-sm" data-pa="pub">${p.pub ? 'Ocultar da landing' : 'Publicar na landing'}</button>
        <button class="btn btn-ghost btn-sm" data-pa="hl">${p.hl ? 'Remover destaque' : 'Destacar'}</button>
        <button class="btn btn-ghost btn-sm" data-pa="edit">Editar</button>
        <button class="btn btn-ghost btn-sm" data-pa="sync">${icon('refresh')}Sincronizar</button>
        <a class="btn btn-ghost btn-sm" href="planos.html" target="_blank" rel="noopener">Ver na landing</a>
      </div></div></div>`).join('')}</div>`;
  const planForm = (p = {}) => `<div class="sh-form">
      <label class="field"><span>Nome comercial</span><input class="ctl" id="pfN" value="${esc(p.n || '')}"><small>Aparece na landing e no cadastro.</small></label>
      <label class="field"><span>Identificador (slug)</span><input class="ctl" id="pfSlug" value="${esc(p.slug || '')}"><small>Letras minúsculas, números e hífen. Usado na URL (?plano=essencial).</small></label>
      <label class="field"><span>Preço</span><input class="ctl" id="pfPrice" inputmode="decimal" value="${p.price ? String(p.price).replace('.', ',') : ''}" placeholder="99,90"><small>Sem R$. É o valor mostrado na landing.</small></label>
      <label class="field"><span>Periodicidade</span><select class="ctl" id="pfPer"><option ${p.per !== 'Anual' ? 'selected' : ''}>Mensal</option><option ${p.per === 'Anual' ? 'selected' : ''}>Anual</option></select></label>
      <label class="field"><span>ID do preço na plataforma de pagamento</span><input class="ctl mono" id="pfPid" value="${esc(p.pid || '')}"><small>Sem ele, use Sincronizar depois de criar o plano.</small></label>
      <div class="field"><span>Recursos</span><div class="checks-row">${FEATS.map(f => `<label class="chk"><input type="checkbox" value="${f}" ${(p.feats || []).includes(f) ? 'checked' : ''}>${f}</label>`).join('')}</div></div>
      <label class="field"><span>Ordem na landing</span><input class="ctl" id="pfOrder" type="number" min="1" value="${p.order || PLANOS.length + 1}"></label>
      <label class="field"><span>Selo</span><input class="ctl" id="pfBadge" value="${esc(p.badge || '')}" placeholder="Ex.: Mais completo"></label>
      <label class="field"><span>Texto do botão</span><input class="ctl" id="pfCta" value="${esc(p.cta || '')}" placeholder="Vazio: o sistema escolhe"></label></div>`;
  V.planos.bind = () => {
    $('plNew').addEventListener('click', () => openSheet('ok', sheetHead('crown', 'Planos', 'Criar plano', 'Ele nasce como rascunho e fora da landing.') + planForm() + `<div class="sh-actions"><button class="btn btn-primary" data-go="plSave">Criar rascunho</button></div>`));
    document.querySelectorAll('[data-pa]').forEach(b => b.addEventListener('click', () => {
      const p = PLANOS.find(x => x.id === b.closest('[data-p]').dataset.p), a = b.dataset.pa;
      if (a === 'status') { p.st = p.st === 'ACTIVE' ? 'DRAFT' : 'ACTIVE'; if (p.st === 'DRAFT') p.pub = false; toast(p.st === 'ACTIVE' ? 'Plano ativado.' : 'Plano voltou a rascunho.'); }
      if (a === 'pub') { if (!p.pub && p.st !== 'ACTIVE') return toast('Ative o plano antes de publicar.'); p.pub = !p.pub; toast(p.pub ? 'Publicado na landing.' : 'Oculto da landing.'); }
      if (a === 'hl') { const on = !p.hl; PLANOS.forEach(x => { x.hl = false; }); p.hl = on; toast(on ? p.n + ' destacado.' : 'Destaque removido.'); }
      if (a === 'sync') { if (!p.pid) p.pid = 'preco_' + p.slug + '_' + p.per.toLowerCase(); toast('Plano sincronizado com a plataforma de pagamento.'); }
      if (a === 'edit') return openSheet('ok', sheetHead('crown', 'Planos', 'Editar ' + esc(p.n)) + planForm(p) + `<div class="sh-actions"><button class="btn btn-primary" data-go="plSave" data-id="${p.id}">Salvar</button></div>`);
      AUDIT.unshift(['plan.update', 'operacao@exemplo.com', 'Plan', now()]); render(true);
    }));
  };

  // --- Assinaturas / Pagamentos / Faturas / Reconciliação ---
  V.assinaturas = () => head('Assinaturas', 'Assinaturas das empresas.') + table([['Empresa'], ['Plano'], ['Status'], ['Fim do período'], ['Cancela no fim']],
    EMPRESAS.map(e => `<tr class="link" data-go-href="#empresas/${e.id}"><td><b>${esc(e.n)}</b></td><td>${e.plan}</td><td>${st(e.bill)}</td><td>${e.bill === 'ACTIVE' || e.bill === 'PAST_DUE' ? '05/11/2026' : '—'}</td><td>${e.bill === 'CANCELED' ? pill('Sim', 'warn') : 'Não'}</td></tr>`));
  V.assinaturas.bind = () => rowLinks();
  V.pagamentos = () => head('Pagamentos', 'Cobranças da plataforma de pagamento espelhadas aqui.', `<button class="btn btn-ghost btn-sm" data-retry>${icon('refresh')}Atualizar</button>`) +
    table([['Data'], ['Empresa'], ['Valor', 'num'], ['Método'], ['Status']], PAGAMENTOS.map(p => `<tr><td>${p[0]}</td><td><b>${esc(p[1])}</b></td><td class="num">${brl(p[2])}</td><td>${p[3]}</td><td>${pill(p[4], p[4] === 'Pago' ? 'ok' : 'err')}</td></tr>`), 'Nenhum pagamento.');
  V.faturas = () => head('Faturas', 'Faturas locais. A fatura da plataforma de pagamento não é NFS-e brasileira.', `<button class="btn btn-ghost btn-sm" data-retry>${icon('refresh')}Atualizar</button>`) +
    table([['Número'], ['Empresa'], ['Valor', 'num'], ['Vencimento'], ['Status']], FATURAS.map(f => `<tr><td class="mono"><b>${f[0]}</b></td><td>${esc(f[1])}</td><td class="num">${brl(f[2])}</td><td>${f[3]}</td><td>${pill(f[4], f[4] === 'Paga' ? 'ok' : 'warn')}</td></tr>`), 'Nenhuma fatura.');
  V.reconciliacao = () => head('Reconciliação', 'Diferenças entre o registro local e a plataforma de pagamento.', `<button class="btn btn-ghost btn-sm" data-retry>${icon('refresh')}Verificar de novo</button>`) + `
    <div class="card">${DIVERG.filter(d => !d.ok).map(d => `<div class="item" data-d="${d.id}"><span class="item-ic" style="background:#fff6e0;color:#8a5a00;border-color:#f6e3b8">${icon('scale')}</span><div class="item-body"><b>${esc(d.emp)}</b><p>${d.txt}</p></div><button class="btn btn-primary btn-sm" data-dfix>Marcar como resolvida</button></div>`).join('') || '<p class="empty">Nenhuma divergência encontrada.</p>'}</div>`;
  [V.pagamentos, V.faturas, V.reconciliacao].forEach(v => { v.bind = () => document.querySelectorAll('[data-retry]').forEach(b => b.addEventListener('click', () => toast('Dados atualizados.'))); });
  const recBind = V.reconciliacao.bind;
  V.reconciliacao.bind = () => { recBind(); document.querySelectorAll('[data-dfix]').forEach(b => b.addEventListener('click', () => { DIVERG.find(d => d.id === b.closest('[data-d]').dataset.d).ok = true; render(true); toast('Divergência resolvida.'); })); };

  // --- Landing ---
  V.landing = () => head('Landing', 'A página pública é o site. Aqui dá para esconder a seção de preços. Os planos publicados vêm de Billing → Planos.', `<a class="btn btn-ghost btn-sm" href="#billing/planos">${icon('crown')}Ir para planos</a>`) + `
    <div class="card" style="max-width:760px"><div class="form-grid">
      <label class="field full"><span>Título principal</span><input class="ctl" id="lnH" value="${esc(LANDING.h)}"></label>
      <label class="field full"><span>Subtítulo</span><textarea class="ctl" id="lnSub">${esc(LANDING.sub)}</textarea></label>
      <label class="field full"><span>Botão principal</span><input class="ctl" id="lnCta" value="${esc(LANDING.cta)}"></label>
      <div class="field full"><div class="checks-row"><label class="chk"><input type="checkbox" id="lnPlans" ${LANDING.plans ? 'checked' : ''}>Mostrar planos</label><label class="chk"><input type="checkbox" id="lnDemo" ${LANDING.demo ? 'checked' : ''}>Mostrar demonstração</label></div></div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:18px"><span class="muted" style="font-size:14px">${PLANOS.filter(p => p.pub && p.st === 'ACTIVE').length} plano(s) público(s) ativo(s).</span><button class="btn btn-primary" id="lnSave">Salvar</button></div></div>`;
  V.landing.bind = () => $('lnSave').addEventListener('click', () => {
    if (!$('lnH').value.trim()) { $('lnH').classList.add('err'); $('lnH').focus(); return toast('O título não pode ficar vazio.'); }
    Object.assign(LANDING, { h: $('lnH').value.trim(), sub: $('lnSub').value.trim(), cta: $('lnCta').value.trim(), plans: $('lnPlans').checked, demo: $('lnDemo').checked });
    toast('Landing salva.');
  });

  // --- FAQ do cliente ---
  V.faq = () => head('FAQ do cliente', 'Perguntas do app do cliente e contato (e-mail e WhatsApp) exibidos em Dúvidas frequentes.') + `
    <div class="grid-2">
      <div class="card"><div class="card-head"><h2>Contato</h2></div><div class="form-grid">
        <label class="field"><span>E-mail</span><input class="ctl" id="fqMail" type="email" value="${esc(FAQ.email)}" placeholder="contato@seudominio.com"></label>
        <label class="field"><span>WhatsApp</span><input class="ctl" id="fqWa" inputmode="tel" value="${esc(FAQ.whats)}" placeholder="(85) 99999-9999"></label></div>
        <button class="btn btn-primary btn-sm" id="fqSaveC" style="margin-top:14px">Salvar contato</button></div>
      <div class="card"><div class="card-head"><h2>Nova pergunta</h2></div><div class="form-grid">
        <label class="field full"><span>Pergunta</span><input class="ctl" id="fqQ"></label>
        <label class="field full"><span>Resposta</span><textarea class="ctl" id="fqA"></textarea></label>
        <label class="field"><span>Ordem</span><input class="ctl" id="fqO" type="number" min="0" value="${FAQ.items.length}"></label></div>
        <button class="btn btn-primary btn-sm" id="fqAdd" style="margin-top:14px">${icon('plus')}Adicionar</button></div>
    </div>
    <div class="card" style="margin-top:16px"><div class="card-head"><h2>Perguntas publicadas</h2>${pill(FAQ.items.length)}</div>
      ${FAQ.items.slice().sort((a, b) => a.o - b.o).map(it => `<div class="item" data-q="${FAQ.items.indexOf(it)}"><span class="item-ic">${icon('help')}</span><div class="item-body"><b>${esc(it.q)}</b><p>${esc(it.a)}</p><div class="item-acts">${pill('Ordem ' + it.o)}<button class="btn btn-ghost btn-sm" data-qa="edit">Editar</button><button class="btn btn-danger btn-sm" data-qa="rm">Remover</button></div></div></div>`).join('') || '<p class="empty">Nenhuma pergunta.</p>'}</div>`;
  V.faq.bind = () => {
    $('fqSaveC').addEventListener('click', () => { FAQ.email = $('fqMail').value.trim(); FAQ.whats = $('fqWa').value.trim(); toast('Contato salvo.'); });
    $('fqAdd').addEventListener('click', () => {
      if (!$('fqQ').value.trim() || !$('fqA').value.trim()) { ['fqQ', 'fqA'].forEach(i => $(i).classList.toggle('err', !$(i).value.trim())); return toast('Preencha pergunta e resposta.'); }
      FAQ.items.push({ q: $('fqQ').value.trim(), a: $('fqA').value.trim(), o: +$('fqO').value || 0 }); render(true); toast('Pergunta adicionada.');
    });
    document.querySelectorAll('[data-qa]').forEach(b => b.addEventListener('click', () => {
      const i = +b.closest('[data-q]').dataset.q, it = FAQ.items[i];
      if (b.dataset.qa === 'rm') return openSheet('err', sheetHead('alert', 'FAQ', 'Remover esta pergunta?', esc(it.q)) + `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Cancelar</button><button class="btn btn-err" data-go="fqRm" data-id="${i}">Remover</button></div>`);
      openSheet('ok', sheetHead('help', 'FAQ', 'Editar pergunta') + `<div class="sh-form"><label class="field"><span>Pergunta</span><input class="ctl" id="feQ" value="${esc(it.q)}"></label><label class="field"><span>Resposta</span><textarea class="ctl" id="feA">${esc(it.a)}</textarea></label><label class="field"><span>Ordem</span><input class="ctl" id="feO" type="number" value="${it.o}"></label></div><div class="sh-actions"><button class="btn btn-primary" data-go="fqEdit" data-id="${i}">Salvar</button></div>`);
    }));
  };

  // --- E-mails ---
  V.emails = () => head('E-mails', 'Diagnóstico do envio e confirmação manual de e-mail.') + `
    <div class="card" style="margin-bottom:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap"><span class="item-ic">${icon('mail')}</span><div style="flex:1;min-width:200px"><b style="color:var(--ink-deep)">Envio: SMTP</b><p class="muted" style="font-size:14px">Entrega externa ativa.</p></div><button class="btn btn-ghost btn-sm" id="smtpTest">Testar SMTP</button></div>
    <div class="card"><div class="card-head"><div><h2>Aguardando confirmação de e-mail</h2><p>Contas que ainda não confirmaram o e-mail.</p></div></div>
      ${EMAILS.filter(m => !m.ok).map(m => `<div class="item" data-m="${m.id}"><span class="av">${m.n.split(' ').map(w => w[0]).join('').slice(0, 2)}</span><div class="item-body"><b>${esc(m.n)}</b><p>${esc(m.e)} · criado em ${m.at}</p></div><div class="item-acts" style="margin:0"><button class="btn btn-ghost btn-sm" data-ma="resend">Reenviar</button><button class="btn btn-primary btn-sm" data-ma="ok">Confirmar manualmente</button></div></div>`).join('') || '<p class="empty">Ninguém aguardando confirmação.</p>'}</div>`;
  V.emails.bind = () => {
    $('smtpTest').addEventListener('click', () => toast('E-mail de teste enviado.'));
    document.querySelectorAll('[data-ma]').forEach(b => b.addEventListener('click', () => {
      const m = EMAILS.find(x => x.id === b.closest('[data-m]').dataset.m);
      if (b.dataset.ma === 'resend') return toast('Confirmação reenviada para ' + m.e + '.');
      m.ok = true; AUDIT.unshift(['user.email.confirm', 'operacao@exemplo.com', 'User', now()]); render(true); toast('E-mail confirmado manualmente.');
    }));
  };

  // --- Auditoria ---
  V.auditoria = () => head('Auditoria', 'Trilha de ações na plataforma.') + `<div class="filters">${searchBox('auQ', 'Ação, pessoa ou entidade')}${sel('auT', 'Tipo', [['all', 'Todas'], ['admin', 'Administração'], ['auth', 'Login'], ['company', 'Empresas'], ['plan', 'Planos']], 'all')}</div>` +
    table([['Ação'], ['Quem'], ['Entidade'], ['Quando']], AUDIT.map(a => `<tr data-type="${a[0].split('.')[0]}"><td class="mono"><b>${a[0]}</b></td><td>${esc(a[1])}</td><td>${a[2]}</td><td>${a[3]}</td></tr>`));
  V.auditoria.bind = () => {
    filterRows('auQ', '#view tbody');
    $('auT').addEventListener('change', e => document.querySelectorAll('#view tbody tr').forEach(tr => { tr.hidden = e.target.value !== 'all' && tr.dataset.type !== e.target.value; }));
  };

  // --- Configurações ---
  V.configuracoes = () => head('Configurações', 'Somente leitura. Segredos (chaves, cookies, banco) não aparecem aqui.') + `
    <div class="grid-2"><div class="card"><div class="card-head"><h2>Regras da plataforma</h2></div><div class="kv">
      <div><span>Período de segurança do cashback</span><b>0 h</b></div><div><span>Validade do voucher</span><b>10 min</b></div>
      <div><span>Aviso de cashback a expirar</span><b>7 dias</b></div><div><span>Teto do score de fraude</span><b>100</b></div></div></div>
    <div class="card"><div class="card-head"><h2>Integrações</h2></div><div class="kv">
      <div><span>Envio de e-mails</span><b>SMTP</b></div><div><span>Plataforma de pagamento</span><b>${pill('A configurar', 'warn')}</b></div>
      <div><span>Landing · planos públicos</span><b><a class="back-link" style="margin:0" href="#billing/planos">${PLANOS.filter(p => p.pub).length}</a></b></div><div><span>FAQ do cliente</span><b><a class="back-link" style="margin:0" href="#faq">Perguntas, e-mail e WhatsApp</a></b></div></div></div></div>`;

  // --- Saúde do sistema ---
  V.sistema = () => head('Saúde do sistema', 'Serviços, integrações e webhooks. Segredos não são exibidos.', `<button class="btn btn-ghost btn-sm" id="svcRetry">${icon('refresh')}Verificar de novo</button>`) + `
    <div class="grid-2">${SVC.map(([n, d, k]) => `<div class="svc"><span class="dot" style="--c:${k === 'ok' ? '#0fa36e' : k === 'warn' ? '#e0a100' : '#dc4b4b'}"></span><div><b>${n}</b><small>${d}</small></div>${pill(k === 'ok' ? 'Normal' : 'Atenção', k === 'ok' ? 'ok' : 'warn')}</div>`).join('')}</div>
    <p class="muted" style="margin-top:14px;font-size:13.5px">Última verificação: ${now()}</p>`;
  V.sistema.bind = () => $('svcRetry').addEventListener('click', () => { render(true); toast('Serviços verificados.'); });

  // ================= ações das janelas =================
  $('shBody').addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    const go = b.dataset.go, id = b.dataset.id;
    if (go === 'close') return closeSheet();
    if (go === 'emOff') { EMPRESAS.find(x => x.id === id).st = 'INACTIVE'; AUDIT.unshift(['company.deactivate', 'operacao@exemplo.com', 'Company', now()]); closeSheet(); render(); toast('Empresa desativada.'); }
    if (go === 'clBlock') { CLIENTES.find(x => x.id === id).st = 'BLOCKED'; closeSheet(); render(); toast('Cliente bloqueado.'); }
    if (go === 'frResolve' || go === 'frReview') {
      const f = FRAUDES.find(x => x.id === id);
      if (go === 'frResolve' && !$('frNote').value.trim()) { $('frNote').classList.add('err'); $('frNote').focus(); return toast('Escreva uma nota para encerrar.'); }
      f.st = go === 'frResolve' ? 'RESOLVED' : 'REVIEW'; AUDIT.unshift(['fraud.review', 'operacao@exemplo.com', 'RiskEvent', now()]);
      closeSheet(); updFraud(); render(true); toast(go === 'frResolve' ? 'Evento resolvido.' : 'Mantido em revisão.');
    }
    if (go === 'plSave') {
      const n = $('pfN').value.trim(), slug = $('pfSlug').value.trim(), price = parseFloat($('pfPrice').value.replace(',', '.'));
      const bad = [['pfN', !n], ['pfSlug', !/^[a-z0-9-]+$/.test(slug)], ['pfPrice', !(price > 0)]].filter(x => x[1]);
      document.querySelectorAll('.sh-form .ctl').forEach(i => i.classList.remove('err'));
      if (bad.length) { bad.forEach(([i]) => $(i).classList.add('err')); $(bad[0][0]).focus(); return toast('Confira os campos marcados.'); }
      const data = { n, slug, price, per: $('pfPer').value, pid: $('pfPid').value.trim(), order: +$('pfOrder').value || 1, badge: $('pfBadge').value.trim(), cta: $('pfCta').value.trim(), feats: [...document.querySelectorAll('.sh-form .chk input:checked')].map(i => i.value) };
      if (id) Object.assign(PLANOS.find(p => p.id === id), data); else PLANOS.push({ id: 'p' + Date.now(), st: 'DRAFT', pub: false, hl: false, ...data });
      AUDIT.unshift(['plan.' + (id ? 'update' : 'create'), 'operacao@exemplo.com', 'Plan', now()]); closeSheet(); render(); toast(id ? 'Plano salvo.' : 'Plano criado como rascunho.');
    }
    if (go === 'fqRm') { FAQ.items.splice(+id, 1); closeSheet(); render(true); toast('Pergunta removida.'); }
    if (go === 'fqEdit') { Object.assign(FAQ.items[+id], { q: $('feQ').value.trim(), a: $('feA').value.trim(), o: +$('feO').value || 0 }); closeSheet(); render(true); toast('Pergunta salva.'); }
  });

  // ================= rotas =================
  const ROUTES = {
    dashboard: ['Operação', 'Dashboard'], busca: ['Operação', 'Busca global'], nfce: ['Operação', 'NFC-e'], vouchers: ['Operação', 'Vouchers'], fraudes: ['Operação', 'Fraudes'],
    empresas: ['Cadastros', 'Empresas'], clientes: ['Cadastros', 'Clientes'], usuarios: ['Cadastros', 'Usuários'],
    billing: ['Billing', 'Visão geral'], 'billing/planos': ['Billing', 'Planos'], 'billing/assinaturas': ['Billing', 'Assinaturas'], 'billing/pagamentos': ['Billing', 'Pagamentos'],
    'billing/faturas': ['Billing', 'Faturas'], 'billing/reconciliacao': ['Billing', 'Reconciliação'], landing: ['Programa', 'Landing'], faq: ['Programa', 'FAQ do cliente'],
    emails: ['Sistema', 'E-mails'], auditoria: ['Sistema', 'Auditoria'], configuracoes: ['Sistema', 'Configurações'], sistema: ['Sistema', 'Saúde do sistema']
  };
  const VIEW_OF = { 'billing/planos': 'planos', 'billing/assinaturas': 'assinaturas', 'billing/pagamentos': 'pagamentos', 'billing/faturas': 'faturas', 'billing/reconciliacao': 'reconciliacao' };
  const route = { key: 'dashboard', view: 'dashboard', param: null };
  function render(keepScroll) {
    const y = scrollY;
    $('view').innerHTML = `<section class="view on">${V[route.view](route.param)}</section>`;
    if (V[route.view].bind) V[route.view].bind(route.param);
    if (keepScroll) { $('view').firstElementChild.style.animation = 'none'; scrollTo(0, y); }
  }
  const go = () => {
    const h = location.hash.slice(1) || 'dashboard';
    let key = ROUTES[h] ? h : 'dashboard', view = VIEW_OF[key] || key, param = null, title;
    if (/^empresas\/.+/.test(h)) { key = 'empresas'; view = 'empresa'; param = h.split('/')[1]; title = (EMPRESAS.find(e => e.id === param) || {}).n; }
    if (/^clientes\/.+/.test(h)) { key = 'clientes'; view = 'cliente'; param = h.split('/')[1]; title = (CLIENTES.find(c => c.id === param) || {}).n; }
    const changed = view !== route.view || param !== route.param;
    Object.assign(route, { key, view, param });
    const [grp, t] = ROUTES[key];
    $('crumbGrp').textContent = grp; $('crumb').textContent = title || t;
    document.title = (title || t) + ' — Administração Muito Mais';
    document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    closeSheet(); setMenu(false); render();
    if (changed) scrollTo(0, 0);
  };
  addEventListener('hashchange', go);

  // busca do topo
  $('topSearch').addEventListener('submit', e => { e.preventDefault(); SEARCH.q = $('topQ').value.trim(); $('topQ').value = ''; if (location.hash === '#busca') render(); else location.hash = 'busca'; });

  // menu no celular
  const setMenu = on => { document.body.classList.toggle('menu-open', on); $('menuBtn').setAttribute('aria-expanded', on); };
  $('menuBtn').addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $('scrim').addEventListener('click', () => setMenu(false));

  updFraud();
  go();
})();
