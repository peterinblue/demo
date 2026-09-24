/**
 * 保存名片 + 名片二维码页 + 分享二维码 + 扫码查看
 */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-show'), 2400);
  }

  function parseQuery() {
    const q = new URLSearchParams(location.search);
    return { card: q.get('card') || '', edit: q.get('edit') || '' };
  }

  function field(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? String(el.value || '').trim() : '';
  }

  /** 优先走 CardEditor，失败则读表单 DOM */
  function getCard() {
    if (window.CardEditor && CardEditor.getState) {
      try {
        return CardEditor.getState();
      } catch (_) {}
    }
    return {
      name: field('name'),
      nameEn: field('nameEn'),
      title: field('title'),
      company: field('company'),
      phone: field('phone'),
      email: field('email'),
      website: field('website'),
      wechat: field('wechat'),
      address: field('address'),
      bio: field('bio'),
      avatar: '',
      template: 'minimal',
      accent: '#0B3D5C',
    };
  }

  function drawQr(canvas, text) {
    if (!canvas || !window.QRMini) throw new Error('QR 模块未加载');
    const matrix = QRMini.encodeText(text);
    QRMini.toCanvas(canvas, matrix, {
      scale: 5,
      margin: 2,
      dark: '#1a1814',
      light: '#ffffff',
    });
    return canvas;
  }

  function downloadPoster(card, vurl, hint) {
    const src = $('#share-qr-canvas');
    const w = 720;
    const h = 980;
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const ctx = out.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#f7f3ea');
    g.addColorStop(1, '#ebe4d6');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#0b3d5c';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    ctx.fillStyle = '#0b3d5c';
    ctx.textAlign = 'center';
    ctx.font = '600 28px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText(hint || '名片二维码', w / 2, 88);

    ctx.fillStyle = '#1a1814';
    ctx.font = '700 44px "Noto Serif SC","Songti SC",serif';
    ctx.fillText(card.name || '', w / 2, 160);

    ctx.fillStyle = '#6b6458';
    ctx.font = '400 22px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText([card.title, card.company].filter(Boolean).join(' · '), w / 2, 200);

    const qs = 360;
    const qx = (w - qs) / 2;
    const qy = 250;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qx - 16, qy - 16, qs + 32, qs + 32);
    ctx.strokeStyle = 'rgba(26,24,20,0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(qx - 16, qy - 16, qs + 32, qs + 32);
    ctx.drawImage(src, qx, qy, qs, qs);

    ctx.fillStyle = '#1a1814';
    ctx.font = '500 24px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText('微信扫码打开网页名片', w / 2, qy + qs + 56);

    ctx.fillStyle = '#6b6458';
    ctx.font = '400 16px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText('可保存图片后发给微信好友 / 朋友圈', w / 2, qy + qs + 92);

    ctx.fillStyle = '#b8956a';
    ctx.font = '500 18px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText('名片工坊 · by 梁英俊', w / 2, h - 56);

    const a = document.createElement('a');
    a.href = out.toDataURL('image/png');
    a.download = `${hint || '名片二维码'}-${card.name || 'card'}.png`;
    a.click();
    toast('二维码图片已保存，可发到微信');
  }

  function openModal(title, sub) {
    const modal = $('#qr-modal');
    if (!modal) return null;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const t = $('#qr-modal-title');
    if (t) t.textContent = title || '名片二维码';
    const s = modal.querySelector('.modal-sub');
    if (s) s.textContent = sub || '';
    return modal;
  }

  function closeModal() {
    const modal = $('#qr-modal');
    if (modal) modal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  async function copyText(text, okMsg) {
    try {
      await navigator.clipboard.writeText(text);
      toast(okMsg || '已复制');
    } catch (_) {
      prompt('请手动复制：', text);
    }
  }

  async function tryWeChatShare(card, url) {
    // 系统/微信内分享（iOS 微信等支持 Web Share）
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name || '电子名片'} 的名片`,
          text: [card.name, [card.title, card.company].filter(Boolean).join(' · ')]
            .filter(Boolean)
            .join(' · '),
          url,
        });
        return true;
      } catch (_) {
        /* 用户取消或不支持 */
      }
    }
    return false;
  }

  /** 分享链接 → 网页二维码 + 微信分享 */
  function openShareQr(url, card) {
    card = card || getCard();
    openModal('分享名片', '扫码打开网页名片，或保存二维码图片后发到微信');
    const nameEl = $('#qr-poster-name');
    const metaEl = $('#qr-poster-meta');
    if (nameEl) nameEl.textContent = card.name || '电子名片';
    if (metaEl) metaEl.textContent = [card.title, card.company].filter(Boolean).join(' · ');

    try {
      drawQr($('#share-qr-canvas'), url);
    } catch (err) {
      console.error(err);
      toast('二维码生成失败，请复制链接分享');
    }

    const actions = $('#qr-modal .modal-actions');
    if (actions && !$('#btn-wechat-share')) {
      const wx = document.createElement('button');
      wx.type = 'button';
      wx.className = 'btn btn-primary';
      wx.id = 'btn-wechat-share';
      wx.textContent = '微信分享';
      actions.insertBefore(wx, actions.firstChild);
      wx.addEventListener('click', async () => {
        const ok = await tryWeChatShare(card, url);
        if (!ok) {
          await copyText(url, '链接已复制，去微信粘贴给好友');
        }
      });
    }

    const dl = $('#btn-dl-qr');
    if (dl) dl.onclick = () => downloadPoster(card, url, '名片分享');

    const copyView = $('#btn-copy-view-link');
    if (copyView) {
      copyView.textContent = '复制网页链接';
      copyView.onclick = () => copyText(url, '网页链接已复制');
    }
    const copyEdit = $('#btn-copy-edit-link');
    if (copyEdit) copyEdit.hidden = true;
  }

  // ---------- 保存 ----------
  async function onSave() {
    const card = getCard();
    if (!card.name || !String(card.name).trim()) {
      toast('请先填写姓名');
      return;
    }
    if (!card.phone || !String(card.phone).replace(/\s/g, '')) {
      toast('请先填写手机号（作为唯一标识）');
      return;
    }

    const btn = $('#btn-save-card');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '保存中…';
    }
    try {
      const key = CardStore.localKey(card.name, card.phone);
      const prev = CardStore.loadLocalByKey(key);
      const editToken = (prev && prev.editToken) || CardStore.makeEditToken();
      const result = await CardStore.saveCard(card, editToken);

      openModal('名片二维码', '保存图片后，对方扫码即可查看你的网页名片。本人扫码可继续编辑。');
      const nameEl = $('#qr-poster-name');
      const metaEl = $('#qr-poster-meta');
      if (nameEl) nameEl.textContent = card.name || '';
      if (metaEl) metaEl.textContent = [card.title, card.company].filter(Boolean).join(' · ');

      const vurl = CardStore.viewUrl(result.id);
      try {
        drawQr($('#share-qr-canvas'), vurl);
      } catch (err) {
        console.error(err);
        toast('二维码绘制失败，请重试');
      }

      $('#btn-dl-qr').onclick = () => downloadPoster(card, vurl, '名片二维码');
      $('#btn-copy-view-link').onclick = () => copyText(vurl, '查看链接已复制');
      const copyEdit = $('#btn-copy-edit-link');
      if (copyEdit) {
        copyEdit.hidden = false;
        copyEdit.onclick = () =>
          copyText(CardStore.editUrl(result.id, editToken), '编辑链接已复制（请妥善保管）');
      }

      toast(result.remote ? '已保存到云端，二维码已生成' : '网络不可用，已存本机并生成二维码');
    } catch (err) {
      console.error(err);
      toast(err.message || '保存失败');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '保存名片';
      }
    }
  }

  // ---------- 查看页 ----------
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderViewCard(card) {
    const wrap = $('#view-card-wrap');
    if (!wrap) return;
    const tpl = (card && card.template) || 'minimal';
    const initials = (card.name || '名').trim().slice(0, 1);
    const avatar = card.avatar
      ? `<img src="${card.avatar}" alt="" />`
      : `<span>${initials}</span>`;
    const rows = [
      ['电话', card.phone],
      ['邮箱', card.email],
      ['微信', card.wechat],
      ['网站', (card.website || '').replace(/^https?:\/\//, '')],
      ['地址', card.address],
    ]
      .filter((r) => r[1])
      .map((r) => `<li><span class="ico">${r[0]}</span><span>${escapeHtml(r[1])}</span></li>`)
      .join('');

    wrap.innerHTML = `
      <article class="view-card t-${escapeHtml(tpl)}">
        <div class="view-card-top">
          <div class="view-avatar">${avatar}</div>
          <div>
            <h1>${escapeHtml(card.name || '')}</h1>
            ${card.nameEn ? `<p class="en">${escapeHtml(card.nameEn)}</p>` : ''}
            <p class="role">${escapeHtml([card.title, card.company].filter(Boolean).join(' · '))}</p>
          </div>
        </div>
        <ul class="view-contacts">${rows}</ul>
        ${card.bio ? `<p class="view-bio">${escapeHtml(card.bio)}</p>` : ''}
      </article>`;
  }

  function buildVCard(card) {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${card.name || ''}`];
    if (card.title) lines.push(`TITLE:${card.title}`);
    if (card.company) lines.push(`ORG:${card.company}`);
    if (card.phone) lines.push(`TEL:${String(card.phone).replace(/\s+/g, '')}`);
    if (card.email) lines.push(`EMAIL:${card.email}`);
    if (card.website) lines.push(`URL:${card.website}`);
    if (card.wechat) lines.push(`X-WECHAT:${card.wechat}`);
    if (card.address) lines.push(`ADR:;;${card.address}`);
    if (card.bio) lines.push(`NOTE:${card.bio}`);
    lines.push('END:VCARD');
    return lines.join('\n');
  }

  async function showViewMode(id, editFromUrl) {
    document.body.classList.add('is-view-mode');
    const app = document.querySelector('.app');
    if (app) app.hidden = true;
    const page = $('#view-page');
    page.hidden = false;

    let loaded = null;
    try {
      loaded = await CardStore.loadCard(id);
    } catch (err) {
      $('#view-card-wrap').innerHTML = '<div class="view-error">名片不存在或网络异常</div>';
      return;
    }
    const data = loaded.data;
    const card = data.card || data;
    const ownerToken = loaded.ownerToken || '';
    const isOwner =
      (editFromUrl && data.editToken && editFromUrl === data.editToken) ||
      (ownerToken && data.editToken && ownerToken === data.editToken);

    renderViewCard(card);

    const editBtn = $('#btn-view-edit');
    if (isOwner) {
      editBtn.hidden = false;
      editBtn.onclick = () => {
        if (window.CardEditor && CardEditor.setState) CardEditor.setState(card);
        document.body.classList.remove('is-view-mode');
        page.hidden = true;
        if (app) app.hidden = false;
        toast('已载入你的名片，可继续编辑');
      };
    } else {
      editBtn.hidden = true;
    }

    $('#btn-view-vcard').onclick = () => {
      const blob = new Blob([buildVCard(card)], { type: 'text/vcard;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${card.name || 'contact'}.vcf`;
      a.click();
    };
    $('#btn-view-copy').onclick = () => {
      const text = [
        card.name,
        [card.title, card.company].filter(Boolean).join(' · '),
        card.phone && `手机  ${card.phone}`,
        card.email && `邮箱  ${card.email}`,
        card.wechat && `微信  ${card.wechat}`,
      ]
        .filter(Boolean)
        .join('\n');
      copyText(text, '联系方式已复制');
    };
  }

  function initSaveView() {
    $$('#qr-modal [data-close]').forEach((el) => el.addEventListener('click', closeModal));

    const saveBtn = $('#btn-save-card');
    if (saveBtn) saveBtn.addEventListener('click', onSave);

    // 导出区「保存并生成二维码」
    let exportSave = $('#btn-save-cloud') || $('#btn-save-local');
    if (exportSave) {
      const strong = exportSave.querySelector('strong');
      const span = exportSave.querySelector('span');
      if (strong) strong.textContent = '保存并生成二维码';
      if (span) span.textContent = '按姓名+手机存档，生成网页名片二维码';
      // 换绑为保存（移除旧 listener 不可行，直接覆盖 onclick 优先）
      exportSave.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onSave();
      };
    }

    // 分享入口由 app.js 调用 CardShare.openShareQr
    window.CardShare = { openShareQr, getCard, onSave };

    const q = parseQuery();
    if (q.card) showViewMode(q.card, q.edit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaveView);
  } else {
    initSaveView();
  }
})();
