/*!
 * 访问计数器  ·  peterinblue.github.io/demo
 * ------------------------------------------------------------------
 * 一行引入即可，样式与 DOM 全部由本文件注入，不影响宿主页面：
 *
 *   <script defer src="https://peterinblue.github.io/demo/counter.js?v=2"></script>
 *
 *   <!-- 只在后台计数、不显示任何东西 -->
 *   <script defer src="https://peterinblue.github.io/demo/counter.js?v=2" data-mode="count"></script>
 *
 * 可选属性：
 *   data-mode       display | count            默认 display
 *   data-namespace  计数命名空间                默认 peterinblue.github.io
 *   data-key        计数键                      默认 demo-visits
 *   data-base       起始值（键不存在时的兜底）  默认 2000
 *   data-label      标题文案                    默认 累计访问
 *   data-note       尾注文案                    默认 同一访客每天只计一次
 *   data-target     自定义挂载选择器（默认放进 <footer> 首行之上）
 *
 * 外观：**只有一行浅灰小字** —— 无边框、无底色、无阴影，跟页脚版权行同色系，
 *       不喧宾夺主；数字是唯一有动效的部分（rolling odometer）。
 *
 * 计数规则：
 *   1. 只统计挂了本脚本的页面 —— 当前仅 https://peterinblue.github.io/demo/；
 *   2. 同一天、同一个访客只计一次 —— 服务端用「每(日+IP)一把唯一键」做原子去重，
 *      客户端 local 记录只作加速，清缓存也刷不上去；
 *   3. 取不到 IP 时退化为「设备指纹」，效果等价（同一台设备一天仍只计一次）。
 * ------------------------------------------------------------------
 */
