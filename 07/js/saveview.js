/**
 * 保存名片 + 名片二维码页 + 扫码查看
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
    return {
      card: q.get('card') || '',
      edit: q.get('edit') || '',
    };
  }

  function cardFromEditor() {
    if (window.CardEditor && CardEditor.getState) return CardEditor.getState();
    return null;
  }

  function setEditorState(card) {
    if (window.CardEditor && CardEditor.setState) CardEditor.setState(card);
  }

  // ---------- 保存 ----------
  async function onSave() {
    if (window.CardEditor && CardEditor.readForm) CardEditor.readForm();
    const card = cardFromEditor();
    if (!card) return;
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
      // 姓名+手机唯一：复用本机已有 editToken 以便持续可改
      const key = CardStore.localKey(card.name, card.phone);
      const prev = CardStore.loadLocalByKey(key);
      const editToken = (prev && prev.editToken) || CardStore.makeEditToken();
      const result = await CardStore.saveCard(card, editToken);
      openQrModal(result, card, editToken);
      toast(result.remote ? '已保存到云端' : '网络不可用，已保存到本机');
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

  function openQrModal(result, card, editToken) {
    const modal = $('#qr-modal');
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add('modal-open');

    $('#qr-poster-name').textContent = card.name || '';
    $('#qr-poster-meta').textContent = [card.title, card.company].filter(Boolean).join(' · ');

    const vurl = CardStore.viewUrl(result.id);
    try {
      const matrix = QRMini.encodeText(vurl);
      QRMini.toCanvas($('#share-qr-canvas'), matrix, {
        scale: 5,
        margin: 2,
        dark: '#1a1814',
        light: '#ffffff',
      });
    } catch (err) {
      console.error(err);
      toast('二维码生成失败');
    }

    $('#btn-copy-view-link').onclick = async () => {
      try {
        await navigator.clipboard.writeText(vurl);
        toast('查看链接已复制');
      } catch (_) {
        prompt('复制查看链接：', vurl);
      }
    };
    $('#btn-copy-edit-link').onclick = async () => {
      const eurl = CardStore.editUrl(result.id, editToken);
      try {
        await navigator.clipboard.writeText(eurl);
        toast('编辑链接已复制（请妥善保管）');
      } catch (_) {
        prompt('复制编辑链接：', eurl);
      }
    };
    $('#btn-dl-qr').onclick = () => downloadPoster(card, vurl);
  }

  function downloadPoster(card, vurl) {
    const src = $('#share-qr-canvas');
    const w = 720;
    const h = 980;
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const ctx = out.getContext('2d');

    // 背景
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#f7f3ea');
    g.addColorStop(1, '#ebe4d6');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // 边框
    ctx.strokeStyle = '#0b3d5c';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    ctx.fillStyle = '#0b3d5c';
    ctx.textAlign = 'center';
    ctx.font = '600 28px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText('名片二维码', w / 2, 88);

    ctx.fillStyle = '#1a1814';
    ctx.font = '700 44px "Noto Serif SC","Songti SC",serif';
    ctx.fillText(card.name || '', w / 2, 160);

    ctx.fillStyle = '#6b6458';
    ctx.font = '400 22px "PingFang SC","Noto Sans SC",sans-serif';
    const meta = [card.title, card.company].filter(Boolean).join(' · ');
    ctx.fillText(meta, w / 2, 200);

    // QR
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
    ctx.fillText('扫码查看名片', w / 2, qy + qs + 56);

    ctx.fillStyle = '#6b6458';
    ctx.font = '400 16px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText('本人扫码可编辑 · 他人仅可查看', w / 2, qy + qs + 92);

    ctx.fillStyle = '#b8956a';
    ctx.font = '500 18px "PingFang SC","Noto Sans SC",sans-serif';
    ctx.fillText('名片工坊 · by 梁英俊', w / 2, h - 56);

    const a = document.createElement('a');
    a.href = out.toDataURL('image/png');
    a.download = `名片二维码-${card.name || 'card'}.png`;
    a.click();
    toast('二维码图片已保存');
  }

  function closeModal() {
    const modal = $('#qr-modal');
    if (modal) modal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  // ---------- 查看页 ----------
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
      .map(
        (r) =>
          `<li><span class="ico">${r[0]}</span><span>${escapeHtml(r[1])}</span></li>`
      )
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

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
      $('#view-card-wrap').innerHTML =
        '<div class="view-error">名片不存在或网络异常</div>';
      return;
    }
    const data = loaded.data;
    const card = data.card || data;
    const ownerToken = loaded.ownerToken || '';
    const isOwner =
      (editFromUrl && data.editToken && editFromUrl === data.editToken) ||
      (ownerToken && data.editToken && ownerToken === data.editToken) ||
      (ownerToken && !data.editToken);

    renderViewCard(card);

    const editBtn = $('#btn-view-edit');
    if (isOwner) {
      editBtn.hidden = false;
      editBtn.onclick = () => {
        setEditorState(card);
        // 进入编辑器
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
    $('#btn-view-copy').onclick = async () => {
      const text = [
        card.name,
        [card.title, card.company].filter(Boolean).join(' · '),
        card.phone && `手机  ${card.phone}`,
        card.email && `邮箱  ${card.email}`,
        card.wechat && `微信  ${card.wechat}`,
      ]
        .filter(Boolean)
        .join('\n');
      try {
        await navigator.clipboard.writeText(text);
        toast('联系方式已复制');
      } catch (_) {
        prompt('复制联系方式：', text);
      }
    };
  }

  // ---------- init ----------
  function initSaveView() {
    $$('#qr-modal [data-close]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    const saveBtn = $('#btn-save-card');
    if (saveBtn) saveBtn.addEventListener('click', onSave);

    // 导出区也提供保存
    const exportSave = $('#btn-save-local');
    if (exportSave) {
      exportSave.id = 'btn-save-cloud';
      exportSave.querySelector('strong').textContent = '保存并生成二维码';
      exportSave.querySelector('span').textContent = '按姓名+手机存档，生成名片二维码';
      exportSave.addEventListener('click', onSave);
    }

    const q = parseQuery();
    if (q.card) {
      showViewMode(q.card, q.edit);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaveView);
  } else {
    initSaveView();
  }
})();
