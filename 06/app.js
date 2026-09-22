(function () {
  const contentEl = document.getElementById("content");
  const sizeEl = document.getElementById("size");
  const eccEl = document.getElementById("ecc");
  const fgEl = document.getElementById("fg");
  const bgEl = document.getElementById("bg");
  const typeHintEl = document.getElementById("type-hint");
  const statusEl = document.getElementById("status");
  const metaEl = document.getElementById("meta");
  const qrBox = document.getElementById("qr-box");
  const canvas = document.getElementById("qr-canvas");
  const downloadBtn = document.getElementById("download-btn");
  const copyBtn = document.getElementById("copy-btn");
  const clearBtn = document.getElementById("clear-btn");

  let ready = false;
  let currentText = "";
  let debounceTimer = null;

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
    ready = on;
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
    currentText = "";
    setReady(false, "输入内容后自动生成");
  }

  function buildQr(text) {
    if (typeof qrcode !== "function") {
      throw new Error("qrcode library missing");
    }
    // typeNumber 0 = auto-fit; ECC: L/M/Q/H
    const qr = qrcode(0, eccEl.value || "M");
    qr.addData(text);
    qr.make();
    return qr;
  }

  function paint(canvasEl, qr, size, dark, light) {
    const count = qr.getModuleCount();
    const margin = 2;
    const total = count + margin * 2;
    const scale = Math.max(1, Math.floor(size / total));
    const dim = scale * total;

    canvasEl.width = dim;
    canvasEl.height = dim;
    const ctx = canvasEl.getContext("2d");
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = dark;

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect(
            (c + margin) * scale,
            (r + margin) * scale,
            scale,
            scale
          );
        }
      }
    }
  }

  function renderQr(text) {
    try {
      const size = Number(sizeEl.value) || 512;
      const dark = fgEl.value || "#0B1220";
      const light = bgEl.value || "#FFFFFF";
      const qr = buildQr(text);
      paint(canvas, qr, size, dark, light);

      const empty = qrBox.querySelector(".empty-state");
      if (empty) empty.hidden = true;
      canvas.hidden = false;
      qrBox.classList.remove("is-empty");
      qrBox.classList.remove("is-ready");
      void qrBox.offsetWidth;
      qrBox.classList.add("is-ready");

      currentText = text;
      const kind = detectType(text);
      metaEl.textContent =
        (kind === "url" ? "网址 · " : "文本 · ") +
        size +
        "px · 容错 " +
        (eccEl.value || "M");
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
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      renderQr(text);
    }, 180);
  }

  function downloadPng() {
    if (!ready || !currentText) return;
    try {
      const size = Number(sizeEl.value) || 512;
      const exportCanvas = document.createElement("canvas");
      const qr = buildQr(currentText);
      paint(
        exportCanvas,
        qr,
        size,
        fgEl.value || "#0B1220",
        bgEl.value || "#FFFFFF"
      );
      const link = document.createElement("a");
      const stamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-");
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

  contentEl.addEventListener("input", scheduleRender);
  sizeEl.addEventListener("change", scheduleRender);
  eccEl.addEventListener("change", scheduleRender);
  fgEl.addEventListener("input", scheduleRender);
  bgEl.addEventListener("input", scheduleRender);
  downloadBtn.addEventListener("click", downloadPng);
  copyBtn.addEventListener("click", copyContent);
  clearBtn.addEventListener("click", function () {
    contentEl.value = "";
    scheduleRender();
    contentEl.focus();
  });

  const params = new URLSearchParams(window.location.search);
  const preset = params.get("t") || params.get("url") || params.get("text");
  if (preset) {
    contentEl.value = preset;
  }

  scheduleRender();
})();