(function () {
  'use strict';

  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  var self = document.currentScript;
  if (!self) {
    var list = document.getElementsByTagName('script');
    for (var i = list.length - 1; i >= 0; i--) {
      if (/counter\.js(\?|$)/.test(list[i].src || '')) { self = list[i]; break; }
    }
  }
  var attr = function (n, d) { var v = self && self.getAttribute(n); return (v === null || v === '') ? d : v; };

  var CFG = {
    mode: attr('data-mode', 'display') === 'count' ? 'count' : 'display',
    ns: attr('data-namespace', 'peterinblue.github.io'),
    key: attr('data-key', 'demo-visits'),
    base: parseInt(attr('data-base', '2000'), 10) || 2000,
    label: attr('data-label', '累计访问'),
    note: attr('data-note', '同一访客每天只计一次'),
    target: attr('data-target', '')
  };

  var API = 'https://abacus.jasoncameron.dev';
  var IP_APIS = [
    'https://api.ipify.org?format=json',
    'https://ipwho.is/',
    'https://api64.ipify.org?format=json',
    'https://ipapi.co/json/',
    'https://api.ip.sb/geoip'
  ];

  /* ---------------- 小工具 ---------------- */

  var store = (function () {
    try {
      var k = '__pbc_probe__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return window.localStorage;
    } catch (e) { return null; }
  })();

  function lsGet(k) { try { return store ? store.getItem(k) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { store && store.setItem(k, v); } catch (e) {} }

  /* 北京时间当天，形如 20261003 */
  function dayKey() {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date()).replace(/-/g, '');
    } catch (e) {
      var d = new Date(Date.now() + 8 * 3600 * 1000);
      return d.toISOString().slice(0, 10).replace(/-/g, '');
    }
  }

  function hash(str) {
    var h = 2166136261, i;
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h.toString(36);
  }

  function deviceId() {
    var v = lsGet('pbc_did');
    if (v) return v;
    v = 'd' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    lsSet('pbc_did', v);
    return v;
  }

  function req(url, ms) {
    if (!window.fetch) return Promise.reject(new Error('no-fetch'));
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { ctl && ctl.abort(); }, ms || 6000);
    return fetch(url, {
      method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'omit',
      referrerPolicy: 'no-referrer-when-downgrade',
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      clearTimeout(timer);
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) {}
        return { status: r.status, ok: r.ok, value: j && j.value, json: j };
      });
    }, function (e) {
      clearTimeout(timer);
      throw e;
    });
  }

  function api(op, key, query) {
    var url = API + '/' + op + '/' + encodeURIComponent(CFG.ns) + '/' +
              encodeURIComponent(key || CFG.key) + (query || '');
    return req(url, 6000).catch(function () { return null; });
  }

  /* 多个回显服务赛跑，先回来的先用；全都拿不到就返回 null */
  function visitorIp() {
    return new Promise(function (resolve) {
      var settled = false, pending = IP_APIS.length, guard;
      function done(v) { if (!settled) { settled = true; clearTimeout(guard); resolve(v); } }
      guard = setTimeout(function () { done(null); }, 4000);
      IP_APIS.forEach(function (u) {
        req(u, 3500).then(function (r) {
          var j = r && r.json;
          var ip = j && (j.ip || j.query || j.ipAddress || (j.data && j.data.ip));
          if (ip && /^[0-9a-fA-F:.]{3,}$/.test(String(ip))) done(String(ip));
          else if (--pending === 0) done(null);
        }).catch(function () { if (--pending === 0) done(null); });
      });
    });
  }

  /* ---------------- 样式：刻意做"轻" ---------------- */
  /* 只有一行浅灰小字，与页脚版权行同色系；不设边框 / 背景 / 阴影，避免变成一张卡片 */

  var CSS = [
    '.pbc-root{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;',
    'margin:0 auto 7px;font-size:12.5px;line-height:1.2;font-weight:400;letter-spacing:.01em;color:#94a3b8;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    'background:none;border:0;box-shadow:none;padding:0;}',
    '.pbc-ico{display:inline-flex;align-items:center;flex:0 0 auto;opacity:.85;}',
    '.pbc-ico svg{width:13px;height:13px;display:block;stroke:#9aa8bb;fill:none;stroke-width:1.7;',
    'stroke-linecap:round;stroke-linejoin:round;}',
    '.pbc-label{color:#94a3b8;}',
    '.pbc-digits{display:inline-flex;align-items:flex-end;height:1em;overflow:hidden;',
    'font-size:14px;font-weight:600;color:#64748b;font-variant-numeric:tabular-nums;}',
    '.pbc-d{display:inline-block;width:.60em;height:1em;overflow:hidden;}',
    '.pbc-t{display:block;will-change:transform;}',
    '.pbc-t i{display:block;height:1em;line-height:1;font-style:normal;text-align:center;}',
    '.pbc-sep{display:inline-block;width:.28em;height:1em;line-height:1;text-align:center;color:#c3ccd8;}',
    '.pbc-dot{display:inline-block;width:3px;height:3px;border-radius:50%;background:#cbd5e1;flex:0 0 auto;}',
    '.pbc-note{color:#a9b4c2;font-size:11.5px;}',
    '@media (max-width:430px){.pbc-root{font-size:11.5px;gap:5px;}.pbc-digits{font-size:13px;}.pbc-note{font-size:10.5px;}}',
    '@media (prefers-reduced-motion:reduce){.pbc-t{transition:none!important;}}'
  ].join('');

  function ensureStyle() {
    if (document.getElementById('pbc-style')) return;
    var s = document.createElement('style');
    s.id = 'pbc-style';
    s.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------------- 渲染 ---------------- */

  var el = {}, cols = [], lastCount = -1, mountNode = null;

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function targetsOf(str) {
    var out = [];
    str.split('').forEach(function (ch) { if (ch >= '0' && ch <= '9') out.push(parseInt(ch, 10)); });
    return out;
  }

  function build(box, str, roll) {
    box.innerHTML = '';
    cols.length = 0;
    str.split('').forEach(function (ch) {
      var node;
      if (ch >= '0' && ch <= '9') {
        node = document.createElement('span');
        node.className = 'pbc-d';
        var t = document.createElement('span');
        t.className = 'pbc-t';
        for (var i = 0; i < 10; i++) {
          var d = document.createElement('i');
          d.textContent = String(i);
          t.appendChild(d);
        }
        node.appendChild(t);
        box.appendChild(node);
        t.style.transform = 'translateY(0em)';
        cols.push({ t: t, v: 0 });
      } else {
        node = document.createElement('span');
        node.className = 'pbc-sep';
        node.textContent = ch;
        box.appendChild(node);
      }
    });

    var targets = targetsOf(str);
    void box.offsetHeight;   /* 强制回流，让下面的位移产生过渡而不是瞬移 */
    cols.forEach(function (c, idx) {
      var target = targets[idx] || 0;
      c.t.style.transition = roll
        ? 'transform .9s cubic-bezier(.22,1,.36,1) ' + (idx * 60) + 'ms'
        : 'transform .7s cubic-bezier(.22,1,.36,1)';
      c.t.style.transform = 'translateY(-' + target + 'em)';
      c.v = target;
    });
  }

  function paint(value, roll) {
    if (!el.digits) return;
    var str = fmt(value);
    var digitCount = str.replace(/[^0-9]/g, '').length;
    if (digitCount !== lastCount) {
      build(el.digits, str, roll !== false);
      lastCount = digitCount;
      return;
    }
    var idx = 0;
    str.split('').forEach(function (ch) {
      if (ch >= '0' && ch <= '9') {
        var c = cols[idx];
        var d = parseInt(ch, 10);
        if (c && c.v !== d) {
          c.t.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1)';
          c.t.style.transform = 'translateY(-' + d + 'em)';
          c.v = d;
        }
        idx++;
      }
    });
  }

  function buildWidget() {
    ensureStyle();
    var root = document.createElement('div');
    root.className = 'pbc-root';
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', CFG.label + ' ' + CFG.note);

    var ico = document.createElement('span');
    ico.className = 'pbc-ico';
    ico.innerHTML = '<svg viewBox="0 0 24 24"><path d="M1.6 12S5.2 5.8 12 5.8 22.4 12 22.4 12 18.8 18.2 12 18.2 1.6 12 1.6 12z"/><circle cx="12" cy="12" r="3.1"/></svg>';

    var lab = document.createElement('span');
    lab.className = 'pbc-label';
    lab.textContent = CFG.label;

    var digits = document.createElement('span');
    digits.className = 'pbc-digits';

    var dot = document.createElement('span');
    dot.className = 'pbc-dot';

    var note = document.createElement('span');
    note.className = 'pbc-note';
    note.textContent = CFG.note;

    root.appendChild(ico);
    root.appendChild(lab);
    root.appendChild(digits);
    if (CFG.note) { root.appendChild(dot); root.appendChild(note); }

    el = { root: root, digits: digits };
    return root;
  }

  /* 挂载：优先放进 <footer> 里（当版权行的上一行），这样与页脚同色系、间距自然，
     不会被页脚那个 clamp(40px,6vw,64px) 的 margin-top 顶得老远 */
  function mount() {
    if (mountNode) return mountNode;
    var node = buildWidget();
    var host = CFG.target ? document.querySelector(CFG.target) : null;
    if (host) { host.appendChild(node); mountNode = node; return node; }

    var foot = document.querySelector('footer') || document.querySelector('.footer') || document.querySelector('#footer');
    if (foot) {
      foot.insertBefore(node, foot.firstChild);
      mountNode = node;
      return node;
    }
    document.body.appendChild(node);
    mountNode = node;
    return node;
  }

  /* ---------------- 主流程 ---------------- */

  function run() {
    var day = dayKey();
    var flag = 'pbc_seen_' + day;
    var cached = parseInt(lsGet('pbc_last'), 10);
    var fallback = (isFinite(cached) && cached >= CFG.base) ? cached : CFG.base;

    if (CFG.mode === 'display') {
      mount();
      paint(fallback, true);
    }

    function apply(v) {
      if (typeof v === 'number' && isFinite(v) && v >= CFG.base) {
        lsSet('pbc_last', String(v));
        if (CFG.mode === 'display') paint(v, false);
      }
    }

    if (lsGet(flag) === '1') {
      api('get', CFG.key).then(function (r) {
        if (r && r.status === 200) apply(r.value);
      });
      return;
    }

    visitorIp().then(function (ip) {
      var ident = ip ? ('ip:' + ip) : ('dev:' + deviceId());
      var uniqueKey = 'd' + day + '-' + hash(ident);
      return api('create', uniqueKey, '?initializer=1').then(function (r) {
        if (r && r.status === 201) {
          lsSet(flag, '1');
          return api('hit', CFG.key).then(function (h) { if (h) apply(h.value); });
        }
        if (r && r.status === 409) lsSet(flag, '1');
        return api('get', CFG.key).then(function (g) { if (g) apply(g.value); });
      });
    }).catch(function () {});
  }

  function boot() {
    try { run(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
