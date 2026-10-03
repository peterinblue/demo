/*!
 * 访问计数器  ·  peterinblue.github.io/demo
 * ------------------------------------------------------------------
 * 一行引入即可，样式与 DOM 全部由本文件注入，不影响宿主页面：
 *
 *   <!-- 展示样式（带数字动画） -->
 *   <script defer src="https://peterinblue.github.io/demo/counter.js"></script>
 *
 *   <!-- 只在后台计数、不显示任何东西 -->
 *   <script defer src="https://peterinblue.github.io/demo/counter.js" data-mode="count"></script>
 *
 * 可选属性：
 *   data-mode       display | count            默认 display
 *   data-namespace  计数命名空间                默认 peterinblue.github.io
 *   data-key        计数键                      默认 demo-visits
 *   data-base       起始值（键不存在时的兜底）  默认 2000
 *   data-label      标题文案
 *   data-sub        副标题文案
 *   data-target     自定义挂载选择器（默认插到 <footer> 之前）
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
    label: attr('data-label', '累计访问人数'),
    sub: attr('data-sub', '本站访客 · 同一访客每天只计一次'),
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

  /* ---------------- 样式 ---------------- */

  var CSS = [
    '.pbc-root{--pbc-a:#4f46e5;--pbc-b:#0891b2;--pbc-ink:#312e81;--pbc-mut:#64748b;',
    'display:flex;justify-content:center;margin:30px 16px 20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;}',
    '.pbc-card{position:relative;display:flex;align-items:center;gap:14px;width:100%;max-width:400px;padding:15px 20px 15px 22px;',
    'border-radius:18px;border:1px solid transparent;box-sizing:border-box;overflow:hidden;',
    'background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(246,248,255,.9)) padding-box,',
    'linear-gradient(135deg,rgba(99,102,241,.55),rgba(6,182,212,.45),rgba(99,102,241,.2)) border-box;',
    'box-shadow:0 14px 34px -18px rgba(49,46,129,.45),0 2px 6px rgba(15,23,42,.04);',
    'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
    'transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s ease;}',
    '.pbc-card:hover{transform:translateY(-2px);box-shadow:0 20px 40px -20px rgba(49,46,129,.5),0 2px 8px rgba(15,23,42,.06);}',
    '.pbc-card::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:0 3px 3px 0;',
    'background:linear-gradient(180deg,var(--pbc-a),var(--pbc-b));}',
    '.pbc-card::after{content:"";position:absolute;right:-40px;top:-60px;width:150px;height:150px;border-radius:50%;',
    'background:radial-gradient(circle,rgba(99,102,241,.16),rgba(99,102,241,0) 70%);pointer-events:none;}',

    '.pbc-ico{flex:0 0 auto;width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;',
    'background:linear-gradient(135deg,var(--pbc-a),var(--pbc-b));box-shadow:0 6px 14px -6px rgba(79,70,229,.8);}',
    '.pbc-ico svg{width:17px;height:17px;display:block;}',

    '.pbc-main{flex:1 1 auto;min-width:0;}',
    '.pbc-head{display:flex;align-items:center;gap:7px;margin-bottom:2px;}',
    '.pbc-label{font-size:11.5px;font-weight:600;letter-spacing:.14em;color:var(--pbc-mut);white-space:nowrap;}',
    '.pbc-live{display:inline-flex;align-items:center;gap:4px;margin-left:auto;font-size:9px;font-weight:700;letter-spacing:.12em;color:#059669;}',
    '.pbc-live i{width:5px;height:5px;border-radius:50%;background:#10b981;box-shadow:0 0 0 0 rgba(16,185,129,.6);animation:pbc-pulse 2s infinite;}',
    '@keyframes pbc-pulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,.55)}70%{box-shadow:0 0 0 7px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}',

    '.pbc-val{display:flex;align-items:baseline;gap:9px;line-height:1;margin:3px 0 5px;}',
    '.pbc-digits{display:inline-flex;align-items:flex-end;height:1em;overflow:hidden;',
    'font-size:34px;font-weight:800;color:var(--pbc-ink);font-variant-numeric:tabular-nums;}',
    '.pbc-d{display:inline-block;width:.62em;height:1em;overflow:hidden;}',
    '.pbc-t{display:block;will-change:transform;}',
    '.pbc-t i{display:block;height:1em;line-height:1;font-style:normal;text-align:center;}',
    '.pbc-sep{display:inline-block;width:.32em;height:1em;line-height:1;text-align:center;color:rgba(49,46,129,.45);}',
    '.pbc-plus{font-size:12px;font-weight:700;color:#059669;opacity:0;transform:translateY(4px);transition:opacity .4s ease,transform .4s ease;}',
    '.pbc-plus.on{opacity:1;transform:translateY(0);}',

    '.pbc-sub{margin-top:4px;font-size:10.5px;color:#94a3b8;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.pbc-dot{display:inline-block;width:3px;height:3px;border-radius:50%;background:#cbd5e1;margin:0 5px;vertical-align:middle;}',
    '@media (max-width:430px){.pbc-card{padding:13px 16px 13px 18px;gap:11px;}.pbc-digits{font-size:26px;}.pbc-label{font-size:10.5px;letter-spacing:.1em;}.pbc-sub{font-size:9.5px;}}',
    '@media (prefers-reduced-motion:reduce){.pbc-card,.pbc-t,.pbc-plus{transition:none!important;}.pbc-live i{animation:none!important;}}'
  ].join('');

  function ensureStyle() {
    if (document.getElementById('pbc-style')) return;
    var s = document.createElement('style');
    s.id = 'pbc-style';
    s.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(s);
  }

  /* ---------------- 渲染 ---------------- */

  var el = {}, cols = [], lastCount = -1, mountNode = null, plusTimer = null;

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
        ? 'transform .95s cubic-bezier(.22,1,.36,1) ' + (idx * 70) + 'ms'
        : 'transform .8s cubic-bezier(.22,1,.36,1)';
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
          c.t.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
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
    root.setAttribute('aria-label', CFG.label);

    var card = document.createElement('div');
    card.className = 'pbc-card';

    var ico = document.createElement('div');
    ico.className = 'pbc-ico';
    ico.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3.2"/></svg>';

    var main = document.createElement('div');
    main.className = 'pbc-main';

    var head = document.createElement('div');
    head.className = 'pbc-head';
    var lab = document.createElement('span');
    lab.className = 'pbc-label';
    lab.textContent = CFG.label;
    var live = document.createElement('span');
    live.className = 'pbc-live';
    live.innerHTML = '<i></i>LIVE';
    head.appendChild(lab);
    head.appendChild(live);

    var val = document.createElement('div');
    val.className = 'pbc-val';
    val.setAttribute('aria-live', 'polite');
    var digits = document.createElement('span');
    digits.className = 'pbc-digits';
    var plus = document.createElement('span');
    plus.className = 'pbc-plus';
    plus.textContent = '+1';
    val.appendChild(digits);
    val.appendChild(plus);

    var sub = document.createElement('div');
    sub.className = 'pbc-sub';
    sub.innerHTML = CFG.sub.replace(/·/g, '<span class="pbc-dot"></span>');

    main.appendChild(head);
    main.appendChild(val);
    main.appendChild(sub);
    card.appendChild(ico);
    card.appendChild(main);
    root.appendChild(card);

    el = { root: root, digits: digits, plus: plus };
    return root;
  }

  function mount() {
    if (mountNode) return mountNode;
    var node = buildWidget();
    var host = CFG.target ? document.querySelector(CFG.target) : null;
    if (host) { host.appendChild(node); mountNode = node; return node; }
    var foot = document.querySelector('footer') || document.querySelector('.footer') || document.querySelector('#footer');
    if (foot && foot.parentNode) { foot.parentNode.insertBefore(node, foot); mountNode = node; return node; }
    document.body.appendChild(node);
    mountNode = node;
    return node;
  }

  function showPlus() {
    if (!el.plus) return;
    el.plus.classList.add('on');
    clearTimeout(plusTimer);
    plusTimer = setTimeout(function () { el.plus.classList.remove('on'); }, 2200);
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

    if (lsGet(flag) === '1') {
      api('get', CFG.key).then(function (r) {
        if (r && r.status === 200 && typeof r.value === 'number' && r.value >= CFG.base) {
          lsSet('pbc_last', String(r.value));
          if (CFG.mode === 'display') paint(r.value, false);
        }
      });
      return;
    }

    visitorIp().then(function (ip) {
      var ident = ip ? ('ip:' + ip) : ('dev:' + deviceId());
      var uniqueKey = 'd' + day + '-' + hash(ident);
      return api('create', uniqueKey, '?initializer=1').then(function (r) {
        if (r && r.status === 201) {
          lsSet(flag, '1');
          return api('hit', CFG.key).then(function (h) {
            if (h && typeof h.value === 'number') {
              lsSet('pbc_last', String(h.value));
              if (CFG.mode === 'display') { paint(h.value, false); showPlus(); }
            }
          });
        }
        if (r && r.status === 409) {
          lsSet(flag, '1');
          return api('get', CFG.key).then(function (g) {
            if (g && typeof g.value === 'number' && g.value >= CFG.base) {
              lsSet('pbc_last', String(g.value));
              if (CFG.mode === 'display') paint(g.value, false);
            }
          });
        }
        return api('get', CFG.key).then(function (g) {
          if (g && typeof g.value === 'number' && g.value >= CFG.base) {
            lsSet('pbc_last', String(g.value));
            if (CFG.mode === 'display') paint(g.value, false);
          }
        });
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
