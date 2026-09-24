/**
 * 名片存储：本机 localStorage + 云端 JSONBlob
 * 唯一键：姓名|手机号
 * 所有权：editToken（仅本人浏览器/私链持有）
 */
(function (global) {
  'use strict';

  const LS_PREFIX = 'cardcraft:';
  const LS_OWNER = 'cardcraft:owner:';
  const API = 'https://jsonblob.com/api/jsonBlob';

  function localKey(name, phone) {
    const n = String(name || '').trim();
    const p = String(phone || '').replace(/\s+/g, '');
    return n + '|' + p;
  }

  function lsGet(key) {
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function lsSet(key, val) {
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify(val));
    } catch (_) {
      /* quota */
    }
  }

  function hasLocalHistory() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(LS_PREFIX) === 0 && k.indexOf(LS_OWNER) !== 0) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  function loadLastLocal() {
    try {
      const raw = localStorage.getItem(LS_PREFIX + 'last');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function saveLastLocal(data) {
    lsSet('last', data);
  }

  function saveLocalByKey(key, record) {
    lsSet('k:' + key, record);
  }

  function loadLocalByKey(key) {
    return lsGet('k:' + key);
  }

  function saveOwner(blobId, editToken) {
    try {
      localStorage.setItem(LS_OWNER + blobId, editToken);
    } catch (_) {}
  }

  function getOwner(blobId) {
    try {
      return localStorage.getItem(LS_OWNER + blobId) || '';
    } catch (_) {
      return '';
    }
  }

  async function createRemote(payload) {
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('remote create failed: ' + res.status);
    const loc = res.headers.get('Location') || res.headers.get('location') || '';
    const id = loc.split('/').filter(Boolean).pop();
    if (!id) throw new Error('remote id missing');
    return id;
  }

  async function updateRemote(id, payload) {
    const res = await fetch(API + '/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('remote update failed: ' + res.status);
    return true;
  }

  async function fetchRemote(id) {
    const res = await fetch(API + '/' + id, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('remote fetch failed: ' + res.status);
    return res.json();
  }

  /**
   * 保存名片（姓名+手机 唯一）
   * 返回 { id, viewUrl, editUrl, payload, remote }
   */
  async function saveCard(card, editToken) {
    const key = localKey(card.name, card.phone);
    if (!card.name || !card.phone) {
      throw new Error('请填写姓名和手机号');
    }

    const payload = {
      v: 1,
      key,
      name: card.name,
      phone: card.phone,
      editToken: editToken,
      savedAt: new Date().toISOString(),
      card,
    };

    const prev = loadLocalByKey(key);
    let id = prev && prev.blobId ? prev.blobId : '';
    let remote = true;
    try {
      if (id) {
        await updateRemote(id, payload);
      } else {
        id = await createRemote(payload);
      }
    } catch (err) {
      remote = false;
      id = id || ('local-' + Date.now().toString(36));
    }

    const record = { key, blobId: id, editToken, card, savedAt: payload.savedAt, remote };
    saveLocalByKey(key, record);
    saveLastLocal(record);
    saveOwner(id, editToken);

    return {
      id,
      key,
      remote,
      payload,
      record,
    };
  }

  /**
   * 读取名片
   * @param {string} id
   * @returns {Promise<{data, ownerToken}>} ownerToken 为空表示非本人
   */
  async function loadCard(id) {
    let data = null;
    try {
      data = await fetchRemote(id);
    } catch (_) {
      // 本机回退
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k || k.indexOf(LS_PREFIX + 'k:') !== 0) continue;
          const rec = lsGet(k.slice(LS_PREFIX.length));
          if (rec && rec.blobId === id) {
            data = { card: rec.card, editToken: rec.editToken, key: rec.key, name: rec.card.name, phone: rec.card.phone };
            break;
          }
        }
      } catch (_) {}
    }
    if (!data) throw new Error('名片不存在或已过期');
    const ownerToken = getOwner(id);
    return { data, ownerToken };
  }

  function makeEditToken() {
    const a = new Uint8Array(16);
    (global.crypto || global.msCrypto).getRandomValues(a);
    return Array.from(a)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function baseUrl() {
    return location.origin + location.pathname;
  }

  function viewUrl(id) {
    return baseUrl() + '?card=' + encodeURIComponent(id);
  }

  function editUrl(id, editToken) {
    return baseUrl() + '?card=' + encodeURIComponent(id) + '&edit=' + encodeURIComponent(editToken);
  }

  global.CardStore = {
    localKey,
    hasLocalHistory,
    loadLastLocal,
    saveLastLocal,
    loadLocalByKey,
    saveLocalByKey,
    saveOwner,
    getOwner,
    saveCard,
    loadCard,
    makeEditToken,
    viewUrl,
    editUrl,
    baseUrl,
  };
})(typeof window !== 'undefined' ? window : globalThis);
