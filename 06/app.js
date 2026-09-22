(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const contentEl = $("#content");
  const sizeEl = $("#size");
  const eccEl = $("#ecc");
  const fgEl = $("#fg");
  const fg2El = $("#fg2");
  const bgEl = $("#bg");
  const bg2El = $("#bg2");
  const eyeColorEl = $("#eye-color");
  const typeHintEl = $("#type-hint");
  const statusEl = $("#status");
  const metaEl = $("#meta");
  const qrBox = $("#qr-box");
  const canvas = $("#qr-canvas");
  const downloadBtn = $("#download-btn");
  const copyBtn = $("#copy-btn");
  const clearBtn = $("#clear-btn");
  const tabTip = $("#tab-tip");

  const logoInput = $("#logo-input");
  const logoRemove = $("#logo-remove");
  const logoThumb = $("#logo-thumb");
  const logoSizeEl = $("#logo-size");
  const logoSizeVal = $("#logo-size-val");

  const frameColorEl = $("#frame-color");
  const frameColor2El = $("#frame-color2");
  const frameColor2Wrap = $("#frame-color2-wrap");
  const frameTextEl = $("#frame-text");
  const frameFontEl = $("#frame-font");
  const textModeEl = $("#text-mode");
  const fg2Wrap = $("#fg2-wrap");
  const bg2Wrap = $("#bg2-wrap");

  const TAB_TIPS = {
    pattern: "根据品牌形象和使用场景选择合适的二维码图案",
    eye: "选择图眼，让您的二维码脱颖而出。扫描时会通过定位图眼来识别二维码。",
    logo: "添加品牌 Logo 以彰显形象。建议正方形透明 PNG，容错级别选 H。",
    color: "支持纯色与渐变着色，可单独设置图眼颜色。",
    frame: "带边框和引导扫描文字的二维码更醒目，可自定义颜色与文案。",
    template: "选择现成模板快速套用图案、图眼、颜色与边框组合（可选）。",
  };

  const PATTERNS = [
    { id: "square", name: "方块" },
    { id: "rounded", name: "圆角" },
    { id: "dots", name: "圆点" },
    { id: "diamond", name: "菱形" },
    { id: "star", name: "星形" },
    { id: "hbar", name: "横条" },
    { id: "vbar", name: "竖条" },
    { id: "soft", name: "柔和" },
    { id: "tile", name: "砖块" },
    { id: "cross", name: "十字" },
    { id: "drop", name: "水滴" },
    { id: "slash", name: "斜切" },
  ];

  const EYES = [
    { id: "square", name: "方孔" },
    { id: "square-dot", name: "方框点" },
    { id: "circle", name: "圆环" },
    { id: "circle-dot", name: "同心圆" },
    { id: "rounded", name: "圆角框" },
    { id: "rounded-dot", name: "圆角点" },
    { id: "diamond", name: "菱形" },
    { id: "leaf", name: "叶形" },
    { id: "star", name: "星形" },
    { id: "dotted", name: "点阵" },
  ];

  const FRAMES = [
    { id: "none", name: "无边框" },
    { id: "banner", name: "上下横幅" },
    { id: "top-banner", name: "顶部标签" },
    { id: "bottom-banner", name: "底部横幅" },
    { id: "bubble", name: "气泡" },
    { id: "circle-dark", name: "圆底" },
    { id: "card-dark", name: "深色卡" },
    { id: "ribbon", name: "缎带" },
    { id: "ticket", name: "票券" },
    { id: "shadow-card", name: "投影卡" },
    { id: "rounded-tag", name: "圆角签" },
    { id: "outline", name: "描边框" },
  ];

  const TEMPLATES = [
    {
      id: "clean",
      name: "极简",
      style: {
        pattern: "square", eye: "square", colorMode: "solid",
        fg: "#0B1220", fg2: "#0B1220", eyeColor: "#0B1220",
        bg: "#FFFFFF", bg2: "#FFFFFF",
        frame: "none", frameColor: "#0B1220", frameColor2: "#0B1220",
        frameText: "", frameFont: "Arial, sans-serif", textMode: "solid",
      },
    },
    {
      id: "brand-blue",
      name: "品牌蓝",
      style: {
        pattern: "rounded", eye: "rounded-dot", colorMode: "solid",
        fg: "#054080", fg2: "#2F6BFF", eyeColor: "#054080",
        bg: "#FFFFFF", bg2: "#EAF1FF",
        frame: "bottom-banner", frameColor: "#054080", frameColor2: "#2F6BFF",
        frameText: "扫一扫", frameFont: "'PingFang SC','Microsoft YaHei',sans-serif", textMode: "solid",
      },
    },
    {
      id: "scan-me",
      name: "Scan Me",
      style: {
        pattern: "square", eye: "square", colorMode: "solid",
        fg: "#111111", fg2: "#111111", eyeColor: "#111111",
        bg: "#FFFFFF", bg2: "#FFFFFF",
        frame: "banner", frameColor: "#111111", frameColor2: "#333333",
        frameText: "SCAN ME", frameFont: "Arial, sans-serif", textMode: "solid",
      },
    },
    {
      id: "violet",
      name: "渐变紫",
      style: {
        pattern: "dots", eye: "circle-dot", colorMode: "gradient",
        fg: "#5B21B6", fg2: "#DB2777", eyeColor: "#4C1D95",
        bg: "#FFFFFF", bg2: "#F5F3FF",
        frame: "rounded-tag", frameColor: "#5B21B6", frameColor2: "#DB2777",
        frameText: "立即扫描", frameFont: "'PingFang SC','Microsoft YaHei',sans-serif", textMode: "gradient",
      },
    },
    {
      id: "forest",
      name: "森系",
      style: {
        pattern: "soft", eye: "leaf", colorMode: "solid",
        fg: "#166534", fg2: "#166534", eyeColor: "#14532D",
        bg: "#FFFFFF", bg2: "#ECFDF5",
        frame: "ticket", frameColor: "#166534", frameColor2: "#22C55E",
        frameText: "扫一扫", frameFont: "'PingFang SC','Microsoft YaHei',sans-serif", textMode: "solid",
      },
    },
    {
      id: "sunset",
      name: "日落",
      style: {
        pattern: "diamond", eye: "diamond", colorMode: "gradient",
        fg: "#C2410C", fg2: "#F59E0B", eyeColor: "#9A3412",
        bg: "#FFFFFF", bg2: "#FFF7ED",
        frame: "card-dark", frameColor: "#1F2937", frameColor2: "#C2410C",
        frameText: "SCAN ME", frameFont: "Arial, sans-serif", textMode: "solid",
      },
    },
    {
      id: "neon",
      name: "霓虹",
      style: {
        pattern: "star", eye: "star", colorMode: "gradient",
        fg: "#0F766E", fg2: "#2563EB", eyeColor: "#0E7490",
        bg: "#FFFFFF", bg2: "#ECFEFF",
        frame: "bubble", frameColor: "#0F766E", frameColor2: "#2563EB",
        frameText: "关注我们", frameFont: "'PingFang SC','Microsoft YaHei',sans-serif", textMode: "solid",
      },
    },
    {
      id: "mono-circle",
      name: "圆底黑",
      style: {
        pattern: "square", eye: "circle", colorMode: "solid",
        fg: "#111111", fg2: "#111111", eyeColor: "#111111",
        bg: "#FFFFFF", bg2: "#FFFFFF",
        frame: "circle-dark", frameColor: "#111111", frameColor2: "#111111",
        frameText: "SCAN ME", frameFont: "Arial, sans-serif", textMode: "solid",
      },
    },
    {
      id: "coral",
      name: "珊瑚粉",
      style: {
        pattern: "tile", eye: "rounded", colorMode: "solid",
        fg: "#BE123C", fg2: "#FB7185", eyeColor: "#9F1239",
        bg: "#FFFFFF", bg2: "#FFF1F2",
        frame: "ribbon", frameColor: "#BE123C", frameColor2: "#FB7185",
        frameText: "现在扫描", frameFont: "'PingFang SC','Microsoft YaHei',sans-serif", textMode: "solid",
      },
    },
    {
      id: "slate",
      name: "深空灰",
      style: {
        pattern: "hbar", eye: "square-dot", colorMode: "solid",
        fg: "#0F172A", fg2: "#334155", eyeColor: "#020617",
        bg: "#FFFFFF", bg2: "#F8FAFC",
        frame: "shadow-card", frameColor: "#0F172A", frameColor2: "#475569",
        frameText: "扫一扫", frameFont: "Arial, sans-serif", textMode: "solid",
      },
    },
    {
      id: "sky",
      name: "天空",
      style: {
        pattern: "drop", eye: "rounded-dot", colorMode: "gradient",
        fg: "#0369A1", fg2: "#38BDF8", eyeColor: "#0C4A6E",
        bg: "#FFFFFF", bg2: "#F0F9FF",
        frame: "top-banner", frameColor: "#0369A1", frameColor2: "#38BDF8",
        frameText: "SCAN ME", frameFont: "Arial, sans-serif", textMode: "solid",
      },
    },
    {
      id: "outline-blue",
      name: "描边",
      style: {
        pattern: "square", eye: "square", colorMode: "solid",
        fg: "#1D4ED8", fg2: "#1D4ED8", eyeColor: "#1E3A8A",
        bg: "#FFFFFF", bg2: "#FFFFFF",
        frame: "outline", frameColor: "#1D4ED8", frameColor2: "#60A5FA",
        frameText: "立即扫描", frameFont: "'PingFang SC','Microsoft YaHei',sans-serif", textMode: "solid",
      },
    },
  ];

  const state = {
    pattern: "square",
    eye: "square",
    frame: "none",
    colorMode: "solid",
    logo: null,
    logoSize: 20,
    ready: false,
    currentText: "",
    debounceTimer: null,
  };

  function detectType(text) {
    const trimmed = text.trim();
    if (!trimmed) return "empty";
    const urlLike =
      /^(https?:\/\/|www\.)[^\s]+$/i.test(trimmed) ||
      /^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(trimmed);
    return urlLike ? "url" : "text";
  }

  function updateHint(text) {
    const kind = detectType(text);
    if (kind === "empty") {
      typeHintEl.textContent = "将自动识别文字或网址";
      typeHintEl.classList.remove("is-url");
    } else if (kind === "url") {
      typeHintEl.textContent = "识别为网址链接";
      typeHintEl.classList.add("is-url");
    } else {
      typeHintEl.textContent = "识别为纯文本";
      typeHintEl.classList.remove("is-url");
    }
  }

  function setReady(on, message) {
    state.ready = on;
    downloadBtn.disabled = !on;
    copyBtn.disabled = !contentEl.value.trim().length;
    statusEl.textContent = message;
  }

  function showEmpty() {
    qrBox.classList.add("is-empty");
    qrBox.classList.remove("is-ready");
    canvas.hidden = true;
    const empty = qrBox.querySelector(".empty-state");
    if (empty) empty.hidden = false;
    metaEl.textContent = "";
    state.currentText = "";
    setReady(false, "输入内容后自动生成");
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function starPath(ctx, cx, cy, spikes, outer, inner) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outer);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
      rot += step;
    }
    ctx.closePath();
  }

  function makeFill(ctx, mode, c1, c2, x, y, w, h) {
    if (mode === "gradient") {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, c1 || "#000");
      g.addColorStop(1, c2 || c1 || "#000");
      return g;
    }
    return c1;
  }

  function drawModule(ctx, pattern, x, y, s) {
    const p = s * 0.06;
    switch (pattern) {
      case "rounded":
        roundRect(ctx, x + p, y + p, s - p * 2, s - p * 2, s * 0.28);
        ctx.fill();
        break;
      case "dots":
        ctx.beginPath();
        ctx.arc(x + s / 2, y + s / 2, s * 0.42, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "diamond":
        ctx.beginPath();
        ctx.moveTo(x + s / 2, y + s * 0.08);
        ctx.lineTo(x + s * 0.92, y + s / 2);
        ctx.lineTo(x + s / 2, y + s * 0.92);
        ctx.lineTo(x + s * 0.08, y + s / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case "star":
        starPath(ctx, x + s / 2, y + s / 2, 5, s * 0.48, s * 0.22);
        ctx.fill();
        break;
      case "hbar":
        roundRect(ctx, x, y + s * 0.18, s, s * 0.64, s * 0.2);
        ctx.fill();
        break;
      case "vbar":
        roundRect(ctx, x + s * 0.18, y, s * 0.64, s, s * 0.2);
        ctx.fill();
        break;
      case "soft":
        roundRect(ctx, x + p, y + p, s - p * 2, s - p * 2, s * 0.4);
        ctx.fill();
        break;
      case "tile":
        roundRect(ctx, x, y, s * 0.92, s * 0.92, s * 0.12);
        ctx.fill();
        break;
      case "cross":
        roundRect(ctx, x + s * 0.35, y + s * 0.05, s * 0.3, s * 0.9, s * 0.12);
        ctx.fill();
        roundRect(ctx, x + s * 0.05, y + s * 0.35, s * 0.9, s * 0.3, s * 0.12);
        ctx.fill();
        break;
      case "drop":
        ctx.beginPath();
        ctx.moveTo(x + s / 2, y + s * 0.08);
        ctx.quadraticCurveTo(x + s * 0.92, y + s * 0.4, x + s * 0.7, y + s * 0.78);
        ctx.quadraticCurveTo(x + s / 2, y + s * 0.98, x + s * 0.3, y + s * 0.78);
        ctx.quadraticCurveTo(x + s * 0.08, y + s * 0.4, x + s / 2, y + s * 0.08);
        ctx.closePath();
        ctx.fill();
        break;
      case "slash":
        ctx.save();
        ctx.translate(x + s / 2, y + s / 2);
        ctx.rotate(-Math.PI / 4);
        roundRect(ctx, -s * 0.45, -s * 0.2, s * 0.9, s * 0.4, s * 0.12);
        ctx.fill();
        ctx.restore();
        break;
      default:
        ctx.fillRect(x + p, y + p, s - p * 2, s - p * 2);
    }
  }

  function isFinderCell(row, col, count) {
    return (
      (row < 7 && col < 7) ||
      (row < 7 && col >= count - 7) ||
      (row >= count - 7 && col < 7)
    );
  }

  function fillRing(ctx, outerFn, innerFn) {
    ctx.beginPath();
    outerFn();
    innerFn();
    ctx.fill("evenodd");
  }

  function drawEye(ctx, eyeStyle, ox, oy, unit, dark, light) {
    const outer = unit * 7;
    const cx = ox + outer / 2;
    const cy = oy + outer / 2;
    const mid = unit * 5;
    const core = unit * 3;
    ctx.fillStyle = dark;

    const squareOuter = () => ctx.rect(ox, oy, outer, outer);
    const squareInner = () => ctx.rect(ox + unit, oy + unit, outer - 2 * unit, outer - 2 * unit);
    const circleOuter = () => ctx.arc(cx, cy, outer / 2, 0, Math.PI * 2);
    const circleInner = () => ctx.arc(cx, cy, outer / 2 - unit, 0, Math.PI * 2);

    switch (eyeStyle) {
      case "square-dot":
        fillRing(ctx, squareOuter, squareInner);
        ctx.fillRect(ox + unit * 2, oy + unit * 2, core, core);
        break;
      case "circle":
        fillRing(ctx, circleOuter, circleInner);
        roundRect(ctx, ox + unit * 2, oy + unit * 2, core, core, unit * 0.5);
        ctx.fill();
        break;
      case "circle-dot":
        fillRing(ctx, circleOuter, circleInner);
        ctx.beginPath();
        ctx.arc(cx, cy, core / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "rounded":
        fillRing(
          ctx,
          () => roundRect(ctx, ox, oy, outer, outer, unit * 1.5),
          () => roundRect(ctx, ox + unit, oy + unit, outer - 2 * unit, outer - 2 * unit, unit * 1.2)
        );
        roundRect(ctx, ox + unit * 2, oy + unit * 2, core, core, unit * 0.8);
        ctx.fill();
        break;
      case "rounded-dot":
        fillRing(
          ctx,
          () => roundRect(ctx, ox, oy, outer, outer, unit * 1.5),
          () => roundRect(ctx, ox + unit, oy + unit, outer - 2 * unit, outer - 2 * unit, unit * 1.2)
        );
        ctx.beginPath();
        ctx.arc(cx, cy, core / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "diamond":
        fillRing(
          ctx,
          () => {
            ctx.moveTo(cx, oy);
            ctx.lineTo(ox + outer, cy);
            ctx.lineTo(cx, oy + outer);
            ctx.lineTo(ox, cy);
            ctx.closePath();
          },
          () => {
            ctx.moveTo(cx, oy + unit);
            ctx.lineTo(ox + outer - unit, cy);
            ctx.lineTo(cx, oy + outer - unit);
            ctx.lineTo(ox + unit, cy);
            ctx.closePath();
          }
        );
        ctx.beginPath();
        ctx.moveTo(cx, oy + unit * 2.2);
        ctx.lineTo(ox + unit * 4.8, cy);
        ctx.lineTo(cx, oy + unit * 4.8);
        ctx.lineTo(ox + unit * 2.2, cy);
        ctx.closePath();
        ctx.fill();
        break;
      case "leaf":
        fillRing(
          ctx,
          () => {
            ctx.moveTo(ox + unit * 0.5, oy + unit * 2.2);
            ctx.quadraticCurveTo(ox, oy, ox + unit * 2.2, oy + unit * 0.5);
            ctx.lineTo(ox + outer - unit * 2.2, oy + unit * 0.5);
            ctx.quadraticCurveTo(ox + outer, oy, ox + outer - unit * 0.5, oy + unit * 2.2);
            ctx.lineTo(ox + outer - unit * 0.5, oy + outer - unit * 2.2);
            ctx.quadraticCurveTo(ox + outer, oy + outer, ox + outer - unit * 2.2, oy + outer - unit * 0.5);
            ctx.lineTo(ox + unit * 2.2, oy + outer - unit * 0.5);
            ctx.quadraticCurveTo(ox, oy + outer, ox + unit * 0.5, oy + outer - unit * 2.2);
            ctx.closePath();
          },
          () => roundRect(ctx, ox + unit, oy + unit, outer - 2 * unit, outer - 2 * unit, unit)
        );
        ctx.beginPath();
        ctx.arc(cx, cy, core / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "star":
        fillRing(
          ctx,
          () => starPath(ctx, cx, cy, 8, outer / 2, outer * 0.38),
          () => starPath(ctx, cx, cy, 8, outer / 2 - unit, outer * 0.38 - unit * 0.9)
        );
        ctx.beginPath();
        ctx.arc(cx, cy, core / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "dotted":
        ctx.beginPath();
        ctx.arc(ox + unit * 0.75, oy + unit * 0.75, unit * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ox + outer - unit * 0.75, oy + unit * 0.75, unit * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ox + outer - unit * 0.75, oy + outer - unit * 0.75, unit * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ox + unit * 0.75, oy + outer - unit * 0.75, unit * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = dark;
        ctx.lineWidth = unit * 0.5;
        roundRect(ctx, ox + unit * 1.3, oy + unit * 1.3, outer - unit * 2.6, outer - unit * 2.6, unit);
        ctx.stroke();
        ctx.fillStyle = dark;
        ctx.beginPath();
        ctx.arc(cx, cy, core / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      default:
        ctx.fillRect(ox, oy, outer, outer);
        ctx.fillStyle = light;
        ctx.fillRect(ox + unit, oy + unit, outer - 2 * unit, outer - 2 * unit);
        ctx.fillStyle = dark;
        ctx.fillRect(ox + unit * 2, oy + unit * 2, core, core);
    }
  }

  function drawLabel(ctx, text, x, y, font, fill, size) {
    if (!text) return;
    ctx.save();
    ctx.fillStyle = fill;
    ctx.font = "700 " + size + "px " + font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * Draw frame decoration and return QR well (cutout) in canvas coords.
   * @returns {{x,y,w,h}|null}
   */
  function drawFrame(ctx, style, bounds, colors, opts) {
    const { x, y, w, h } = bounds;
    const text = (opts && opts.text) || "";
    const font = (opts && opts.font) || "Arial, sans-serif";
    const textMode = (opts && opts.textMode) || "solid";
    const fill = makeFill(ctx, textMode, colors.c1, colors.c2, x, y, w, h);
    const labelColor = colors.label || "#ffffff";

    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = fill;

    switch (style) {
      case "banner": {
        const bar = Math.max(36, h * 0.14);
        roundRect(ctx, x, y, w, bar + 8, 14);
        ctx.fill();
        roundRect(ctx, x, y + h - bar - 8, w, bar + 8, 14);
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + bar / 2 + 4, font, labelColor, Math.max(12, bar * 0.42));
        drawLabel(ctx, text, x + w / 2, y + h - bar / 2 - 4, font, labelColor, Math.max(12, bar * 0.42));
        ctx.restore();
        return { x: x + 18, y: y + bar + 16, w: w - 36, h: h - (bar + 16) * 2 };
      }
      case "top-banner": {
        const bar = Math.max(38, h * 0.15);
        roundRect(ctx, x, y, w, bar + 10, 16);
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + bar / 2 + 5, font, labelColor, Math.max(12, bar * 0.42));
        ctx.restore();
        return { x: x + 18, y: y + bar + 18, w: w - 36, h: h - bar - 36 };
      }
      case "bottom-banner": {
        const bar = Math.max(40, h * 0.16);
        roundRect(ctx, x + w * 0.06, y + h - bar, w * 0.88, bar, 12);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 14, y + h - bar);
        ctx.lineTo(x + w / 2, y + h - bar - 16);
        ctx.lineTo(x + w / 2 + 14, y + h - bar);
        ctx.closePath();
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + h - bar / 2, font, labelColor, Math.max(12, bar * 0.4));
        ctx.restore();
        return { x: x + 20, y: y + 18, w: w - 40, h: h - bar - 42 };
      }
      case "bubble": {
        roundRect(ctx, x, y, w, h - 10, 28);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w * 0.3, y + h - 12);
        ctx.lineTo(x + w * 0.42, y + h + 4);
        ctx.lineTo(x + w * 0.52, y + h - 12);
        ctx.closePath();
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + h - 28, font, labelColor, 14);
        ctx.restore();
        return { x: x + 22, y: y + 18, w: w - 44, h: h - 70 };
      }
      case "circle-dark": {
        const r = Math.min(w, h) / 2 - 2;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + h / 2 + r * 0.72, font, labelColor, 13);
        ctx.restore();
        const side = r * 1.2;
        return {
          x: x + w / 2 - side / 2,
          y: y + h / 2 - side / 2 - r * 0.08,
          w: side,
          h: side,
        };
      }
      case "card-dark":
      case "shadow-card": {
        const radius = 22;
        if (style === "shadow-card") {
          ctx.fillStyle = "rgba(15,23,42,0.16)";
          roundRect(ctx, x + 8, y + 10, w - 4, h - 4, radius);
          ctx.fill();
          ctx.fillStyle = fill;
        }
        roundRect(ctx, x, y, w, h, radius);
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + h - 24, font, labelColor, 14);
        ctx.restore();
        return { x: x + 22, y: y + 18, w: w - 44, h: h - 64 };
      }
      case "ribbon": {
        roundRect(ctx, x + 10, y + h * 0.08, w - 20, h * 0.78, 18);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + 10, y + h * 0.3);
        ctx.lineTo(x - 4, y + h * 0.42);
        ctx.lineTo(x + 10, y + h * 0.54);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + w - 10, y + h * 0.3);
        ctx.lineTo(x + w + 4, y + h * 0.42);
        ctx.lineTo(x + w - 10, y + h * 0.54);
        ctx.closePath();
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + h * 0.78, font, labelColor, 13);
        ctx.restore();
        return { x: x + 28, y: y + h * 0.08 + 16, w: w - 56, h: h * 0.52 };
      }
      case "ticket": {
        roundRect(ctx, x, y, w, h, 18);
        ctx.fill();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x + 4, y + h * 0.5, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + w - 4, y + h * 0.5, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        drawLabel(ctx, text, x + w / 2, y + h - 24, font, labelColor, 13);
        ctx.restore();
        return { x: x + 22, y: y + 16, w: w - 44, h: h - 62 };
      }
      case "rounded-tag": {
        roundRect(ctx, x, y, w, h, 28);
        ctx.fill();
        drawLabel(ctx, text, x + w / 2, y + h - 24, font, labelColor, 14);
        ctx.restore();
        return { x: x + 24, y: y + 18, w: w - 48, h: h - 64 };
      }
      case "outline": {
        ctx.lineWidth = Math.max(5, w * 0.018);
        roundRect(ctx, x + 8, y + 8, w - 16, h - 16, 20);
        ctx.stroke();
        drawLabel(ctx, text, x + w / 2, y + h - 26, font, colors.c1, 13);
        ctx.restore();
        return { x: x + 28, y: y + 22, w: w - 56, h: h - 70 };
      }
      default:
        ctx.restore();
        return null;
    }
  }

  function getPalette() {
    const checked = document.querySelector('input[name="color-mode"]:checked');
    const colorMode = (checked && checked.value) || state.colorMode;
    state.colorMode = colorMode;
    return {
      colorMode,
      fg: fgEl.value || "#0B1220",
      fg2: fg2El.value || fgEl.value || "#0B1220",
      eyeColor: eyeColorEl.value || fgEl.value || "#0B1220",
      bg: bgEl.value || "#FFFFFF",
      bg2: bg2El.value || bgEl.value || "#FFFFFF",
    };
  }

  function renderTo(canvasEl, text) {
    const qr = qrcode(0, eccEl.value || "H");
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    const pal = getPalette();
    const size = Number(sizeEl.value) || 768;
    const frameStyle = state.frame || "none";
    const needsFrame = frameStyle !== "none";

    canvasEl.width = size;
    canvasEl.height = size;
    const ctx = canvasEl.getContext("2d");

    // page background
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, size, size);
    if (pal.colorMode === "gradient") {
      ctx.fillStyle = makeFill(ctx, "gradient", pal.bg, pal.bg2, 0, 0, size, size);
      ctx.fillRect(0, 0, size, size);
    }

    let well = null;
    if (needsFrame) {
      const pad = size * 0.03;
      const bounds = { x: pad, y: pad, w: size - pad * 2, h: size - pad * 2 };
      const textMode = textModeEl.value || "solid";
      const c1 = frameColorEl.value || "#054080";
      const c2 = frameColor2El.value || c1;
      const colors = {
        c1,
        c2,
        label: frameStyle === "outline" ? c1 : "#ffffff",
      };
      well = drawFrame(ctx, frameStyle, bounds, colors, {
        text: (frameTextEl.value || "").trim(),
        font: frameFontEl.value || "Arial, sans-serif",
        textMode,
      });
    }

    if (!well) {
      const margin = size * 0.06;
      well = { x: margin, y: margin, w: size - margin * 2, h: size - margin * 2 };
    }

    // QR well plate (keeps quiet zone / light modules readable)
    ctx.save();
    roundRect(ctx, well.x, well.y, well.w, well.h, needsFrame ? 12 : 0);
    ctx.fillStyle = pal.bg;
    if (pal.colorMode === "gradient") {
      ctx.fillStyle = makeFill(ctx, "gradient", pal.bg, pal.bg2, well.x, well.y, well.w, well.h);
    } else {
      ctx.fillStyle = pal.bg;
    }
    ctx.fill();
    ctx.restore();

    const quiet = 2;
    const totalModules = count + quiet * 2;
    const cell = Math.min(well.w, well.h) / totalModules;
    const drawX = well.x + (well.w - cell * count) / 2;
    const drawY = well.y + (well.h - cell * count) / 2;

    const darkFill = makeFill(
      ctx,
      pal.colorMode === "gradient" ? "gradient" : "solid",
      pal.fg,
      pal.fg2,
      drawX,
      drawY,
      cell * count,
      cell * count
    );

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (!qr.isDark(r, c)) continue;
        if (isFinderCell(r, c, count)) continue;
        ctx.fillStyle = darkFill;
        drawModule(ctx, state.pattern, drawX + c * cell, drawY + r * cell, cell);
      }
    }

    const eyes = [
      [0, 0],
      [0, count - 7],
      [count - 7, 0],
    ];
    for (const [row, col] of eyes) {
      drawEye(
        ctx,
        state.eye,
        drawX + col * cell,
        drawY + row * cell,
        cell,
        pal.eyeColor,
        pal.bg
      );
    }

    if (state.logo) {
      const logoScale = state.logoSize / 100;
      const qrPixel = cell * count;
      const logoSide = qrPixel * logoScale;
      const lx = drawX + (qrPixel - logoSide) / 2;
      const ly = drawY + (qrPixel - logoSide) / 2;
      const pad = logoSide * 0.1;
      ctx.fillStyle = pal.bg;
      roundRect(ctx, lx - pad, ly - pad, logoSide + pad * 2, logoSide + pad * 2, logoSide * 0.22);
      ctx.fill();
      try {
        ctx.drawImage(state.logo, lx, ly, logoSide, logoSide);
      } catch (_) {}
    }

    return {
      count,
      patternName: (PATTERNS.find((p) => p.id === state.pattern) || {}).name || "",
      frameName: (FRAMES.find((f) => f.id === state.frame) || { name: "无边框" }).name,
    };
  }

  function renderQr(text) {
    try {
      const info = renderTo(canvas, text);
      const empty = qrBox.querySelector(".empty-state");
      if (empty) empty.hidden = true;
      canvas.hidden = false;
      qrBox.classList.remove("is-empty");
      qrBox.classList.remove("is-ready");
      void qrBox.offsetWidth;
      qrBox.classList.add("is-ready");
      state.currentText = text;
      const kind = detectType(text);
      metaEl.textContent =
        (kind === "url" ? "网址 · " : "文本 · ") +
        info.count +
        " 模块 · " +
        info.patternName +
        " · " +
        info.frameName;
      setReady(true, "已生成，可下载或扫码");
    } catch (err) {
      console.error(err);
      showEmpty();
      statusEl.textContent = "内容过长或无法生成，请精简后重试";
    }
  }

  function scheduleRender() {
    const text = contentEl.value;
    updateHint(text);
    copyBtn.disabled = !text.trim().length;
    if (!text.trim()) {
      showEmpty();
      return;
    }
    setReady(false, "生成中…");
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => renderQr(text), 160);
  }

  function downloadPng() {
    if (!state.ready || !state.currentText) return;
    try {
      const exportCanvas = document.createElement("canvas");
      renderTo(exportCanvas, state.currentText);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      link.download = "qrcode-" + stamp + ".png";
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "下载失败，请重试";
    }
  }

  async function copyContent() {
    const text = contentEl.value.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      statusEl.textContent = "内容已复制";
    } catch (_) {
      contentEl.select();
      statusEl.textContent = "请使用系统复制（Ctrl/⌘ + C）";
    }
  }

  function buildSwatch(container, items, currentId, onPick, painter) {
    container.innerHTML = "";
    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch" + (item.id === currentId ? " is-active" : "");
      btn.innerHTML = '<canvas width="120" height="120"></canvas><span class="swatch-label"></span>';
      btn.querySelector(".swatch-label").textContent = item.name;
      const c = btn.querySelector("canvas");
      painter(c.getContext("2d"), item.id, 120, 120);
      btn.addEventListener("click", () => {
        onPick(item);
        $$(".swatch", container).forEach((el) => el.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
      container.appendChild(btn);
    });
  }

  function paintPatternThumb(ctx, id) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = "#0B1220";
    const s = 120 / 5;
    const map = [
      [1, 0, 1, 1, 0],
      [0, 1, 1, 0, 1],
      [1, 1, 0, 1, 0],
      [0, 1, 1, 1, 1],
      [1, 0, 0, 1, 0],
    ];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (map[r][c]) drawModule(ctx, id, c * s + s * 0.15, r * s + s * 0.15, s * 0.7);
      }
    }
  }

  function paintEyeThumb(ctx, id) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 120, 120);
    const unit = 12;
    drawEye(ctx, id, 12, 12, unit, "#0B1220", "#ffffff");
  }

  function paintFrameThumb(ctx, id) {
    ctx.fillStyle = "#f3f5f9";
    ctx.fillRect(0, 0, 120, 120);
    if (id === "none") {
      ctx.fillStyle = "#0B1220";
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if ((i * 3 + j * 5) % 3 === 0) ctx.fillRect(24 + i * 12, 24 + j * 12, 10, 10);
        }
      }
      return;
    }
    const well = drawFrame(
      ctx,
      id,
      { x: 6, y: 6, w: 108, h: 108 },
      { c1: "#0B1220", c2: "#2F6BFF", label: "#ffffff" },
      { text: "SCAN", font: "Arial, sans-serif", textMode: "solid" }
    );
    ctx.fillStyle = "#ffffff";
    const box = well || { x: 24, y: 24, w: 72, h: 72 };
    roundRect(ctx, box.x, box.y, box.w, box.h, 6);
    ctx.fill();
    ctx.fillStyle = "#0B1220";
    const step = Math.min(box.w, box.h) / 8;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(box.x + 8 + i * step * 0.8, box.y + 8 + j * step * 0.8, step * 0.7, step * 0.7);
        }
      }
    }
  }

  function paintTemplateThumb(ctx, tpl) {
    const st = tpl.style;
    ctx.fillStyle = st.bg;
    ctx.fillRect(0, 0, 120, 120);
    let well = { x: 16, y: 16, w: 88, h: 88 };
    if (st.frame && st.frame !== "none") {
      well =
        drawFrame(
          ctx,
          st.frame,
          { x: 6, y: 6, w: 108, h: 108 },
          {
            c1: st.frameColor,
            c2: st.frameColor2,
            label: st.frame === "outline" ? st.frameColor : "#ffffff",
          },
          { text: st.frameText || "SCAN", font: st.frameFont, textMode: st.textMode || "solid" }
        ) || well;
    }
    ctx.fillStyle = st.bg;
    roundRect(ctx, well.x, well.y, well.w, well.h, 6);
    ctx.fill();
    ctx.fillStyle = st.fg;
    const count = 7;
    const cell = Math.min(well.w, well.h) / (count + 2);
    const dx = well.x + (well.w - cell * count) / 2;
    const dy = well.y + (well.h - cell * count) / 2;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (isFinderCell(r, c, count)) continue;
        if ((r * 2 + c * 3) % 2 === 0) {
          ctx.fillStyle = st.fg;
          drawModule(ctx, st.pattern, dx + c * cell, dy + r * cell, cell);
        }
      }
    }
    drawEye(ctx, st.eye, dx, dy, cell, st.eyeColor, st.bg);
  }

  function applyTemplate(tpl) {
    const st = tpl.style;
    state.pattern = st.pattern;
    state.eye = st.eye;
    state.frame = st.frame;
    state.colorMode = st.colorMode;
    fgEl.value = st.fg;
    fg2El.value = st.fg2;
    eyeColorEl.value = st.eyeColor;
    bgEl.value = st.bg;
    bg2El.value = st.bg2;
    frameColorEl.value = st.frameColor;
    frameColor2El.value = st.frameColor2;
    frameTextEl.value = st.frameText || "";
    frameFontEl.value = st.frameFont || "Arial, sans-serif";
    textModeEl.value = st.textMode || "solid";
    const colorModeInput = document.querySelector(
      'input[name="color-mode"][value="' + st.colorMode + '"]'
    );
    if (colorModeInput) colorModeInput.checked = true;
    syncColorVisibility();
    syncFrameVisibility();
    refreshSwatches();
    scheduleRender();
  }

  function refreshSwatches() {
    buildSwatch($("#pattern-grid"), PATTERNS, state.pattern, (item) => {
      state.pattern = item.id;
      scheduleRender();
    }, paintPatternThumb);

    buildSwatch($("#eye-grid"), EYES, state.eye, (item) => {
      state.eye = item.id;
      scheduleRender();
    }, paintEyeThumb);

    buildSwatch($("#frame-grid"), FRAMES, state.frame, (item) => {
      state.frame = item.id;
      syncFrameVisibility();
      scheduleRender();
    }, paintFrameThumb);

    const tgrid = $("#template-grid");
    tgrid.innerHTML = "";
    const noneBtn = document.createElement("button");
    noneBtn.type = "button";
    noneBtn.className = "swatch is-active";
    noneBtn.innerHTML = '<canvas width="120" height="120"></canvas><span class="swatch-label">不套用</span>';
    const nctx = noneBtn.querySelector("canvas").getContext("2d");
    nctx.fillStyle = "#fff";
    nctx.fillRect(0, 0, 120, 120);
    nctx.strokeStyle = "#EF4444";
    nctx.lineWidth = 3;
    nctx.beginPath();
    nctx.moveTo(48, 48);
    nctx.lineTo(72, 72);
    nctx.moveTo(72, 48);
    nctx.lineTo(48, 72);
    nctx.stroke();
    noneBtn.addEventListener("click", () => {
      $$(".swatch", tgrid).forEach((el) => el.classList.remove("is-active"));
      noneBtn.classList.add("is-active");
    });
    tgrid.appendChild(noneBtn);

    TEMPLATES.forEach((tpl) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch";
      btn.innerHTML = '<canvas width="120" height="120"></canvas><span class="swatch-label"></span>';
      btn.querySelector(".swatch-label").textContent = tpl.name;
      paintTemplateThumb(btn.querySelector("canvas").getContext("2d"), tpl);
      btn.addEventListener("click", () => {
        $$(".swatch", tgrid).forEach((el) => el.classList.remove("is-active"));
        btn.classList.add("is-active");
        applyTemplate(tpl);
      });
      tgrid.appendChild(btn);
    });
  }

  function syncColorVisibility() {
    const checked = document.querySelector('input[name="color-mode"]:checked');
    const mode = (checked && checked.value) || "solid";
    state.colorMode = mode;
    fg2Wrap.hidden = mode !== "gradient";
    bg2Wrap.hidden = mode !== "gradient";
  }

  function syncFrameVisibility() {
    frameColor2Wrap.hidden = (textModeEl.value || "solid") !== "gradient";
  }

  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      $$(".tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      $$(".tab-panel").forEach((panel) => {
        const active = panel.dataset.panel === name;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
      tabTip.textContent = TAB_TIPS[name] || "";
    });
  });

  contentEl.addEventListener("input", scheduleRender);
  sizeEl.addEventListener("change", scheduleRender);
  eccEl.addEventListener("change", scheduleRender);
  [fgEl, fg2El, bgEl, bg2El, eyeColorEl, frameColorEl, frameColor2El].forEach((el) => {
    el.addEventListener("input", scheduleRender);
  });
  $$('input[name="color-mode"]').forEach((el) => {
    el.addEventListener("change", () => {
      syncColorVisibility();
      scheduleRender();
    });
  });
  frameTextEl.addEventListener("input", scheduleRender);
  frameFontEl.addEventListener("change", scheduleRender);
  textModeEl.addEventListener("change", () => {
    syncFrameVisibility();
    scheduleRender();
  });
  logoSizeEl.addEventListener("input", () => {
    state.logoSize = Number(logoSizeEl.value) || 20;
    logoSizeVal.textContent = state.logoSize + "%";
    scheduleRender();
  });
  downloadBtn.addEventListener("click", downloadPng);
  copyBtn.addEventListener("click", copyContent);
  clearBtn.addEventListener("click", () => {
    contentEl.value = "";
    scheduleRender();
    contentEl.focus();
  });

  logoInput.addEventListener("change", () => {
    const file = logoInput.files && logoInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      state.logo = img;
      logoThumb.innerHTML = "";
      const view = document.createElement("img");
      view.src = url;
      view.alt = "logo";
      logoThumb.appendChild(view);
      logoRemove.disabled = false;
      if (eccEl.value !== "H") eccEl.value = "H";
      scheduleRender();
    };
    img.onerror = () => {
      statusEl.textContent = "Logo 图片无法读取，请换一张";
    };
    img.src = url;
  });

  logoRemove.addEventListener("click", () => {
    state.logo = null;
    logoInput.value = "";
    logoThumb.innerHTML = "<span>无</span>";
    logoRemove.disabled = true;
    scheduleRender();
  });

  const params = new URLSearchParams(window.location.search);
  const preset = params.get("t") || params.get("url") || params.get("text");
  if (preset) contentEl.value = preset;
  syncColorVisibility();
  syncFrameVisibility();
  refreshSwatches();
  scheduleRender();
})();
