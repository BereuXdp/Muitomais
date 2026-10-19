// Muito Mais — painel da empresa (mesmas áreas do painel original, com dados de exemplo)
(() => {
  const $ = id => document.getElementById(id);
  const icon = (n, s = '') => `<svg class="ic"${s ? ` style="${s}"` : ''}><use href="#i-${n}"/></svg>`;
  const brl = v => (v < 0 ? '− ' : '') + 'R$ ' + Math.abs(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const num = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initials = n => n.split(' ').filter(w => /^[A-ZÀ-Ú]/.test(w)).map(w => w[0]).join('').slice(0, 2) || n[0].toUpperCase();
  const today = new Date();
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmtD = d => d.toLocaleDateString('pt-BR');
  const fmtLong = d => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  let seed = 11;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  // ================= dados de exemplo (trocar pela API) =================
  const UNITS = [
    { id: 'u1', n: 'BELLA CENTRO', rs: 'BELLA MESA RESTAURANTES LTDA', cnpj: '12.345.678/0001-90', city: 'Fortaleza/CE', on: true, a1: '21/08/2027' },
    { id: 'u2', n: 'BELLA JARDINS', rs: 'BELLA JARDINS ALIMENTOS LTDA', cnpj: '23.456.789/0001-01', city: 'Fortaleza/CE', on: true, a1: '05/02/2027' },
    { id: 'u3', n: 'BELLA SHOPPING', rs: 'BELLA SHOPPING GASTRONOMIA LTDA', cnpj: '34.567.890/0001-12', city: 'Fortaleza/CE', on: true, a1: null }
  ];
  const ST = { NEW: ['Novo', 'info'], RECURRING: ['Recorrente', 'ok'], ACTIVE: ['Ativo', 'ok'], AT_RISK: ['Em risco', 'warn'], INACTIVE: ['Inativo', ''] };
  const CLIENTS = [
    { id: 'c1', n: 'Mariana Costa', d: '1699', last: '09/09/2026', since: 47, first: '30/08/2026', buys: 7, ticket: 206.06, cb: 37.40, used: 0, freq: 5.0, st: 'AT_RISK', u: 'u1', day: 'segunda-feira', prod: 'Risoto de cogumelos' },
    { id: 'c2', n: 'Rafael Souza', d: '2231', last: '14/10/2026', since: 80, first: '28/07/2026', buys: 12, ticket: 98.50, cb: 54.20, used: 22.00, freq: 3.2, st: 'RECURRING', u: 'u2', day: 'sexta-feira', prod: 'Chopp 300ml' },
    { id: 'c3', n: 'Juliana Alves', d: '8810', last: '15/10/2026', since: 1, first: '15/10/2026', buys: 1, ticket: 324.15, cb: 32.41, used: 0, freq: null, st: 'NEW', u: 'u1', day: 'quinta-feira', prod: 'Massa da casa' },
    { id: 'c4', n: 'Pedro Henrique', d: '5521', last: '12/10/2026', since: 26, first: '20/09/2026', buys: 4, ticket: 142.30, cb: 22.80, used: 10.00, freq: 6.5, st: 'ACTIVE', u: 'u3', day: 'sábado', prod: 'Pizza margherita' },
    { id: 'c5', n: 'Camila Rocha', d: '0094', last: '02/08/2026', since: 120, first: '18/06/2026', buys: 3, ticket: 88.00, cb: 12.10, used: 0, freq: 9.0, st: 'INACTIVE', u: 'u2', day: 'domingo', prod: 'Água sem gás' },
    { id: 'c6', n: 'Bruno Martins', d: '7713', last: '16/10/2026', since: 64, first: '13/08/2026', buys: 9, ticket: 175.40, cb: 61.30, used: 35.00, freq: 4.1, st: 'RECURRING', u: 'u1', day: 'terça-feira', prod: 'Chopp 300ml' },
    { id: 'c7', n: 'Larissa Melo', d: '3348', last: '11/10/2026', since: 15, first: '01/10/2026', buys: 2, ticket: 260.00, cb: 26.00, used: 0, freq: 7.0, st: 'ACTIVE', u: 'u3', day: 'sexta-feira', prod: 'Petit gâteau' },
    { id: 'c8', n: 'Thiago Nunes', d: '6620', last: '20/09/2026', since: 55, first: '22/08/2026', buys: 5, ticket: 120.00, cb: 18.50, used: 0, freq: 8.0, st: 'AT_RISK', u: 'u2', day: 'quarta-feira', prod: 'Pastel de queijo' },
    { id: 'c9', n: 'Fernanda Lima', d: '4410', last: '13/10/2026', since: 33, first: '13/09/2026', buys: 6, ticket: 133.70, cb: 30.10, used: 12.50, freq: 5.5, st: 'RECURRING', u: 'u1', day: 'sexta-feira', prod: 'Risoto de cogumelos' }
  ];
  CLIENTS.forEach(c => { c.total = +(c.buys * c.ticket).toFixed(2); });
  const unitName = id => (UNITS.find(u => u.id === id) || {}).n || '—';

  const TX = [
    { dt: '16/10/2026, 20:14', c: 'Bruno Martins', u: 'u1', desc: 'Cashback', nf: '25891', v: 17.54, st: 'Confirmado' },
    { dt: '15/10/2026, 13:02', c: 'Juliana Alves', u: 'u1', desc: 'Cashback', nf: '25877', v: 32.41, st: 'Pendente' },
    { dt: '14/10/2026, 21:40', c: 'Rafael Souza', u: 'u2', desc: 'Resgate de cashback', nf: '10988', v: -22.00, st: 'Confirmado' },
    { dt: '14/10/2026, 21:38', c: 'Rafael Souza', u: 'u2', desc: 'Cashback', nf: '10988', v: 9.85, st: 'Confirmado' },
    { dt: '13/10/2026, 19:22', c: 'Fernanda Lima', u: 'u1', desc: 'Recompensa de missão', nf: null, v: 5.00, st: 'Confirmado' },
    { dt: '12/10/2026, 12:51', c: 'Pedro Henrique', u: 'u3', desc: 'Cashback', nf: '31204', v: 14.23, st: 'Confirmado' },
    { dt: '11/10/2026, 20:05', c: 'Larissa Melo', u: 'u3', desc: 'Cashback dividido na mesa', nf: '31188', v: 13.00, st: 'Confirmado' },
    { dt: '09/09/2026, 19:42', c: 'Mariana Costa', u: 'u2', desc: 'Cashback', nf: '10949', v: 16.07, st: 'Confirmado' },
    { dt: '09/09/2026, 16:16', c: 'Mariana Costa', u: 'u1', desc: 'Cashback', nf: '25576', v: 10.19, st: 'Confirmado' }
  ];
  const VOUCHERS = [
    { code: 'VCH-7F3K', c: 'Rafael Souza', v: 22.00, u: 'u2', st: 'Usado', dt: '14/10/2026, 21:40' },
    { code: 'VCH-2M9Q', c: 'Bruno Martins', v: 35.00, u: 'u1', st: 'Usado', dt: '10/10/2026, 20:11' },
    { code: 'VCH-8P1Z', c: 'Fernanda Lima', v: 12.50, u: 'u1', st: 'Reservado', dt: '16/10/2026, 12:30' },
    { code: 'VCH-5T6W', c: 'Pedro Henrique', v: 10.00, u: 'u3', st: 'Expirado', dt: '01/09/2026, 19:05' }
  ];
  const CUPONS = [
    { u: 'u1', sit: 'VALIDADO', v: 22.10, key: '4830', tags: [['Confirmado', 'ok'], ['Confirmado sem cashback', ''], ['Valor abaixo do mínimo do programa', 'warn']], sefaz: 'Consulta à SEFAZ concluída. Cupom confirmado.', at: '06/10/2026, 19:23' },
    { u: 'u1', sit: 'VALIDADO', v: 324.15, key: '5011', tags: [['Confirmado', 'ok'], ['Cashback gerado', 'ok']], sefaz: 'Consulta à SEFAZ concluída. Cupom confirmado.', at: '06/10/2026, 19:22' },
    { u: 'u2', sit: 'PENDENTE', v: 139.00, key: '4967', tags: [['Aguardando SEFAZ', 'warn']], sefaz: 'Nota ainda não disponível na SEFAZ. Nova tentativa automática.', at: '06/10/2026, 19:22' },
    { u: 'u3', sit: 'VALIDADO', v: 87.36, key: '5043', tags: [['Confirmado', 'ok'], ['Cashback gerado', 'ok']], sefaz: 'Consulta à SEFAZ concluída. Cupom confirmado.', at: '05/10/2026, 13:10' },
    { u: 'u2', sit: 'REJEITADO', v: 297.92, key: '5038', tags: [['Rejeitado', 'err'], ['CNPJ não pertence à empresa', 'err']], sefaz: 'O emitente da nota não é uma unidade cadastrada.', at: '04/10/2026, 21:02' },
    { u: 'u1', sit: 'VALIDADO', v: 1479.97, key: '6310', tags: [['Confirmado', 'ok'], ['Cashback no teto', 'info']], sefaz: 'Consulta à SEFAZ concluída. Cupom confirmado.', at: '02/10/2026, 11:02' }
  ];
  const RISKS = [
    { id: 'r1', n: 'Thiago Nunes', uid: '0c75d95a', score: 45, lvl: 'MEDIUM', rule: 'NFCE_BURST', ruleTxt: 'Muitas NFC-e em curto período', doc: '4830', at: '06/10/2026, 19:23', st: 'open', note: '' },
    { id: 'r2', n: 'Thiago Nunes', uid: '0c75d95a', score: 45, lvl: 'MEDIUM', rule: 'NFCE_BURST', ruleTxt: 'Muitas NFC-e em curto período', doc: '5011', at: '06/10/2026, 19:22', st: 'open', note: '' },
    { id: 'r3', n: 'Larissa Melo', uid: '9b21e4c0', score: 72, lvl: 'HIGH', rule: 'TICKET_SPIKE', ruleTxt: 'Valor muito acima do ticket habitual', doc: '6310', at: '02/10/2026, 11:02', st: 'open', note: '' },
    { id: 'r4', n: 'Bruno Martins', uid: '41aa0f73', score: 28, lvl: 'LOW', rule: 'SHARED_DEVICE', ruleTxt: 'Mesmo aparelho usado em outra conta', doc: '5043', at: '28/09/2026, 20:40', st: 'approved', note: 'Casal usa o mesmo celular.' }
  ];
  const PROGRAM = { name: 'Programa padrão', on: true, v: 3, pct: 10, min: 50, cap: 10000, days: 45, hours: 48, minRedeem: 1, maxUse: 30, split: true, people: 10, units: ['u1', 'u2', 'u3'] };
  const VERSIONS = [
    { v: 3, pct: 10, min: 50, cap: 10000, days: 45 },
    { v: 2, pct: 5, min: 200, cap: 200, days: 90 },
    { v: 1, pct: 5, min: 30, cap: 50, days: 90 }
  ];
  const MISSIONS = [
    { id: 'm1', n: 'Volte 3x no mês', d: 'Ganhe 5% extra na terceira visita do mês.', from: '01/10/2026', to: '31/10/2026', kind: 'pct', val: 5, st: 'Ativa', done: 14, extra: 86.40, sales: 2140.00 },
    { id: 'm2', n: 'Almoço na semana', d: 'R$ 6 de cashback extra no almoço de segunda a sexta.', from: '06/10/2026', to: '31/10/2026', kind: 'fix', val: 6, st: 'Ativa', done: 9, extra: 54.00, sales: 980.00 },
    { id: 'm3', n: 'Prove um prato do novo menu', d: 'Ganhe cashback extra ao experimentar o novo menu.', from: '01/09/2026', to: '30/09/2026', kind: 'pct', val: 3, st: 'Encerrada', done: 31, extra: 112.70, sales: 3756.00 }
  ];
  const STAFF = [
    { n: 'Ana Ribeiro', e: 'ana@bellamesa.com.br', r: 'Proprietária', st: 'ACTIVE', owner: true },
    { n: 'Marcos Lima', e: 'marcos@bellamesa.com.br', r: 'Gerente', st: 'ACTIVE' },
    { n: 'Paula Dias', e: 'paula@bellamesa.com.br', r: 'Caixa', st: 'INVITED' }
  ];
  const KEYS = [{ id: 'k1', tail: 'mtQY', at: '15 set 2026' }];
  const COMPANY = { rs: 'BELLA MESA RESTAURANTES LTDA', fant: 'Grupo Bella Mesa', status: 'ACTIVE' };
  const PLANS = {
    essencial: { name: 'Essencial', price: 99, multi: false, feats: ['Cashback', 'Missões'] },
    profissional: { name: 'Profissional', price: 197, multi: false, feats: ['Cashback', 'Missões', 'Analytics', 'Validação de NFC-e', 'Segmentação', '1 unidade', '5 usuários', '10 missões ativas'] },
    redes: { name: 'Redes', price: 597, multi: true, feats: ['Cashback', 'Missões', 'Analytics', 'Validação de NFC-e', 'Segmentação', 'Multiunidade', '20 usuários', '50 missões ativas'] }
  };
  const TRIAL_DAYS = 14;
  const qs = new URLSearchParams(location.search);
  const PLAN = { current: null, trialEnd: null, landing: PLANS[qs.get('plano')] ? qs.get('plano') : null, pick: PLANS[qs.get('plano')] ? qs.get('plano') : 'profissional', units: 3, pay: 'cartao' };

  // ================= utilidades de interface =================
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
  const closeSheet = () => {
    if (sheet.hidden) return;
    sheet.classList.remove('on'); sheet._t = setTimeout(() => { sheet.hidden = true; }, 300);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  };
  $('shClose').addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); setMenu(false); } });
  const sheetHead = (tone, ic, kicker, title, sub) => `<span class="sh-ic">${icon(ic)}</span><p class="sh-kicker">${kicker}</p><h2 class="sh-title" id="shTitle">${title}</h2>${sub ? `<p class="sh-sub">${sub}</p>` : ''}`;
  const pill = (t, k = '') => `<span class="pill ${k}">${t}</span>`;
  const head = (title, sub, acts = '') => `<div class="page-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
  const sel = (id, label, opts, val) => `<label class="field"><span>${label}</span><select class="ctl" id="${id}">${opts.map(([v, t]) => `<option value="${v}" ${v === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;

  // gráfico de barras (SVG) com linha opcional
  const barChart = (vals, labels, { line, color = '#0fa36e', line2 = '#e0a100', stack } = {}) => {
    const W = 600, H = 220, P = { l: 8, r: 8, t: 10, b: 24 };
    const n = vals.length, iw = W - P.l - P.r, ih = H - P.t - P.b, bw = iw / n;
    const max = Math.max(...vals.map((v, i) => v + (stack ? stack[i] : 0)), 1);
    let s = '';
    for (let g = 0; g <= 3; g++) { const y = P.t + ih * g / 3; s += `<line class="gl" x1="${P.l}" x2="${W - P.r}" y1="${y}" y2="${y}"/>`; }
    vals.forEach((v, i) => {
      const h = ih * v / max, x = P.l + i * bw + bw * .18, w = bw * .64;
      s += `<rect x="${x}" y="${P.t + ih - h}" width="${w}" height="${h}" rx="${Math.min(4, w / 3)}" fill="${color}" opacity=".9"><title>${labels[i]}: ${num(v, 0)}</title></rect>`;
      if (stack) { const h2 = ih * stack[i] / max; s += `<rect x="${x}" y="${P.t + ih - h - h2}" width="${w}" height="${h2}" rx="${Math.min(4, w / 3)}" fill="#47d398" opacity=".55"><title>${labels[i]}: ${stack[i]}</title></rect>`; }
      const every = Math.ceil(n / 10);
      if (i % every === 0) s += `<text class="ax" x="${P.l + i * bw + bw / 2}" y="${H - 6}" text-anchor="middle">${labels[i]}</text>`;
    });
    if (line) {
      const lm = Math.max(...line, 1);
      const pts = line.map((v, i) => `${P.l + i * bw + bw / 2},${P.t + ih - ih * .85 * v / lm}`).join(' ');
      s += `<polyline points="${pts}" fill="none" stroke="${line2}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    }
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico">${s}</svg>`;
  };
  const hbars = (rows, fmt = v => num(v)) => {
    const max = Math.max(...rows.map(r => r[1]), 1);
    return `<div class="hbars">${rows.map(([l, v], i) => `<div class="hbar"><span title="${esc(l)}">${esc(l)}</span><span class="track"><i style="--w:${Math.max(2, v / max * 100)}%;animation-delay:${i * 40}ms"></i></span><b>${fmt(v)}</b></div>`).join('')}</div>`;
  };
  const vbars = rows => {
    const max = Math.max(...rows.map(r => r[1]), 1);
    return `<div class="vbars">${rows.map(([l, v], i) => `<div><b>${num(v)}</b><i class="${v === max ? 'top' : ''}" style="--h:${v / max * 100}%;animation-delay:${i * 50}ms"></i>${l}</div>`).join('')}</div>`;
  };
  const donut = parts => {
    const total = parts.reduce((a, p) => a + p[1], 0) || 1; let acc = 0; const R = 54, C = 2 * Math.PI * R;
    const arcs = parts.map(([, v, c]) => { const len = C * v / total; const a = `<circle cx="75" cy="75" r="${R}" fill="none" stroke="${c}" stroke-width="20" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-acc}" transform="rotate(-90 75 75)"/>`; acc += len; return a; }).join('');
    return `<svg class="donut" viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="${R}" fill="none" stroke="#eef3f1" stroke-width="20"/>${arcs}</svg>`;
  };

  // ================= telas =================
  const V = {};
  const PERIOD = { today: ['Hoje', .04], '7d': ['7 dias', .24], '30d': ['30 dias', 1], '90d': ['90 dias', 2.9], custom: ['Personalizado', 1] };
  const DASH = { period: '30d', unit: 'all', sort: 'quantity' };

  V.painel = () => {
    const f = PERIOD[DASH.period][1], uf = DASH.unit === 'all' ? 1 : { u1: .46, u2: .33, u3: .21 }[DASH.unit];
    const k = f * uf;
    const kpis = [
      ['Faturamento no MuitoMais', brl(18420.5 * k), 12.4, true],
      ['Cashback concedido', brl(1842.05 * k), 9.8], ['Cashback utilizado', brl(612.3 * k), 21.5], ['Cashback pendente', brl(486.2 * k), -4.1],
      ['Clientes ativos', num(Math.round(184 * k) || 1), 6.2], ['Novos clientes', num(Math.round(52 * k) || 1), 18.0], ['Clientes recorrentes', num(Math.round(132 * k)), 3.4],
      ['Taxa de resgate', num(33.2, 1) + '%', 2.1], ['Ticket médio', brl(124.8 * (DASH.unit === 'u3' ? 1.12 : 1)), 14.2], ['Frequência média', num(9.4, 1) + ' dias', -6.0],
      ['NFC-e processadas', num(Math.round(412 * k)), 11.3], ['Mesas confirmadas', num(Math.round(38 * k)), 25.0]
    ];
    const n = { today: 12, '7d': 7, '30d': 30, '90d': 13, custom: 30 }[DASH.period];
    const labels = Array.from({ length: n }, (_, i) => DASH.period === 'today' ? (10 + i) + 'h' : DASH.period === '90d' ? 'S' + (i + 1) : fmtD(addDays(today, i - n + 1)).slice(0, 5));
    seed = 7 + n + (DASH.unit.length * 3);
    const sales = labels.map(() => Math.round((400 + rnd() * 900) * uf * (DASH.period === '90d' ? 7 : DASH.period === 'today' ? .12 : 1)));
    const cash = sales.map(v => v * .1);
    const novos = labels.map(() => Math.round(rnd() * 4 * uf * (DASH.period === '90d' ? 5 : 1)));
    const recs = labels.map(() => Math.round(rnd() * 7 * uf * (DASH.period === '90d' ? 5 : 1)));
    const prods = [['Chopp 300ml', 171, 98, 1197], ['Risoto de cogumelos', 88, 80, 5104], ['Pizza margherita', 76, 61, 4332], ['Água sem gás', 70, 52, 420], ['Massa da casa', 64, 60, 3648], ['Refrigerante lata', 59, 44, 413], ['Pastel de queijo', 51, 30, 918], ['Petit gâteau', 43, 41, 1290], ['Caipirinha', 39, 28, 936], ['Salada da casa', 27, 25, 1053]]
      .map(([nm, q, p, s]) => [nm, Math.round(q * k) || 1, Math.round(p * k) || 1, s * k]);
    const si = { quantity: 1, purchases: 2, spend: 3 }[DASH.sort];
    prods.sort((a, b) => b[si] - a[si]);
    const atRisk = CLIENTS.filter(c => c.st === 'AT_RISK');
    const act = MISSIONS.filter(m => m.st === 'Ativa');
    return head('Dashboard', 'Números desta empresa apenas. Totais financeiros usam NFC-e verificadas.') + `
      <div class="filters">
        ${sel('fPeriod', 'Período', Object.entries(PERIOD).map(([v, [t]]) => [v, t]), DASH.period)}
        ${sel('fUnit', 'Unidade', [['all', 'Todas as unidades'], ...UNITS.map(u => [u.id, u.n])], DASH.unit)}
      </div>
      <div class="kpis">${kpis.map(([l, v, d, hl]) => `<div class="kpi${hl ? ' hl' : ''}"><small>${l}</small><strong>${v}</strong><em class="${d >= 0 ? 'up' : 'down'}">${d >= 0 ? '▲' : '▼'} ${num(Math.abs(d), 1)}% vs. período anterior</em></div>`).join('')}</div>

      <div class="card" style="margin-top:16px">
        <div class="card-head"><div><h2>Missões ativas</h2><p>${act.reduce((a, m) => a + m.done, 0)} conclusões · extra ${brl(act.reduce((a, m) => a + m.extra, 0))} · vendas associadas ${brl(act.reduce((a, m) => a + m.sales, 0))}</p></div><a class="btn btn-ghost btn-sm" href="#missoes">Ver missões</a></div>
        <div class="grid-2">${act.map(m => `<div class="item" style="margin:0"><span class="item-ic">${icon('target')}</span><div class="item-body"><b>${esc(m.n)}</b><p>${m.done} conclusões · até ${m.to}</p></div>${pill(m.kind === 'pct' ? '+' + m.val + '%' : '+' + brl(m.val), 'ok')}</div>`).join('') || '<p class="empty">Nenhuma missão ativa.</p>'}</div>
      </div>

      <div class="grid-2" style="margin-top:16px">
        <div class="card span-2"><div class="card-head"><div><h2>Vendas e cashback</h2><p>Evolução das vendas verificadas nesta empresa. A linha mostra o cashback, em escala própria.</p></div></div>
          ${barChart(sales, labels, { line: cash })}
          <div class="legend"><span><i style="--c:#0fa36e"></i>Vendas</span><span><i style="--c:#e0a100"></i>Cashback</span></div></div>
        <div class="card"><div class="card-head"><div><h2>Clientes novos x recorrentes</h2><p>Novo: primeira compra nesta empresa no período. Recorrente: já comprava aqui antes.</p></div></div>
          ${barChart(novos, labels, { stack: recs, color: '#065f46' })}
          <div class="legend"><span><i style="--c:#065f46"></i>Novos</span><span><i style="--c:#9fe3c4"></i>Recorrentes</span></div></div>
        <div class="card"><div class="card-head"><div><h2>Tempo para o cliente retornar</h2><p>Intervalo entre visitas seguidas nesta empresa, quando a volta cai no período.</p></div></div>
          ${hbars([['Até 7 dias', Math.round(46 * k) || 2], ['8–15 dias', Math.round(31 * k)], ['16–30 dias', Math.round(18 * k)], ['31–60 dias', Math.round(7 * k)], ['Mais de 60 dias', Math.round(3 * k)]])}</div>
        <div class="card"><div class="card-head"><div><h2>Cashback gerado x utilizado</h2><p>Quanto do cashback concedido voltou como uso. Pendente não é perda.</p></div></div>
          <div class="donut-wrap">${donut([['Utilizado', 612.3, '#0fa36e'], ['Disponível', 743.55, '#47d398'], ['Pendente', 486.2, '#e0a100']])}
          <div class="donut-legend"><span><i class="pill ok">Utilizado</i><b>${brl(612.3 * k)}</b></span><span><i class="pill">Disponível</i><b>${brl(743.55 * k)}</b></span><span><i class="pill warn">Pendente</i><b>${brl(486.2 * k)}</b></span></div></div></div>
        <div class="card"><div class="card-head"><div><h2>Quando os clientes compram</h2><p>Dia da semana das NFC-e verificadas nesta empresa.</p></div></div>
          ${vbars([['Dom', 38], ['Seg', 12], ['Ter', 41], ['Qua', 33], ['Qui', 47], ['Sex', 96], ['Sáb', 88]].map(([d, v]) => [d, Math.round(v * k)]))}</div>
      </div>

      <div class="sec-title"><h2>Produtos mais consumidos</h2>${sel('fSort', 'Ordenar', [['quantity', 'Quantidade'], ['purchases', 'Nº de compras'], ['spend', 'Valor vendido']], DASH.sort)}</div>
      <div class="grid-2">
        <div class="card"><div class="card-head"><div><h2>Top 10 produtos</h2><p>Somente itens de NFC-e verificadas desta empresa.</p></div></div>
          ${hbars(prods.map(p => [p[0], p[si]]), si === 3 ? v => brl(v) : v => num(v))}</div>
        <div class="card"><div class="card-head"><div><h2>Consumo por categoria</h2><p>12% dos itens ainda não estão categorizados.</p></div></div>
          ${hbars([['Pratos principais', 9840 * k], ['Bebidas', 4120 * k], ['Sobremesas', 1890 * k], ['Entradas', 1210 * k], ['Sem categoria', 1360 * k]], v => brl(v))}</div>
      </div>

      <div class="sec-title"><h2>Clientes que precisam de atenção</h2></div>
      <div class="card">${atRisk.map(c => `<a class="item" href="#clientes/${c.id}" style="display:flex"><span class="item-ic" style="background:#fff6e0;color:#8a5a00;border-color:#f6e3b8">${icon('alert')}</span><div class="item-body"><b>${esc(c.n)}</b><p>Em risco · Recorrente sem comprar acima do intervalo habitual nesta empresa.</p></div>${icon('chev')}</a>`).join('') || '<p class="empty">Nenhum cliente em risco.</p>'}</div>`;
  };
  V.painel.bind = () => {
    $('fPeriod').addEventListener('change', e => { DASH.period = e.target.value; if (DASH.period === 'custom') toast('Escolha de datas personalizada disponível em breve.'); render(); });
    $('fUnit').addEventListener('change', e => { DASH.unit = e.target.value; render(); });
    $('fSort').addEventListener('change', e => { DASH.sort = e.target.value; render(); });
  };

  // --- Clientes ---
  const CL = { q: '', st: 'all', sort: 'lastPurchase', page: 1 };
  const PAGE = 6;
  const pdate = s => { const [d, m, y] = s.split('/'); return new Date(+y, m - 1, +d); };
  V.clientes = () => head('Clientes', 'Relacionamento só com esta empresa. CPF não é exibido.') + `
    <div class="filters">
      <label class="field" style="flex:1 1 220px"><span>Buscar</span><input class="ctl" id="clQ" placeholder="Nome ou final do CPF" value="${esc(CL.q)}"></label>
      ${sel('clSt', 'Status', [['all', 'Todos'], ['NEW', 'Novos'], ['RECURRING', 'Recorrentes'], ['ACTIVE', 'Ativos'], ['AT_RISK', 'Em risco'], ['INACTIVE', 'Inativos']], CL.st)}
      ${sel('clSort', 'Ordenar', [['lastPurchase', 'Última compra'], ['ticket', 'Maior ticket'], ['frequency', 'Maior frequência'], ['balance', 'Maior saldo'], ['spend', 'Maior consumo'], ['purchases', 'Mais compras']], CL.sort)}
    </div>
    <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Cliente</th><th>Última compra</th><th class="num">Compras</th><th class="num">Ticket médio</th><th class="num">Total</th><th class="num">Cashback</th><th>Frequência</th><th>Status</th></tr></thead><tbody id="clBody"></tbody></table></div>
    <div class="pager"><button class="btn btn-ghost btn-sm" id="clPrev">Anterior</button><span id="clInfo"></span><button class="btn btn-ghost btn-sm" id="clNext">Próxima</button></div></div>`;
  V.clientes.bind = () => {
    const draw = () => {
      const q = CL.q.toLowerCase();
      let list = CLIENTS.filter(c => (CL.st === 'all' || c.st === CL.st) && (!q || c.n.toLowerCase().includes(q) || c.d.includes(q)));
      const key = { lastPurchase: c => pdate(c.last), ticket: c => c.ticket, frequency: c => c.freq ? -c.freq : -999, balance: c => c.cb, spend: c => c.total, purchases: c => c.buys }[CL.sort];
      list.sort((a, b) => key(b) - key(a));
      const pages = Math.max(1, Math.ceil(list.length / PAGE)); CL.page = Math.min(CL.page, pages);
      const rows = list.slice((CL.page - 1) * PAGE, CL.page * PAGE);
      $('clBody').innerHTML = rows.map(c => `<tr class="link" data-id="${c.id}"><td><a class="name" href="#clientes/${c.id}">${esc(c.n)}</a><small>****${c.d}</small></td><td>${c.last}</td><td class="num">${c.buys}</td><td class="num">${brl(c.ticket)}</td><td class="num">${brl(c.total)}</td><td class="num">${brl(c.cb)}</td><td>${c.freq ? num(c.freq, 1) + ' dias' : '—'}</td><td>${pill(...ST[c.st])}</td></tr>`).join('') || `<tr><td colspan="8"><p class="empty">Nenhum cliente encontrado.</p></td></tr>`;
      $('clInfo').textContent = `Página ${CL.page} de ${pages} · ${list.length} ${list.length === 1 ? 'cliente' : 'clientes'}`;
      $('clPrev').disabled = CL.page <= 1; $('clNext').disabled = CL.page >= pages;
    };
    $('clQ').addEventListener('input', e => { CL.q = e.target.value; CL.page = 1; draw(); });
    $('clSt').addEventListener('change', e => { CL.st = e.target.value; CL.page = 1; draw(); });
    $('clSort').addEventListener('change', e => { CL.sort = e.target.value; draw(); });
    $('clPrev').addEventListener('click', () => { CL.page--; draw(); });
    $('clNext').addEventListener('click', () => { CL.page++; draw(); });
    $('clBody').addEventListener('click', e => { const tr = e.target.closest('tr[data-id]'); if (tr && !e.target.closest('a')) location.hash = 'clientes/' + tr.dataset.id; });
    draw();
  };

  // --- Cliente (detalhe) ---
  let CTAB = 'geral';
  const purchasesOf = c => {
    seed = c.id.charCodeAt(1) * 31;
    return Array.from({ length: c.buys }, (_, i) => {
      const d = addDays(pdate(c.last), -Math.round(i * (c.freq || 3)));
      const v = +(c.ticket * (.6 + rnd() * .8)).toFixed(2);
      return { d: fmtD(d), u: i % 3 === 2 ? unitName('u2') : unitName(c.u), nf: String(20000 + Math.round(rnd() * 9000)), v, cb: +(v * PROGRAM.pct / 100).toFixed(2) };
    });
  };
  V.cliente = id => {
    const c = CLIENTS.find(x => x.id === id);
    if (!c) return head('Cliente não encontrado', '') + '<a class="back-link" href="#clientes">' + icon('back') + 'Voltar para clientes</a>';
    const P = purchasesOf(c);
    const months = {}; P.forEach(p => { const m = p.d.slice(3); months[m] = (months[m] || { v: 0, n: 0 }); months[m].v += p.v; months[m].n++; });
    const mk = Object.keys(months).reverse();
    const daysSince = Math.max(0, Math.round((today - pdate(c.last)) / 864e5));
    const tabs = [['geral', 'Visão geral'], ['consumo', 'Consumo'], ['compras', 'Compras'], ['cashback', 'Cashback'], ['vouchers', 'Vouchers'], ['missoes', 'Missões']];
    let body = '';
    if (CTAB === 'geral') body = `<div class="kpi-row">
        <div class="kpi"><small>Frequência</small><strong>${c.freq ? '1 visita / ' + num(c.freq, 1) + ' dias' : '—'}</strong></div>
        <div class="kpi"><small>Dias desde a última compra</small><strong>${daysSince}</strong></div>
        <div class="kpi"><small>Primeira compra</small><strong>${c.first}</strong></div>
        <div class="kpi"><small>Cashback recebido</small><strong>${brl(c.cb + c.used)}</strong></div></div>
      <div class="grid-2" style="margin-top:16px">
        <div class="card"><div class="card-head"><div><h2>Histórico de consumo</h2><p>Valor verificado nesta empresa por mês.</p></div></div>${vbars(mk.map(m => [m, Math.round(months[m].v)]))}</div>
        <div class="card"><div class="card-head"><div><h2>Frequência de visitas</h2><p>Visitas por mês nesta empresa.</p></div></div>${vbars(mk.map(m => [m, months[m].n]))}</div>
      </div>
      <div class="card" style="margin-top:16px"><div class="card-head"><h2>Insights</h2></div><ul class="insights">
        ${c.freq ? `<li>${icon('bulb')}Visita em média a cada ${num(c.freq, 1)} dias nesta empresa.</li>` : ''}
        <li>${icon('bulb')}${daysSince ? `Não compra nesta empresa há ${daysSince} dias.` : 'Comprou hoje nesta empresa.'}</li>
        <li>${icon('bulb')}Produto mais consumido nesta empresa: ${esc(c.prod)}.</li>
        <li>${icon('bulb')}Costuma visitar esta empresa às ${c.day}s.</li></ul></div>`;
    if (CTAB === 'consumo') body = `<div class="card"><div class="card-head"><div><h2>O que mais consome</h2><p>Itens das NFC-e verificadas deste cliente.</p></div></div>${hbars([[c.prod, 6], ['Água sem gás', 4], ['Refrigerante lata', 3], ['Petit gâteau', 2], ['Salada da casa', 1]])}</div>`;
    if (CTAB === 'compras') body = `<div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Data</th><th>Unidade</th><th>NFC-e</th><th class="num">Valor</th><th class="num">Cashback</th></tr></thead><tbody>${P.map(p => `<tr><td>${p.d}</td><td>${p.u}</td><td>${p.nf}</td><td class="num">${brl(p.v)}</td><td class="num val-pos">+ ${brl(p.cb)}</td></tr>`).join('')}</tbody></table></div></div>`;
    if (CTAB === 'cashback') body = `<div class="kpi-row" style="margin-bottom:16px"><div class="kpi"><small>Disponível</small><strong>${brl(c.cb)}</strong></div><div class="kpi"><small>Utilizado</small><strong>${brl(c.used)}</strong></div><div class="kpi"><small>Validade</small><strong>${PROGRAM.days} dias</strong></div><div class="kpi"><small>Regra atual</small><strong>${PROGRAM.pct}%</strong></div></div>
      <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Data</th><th>Descrição</th><th class="num">Valor</th><th>Status</th></tr></thead><tbody>${P.slice(0, 6).map(p => `<tr><td>${p.d}</td><td><b>Cashback</b><small>NFC-e ${p.nf}</small></td><td class="num val-pos">+ ${brl(p.cb)}</td><td>${pill('Confirmado', 'ok')}</td></tr>`).join('')}${c.used ? `<tr><td>${c.last}</td><td><b>Resgate no caixa</b></td><td class="num val-neg">${brl(-c.used)}</td><td>${pill('Confirmado', 'ok')}</td></tr>` : ''}</tbody></table></div></div>`;
    if (CTAB === 'vouchers') { const vs = VOUCHERS.filter(v => v.c === c.n); body = `<div class="card">${vs.length ? vs.map(v => `<div class="item"><span class="item-ic">${icon('ticket')}</span><div class="item-body"><b>${v.code} · ${brl(v.v)}</b><p>${unitName(v.u)} · ${v.dt}</p></div>${pill(v.st, v.st === 'Usado' ? 'ok' : v.st === 'Reservado' ? 'info' : '')}</div>`).join('') : '<p class="empty">Nenhum voucher deste cliente.</p>'}</div>`; }
    if (CTAB === 'missoes') body = `<div class="card">${c.buys >= 3 ? `<div class="item"><span class="item-ic">${icon('target')}</span><div class="item-body"><b>Volte 3x no mês</b><p>Concluída · + ${brl(5)}</p></div>${pill('Concluída', 'ok')}</div>` : '<p class="empty">Nenhuma missão concluída por este cliente.</p>'}</div>`;
    return `<a class="back-link" href="#clientes">${icon('back')}Clientes</a>
      <div class="page-head"><div class="hero-c"><span class="big-av">${initials(c.n)}</span><div><h1>${esc(c.n)}</h1><p>${pill(...ST[c.st])} <span class="muted">· ****${c.d} · Perfil nesta empresa. Não há visão entre empresas.</span></p></div></div></div>
      <div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
        ${[['Última visita', c.last], ['Compras', c.buys], ['Ticket médio', brl(c.ticket)], ['Total consumido', brl(c.total)], ['Cashback disponível', brl(c.cb)], ['Cashback utilizado', brl(c.used)], ['Tempo como cliente', c.since + ' dias']].map(([l, v]) => `<div class="kpi"><small>${l}</small><strong style="font-size:20px">${v}</strong></div>`).join('')}
      </div>
      <div class="tabs" role="tablist" style="margin-top:18px">${tabs.map(([k, t]) => `<button role="tab" data-ctab="${k}" aria-selected="${CTAB === k}">${t}</button>`).join('')}</div>
      ${body}`;
  };
  V.cliente.bind = () => document.querySelectorAll('[data-ctab]').forEach(b => b.addEventListener('click', () => { CTAB = b.dataset.ctab; render(); }));

  // --- Transações ---
  V.transacoes = () => head('Transações', 'Livro-razão da empresa. CPF e chave completa da NFC-e não aparecem aqui.') + `
    <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Data</th><th>Cliente</th><th>Descrição</th><th class="num">Valor</th><th>Status</th></tr></thead><tbody>
    ${TX.map(t => `<tr><td>${t.dt}</td><td><b>${esc(t.c)}</b><small>${unitName(t.u)}</small></td><td>${t.desc}${t.nf ? `<small>NFC-e ${t.nf}</small>` : ''}</td><td class="num ${t.v < 0 ? 'val-neg' : 'val-pos'}">${t.v < 0 ? '' : '+ '}${brl(t.v)}</td><td>${pill(t.st, t.st === 'Confirmado' ? 'ok' : 'warn')}</td></tr>`).join('')}
    </tbody></table></div></div>`;

  // --- Vouchers ---
  V.vouchers = () => head('Vouchers', 'Leitura no caixa.', `<a class="btn btn-primary" href="#caixa">${icon('scan')}Validar voucher</a>`) + `
    <div class="card">${VOUCHERS.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Código</th><th>Cliente</th><th>Unidade</th><th class="num">Valor</th><th>Status</th><th>Data</th></tr></thead><tbody>
    ${VOUCHERS.map(v => `<tr><td><b>${v.code}</b></td><td>${esc(v.c)}</td><td>${unitName(v.u)}</td><td class="num">${brl(v.v)}</td><td>${pill(v.st, v.st === 'Usado' ? 'ok' : v.st === 'Reservado' ? 'info' : '')}</td><td>${v.dt}</td></tr>`).join('')}
    </tbody></table></div>` : '<p class="empty">Nenhum voucher ainda.</p>'}</div>`;

  // --- Cupons fiscais ---
  V.cupons = () => head('Cupons fiscais', 'Documentos identificados e o estado da validação.') + `
    <div class="card" style="margin-bottom:16px">
      <label class="field"><span>Documento fiscal autorizado da unidade</span><textarea class="ctl" id="cpDoc" placeholder="Cole aqui a chave de acesso (44 números) ou o link do QR Code da NFC-e"></textarea><small>A consulta à SEFAZ usa o certificado A1 da unidade.</small></label>
      <button class="btn btn-primary" id="cpGo" style="margin-top:12px">${icon('check')}Validar documento</button>
    </div>
    <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Unidade</th><th>Situação</th><th class="num">Valor</th><th>Chave</th><th>Status</th><th>Consulta SEFAZ</th></tr></thead><tbody>
    ${CUPONS.map(c => `<tr><td><b>${unitName(c.u)}</b></td><td>${pill(c.sit, c.sit === 'VALIDADO' ? 'ok' : c.sit === 'PENDENTE' ? 'warn' : 'err')}</td><td class="num">${brl(c.v)}</td><td>****${c.key}</td><td><div class="meta" style="margin:0">${c.tags.map(([t, k]) => pill(t, k)).join('')}</div></td><td style="min-width:220px">${c.sefaz}<small>Última tentativa ${c.at}</small></td></tr>`).join('')}
    </tbody></table></div></div>`;
  V.cupons.bind = () => $('cpGo').addEventListener('click', () => {
    const t = $('cpDoc').value.replace(/\s/g, ''), digits = t.replace(/\D/g, '');
    if (digits.length < 44 && !/^https?:/.test(t)) { $('cpDoc').classList.add('err'); toast('Cole a chave de 44 números ou o link do QR Code.'); $('cpDoc').focus(); return; }
    const row = { u: 'u1', sit: 'PENDENTE', v: 0, key: (digits || '0000').slice(-4), tags: [['Consultando SEFAZ', 'warn']], sefaz: 'Consulta em andamento…', at: new Date().toLocaleString('pt-BR').slice(0, 17) };
    CUPONS.unshift(row); render(); toast('Documento enviado para validação.');
    setTimeout(() => { Object.assign(row, { sit: 'VALIDADO', v: 156.9, tags: [['Confirmado', 'ok'], ['Cashback gerado', 'ok']], sefaz: 'Consulta à SEFAZ concluída. Cupom confirmado.' }); if (route.name === 'cupons') render(); toast('Cupom confirmado pela SEFAZ.'); }, 1800);
  });

  // --- Análise de risco ---
  let RF = 'open';
  const RST = { open: ['Aberto', 'warn'], review: ['Em revisão', 'info'], approved: ['Aprovado', 'ok'], confirmed: ['Risco confirmado', 'err'] };
  V.risco = () => {
    const list = RISKS.filter(r => RF === 'open' ? (r.st === 'open' || r.st === 'review') : (r.st === 'approved' || r.st === 'confirmed'));
    return head('Análise de risco', 'Motor determinístico, sem IA. Uma regra isolada não desativa o usuário; toda decisão manual vai para a auditoria.') + `
      <div class="seg" role="group" aria-label="Filtrar" style="margin-bottom:16px"><button data-rf="open" aria-pressed="${RF === 'open'}">Pendentes (${RISKS.filter(r => r.st === 'open' || r.st === 'review').length})</button><button data-rf="done" aria-pressed="${RF === 'done'}">Resolvidos (${RISKS.filter(r => r.st === 'approved' || r.st === 'confirmed').length})</button></div>
      ${list.map(r => `<div class="item${RF === 'done' ? ' done' : ''}" data-r="${r.id}">
        <span class="risk-score ${r.lvl === 'HIGH' ? 'high' : r.lvl === 'LOW' ? 'low' : ''}">${r.score}</span>
        <div class="item-body"><b>${esc(r.n)} <span class="muted" style="font-weight:500">(${r.uid})</span></b>
          <p>${COMPANY.fant} · ${r.rule} · ${r.at}</p>
          <div class="meta">${pill(...RST[r.st])}${pill(r.lvl === 'HIGH' ? 'Alto' : r.lvl === 'LOW' ? 'Baixo' : 'Médio', r.lvl === 'HIGH' ? 'err' : r.lvl === 'LOW' ? 'ok' : 'warn')}${pill('Documento ****' + r.doc)}${pill('Sugestão: revisar', 'info')}</div>
          <p style="margin-top:8px;color:var(--ink-deep);font-weight:600">${r.ruleTxt}</p>
          ${RF === 'open' ? `<label class="field risk-note"><span>Nota (obrigatória para confirmar risco)</span><input class="ctl" data-note="${r.id}" value="${esc(r.note)}" placeholder="Explique a decisão"></label>
          <div class="item-acts"><button class="btn btn-primary btn-sm" data-ract="approved">Aprovar</button><button class="btn btn-ghost btn-sm" data-ract="review">Manter em revisão</button><button class="btn btn-err btn-sm" data-ract="confirmed">Confirmar risco</button></div>` : (r.note ? `<p style="margin-top:6px">Nota: ${esc(r.note)}</p>` : '')}
        </div></div>`).join('') || `<div class="card"><p class="empty">${RF === 'open' ? 'Nenhum alerta pendente.' : 'Nenhum alerta resolvido ainda.'}</p></div>`}`;
  };
  V.risco.bind = () => {
    document.querySelectorAll('[data-rf]').forEach(b => b.addEventListener('click', () => { RF = b.dataset.rf; render(); }));
    if (!V.risco.wired) {   // o container é fixo: liga o ouvinte uma vez só
      V.risco.wired = true;
      $('view').addEventListener('input', e => { const id = e.target.dataset.note; if (id) { RISKS.find(r => r.id === id).note = e.target.value; e.target.classList.remove('err'); } });
    }
    document.querySelectorAll('[data-ract]').forEach(b => b.addEventListener('click', () => {
      const r = RISKS.find(x => x.id === b.closest('[data-r]').dataset.r), a = b.dataset.ract;
      if (a === 'confirmed' && !r.note.trim()) { const inp = document.querySelector(`[data-note="${r.id}"]`); inp.classList.add('err'); inp.focus(); toast('Escreva uma nota para confirmar o risco.'); return; }
      r.st = a; render(); updateRiskCount();
      toast({ approved: 'Alerta aprovado.', review: 'Mantido em revisão.', confirmed: 'Risco confirmado e registrado na auditoria.' }[a]);
    }));
  };
  const updateRiskCount = () => { const n = RISKS.filter(r => r.st === 'open').length; $('riskCount').textContent = n; $('riskCount').hidden = !n; };

  // --- Cashback ---
  V.cashback = () => {
    const p = PROGRAM, f = (id, label, v, extra = '') => `<label class="field"><span>${label}</span><input class="ctl" id="${id}" value="${v}" inputmode="decimal" ${extra}></label>`;
    return head('Cashback', 'Regras do programa. Versões novas não reescrevem transações antigas.') + `
      <div class="program"><span class="pg-ic">${icon('percent')}</span><div><b>${esc(p.name)}</b><small>${p.on ? 'Ativo' : 'Desativado'} · versão ${p.v} · ${p.pct}% de volta</small></div><button class="btn btn-ghost btn-sm" id="cbToggle">${p.on ? 'Desativar' : 'Ativar'}</button></div>
      <div class="layout lay-cb">
        <div class="card"><div class="card-head"><div><h2>Regras</h2><p>Ao publicar, as regras valem para as próximas compras.</p></div></div>
          <div class="form-grid">
            <label class="field full"><span>Nome</span><input class="ctl" id="cbName" value="${esc(p.name)}"></label>
            ${f('cbPct', 'Percentual de cashback (%)', p.pct)}${f('cbMin', 'Compra mínima (R$)', p.min.toFixed(2))}
            ${f('cbCap', 'Cashback máximo por compra (R$)', p.cap.toFixed(2))}${f('cbDays', 'Validade (dias)', p.days, 'type="number"')}
            ${f('cbHours', 'Cadastrar NFC-e em até (horas)', p.hours, 'type="number"')}${f('cbRedeem', 'Resgate mínimo (R$)', p.minRedeem.toFixed(2))}
            ${f('cbUse', 'Uso máximo (% da nova compra)', p.maxUse)}
            <label class="field"><span>Permitir dividir cashback</span><select class="ctl" id="cbSplit"><option value="1" ${p.split ? 'selected' : ''}>Sim</option><option value="0" ${p.split ? '' : 'selected'}>Não</option></select></label>
            ${f('cbPeople', 'Máximo de pessoas na mesa', p.people, 'type="number"')}
            <div class="field full"><span>Unidades participantes</span><small>Nenhuma marcada = todas as unidades.</small>
              <div class="checks-row">${UNITS.map(u => `<label class="chk"><input type="checkbox" value="${u.id}" ${p.units.includes(u.id) ? 'checked' : ''}>${u.n}</label>`).join('')}</div></div>
          </div>
          <button class="btn btn-primary" id="cbPublish" style="margin-top:18px">${icon('check')}Publicar nova versão</button>
        </div>
        <div class="stack">
          <div class="card"><div class="card-head"><div><h2>Simular</h2><p>Veja quanto o cliente ganha e pode usar.</p></div></div>
            <div class="form-grid">${f('smBuy', 'Compra (R$)', '30,00')}${f('smBal', 'Saldo disponível (R$)', '50,00')}</div>
            <button class="btn btn-ghost" id="smGo" style="margin-top:12px;width:100%">${icon('play')}Simular</button>
            <div class="sim-out" id="smOut"></div></div>
          <div class="card"><div class="card-head"><h2>Histórico de versões</h2></div>
            <ul class="versions">${VERSIONS.map((v, i) => `<li class="${i === 0 ? 'cur' : ''}"><b>v${v.v}</b><div>${v.pct}% · mín. ${brl(v.min)} · teto ${brl(v.cap)} · validade ${v.days}d</div>${pill(i === 0 ? 'Atual' : 'Substituída', i === 0 ? 'ok' : '')}</li>`).join('')}</ul></div>
        </div>
      </div>`;
  };
  const pnum = v => { v = String(v).trim(); if (v.includes(',')) v = v.replace(/\./g, '').replace(',', '.'); const n = parseFloat(v); return isNaN(n) ? NaN : n; };
  V.cashback.bind = () => {
    const sim = () => {
      const buy = pnum($('smBuy').value), bal = pnum($('smBal').value), pct = pnum($('cbPct').value), min = pnum($('cbMin').value), cap = pnum($('cbCap').value), use = pnum($('cbUse').value);
      if ([buy, bal].some(isNaN)) { $('smOut').innerHTML = '<p class="muted" style="grid-column:1/-1">Preencha compra e saldo.</p>'; return; }
      const gen = buy >= min ? Math.min(buy * pct / 100, cap) : 0, canUse = Math.min(bal, buy * use / 100);
      $('smOut').innerHTML = `<div class="ok"><small>Cashback gerado</small><b>${brl(gen)}</b></div><div><small>Pode usar nesta compra</small><b>${brl(canUse)}</b></div>
        <div><small>Cliente paga</small><b>${brl(buy - canUse)}</b></div><div><small>Observação</small><b style="font-size:13.5px;letter-spacing:0">${buy < min ? 'Abaixo da compra mínima' : gen >= cap ? 'Chegou ao teto' : 'Dentro das regras'}</b></div>`;
    };
    $('smGo').addEventListener('click', sim); sim();
    $('cbToggle').addEventListener('click', () => {
      if (!PROGRAM.on) { PROGRAM.on = true; render(); toast('Programa ativado.'); return; }
      openSheet('warn', sheetHead('warn', 'alert', 'Desativar programa', 'Desativar o cashback?', 'As próximas compras deixam de gerar cashback. O saldo que os clientes já têm continua valendo.') +
        `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Manter ativo</button><button class="btn btn-warn" data-go="cbOff">Desativar</button></div>`);
    });
    $('cbPublish').addEventListener('click', () => {
      const pct = pnum($('cbPct').value), min = pnum($('cbMin').value), cap = pnum($('cbCap').value), days = pnum($('cbDays').value);
      const bad = [['cbPct', pct > 0 && pct <= 100], ['cbMin', min >= 0], ['cbCap', cap > 0], ['cbDays', days >= 1]].filter(([, ok]) => !ok);
      document.querySelectorAll('.form-grid .ctl').forEach(i => i.classList.remove('err'));
      if (bad.length) { bad.forEach(([id]) => $(id).classList.add('err')); $(bad[0][0]).focus(); toast('Confira os campos marcados.'); return; }
      Object.assign(PROGRAM, { name: $('cbName').value.trim() || 'Programa padrão', pct, min, cap, days, hours: pnum($('cbHours').value) || 48, minRedeem: pnum($('cbRedeem').value) || 0, maxUse: pnum($('cbUse').value) || 30, split: $('cbSplit').value === '1', people: pnum($('cbPeople').value) || 1, units: [...document.querySelectorAll('.checks-row input:checked')].map(i => i.value), v: PROGRAM.v + 1 });
      VERSIONS.unshift({ v: PROGRAM.v, pct, min, cap, days });
      render(); toast('Versão ' + PROGRAM.v + ' publicada.');
    });
  };

  // --- Missões ---
  V.missoes = () => head('Missões', 'Campanhas desta empresa. Um cliente só recebe cada missão uma vez.', `<button class="btn btn-primary" id="msNew">${icon('plus')}Nova missão</button>`) + `
    <div class="grid-2">${MISSIONS.map(m => `<div class="item" style="margin:0" data-m="${m.id}"><span class="item-ic">${icon('target')}</span><div class="item-body"><b>${esc(m.n)}</b><p>${esc(m.d)}</p>
      <div class="meta">${pill(m.st, m.st === 'Ativa' ? 'ok' : m.st === 'Rascunho' ? 'info' : '')}${pill(m.kind === 'pct' ? '+' + m.val + '% de cashback' : '+' + brl(m.val))}${pill(m.from + ' a ' + m.to)}</div>
      ${m.st !== 'Rascunho' ? `<p style="margin-top:8px">${m.done} conclusões · extra ${brl(m.extra)} · vendas ${brl(m.sales)}</p>` : ''}
      <div class="item-acts">${m.st === 'Rascunho' ? `<button class="btn btn-primary btn-sm" data-mact="pub">Publicar</button><button class="btn btn-ghost btn-sm" data-mact="del">Excluir rascunho</button>` : m.st === 'Ativa' ? '<button class="btn btn-ghost btn-sm" data-mact="end">Encerrar</button>' : ''}</div></div></div>`).join('')}</div>
    <div class="card" id="msForm" style="margin-top:16px" hidden>
      <div class="card-head"><div><h2>Nova missão</h2><p>Salve como rascunho e publique quando estiver pronta.</p></div></div>
      <div class="form-grid">
        <label class="field full"><span>Nome</span><input class="ctl" id="msName" placeholder="Prove um prato do novo menu"></label>
        <label class="field full"><span>Descrição</span><textarea class="ctl" id="msDesc" placeholder="Ganhe cashback extra ao experimentar o novo menu."></textarea></label>
        <label class="field"><span>Início</span><input class="ctl" id="msFrom" type="date"></label>
        <label class="field"><span>Fim</span><input class="ctl" id="msTo" type="date"></label>
        <label class="field"><span>Tipo de recompensa</span><select class="ctl" id="msKind"><option value="pct">% adicional</option><option value="fix">Valor fixo</option></select></label>
        <label class="field"><span id="msValL">Percentual (%)</span><input class="ctl" id="msVal" inputmode="decimal" placeholder="3"></label>
        <label class="field"><span>Aplicar em</span><select class="ctl" id="msApply"><option>Somente itens elegíveis</option><option>Compra inteira</option></select></label>
        <label class="field"><span>Limite máximo por cliente (R$)</span><input class="ctl" id="msLimit" inputmode="decimal" placeholder="Sem limite"></label>
        <label class="field"><span>Quando o cliente consumir</span><select class="ctl" id="msWhen"><option>Texto do item</option><option>Produto específico</option><option>Categoria</option><option>Tag de produto</option><option>Critério inteligente</option></select></label>
        <label class="field"><span>Texto do critério</span><input class="ctl" id="msCrit" placeholder="Um prato do novo menu"></label>
        <label class="chk full" style="justify-self:start"><input type="checkbox" id="msCombo" checked>Pode combinar com outra missão na mesma compra</label>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn btn-primary" id="msSave">Salvar rascunho</button><button class="btn btn-ghost" id="msCancel">Cancelar</button></div>
    </div>`;
  V.missoes.bind = () => {
    const form = $('msForm');
    $('msNew').addEventListener('click', () => { form.hidden = false; $('msFrom').value = today.toISOString().slice(0, 10); $('msTo').value = addDays(today, 30).toISOString().slice(0, 10); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(() => $('msName')?.focus(), 400); });
    $('msCancel').addEventListener('click', () => { form.hidden = true; });
    $('msKind').addEventListener('change', e => { $('msValL').textContent = e.target.value === 'pct' ? 'Percentual (%)' : 'Valor (R$)'; });
    $('msSave').addEventListener('click', () => {
      const n = $('msName').value.trim(), val = pnum($('msVal').value);
      document.querySelectorAll('#msForm .ctl').forEach(i => i.classList.remove('err'));
      if (!n) { $('msName').classList.add('err'); $('msName').focus(); toast('Dê um nome para a missão.'); return; }
      if (!(val > 0)) { $('msVal').classList.add('err'); $('msVal').focus(); toast('Informe o valor da recompensa.'); return; }
      if ($('msTo').value < $('msFrom').value) { $('msTo').classList.add('err'); toast('O fim precisa ser depois do início.'); return; }
      const br = s => s.split('-').reverse().join('/');
      MISSIONS.unshift({ id: 'm' + Date.now(), n, d: $('msDesc').value.trim() || 'Sem descrição.', from: br($('msFrom').value), to: br($('msTo').value), kind: $('msKind').value, val, st: 'Rascunho', done: 0, extra: 0, sales: 0 });
      render(); toast('Rascunho salvo.');
    });
    document.querySelectorAll('[data-mact]').forEach(b => b.addEventListener('click', () => {
      const m = MISSIONS.find(x => x.id === b.closest('[data-m]').dataset.m), a = b.dataset.mact;
      if (a === 'pub') { m.st = 'Ativa'; toast('Missão publicada.'); }
      if (a === 'end') { m.st = 'Encerrada'; toast('Missão encerrada.'); }
      if (a === 'del') { MISSIONS.splice(MISSIONS.indexOf(m), 1); toast('Rascunho excluído.'); }
      render();
    }));
  };

  // --- Funcionários ---
  V.funcionarios = () => head('Funcionários', 'Quem acessa o painel e o caixa desta empresa.', `<button class="btn btn-primary" id="stInvite">${icon('mail')}Convidar</button>`) + `
    <div class="card">${STAFF.map((s, i) => `<div class="item" data-s="${i}"><span class="av" style="width:42px;height:42px">${initials(s.n)}</span><div class="item-body"><b>${esc(s.n)}</b><p>${esc(s.e)}</p>
      <div class="meta">${pill(s.r, s.owner ? 'dark' : '')}${pill(s.st === 'ACTIVE' ? 'Ativo' : 'Convite enviado', s.st === 'ACTIVE' ? 'ok' : 'warn')}</div></div>
      ${s.owner ? '' : `<div class="item-acts" style="margin:0">${s.st === 'INVITED' ? '<button class="btn btn-ghost btn-sm" data-sact="resend">Reenviar</button>' : ''}<button class="btn btn-danger btn-sm" data-sact="rm">Remover</button></div>`}</div>`).join('')}</div>`;
  V.funcionarios.bind = () => {
    $('stInvite').addEventListener('click', () => openSheet('ok', sheetHead('ok', 'mail', 'Equipe', 'Convidar funcionário', 'A pessoa recebe um email para criar a senha.') + `
      <div class="sh-form"><label class="field"><span>Nome</span><input class="ctl" id="inName"></label><label class="field"><span>Email</span><input class="ctl" id="inMail" type="email"></label>
      <label class="field"><span>Papel</span><select class="ctl" id="inRole"><option>Gerente</option><option>Caixa</option><option>Analista</option></select></label></div>
      <div class="sh-actions"><button class="btn btn-primary" data-go="invite">Enviar convite</button></div>`));
    document.querySelectorAll('[data-sact]').forEach(b => b.addEventListener('click', () => {
      const s = STAFF[+b.closest('[data-s]').dataset.s];
      if (b.dataset.sact === 'resend') return toast('Convite reenviado para ' + s.e + '.');
      openSheet('err', sheetHead('err', 'alert', 'Equipe', 'Remover ' + esc(s.n) + '?', 'A pessoa perde o acesso ao painel e ao caixa na hora.') + `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Cancelar</button><button class="btn btn-err" data-go="rmStaff" data-i="${STAFF.indexOf(s)}">Remover</button></div>`);
    }));
  };

  // --- Unidades ---
  V.unidades = () => head('Unidades', 'Depois que o certificado A1 da unidade (ou do CNPJ compartilhado) estiver cadastrado, o Muito Mais consulta a SEFAZ para confirmar o cupom.', `<button class="btn btn-primary" id="unNew">${icon('plus')}Nova unidade</button>`) + `
    <div class="grid-2">${UNITS.map(u => `<div class="item" style="margin:0" data-u="${u.id}"><span class="item-ic">${icon('store')}</span><div class="item-body"><b>${esc(u.n)}</b><p>${esc(u.rs)} · ${u.cnpj} · ${esc(u.city)}</p>
      <div class="meta">${pill(u.on ? 'Ativa' : 'Desativada', u.on ? 'ok' : '')}${u.a1 ? pill('A1 válido até ' + u.a1, 'info') : pill('Sem certificado A1', 'warn')}</div>
      <p style="margin-top:8px">${u.on ? (u.a1 ? 'Cashback ativo.' : 'Cashback ativo, mas os cupons ficam pendentes até o certificado ser cadastrado.') : 'Cupons desta unidade não geram cashback.'}</p>
      <div class="item-acts"><button class="btn btn-primary btn-sm" data-uact="a1">${icon('file')}Configurar certificado A1</button><button class="btn btn-ghost btn-sm" data-uact="edit">Editar</button><button class="btn ${u.on ? 'btn-danger' : 'btn-ghost'} btn-sm" data-uact="toggle">${u.on ? 'Desativar' : 'Ativar'}</button></div></div></div>`).join('')}</div>`;
  const unitForm = (u = {}) => `<div class="sh-form"><label class="field"><span>Nome da unidade</span><input class="ctl" id="unN" value="${esc(u.n || '')}"></label>
      <label class="field"><span>Razão social</span><input class="ctl" id="unRs" value="${esc(u.rs || '')}"></label>
      <label class="field"><span>CNPJ</span><input class="ctl" id="unCnpj" inputmode="numeric" value="${esc(u.cnpj || '')}" placeholder="00.000.000/0000-00"></label>
      <label class="field"><span>Cidade/UF</span><input class="ctl" id="unCity" value="${esc(u.city || '')}" placeholder="Fortaleza/CE"></label></div>`;
  V.unidades.bind = () => {
    $('unNew').addEventListener('click', () => openSheet('ok', sheetHead('ok', 'store', 'Unidades', 'Nova unidade', 'Depois cadastre o certificado A1 para validar os cupons.') + unitForm() + `<div class="sh-actions"><button class="btn btn-primary" data-go="unSave">Salvar unidade</button></div>`));
    document.querySelectorAll('[data-uact]').forEach(b => b.addEventListener('click', () => {
      const u = UNITS.find(x => x.id === b.closest('[data-u]').dataset.u), a = b.dataset.uact;
      if (a === 'edit') openSheet('ok', sheetHead('ok', 'store', 'Unidades', 'Editar ' + esc(u.n)) + unitForm(u) + `<div class="sh-actions"><button class="btn btn-primary" data-go="unSave" data-id="${u.id}">Salvar</button></div>`);
      if (a === 'a1') openSheet('info', sheetHead('info', 'file', 'Certificado A1', esc(u.n), 'Envie o arquivo .pfx do certificado e a senha dele. Ele é usado só para consultar a SEFAZ.') + `
        <div class="sh-form"><label class="field"><span>Arquivo do certificado (.pfx)</span><input class="ctl" id="a1File" type="file" accept=".pfx,.p12" style="padding-top:9px"></label>
        <label class="field"><span>Senha do certificado</span><input class="ctl" id="a1Pass" type="password" autocomplete="off"></label></div>
        <p class="sh-note">${icon('lock')}<span>O arquivo fica criptografado. Nem a equipe do Muito Mais vê a senha.</span></p>
        <div class="sh-actions"><button class="btn btn-primary" data-go="a1Save" data-id="${u.id}">Enviar certificado</button></div>`);
      if (a === 'toggle') { if (u.on) openSheet('warn', sheetHead('warn', 'alert', 'Unidades', 'Desativar ' + esc(u.n) + '?', 'Os cupons desta unidade deixam de gerar cashback.') + `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Cancelar</button><button class="btn btn-warn" data-go="unOff" data-id="${u.id}">Desativar</button></div>`); else { u.on = true; render(); toast(u.n + ' ativada.'); } }
    }));
  };

  // --- Chaves de API ---
  const newKey = () => 'opi_live_' + Array.from({ length: 32 }, () => 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 56)]).join('');
  const showKey = k => openSheet('ok', sheetHead('ok', 'key', 'Chave de API', 'Copie a chave agora', 'Por segurança ela só aparece uma vez. Cole no OPIINA para vincular esta conta.') +
    `<div class="key-box" style="margin-top:16px"><span id="keyTxt">${k}</span><button data-go="copyKey">Copiar</button></div><div class="sh-actions"><button class="btn btn-primary" data-go="close">Já copiei</button></div>`);
  V.chaves = () => head('Chaves de API · OPIINA', 'Use no OPIINA para vincular esta conta. A chave aparece só uma vez.', `<button class="btn btn-primary" id="kyNew">${icon('plus')}Gerar chave</button>`) + `
    <div class="card"><div class="card-head"><h2>Chaves ativas</h2></div>${KEYS.map(k => `<div class="item" data-k="${k.id}"><span class="item-ic">${icon('key')}</span><div class="item-body"><b>Chave · opi_…${k.tail}</b><p>Criada em ${k.at}</p></div>
      <div class="item-acts" style="margin:0"><button class="btn btn-ghost btn-sm" data-kact="rot">${icon('refresh')}Rotacionar</button><button class="btn btn-danger btn-sm" data-kact="rev">Revogar</button></div></div>`).join('') || '<p class="empty">Nenhuma chave ativa.</p>'}</div>`;
  V.chaves.bind = () => {
    $('kyNew').addEventListener('click', () => { const k = newKey(); KEYS.unshift({ id: 'k' + Date.now(), tail: k.slice(-4), at: today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '') }); render(); showKey(k); });
    document.querySelectorAll('[data-kact]').forEach(b => b.addEventListener('click', () => {
      const k = KEYS.find(x => x.id === b.closest('[data-k]').dataset.k);
      if (b.dataset.kact === 'rot') { const nk = newKey(); k.tail = nk.slice(-4); render(); showKey(nk); toast('Chave antiga desativada.'); }
      else openSheet('err', sheetHead('err', 'alert', 'Chave de API', 'Revogar esta chave?', 'O OPIINA para de funcionar com ela na hora.') + `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Cancelar</button><button class="btn btn-err" data-go="revoke" data-id="${k.id}">Revogar</button></div>`);
    }));
  };

  // --- Configurações ---
  V.configuracoes = () => head('Configurações', 'Dados cadastrais da empresa.') + `
    <div class="card" style="max-width:720px"><div class="form-grid">
      <label class="field full"><span>Razão social</span><input class="ctl" id="cfRs" value="${esc(COMPANY.rs)}"></label>
      <label class="field full"><span>Nome fantasia</span><input class="ctl" id="cfFant" value="${esc(COMPANY.fant)}"></label></div>
      <p class="muted" style="margin-top:14px;font-size:14px">Status: ${pill('Ativa', 'ok')} · <a class="back-link" style="margin:0" href="#configuracoes/plano">Plano e cobrança</a> · <a class="back-link" style="margin:0" href="#chaves">Chaves de API</a></p>
      <button class="btn btn-primary" id="cfSave" style="margin-top:16px">Salvar</button></div>`;
  V.configuracoes.bind = () => $('cfSave').addEventListener('click', () => {
    if (!$('cfFant').value.trim()) { $('cfFant').classList.add('err'); $('cfFant').focus(); toast('Informe o nome fantasia.'); return; }
    COMPANY.rs = $('cfRs').value.trim(); COMPANY.fant = $('cfFant').value.trim(); $('coName').textContent = COMPANY.fant; toast('Dados salvos.');
  });

  // --- Plano e cobrança ---
  const pUnits = () => PLANS[PLAN.pick].multi ? PLAN.units : 1;
  V.plano = () => {
    const cur = PLAN.current, p = PLANS[PLAN.pick], n = pUnits(), same = cur === PLAN.pick;
    const first = PLAN.trialEnd || addDays(today, TRIAL_DAYS);
    return head('Plano e cobrança', 'Contrate, troque ou regularize sua assinatura. Os preços não são alterados pela empresa.') + `
      <div class="layout"><div class="stack">
        <div class="current"><span class="pg-ic">${icon('crown')}</span>
          <div class="cur-txt"><small>${cur ? 'Plano atual' : 'Status'}</small><b>${cur ? PLANS[cur].name + ' · teste grátis' : 'Sem plano'}</b><p>${cur ? 'Teste grátis até ' + fmtLong(PLAN.trialEnd) + '. Depois, cobrança mensal.' : 'Escolha um plano e comece com 14 dias de teste grátis.'}</p></div>
          ${cur ? `<div class="cur-meta"><span>Valor depois do teste<strong>${brl(PLANS[cur].price * (PLANS[cur].multi ? PLAN.curUnits : 1))}/mês</strong></span></div>` : ''}</div>
        <div class="card"><div class="card-head"><div><h2>Planos</h2><p>Valores por unidade, cobrados todo mês. Todos com ${TRIAL_DAYS} dias de teste.</p></div><a class="pill ok" href="planos.html#comparar">Comparar planos</a></div>
          <div class="plans-pick">${Object.entries(PLANS).map(([k, pl]) => `<label class="pk"><input type="radio" name="plano" value="${k}" ${PLAN.pick === k ? 'checked' : ''}><span class="pk-ok">${icon('check')}</span>
            ${k === cur ? pill('Plano atual', 'dark') : k === PLAN.landing ? pill('Selecionado na landing', 'ok') : pill(k === 'redes' ? 'Redes e franquias' : k === 'profissional' ? 'Mais completo' : 'Para começar')}
            <b>${pl.name}</b><span class="pk-price"><strong>${brl(pl.price).replace(',00', '')}</strong>/mês</span><span class="trial">${TRIAL_DAYS} dias de teste</span>
            <ul>${pl.feats.map(f => `<li>${icon('check')}${f}</li>`).join('')}</ul></label>`).join('')}</div></div>
        ${p.multi ? `<div class="card"><div class="card-head"><div><h2>Unidades</h2><p>No plano Redes cada unidade é cobrada separadamente. Você tem ${UNITS.length} cadastradas.</p></div></div>
          <div class="stepper"><button type="button" data-step="-1" aria-label="Menos uma" ${PLAN.units <= 2 ? 'disabled' : ''}>−</button><input id="plUnits" type="number" min="2" value="${PLAN.units}" aria-label="Unidades"><button type="button" data-step="1" aria-label="Mais uma">+</button></div></div>` : ''}
        <div class="card"><div class="card-head"><div><h2>Forma de pagamento</h2><p>Nada é cobrado durante o teste.</p></div></div>
          <div class="pay">${[['cartao', 'card', 'Cartão de crédito', 'Cobrança automática'], ['pix', 'pix', 'Pix', 'QR Code todo mês'], ['boleto', 'barcode', 'Boleto', 'Vence em 3 dias úteis']].map(([v, ic, t, s]) => `<label class="pm"><input type="radio" name="pay" value="${v}" ${PLAN.pay === v ? 'checked' : ''}><span class="pm-ic">${icon(ic)}</span><div><b>${t}</b><small>${s}</small></div></label>`).join('')}</div></div>
        <div class="card"><div class="card-head"><div><h2>Faturas</h2><p>Histórico de cobranças da assinatura.</p></div></div><p class="empty">${cur ? 'Nenhuma fatura ainda. A primeira cobrança é em ' + fmtLong(PLAN.trialEnd) + '.' : 'Nenhuma fatura ainda.'}</p></div>
        ${cur ? `<div class="card" style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center"><div><b style="color:var(--ink-deep)">Cancelar assinatura</b><p class="muted" style="font-size:14px">Cancelando durante o teste, nada é cobrado.</p></div><button class="btn btn-danger" id="plCancel">Cancelar assinatura</button></div>` : ''}
      </div>
      <aside class="card summary"><div class="card-head" style="margin-bottom:12px"><h2>Resumo</h2>${pill(same ? 'Ativo' : cur ? 'Troca' : 'Teste grátis', same ? 'ok' : 'warn')}</div>
        <div class="line"><span>Plano</span><b>${p.name}</b></div>
        <div class="line"><span>${brl(p.price)} × ${n} ${n > 1 ? 'unidades' : 'unidade'}</span><b>${brl(p.price * n)}/mês</b></div>
        <div class="line"><span>Hoje</span><b>${brl(0)}</b></div>
        <div class="line"><span>Primeira cobrança</span><b>${fmtLong(first)}</b></div>
        <div class="total"><span>Depois do teste</span><strong>${brl(p.price * n)}<small>/mês</small></strong></div>
        <button class="btn btn-primary" id="plGo" style="width:100%;height:52px;margin-top:16px" ${same ? 'disabled' : ''}>${same ? 'Plano atual' : cur ? 'Trocar para o ' + p.name : 'Começar teste grátis'}</button>
        <p class="muted" style="margin-top:10px;font-size:12.5px;text-align:center">${icon('lock', 'width:13px;height:13px;vertical-align:-2px')} Cancele quando quiser</p></aside>
      </div>`;
  };
  V.plano.bind = () => {
    document.querySelectorAll('input[name="plano"]').forEach(r => r.addEventListener('change', () => { PLAN.pick = r.value; qs.set('plano', r.value); history.replaceState(null, '', location.pathname + '?' + qs + location.hash); render(true); }));
    document.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener('change', () => { PLAN.pay = r.value; }));
    document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { PLAN.units = Math.max(2, PLAN.units + +b.dataset.step); render(true); }));
    const ui = $('plUnits'); if (ui) ui.addEventListener('change', () => { PLAN.units = Math.max(2, parseInt(ui.value, 10) || 2); render(true); });
    $('plGo').addEventListener('click', () => {
      const p = PLANS[PLAN.pick], n = pUnits();
      openSheet('ok', sheetHead('ok', 'crown', PLAN.current ? 'Trocar plano' : 'Teste grátis', (PLAN.current ? 'Trocar para o ' : 'Começar o ') + p.name + '?', PLAN.current ? 'O novo plano vale na hora. O teste continua até a mesma data.' : `Você usa tudo por ${TRIAL_DAYS} dias sem pagar nada.`) +
        `<div class="sh-box"><div class="line"><span>Hoje</span><b>${brl(0)}</b></div><div class="line"><span>Depois do teste</span><b>${brl(p.price * n)}/mês</b></div></div><div class="sh-actions"><button class="btn btn-primary" data-go="planGo">Confirmar</button><button class="btn btn-ghost" data-go="close">Voltar</button></div>`);
    });
    const c = $('plCancel'); if (c) c.addEventListener('click', () => openSheet('err', sheetHead('err', 'alert', 'Assinatura', 'Cancelar a assinatura?', 'Durante o teste nada é cobrado. O cashback para de funcionar na hora.') + `<div class="sh-actions"><button class="btn btn-ghost" data-go="close">Manter</button><button class="btn btn-err" data-go="planCancel">Cancelar assinatura</button></div>`));
  };

  // --- Validar no caixa ---
  V.caixa = () => `<div class="caixa-wrap"><div class="caixa-hero">${pill('Caixa', 'dark')}<h1 style="font-size:clamp(28px,4vw,38px);font-weight:800;letter-spacing:-.04em;color:var(--ink-deep)">Validar cashback</h1>
      <p class="muted">Leia o QR do cliente. O voucher fica reservado até a NFC-e desta venda.</p></div>
    <div class="card stack">
      ${sel('cxUnit', 'Unidade deste caixa', UNITS.filter(u => u.on).map(u => [u.id, u.n]), 'u1')}
      <div class="scan-box" id="cxScan"><span class="frame"></span><span class="line"></span><p id="cxHint">Toque em “Ler QR Code” e aponte para o celular do cliente</p></div>
      <button class="btn btn-primary" id="cxRead" style="height:52px">${icon('scan')}Ler QR Code</button>
      <label class="field"><span>Conteúdo do QR do voucher</span><textarea class="ctl" id="cxCode" placeholder="Ou cole aqui o conteúdo lido pelo leitor do caixa"></textarea></label>
      <button class="btn btn-ghost" id="cxGo" style="height:52px">Ler voucher</button>
    </div></div>`;
  V.caixa.bind = () => {
    $('cxRead').addEventListener('click', () => {
      $('cxHint').textContent = 'Lendo QR Code…';
      setTimeout(() => { $('cxCode').value = 'MMV1:VCH-9R4D:c1:37.40'; $('cxHint').textContent = 'QR Code lido'; $('cxGo').click(); }, 1200);
    });
    $('cxGo').addEventListener('click', () => {
      const raw = $('cxCode').value.trim(), m = raw.match(/VCH-[A-Z0-9]{4}/);
      if (!m) {
        openSheet('err', sheetHead('err', 'x', 'Erro', 'Voucher não encontrado', 'O conteúdo lido não é um voucher do Muito Mais.') + `<div class="sh-actions"><button class="btn btn-err" data-go="close">Tentar de novo</button></div>`); return;
      }
      const used = VOUCHERS.find(v => v.code === m[0]);
      if (used) { openSheet('warn', sheetHead('warn', 'alert', 'Aviso', 'Voucher já ' + used.st.toLowerCase(), `${used.code} · ${esc(used.c)} · ${brl(used.v)}`) + `<div class="sh-actions"><button class="btn btn-warn" data-go="close">Entendi</button></div>`); return; }
      const c = CLIENTS[0], val = 37.40, buy = 180;
      openSheet('ok', sheetHead('ok', 'check', 'Voucher válido', esc(c.n), `${m[0]} · ${unitName($('cxUnit').value)}`) + `
        <div class="sh-box"><div class="line"><span>Saldo do voucher</span><b>${brl(val)}</b></div><div class="line"><span>Uso máximo (${PROGRAM.maxUse}% da compra de ${brl(buy)})</span><b>${brl(Math.min(val, buy * PROGRAM.maxUse / 100))}</b></div></div>
        <p class="sh-note">${icon('info')}<span>O valor fica reservado até a NFC-e desta venda ser registrada.</span></p>
        <div class="sh-actions"><button class="btn btn-primary" data-go="reserve" data-code="${m[0]}">Reservar voucher</button><button class="btn btn-ghost" data-go="close">Cancelar</button></div>`);
    });
  };

  // ================= ações das janelas =================
  $('shBody').addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    const go = b.dataset.go, id = b.dataset.id;
    const req = ids => { let ok = true; ids.forEach(i => { const el = $(i); const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)); el.classList.toggle('err', bad); if (bad && ok) { el.focus(); ok = false; } }); return ok; };
    if (go === 'close') return closeSheet();
    if (go === 'copyKey') { navigator.clipboard?.writeText($('keyTxt').textContent).then(() => toast('Chave copiada.'), () => toast('Selecione e copie a chave.')); return; }
    if (go === 'invite') { if (!req(['inName', 'inMail'])) return; STAFF.push({ n: $('inName').value.trim(), e: $('inMail').value.trim(), r: $('inRole').value, st: 'INVITED' }); closeSheet(); render(); toast('Convite enviado.'); }
    if (go === 'rmStaff') { const s = STAFF.splice(+b.dataset.i, 1)[0]; closeSheet(); render(); toast(s.n + ' removido(a).'); }
    if (go === 'unSave') {
      if (!req(['unN', 'unRs', 'unCnpj', 'unCity'])) return;
      const data = { n: $('unN').value.trim().toUpperCase(), rs: $('unRs').value.trim().toUpperCase(), cnpj: $('unCnpj').value.trim(), city: $('unCity').value.trim() };
      if (id) Object.assign(UNITS.find(u => u.id === id), data); else UNITS.push({ id: 'u' + Date.now(), on: true, a1: null, ...data });
      closeSheet(); render(); toast(id ? 'Unidade atualizada.' : 'Unidade criada. Agora cadastre o certificado A1.');
    }
    if (go === 'a1Save') {
      if (!$('a1File').files.length) { $('a1File').classList.add('err'); toast('Escolha o arquivo .pfx do certificado.'); return; }
      if (!req(['a1Pass'])) return;
      UNITS.find(u => u.id === id).a1 = fmtD(addDays(today, 365)); closeSheet(); render(); toast('Certificado enviado e validado.');
    }
    if (go === 'unOff') { UNITS.find(u => u.id === id).on = false; closeSheet(); render(); toast('Unidade desativada.'); }
    if (go === 'revoke') { KEYS.splice(KEYS.findIndex(k => k.id === id), 1); closeSheet(); render(); toast('Chave revogada.'); }
    if (go === 'cbOff') { PROGRAM.on = false; closeSheet(); render(); toast('Programa desativado.'); }
    if (go === 'planGo') {
      const p = PLANS[PLAN.pick];
      if (!PLAN.current) PLAN.trialEnd = addDays(today, TRIAL_DAYS);
      PLAN.current = PLAN.pick; PLAN.curUnits = pUnits();
      $('sidePlan').textContent = 'Plano ' + p.name + ' · teste';
      render(true);
      openSheet('ok', sheetHead('ok', 'check', 'Tudo certo', 'Plano ' + p.name + ' ativo!', 'Teste grátis até ' + fmtLong(PLAN.trialEnd) + '. Os recursos já estão liberados.') + `<div class="sh-actions"><button class="btn btn-primary" data-go="close">Fechar</button></div>`);
    }
    if (go === 'planCancel') { PLAN.current = null; PLAN.trialEnd = null; $('sidePlan').textContent = 'Sem plano'; closeSheet(); render(true); toast('Assinatura cancelada. Nada foi cobrado.'); }
    if (go === 'reserve') { VOUCHERS.unshift({ code: b.dataset.code, c: CLIENTS[0].n, v: 37.40, u: $('cxUnit').value, st: 'Reservado', dt: new Date().toLocaleString('pt-BR').slice(0, 17) }); closeSheet(); $('cxCode').value = ''; $('cxHint').textContent = 'Toque em “Ler QR Code” e aponte para o celular do cliente'; toast('Voucher reservado. Registre a NFC-e da venda.'); }
  });

  // ================= rotas =================
  const ROUTES = {
    painel: ['Operação', 'Dashboard'], clientes: ['Operação', 'Clientes'], cliente: ['Clientes', 'Cliente'], transacoes: ['Operação', 'Transações'], vouchers: ['Operação', 'Vouchers'],
    cupons: ['Operação', 'Cupons fiscais'], risco: ['Operação', 'Análise de risco'], cashback: ['Programa', 'Cashback'], missoes: ['Programa', 'Missões'],
    funcionarios: ['Equipe', 'Funcionários'], unidades: ['Equipe', 'Unidades'], chaves: ['Equipe', 'Chaves de API'], configuracoes: ['Equipe', 'Configurações'],
    plano: ['Configurações', 'Plano e cobrança'], caixa: ['Caixa', 'Validar no caixa']
  };
  const route = { name: 'painel', param: null };
  const parse = () => {
    const h = location.hash.slice(1);
    if (h === 'configuracoes/plano') return ['plano', null];
    if (h.startsWith('clientes/')) return ['cliente', h.split('/')[1]];
    return [ROUTES[h] && h !== 'cliente' && h !== 'plano' ? h : 'painel', null];
  };
  function render(keepScroll) {
    const y = scrollY;
    $('view').innerHTML = `<section class="view on">${V[route.name](route.param)}</section>`;
    if (V[route.name].bind) V[route.name].bind(route.param);
    if (keepScroll) { $('view').firstElementChild.style.animation = 'none'; scrollTo(0, y); }
  }
  const go = () => {
    const [name, param] = parse();
    const changed = name !== route.name || param !== route.param;
    if (name === 'cliente' && param !== route.param) CTAB = 'geral';
    route.name = name; route.param = param;
    const [grp, title] = ROUTES[name];
    $('crumbGrp').textContent = grp; $('crumb').textContent = name === 'cliente' ? (CLIENTS.find(c => c.id === param) || {}).n || 'Cliente' : title;
    document.title = $('crumb').textContent + ' — Muito Mais';
    const navKey = name === 'cliente' ? 'clientes' : name === 'plano' ? 'configuracoes/plano' : name;
    document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === navKey) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $('topCaixa').hidden = name === 'caixa';
    closeSheet(); setMenu(false);
    render();
    if (changed) scrollTo(0, 0);
  };
  addEventListener('hashchange', go);

  // menu no celular
  const setMenu = on => { document.body.classList.toggle('menu-open', on); $('menuBtn').setAttribute('aria-expanded', on); };
  $('menuBtn').addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $('scrim').addEventListener('click', () => setMenu(false));

  updateRiskCount();
  go();
})();
