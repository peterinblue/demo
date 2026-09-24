/**
 * 名片工坊 CardCraft Studio — 主逻辑
 */
(function () {
  'use strict';

  window.addEventListener('error', (e) => {
    console.error('app error', e.message, e.filename, e.lineno);
  });

  const STORAGE_KEY = 'cardcraft-studio-v1';
  const TEMPLATES = [
    { id: 'minimal', name: '极简白', desc: '留白 · 细线', className: 't-minimal', accent: '#1a1814' },
    { id: 'ink', name: '墨蓝', desc: '深蓝 · 金线', className: 't-ink', accent: '#0B3D5C' },
    { id: 'gold', name: '曜金', desc: '黑金 · 轻奢', className: 't-gold', accent: '#B8956A' },
    { id: 'bamboo', name: '竹青', desc: '清雅 · 东方', className: 't-bamboo', accent: '#1F6B4A' },
    { id: 'vermilion', name: '赤朱', desc: '朱砂 · 印记', className: 't-vermilion', accent: '#A33B2B' },
    { id: 'noir', name: '玄黑', desc: '科技 · 高对比', className: 't-noir', accent: '#4A5FA8' },
  ];

  const DEFAULT_STATE = {
    name: '',
    nameEn: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    wechat: '',
    address: '',
    bio: '',
    avatar: '',
    template: 'minimal',
    accent: '#0B3D5C',
  };

  let state = { ...DEFAULT_STATE };
  let flipped = false;
  /** 上次自动生成的英文名；用于判断是否被手改 */
  let lastAutoNameEn = '';
  /** 英文名是否允许随姓名自动生成 */
  let nameEnAuto = true;

  // ---------- DOM ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const form = $('#card-form');
  const toastEl = $('#toast');
  const card3d = $('#card-3d');
  const cardFront = $('#card-front');
  const cardBack = $('#card-back');
  const qrCanvas = $('#qr-canvas');

  // ---------- Utils ----------
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove('is-show'), 2200);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 800);
  }

  function downloadDataURL(dataURL, filename) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function stripUrl(url) {
    return (url || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  function firstChar(name) {
    const n = (name || '').trim();
    return n ? n.slice(0, 1) : '名';
  }

  // ---------- State I/O ----------
  let composing = false;
  let refreshTimer = 0;
  let lastQrText = '';

  function readForm() {
    const fd = new FormData(form);
    for (const [k, v] of fd.entries()) {
      if (k !== 'avatar') state[k] = String(v).trim();
    }
    if (!composing) syncNameEnFromName();
  }

  /** 中文姓名 → 正序拼音（姓在前）。手改过英文名则不覆盖 */
  function syncNameEnFromName(force) {
    try {
      if (typeof PinyinLite === 'undefined' || !PinyinLite.nameToPinyin) return;
      const auto = PinyinLite.nameToPinyin(state.name || '');
      lastAutoNameEn = auto;
      if (!force && !nameEnAuto) return;
      if (auto || force) {
        state.nameEn = auto;
        const el = form.elements.namedItem('nameEn');
        if (el && el.value !== auto) el.value = auto;
      }
    } catch (_) {
      /* 拼音失败不阻塞编辑 */
    }
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      try {
        refresh();
      } catch (err) {
        console.error('refresh failed', err);
      }
    }, 40);
  }

  function fillForm() {
    for (const key of Object.keys(DEFAULT_STATE)) {
      const el = form.elements.namedItem(key);
      if (el && 'value' in el) el.value = state[key] || '';
    }
  }

  function loadState() {
    // 1) URL hash 优先（分享链接）
    const m = location.hash.match(/[#&]c=([A-Za-z0-9+/=]+)/);
    if (m) {
      try {
        const json = decodeURIComponent(escape(atob(m[1])));
        state = { ...DEFAULT_STATE, ...JSON.parse(json) };
        return;
      } catch (_) {
        /* fallthrough */
      }
    }
    // 2) 本机历史：有则保留，无则空白（首访清空）
    try {
      if (typeof CardStore !== 'undefined' && CardStore.loadLastLocal) {
        const last = CardStore.loadLastLocal();
        if (last && last.card) {
          state = { ...DEFAULT_STATE, ...last.card };
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.name && parsed.name !== '林思远') {
          state = { ...DEFAULT_STATE, ...parsed };
        }
      }
    } catch (_) {
      /* ignore */
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      /* quota */
    }
  }

  function encodeShare() {
    const payload = {
      name: state.name,
      nameEn: state.nameEn,
      title: state.title,
      company: state.company,
      phone: state.phone,
      email: state.email,
      website: state.website,
      wechat: state.wechat,
      address: state.address,
      bio: state.bio,
      template: state.template,
      accent: state.accent,
      avatar: state.avatar || '',
    };
    const json = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(json)));
  }

  // ---------- vCard ----------
  function buildVCard() {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${state.name}`,
    ];
    if (state.nameEn) lines.push(`X-NAME:${state.nameEn}`);
    if (state.title) lines.push(`TITLE:${state.title}`);
    if (state.company) lines.push(`ORG:${state.company}`);
    if (state.phone) lines.push(`TEL:${state.phone.replace(/\s+/g, '')}`);
    if (state.email) lines.push(`EMAIL:${state.email}`);
    if (state.website) lines.push(`URL:${state.website}`);
    if (state.wechat) lines.push(`X-WECHAT:${state.wechat}`);
    if (state.address) lines.push(`ADR:;;${state.address}`);
    if (state.bio) lines.push(`NOTE:${state.bio}`);
    lines.push('END:VCARD');
    return lines.join('\n');
  }

  function buildPlainText() {
    const rows = [
      state.name,
      [state.title, state.company].filter(Boolean).join(' · '),
      '',
      state.phone && `手机  ${state.phone}`,
      state.email && `邮箱  ${state.email}`,
      state.wechat && `微信  ${state.wechat}`,
      state.website && `网站  ${stripUrl(state.website)}`,
      state.address && `地址  ${state.address}`,
      '',
      state.bio,
    ].filter((x) => x !== false && x !== null && x !== undefined);
    return rows.join('\n');
  }

  // ---------- Render ----------
  function applyTemplate() {
    const tpl = TEMPLATES.find((t) => t.id === state.template) || TEMPLATES[0];
    [cardFront, cardBack].forEach((el) => {
      if (!el) return;
      el.className = `card ${el.classList.contains('face-front') ? 'face-front' : 'face-back'} ${tpl.className}`;
    });
    const label = $('#template-label');
    if (label) label.textContent = tpl.name;
    document.documentElement.style.setProperty('--card-accent', state.accent || tpl.accent);

    $$('.template-item').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.template === tpl.id);
    });
    $$('.swatch').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.color.toLowerCase() === (state.accent || '').toLowerCase());
    });
    // 换色/换模板后强制重绘二维码
    lastQrText = '';
  }

  function renderAvatar() {
    const letter = firstChar(state.name);
    const placeholder = $('#avatar-placeholder');
    const img = $('#avatar-img');
    const frontLetter = $('#card-avatar-letter');
    const frontImg = $('#card-avatar-img-front');

    placeholder.textContent = letter;
    frontLetter.textContent = letter;

    if (state.avatar) {
      img.src = state.avatar;
      img.hidden = false;
      placeholder.hidden = true;
      frontImg.src = state.avatar;
      frontImg.hidden = false;
      frontLetter.hidden = true;
    } else {
      img.hidden = true;
      placeholder.hidden = false;
      frontImg.hidden = true;
      frontLetter.hidden = false;
    }
  }

  function renderCard() {
    $('#card-name').textContent = state.name || '你的姓名';
    $('#card-name-en').textContent = state.nameEn || '';
    $('#card-name-en').style.display = state.nameEn ? '' : 'none';

    const roleSep = $('#card-role-sep');
    const title = state.title || '';
    const company = state.company || '';
    $('#card-title').textContent = title;
    $('#card-company').textContent = company;
    roleSep.style.display = title && company ? '' : 'none';
    if (!title && !company) {
      $('#card-title').parentElement.style.display = 'none';
    } else {
      $('#card-title').parentElement.style.display = '';
    }

    const contacts = {
      phone: state.phone,
      email: state.email,
      wechat: state.wechat,
      website: stripUrl(state.website),
    };
    $$('#card-contacts li').forEach((li) => {
      const k = li.dataset.k;
      const val = contacts[k] || '';
      li.classList.toggle('is-empty', !val);
      const span = li.querySelector('span:last-child');
      if (span) span.textContent = val;
    });

    $('#card-address').textContent = state.address || '';
    $('#card-address').parentElement.style.display = state.address ? '' : 'none';

    $('#back-company').textContent = state.company || state.name || '';
    $('#back-name').textContent = state.name || '';
    $('#back-bio').textContent = state.bio || '很高兴认识你。';

    renderAvatar();
    renderQR();
  }

  function renderQR() {
    try {
      const vcard = buildVCard();
      const text = vcard.length > 900 ? vcard.slice(0, 900) : vcard;
      if (text === lastQrText && qrCanvas.width > 0) return;
      lastQrText = text;
      const matrix = QRMini.encodeText(text);
      const tpl = TEMPLATES.find((t) => t.id === state.template) || TEMPLATES[0];
      const dark =
        tpl.id === 'minimal' || tpl.id === 'bamboo' || tpl.id === 'vermilion'
          ? '#1a1814'
          : '#12100e';
      QRMini.toCanvas(qrCanvas, matrix, {
        scale: 5,
        margin: 1,
        dark,
        light: '#ffffff',
      });
    } catch (err) {
      console.warn('QR 生成失败', err);
      const ctx = qrCanvas.getContext('2d');
      qrCanvas.width = 140;
      qrCanvas.height = 140;
      ctx.fillStyle = '#eee';
      ctx.fillRect(0, 0, 140, 140);
      ctx.fillStyle = '#999';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('二维码', 70, 74);
    }
  }

  function renderTemplates() {
    const grid = $('#template-grid');
    grid.innerHTML = TEMPLATES.map((t) => {
      const bg =
        t.id === 'ink'
          ? 'linear-gradient(145deg,#0a2f4a,#0b3d5c)'
          : t.id === 'gold'
            ? 'linear-gradient(160deg,#12100e,#1c1916)'
            : t.id === 'bamboo'
              ? 'linear-gradient(155deg,#eef3ef,#cfded4)'
              : t.id === 'vermilion'
                ? 'linear-gradient(160deg,#faf6f1,#f3ebe2)'
                : t.id === 'noir'
                  ? 'linear-gradient(160deg,#0e0e10,#1a1a1e)'
                  : 'linear-gradient(160deg,#faf8f4,#f0ebe3)';
      const fg =
        t.id === 'ink' || t.id === 'gold' || t.id === 'noir' ? '#e8dcc8' : '#1a1814';
      return `
        <button type="button" class="template-item" data-template="${t.id}" style="color:${fg}">
          <div class="template-thumb" style="background:${bg};color:${fg}"></div>
          <strong style="color:var(--ink)">${t.name}</strong>
          <span style="color:var(--ink-faint)">${t.desc}</span>
        </button>`;
    }).join('');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.template-item');
      if (!btn) return;
      state.template = btn.dataset.template;
      const tpl = TEMPLATES.find((t) => t.id === state.template);
      state.accent = tpl.accent;
      applyTemplate();
      renderQR();
      saveState();
    });
  }

  function setFace(face) {
    if (face === 'flip') {
      flipped = !flipped;
      card3d.classList.toggle('is-flipped', flipped);
    } else if (face === 'front') {
      flipped = false;
      card3d.classList.remove('is-flipped');
    } else if (face === 'back') {
      flipped = true;
      card3d.classList.add('is-flipped');
    }
    $$('.face-btn').forEach((b) => {
      const f = b.dataset.face;
      if (f === 'flip') return;
      b.classList.toggle('is-active', (f === 'front' && !flipped) || (f === 'back' && flipped));
    });
  }

  function refresh() {
    readForm();
    applyTemplate();
    renderCard();
    saveState();
  }

  // ---------- Export PNG (canvas 手绘双面) ----------
  function drawCardToCanvas(canvas, face) {
    const W = 1080;
    const H = 648;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const tpl = TEMPLATES.find((t) => t.id === state.template) || TEMPLATES[0];
    const accent = state.accent || tpl.accent;

    // 背景
    const bgMap = {
      minimal: ['#faf8f4', '#f0ebe3'],
      ink: ['#0a2f4a', '#0d4a6e'],
      gold: ['#12100e', '#1c1916'],
      bamboo: ['#eef3ef', '#cfded4'],
      vermilion: ['#faf6f1', '#f3ebe2'],
      noir: ['#0e0e10', '#1a1a1e'],
    };
    const [c0, c1] = bgMap[tpl.id] || bgMap.minimal;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, c0);
    g.addColorStop(1, c1);
    ctx.fillStyle = g;
    roundRect(ctx, 0, 0, W, H, 24);
    ctx.fill();

    const lightCard = ['minimal', 'bamboo', 'vermilion'].includes(tpl.id);
    const ink = lightCard ? '#1a1814' : '#f0e6d4';
    const soft = lightCard ? 'rgba(26,24,20,0.55)' : 'rgba(240,230,212,0.55)';
    const fontUI = '"PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif';
    const fontSerif = tpl.id === 'noir' ? fontUI : '"Noto Serif SC","Songti SC",serif';

    // 装饰
    if (tpl.id === 'ink' || tpl.id === 'gold') {
      ctx.fillStyle = 'rgba(184,149,106,0.2)';
      ctx.beginPath();
      ctx.arc(W - 40, 40, 140, 0, Math.PI * 2);
      ctx.fill();
    }
    if (tpl.id === 'vermilion') {
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, 14, H);
    }

    if (face === 'front') {
      // 头像
      const ax = 72;
      const ay = 72;
      const as = 140;
      ctx.save();
      ctx.beginPath();
      ctx.arc(ax + as / 2, ay + as / 2, as / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      if (state.avatar) {
        // 异步图片 — 同步路径用占位色
        ctx.fillStyle = accent;
        ctx.fillRect(ax, ay, as, as);
      } else {
        ctx.fillStyle = lightCard ? (tpl.id === 'minimal' ? '#1a1814' : accent) : accent;
        ctx.fillRect(ax, ay, as, as);
        ctx.fillStyle = lightCard && tpl.id === 'minimal' ? '#faf8f4' : lightCard ? '#eef3ef' : '#12100e';
        if (tpl.id === 'gold') ctx.fillStyle = '#12100e';
        if (tpl.id === 'ink') ctx.fillStyle = '#0a2f4a';
        ctx.font = `600 56px ${fontSerif}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(firstChar(state.name), ax + as / 2, ay + as / 2 + 2);
      }
      ctx.restore();

      // 文字
      let tx = 250;
      let ty = 100;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = ink;
      ctx.font = `700 52px ${fontSerif}`;
      ctx.fillText(state.name || '你的姓名', tx, ty + 20);

      if (state.nameEn) {
        ctx.fillStyle = tpl.id === 'gold' || tpl.id === 'ink' ? accent : soft;
        ctx.font = `400 18px ${fontUI}`;
        ctx.letterSpacing = '3px';
        ctx.fillText(state.nameEn.toUpperCase(), tx, ty + 52);
      }

      const role = [state.title, state.company].filter(Boolean).join(' · ');
      ctx.fillStyle = soft;
      ctx.font = `500 24px ${fontUI}`;
      ctx.fillText(role, tx, ty + 96);

      // 联系方式
      const items = [
        ['电话', state.phone],
        ['邮箱', state.email],
        ['微信', state.wechat],
        ['网站', stripUrl(state.website)],
      ].filter(([, v]) => v);

      let cy = 360;
      ctx.font = `400 20px ${fontUI}`;
      for (const [label, val] of items) {
        ctx.fillStyle = soft;
        ctx.fillText(label, 72, cy);
        ctx.fillStyle = ink;
        ctx.fillText(val, 130, cy);
        cy += 40;
      }

      if (state.address) {
        ctx.fillStyle = soft;
        ctx.font = `400 16px ${fontUI}`;
        ctx.fillText(state.address, 72, H - 48);
      }
    } else {
      // 背面：QR + 文案
      const qrSize = 280;
      const qx = 90;
      const qy = (H - qrSize) / 2;
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, qx - 16, qy - 16, qrSize + 32, qrSize + 32, 16);
      ctx.fill();

      try {
        const vcard = buildVCard();
        const matrix = QRMini.encodeText(vcard.slice(0, 900));
        const cell = Math.floor(qrSize / matrix.length);
        const offX = qx + ((qrSize - cell * matrix.length) / 2);
        const offY = qy + ((qrSize - cell * matrix.length) / 2);
        ctx.fillStyle = '#12100e';
        for (let r = 0; r < matrix.length; r++) {
          for (let c = 0; c < matrix.length; c++) {
            if (matrix[r][c]) {
              ctx.fillRect(offX + c * cell, offY + r * cell, cell, cell);
            }
          }
        }
      } catch (_) {
        ctx.fillStyle = '#ddd';
        ctx.fillRect(qx, qy, qrSize, qrSize);
      }

      ctx.fillStyle = soft;
      ctx.font = `400 18px ${fontUI}`;
      ctx.textAlign = 'center';
      ctx.fillText('扫码存通讯录', qx + qrSize / 2, qy + qrSize + 40);

      // 右侧文案
      const sx = 480;
      ctx.textAlign = 'left';
      ctx.fillStyle = soft;
      ctx.font = `500 18px ${fontUI}`;
      ctx.fillText(state.company || '', sx, 180);

      ctx.fillStyle = ink;
      ctx.font = `700 42px ${fontSerif}`;
      ctx.fillText(state.name || '', sx, 240);

      ctx.fillStyle = soft;
      ctx.font = `400 22px ${fontUI}`;
      wrapText(ctx, state.bio || '', sx, 300, 480, 34);

      ctx.fillStyle = accent;
      ctx.fillRect(sx, 420, 56, 5);
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = String(text).split('');
    let line = '';
    let cy = y;
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, cy);
        line = ch;
        cy += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, cy);
  }

  async function exportPNG() {
    readForm();
    const front = document.createElement('canvas');
    const back = document.createElement('canvas');
    drawCardToCanvas(front, 'front');
    drawCardToCanvas(back, 'back');

    // 若有头像，先画到正面上
    if (state.avatar) {
      await paintAvatarOnCanvas(front);
    }

    // 拼接双面
    const gap = 24;
    const pad = 32;
    const out = document.createElement('canvas');
    out.width = front.width + pad * 2;
    out.height = front.height * 2 + gap + pad * 2;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(front, pad, pad);
    ctx.drawImage(back, pad, pad + front.height + gap);

    downloadDataURL(out.toDataURL('image/png'), `电子名片-${state.name || 'card'}.png`);
    toast('PNG 已下载');
  }

  function paintAvatarOnCanvas(canvas) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        const ax = 72;
        const ay = 72;
        const as = 140;
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax + as / 2, ay + as / 2, as / 2, 0, Math.PI * 2);
        ctx.clip();
        // cover
        const scale = Math.max(as / img.width, as / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, ax + (as - w) / 2, ay + (as - h) / 2, w, h);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = state.avatar;
    });
  }

  // ---------- Events ----------
  function on(el, type, fn, capture) {
    if (!el) return;
    el.addEventListener(
      type,
      (e) => {
        try {
          fn(e);
        } catch (err) {
          console.error(type, err);
        }
      },
      !!capture
    );
  }

  function bind() {
    // 中文输入法：组合期间不刷新、不改英文名，避免卡死
    on(form, 'compositionstart', (e) => {
      if (e.target && e.target.name === 'name') composing = true;
    });
    on(form, 'compositionend', (e) => {
      composing = false;
      const t = e.target;
      if (t && t.name === 'name') {
        const enEl = form.elements.namedItem('nameEn');
        const cur = String((enEl && enEl.value) || '').trim();
        nameEnAuto = !cur || cur === lastAutoNameEn;
        syncNameEnFromName(true);
      }
      refresh();
    });
    on(form, 'blur', () => {
      composing = false;
    }, true);

    on(form, 'input', (e) => {
      if (composing || e.isComposing) return;
      const t = e.target;
      if (t && t.name === 'nameEn') {
        const val = String(t.value || '').trim();
        if (!val) {
          nameEnAuto = true;
          syncNameEnFromName(true);
        } else {
          nameEnAuto = val === lastAutoNameEn;
        }
      }
      if (t && t.name === 'name') {
        const enEl = form.elements.namedItem('nameEn');
        const cur = String((enEl && enEl.value) || '').trim();
        nameEnAuto = !cur || cur === lastAutoNameEn;
        syncNameEnFromName(false);
      }
      scheduleRefresh();
    });

    // 载入后校准自动状态
    (function calibrateNameEnAuto() {
      try {
        const auto = typeof PinyinLite !== 'undefined' ? PinyinLite.nameToPinyin(state.name) : '';
        lastAutoNameEn = auto;
        nameEnAuto = !state.nameEn || state.nameEn === auto;
      } catch (_) {
        nameEnAuto = false;
      }
    })();

    on($('#f-avatar'), 'change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast('请选择图片文件');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        // 压缩到 256
        const img = new Image();
        img.onload = () => {
          const size = 256;
          const c = document.createElement('canvas');
          c.width = size;
          c.height = size;
          const ctx = c.getContext('2d');
          const scale = Math.max(size / img.width, size / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
          state.avatar = c.toDataURL('image/jpeg', 0.85);
          renderAvatar();
          saveState();
          toast('头像已更新');
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    on($('#btn-clear-avatar'), 'click', () => {
      state.avatar = '';
      const f = $('#f-avatar');
      if (f) f.value = '';
      renderAvatar();
      saveState();
    });

    // tabs
    $$('.tab').forEach((tab) => {
      on(tab, 'click', () => {
        const id = tab.dataset.panel;
        $$('.tab').forEach((t) => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        $$('.panel').forEach((p) => {
          const on = p.id === `panel-${id}`;
          p.classList.toggle('is-active', on);
          p.hidden = !on;
        });
      });
    });

    // face
    $$('.face-btn').forEach((btn) => {
      on(btn, 'click', () => setFace(btn.dataset.face));
    });

    // colors
    on($('#color-row'), 'click', (e) => {
      const btn = e.target.closest('.swatch');
      if (!btn) return;
      state.accent = btn.dataset.color;
      applyTemplate();
      saveState();
    });

    // exports
    on($('#btn-png'), 'click', exportPNG);
    on($('#btn-quick-export'), 'click', () => {
      $$('.tab').forEach((t) => {
        const on = t.dataset.panel === 'export';
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      $$('.panel').forEach((p) => {
        const on = p.id === 'panel-export';
        p.classList.toggle('is-active', on);
        p.hidden = !on;
      });
    });

    on($('#btn-vcard'), 'click', () => {
      readForm();
      const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' });
      downloadBlob(blob, `${state.name || 'contact'}.vcf`);
      toast('vCard 已下载');
    });

    on($('#btn-copy-text'), 'click', async () => {
      readForm();
      try {
        await navigator.clipboard.writeText(buildPlainText());
        toast('名片文本已复制');
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = buildPlainText();
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        toast('名片文本已复制');
      }
    });

    on($('#btn-share-link'), 'click', async () => {
      readForm();
      const url = `${location.origin}${location.pathname}#c=${encodeShare()}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${state.name} 的电子名片`,
            text: buildPlainText(),
            url,
          });
          toast('已分享');
          return;
        } catch (_) {
          /* user cancel or unsupported */
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        toast('分享链接已复制');
      } catch {
        prompt('复制此链接分享名片：', url);
      }
    });

    on($('#btn-save-local'), 'click', () => {
      readForm();
      saveState();
      toast('已保存到本机');
    });

    on($('#btn-reset'), 'click', () => {
      if (!confirm('清空当前编辑？云端已保存的名片不受影响。')) return;
      state = { ...DEFAULT_STATE };
      fillForm();
      applyTemplate();
      renderCard();
      saveState();
      setFace('front');
      toast('已清空');
    });
  }

  // ---------- Init ----------
  function init() {
    try {
      loadState();
      // 启动时若英文名为空或旧倒序默认，自动纠正为正序拼音
      if (typeof PinyinLite !== 'undefined') {
        lastAutoNameEn = PinyinLite.nameToPinyin(state.name);
        if (!state.nameEn || state.nameEn === 'Siyuan Lin') {
          state.nameEn = lastAutoNameEn;
        }
      }
      fillForm();
      renderTemplates();
      applyTemplate();
      renderCard();
      bind();
      setFace('front');

      // 深链：#panel=template / #face=back
      const hash = location.hash || '';
      const panelMatch = hash.match(/panel=([a-z]+)/);
      const faceMatch = hash.match(/face=([a-z]+)/);
      if (panelMatch) {
        const tab = document.querySelector(`.tab[data-panel="${panelMatch[1]}"]`);
        if (tab) tab.click();
      }
      if (faceMatch) setFace(faceMatch[1]);

      if (/[#&]c=/.test(hash)) {
        toast('已载入分享名片');
      }
    } catch (err) {
      console.error('init failed', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
