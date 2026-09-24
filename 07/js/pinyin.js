/**
 * 中文姓名 → 正序拼音（姓 + 名）
 * 完整字库 pinyin-pro（姓氏多音字 / 复姓）
 * 林思远 → Lin Siyuan | 欧阳明月 → Ouyang Mingyue
 */
(function (global) {
  'use strict';

  const COMPOUND_SURNAMES = [
    '欧阳', '司马', '诸葛', '上官', '东方', '皇甫', '尉迟', '公孙',
    '慕容', '长孙', '宇文', '司徒', '鲜于', '轩辕', '令狐', '钟离',
    '闾丘', '子车', '亓官', '巫马', '公西', '颛孙', '壤驷', '公良',
    '漆雕', '乐正', '宰父', '谷梁', '段干', '百里', '东郭', '南门',
    '呼延', '羊舌', '微生', '梁丘', '左丘', '东门', '西门', '南宫',
    '第五', '夏侯', '闻人', '澹台', '公冶', '宗政', '赫连',
  ];

  function cap(py) {
    if (!py) return '';
    return py.charAt(0).toUpperCase() + py.slice(1);
  }

  function isChinese(ch) {
    const code = ch.codePointAt(0);
    return (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3400 && code <= 0x4dbf)
    );
  }

  function getEngine() {
    // 浏览器 UMD → window.pinyinPro
    if (global.pinyinPro && typeof global.pinyinPro.pinyin === 'function') {
      return global.pinyinPro;
    }
    // 兼容 exports 形态
    if (typeof module !== 'undefined' && module.exports && module.exports.pinyin) {
      return module.exports;
    }
    return null;
  }

  /**
   * 中文姓名 → 正序拼音
   * @param {string} name
   * @returns {string} 例如 "Lin Siyuan"
   */
  function nameToPinyin(name) {
    const raw = String(name || '').trim();
    if (!raw) return '';

    const compact = raw.replace(/\s+/g, '');
    const chinese = [];
    const latin = [];
    for (const ch of compact) {
      if (isChinese(ch)) chinese.push(ch);
      else if (/[A-Za-z]/.test(ch)) latin.push(ch);
    }

    if (!chinese.length) {
      return latin
        .join('')
        .split(/(?=[A-Z])|[\s_-]+/)
        .filter(Boolean)
        .map(cap)
        .join(' ');
    }

    const engine = getEngine();
    if (!engine) return raw;

    let syllables = [];
    try {
      const out = engine.pinyin(chinese.join(''), {
        toneType: 'none',
        type: 'array',
        mode: 'surname',
      });
      syllables = (Array.isArray(out) ? out : [out]).map((s) =>
        String(s || '')
          .toLowerCase()
          .replace(/[^a-z]/g, '')
      );
    } catch (_) {
      return raw;
    }
    if (!syllables.length) return raw;

    let surnameLen = 1;
    const head2 = chinese.slice(0, 2).join('');
    if (chinese.length >= 2 && COMPOUND_SURNAMES.indexOf(head2) >= 0) {
      surnameLen = 2;
    }

    const surPy = syllables.slice(0, surnameLen).join('');
    const givenPy = syllables.slice(surnameLen).join('');

    const parts = [];
    if (surPy) parts.push(cap(surPy));
    if (givenPy) parts.push(cap(givenPy));
    if (latin.length) parts.push(cap(latin.join('').toLowerCase()));
    return parts.join(' ');
  }

  global.PinyinLite = { nameToPinyin, COMPOUND_SURNAMES };
})(typeof window !== 'undefined' ? window : globalThis);
