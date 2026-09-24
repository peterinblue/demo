/**
 * 极简 QR Code 生成器（Byte 模式，ECC-M，版本 1–10）
 * 足够编码 vCard 文本。无外部依赖。
 */
(function (global) {
  'use strict';

  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  function gmul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      poly = polyMul(poly, [1, EXP[i]]);
    }
    return poly;
  }

  function polyMul(a, b) {
    const res = new Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        res[i + j] ^= gmul(a[i], b[j]);
      }
    }
    return res;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const msg = data.concat(new Array(ecLen).fill(0));
    for (let i = 0; i < data.length; i++) {
      const coef = msg[i];
      if (coef === 0) continue;
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gmul(gen[j], coef);
      }
    }
    return msg.slice(data.length);
  }

  // ECC level L（容量更大，名片场景足够）
  // [ecPerBlock, groups...]
  const VERSIONS = {
    1:  { ec: 7,  blocks: [[1, 19]] },
    2:  { ec: 10, blocks: [[1, 34]] },
    3:  { ec: 15, blocks: [[1, 55]] },
    4:  { ec: 20, blocks: [[1, 80]] },
    5:  { ec: 26, blocks: [[1, 108]] },
    6:  { ec: 18, blocks: [[2, 68]] },
    7:  { ec: 20, blocks: [[2, 78]] },
    8:  { ec: 24, blocks: [[2, 97]] },
    9:  { ec: 30, blocks: [[2, 116]] },
    10: { ec: 18, blocks: [[2, 68], [2, 69]] },
    11: { ec: 20, blocks: [[4, 81]] },
    12: { ec: 24, blocks: [[2, 92], [2, 93]] },
    13: { ec: 26, blocks: [[4, 107]] },
    14: { ec: 30, blocks: [[3, 115], [1, 116]] },
    15: { ec: 22, blocks: [[5, 87], [1, 88]] },
    16: { ec: 24, blocks: [[5, 98], [1, 99]] },
    17: { ec: 28, blocks: [[1, 107], [5, 108]] },
    18: { ec: 30, blocks: [[5, 120], [1, 121]] },
    19: { ec: 28, blocks: [[3, 113], [4, 114]] },
    20: { ec: 28, blocks: [[3, 107], [5, 108]] },
  };

  function totalDataCw(version) {
    const v = VERSIONS[version];
    return v.blocks.reduce((sum, [n, d]) => sum + n * d, 0);
  }

  function dataCapacityBytes(version) {
    const dataCw = totalDataCw(version);
    const countBits = version >= 10 ? 16 : 8;
    return Math.floor((dataCw * 8 - 4 - countBits) / 8);
  }

  function chooseVersion(byteLen) {
    for (let v = 1; v <= 20; v++) {
      if (dataCapacityBytes(v) >= byteLen) return v;
    }
    return null;
  }

  function alignmentPositions(version) {
    if (version === 1) return [];
    const table = {
      2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
      6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46],
      10: [6, 28, 50], 11: [6, 30, 54], 12: [6, 32, 58], 13: [6, 34, 62],
      14: [6, 26, 46, 66], 15: [6, 26, 48, 70], 16: [6, 26, 50, 74],
      17: [6, 30, 54, 78], 18: [6, 30, 56, 82], 19: [6, 30, 58, 86],
      20: [6, 34, 62, 90],
    };
    return table[version] || [];
  }

  function formatBits(maskId) {
    // ECC L = 01
    const data = (0b01 << 3) | maskId;
    let rem = data << 10;
    for (let i = 14; i >= 10; i--) {
      if ((rem >> i) & 1) rem ^= 0x537 << (i - 10);
    }
    return ((data << 10) | (rem & 0x3ff)) ^ 0x5412;
  }

  function versionBits(version) {
    let rem = version << 12;
    const poly = 0x1f25;
    for (let i = 17; i >= 12; i--) {
      if ((rem >> i) & 1) rem ^= poly << (i - 12);
    }
    return (version << 12) | (rem & 0xfff);
  }

  function maskBit(id, r, c) {
    switch (id) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return (((r * c) % 2) + ((r * c) % 3)) === 0;
      case 6: return ((((r * c) % 2) + ((r * c) % 3)) % 2) === 0;
      case 7: return ((((r + c) % 2) + ((r * c) % 3)) % 2) === 0;
      default: return false;
    }
  }

  function buildMatrix(version, codewords, maskId) {
    const size = version * 4 + 17;
    const matrix = Array.from({ length: size }, () => new Array(size).fill(0));
    const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

    function set(r, c, val) {
      if (r < 0 || r >= size || c < 0 || c >= size) return;
      matrix[r][c] = val;
      reserved[r][c] = true;
    }

    function drawFinder(r0, c0) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const inRing =
            (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
            (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          set(r0 + r, c0 + c, inRing ? 1 : 0);
        }
      }
    }
    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      const bit = i % 2 === 0 ? 1 : 0;
      if (!reserved[6][i]) set(6, i, bit);
      if (!reserved[i][6]) set(i, 6, bit);
    }

    // Dark module
    set(size - 8, 8, 1);

    // Alignment patterns
    const aps = alignmentPositions(version);
    for (const r0 of aps) {
      for (const c0 of aps) {
        if ((r0 <= 8 && c0 <= 8) ||
            (r0 <= 8 && c0 >= size - 9) ||
            (r0 >= size - 9 && c0 <= 8)) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            const on = Math.max(Math.abs(r), Math.abs(c)) !== 1 ? 1 : 0;
            set(r0 + r, c0 + c, on);
          }
        }
      }
    }

    // Reserve format areas
    for (let i = 0; i <= 8; i++) {
      if (i !== 6) {
        reserved[8][i] = true;
        reserved[i][8] = true;
      }
    }
    for (let i = 0; i < 8; i++) {
      reserved[8][size - 1 - i] = true;
      reserved[size - 1 - i][8] = true;
    }
    reserved[size - 8][8] = true; // dark module already reserved

    // Reserve version info (version >= 7)
    if (version >= 7) {
      for (let i = 0; i < 18; i++) {
        const a = Math.floor(i / 3);
        const b = (size - 11) + (i % 3);
        reserved[a][b] = true;
        reserved[b][a] = true;
      }
    }

    // Place data with mask
    const bits = [];
    for (const cw of codewords) {
      for (let b = 7; b >= 0; b--) bits.push((cw >> b) & 1);
    }

    let bitIdx = 0;
    let upward = true;
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col = 5;
      for (let i = 0; i < size; i++) {
        const row = upward ? size - 1 - i : i;
        for (let k = 0; k < 2; k++) {
          const c = col - k;
          if (c < 0 || reserved[row][c]) continue;
          let bit = bitIdx < bits.length ? bits[bitIdx++] : 0;
          if (maskBit(maskId, row, c)) bit ^= 1;
          matrix[row][c] = bit;
        }
      }
      upward = !upward;
    }

    // Format info (LSB = bit 0), matching ISO/IEC 18004 placement
    const fmt = formatBits(maskId);
    for (let i = 0; i < 15; i++) {
      const bit = (fmt >> i) & 1;
      // vertical strip (column 8)
      if (i < 6) set(i, 8, bit);
      else if (i < 8) set(i + 1, 8, bit);
      else set(size - 15 + i, 8, bit);
    }
    for (let i = 0; i < 15; i++) {
      const bit = (fmt >> i) & 1;
      // horizontal strip (row 8)
      if (i < 8) set(8, size - 1 - i, bit);
      else if (i === 8) set(8, 7, bit);
      else set(8, 15 - i - 1, bit);
    }
    set(size - 8, 8, 1); // fixed dark module

    // Version info (version >= 7)
    if (version >= 7) {
      const vinfo = versionBits(version);
      for (let i = 0; i < 18; i++) {
        const bit = (vinfo >> i) & 1;
        const a = Math.floor(i / 3);
        const b = size - 11 + (i % 3);
        set(a, b, bit);
        set(b, a, bit);
      }
    }

    return matrix;
  }

  function interleave(blocksData, blocksEc) {
    const result = [];
    const maxData = Math.max(...blocksData.map((b) => b.length));
    for (let i = 0; i < maxData; i++) {
      for (const block of blocksData) {
        if (i < block.length) result.push(block[i]);
      }
    }
    const maxEc = Math.max(...blocksEc.map((b) => b.length));
    for (let i = 0; i < maxEc; i++) {
      for (const block of blocksEc) {
        if (i < block.length) result.push(block[i]);
      }
    }
    return result;
  }

  function penalty(m) {
    const size = m.length;
    let score = 0;
    for (let i = 0; i < size; i++) {
      let runR = 1;
      let runC = 1;
      for (let j = 1; j < size; j++) {
        if (m[i][j] === m[i][j - 1]) runR++;
        else {
          if (runR >= 5) score += 3 + (runR - 5);
          runR = 1;
        }
        if (m[j][i] === m[j - 1][i]) runC++;
        else {
          if (runC >= 5) score += 3 + (runC - 5);
          runC = 1;
        }
      }
      if (runR >= 5) score += 3 + (runR - 5);
      if (runC >= 5) score += 3 + (runC - 5);
    }
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size - 1; c++) {
        const s = m[r][c] + m[r][c + 1] + m[r + 1][c] + m[r + 1][c + 1];
        if (s === 0 || s === 4) score += 3;
      }
    }
    return score;
  }

  function encodeBytes(bytes) {
    const version = chooseVersion(bytes.length);
    if (!version) throw new Error('内容过长，超出二维码容量');

    const v = VERSIONS[version];
    const countBits = version >= 10 ? 16 : 8;
    const bits = [];

    function push(val, len) {
      for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
    }

    push(0b0100, 4);
    push(bytes.length, countBits);
    for (const b of bytes) push(b, 8);

    const dataCw = totalDataCw(version);
    const capacityBits = dataCw * 8;
    push(0, Math.min(4, capacityBits - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);

    const dataCodewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let cw = 0;
      for (let j = 0; j < 8; j++) cw = (cw << 1) | bits[i + j];
      dataCodewords.push(cw);
    }
    const padBytes = [0xec, 0x11];
    let p = 0;
    while (dataCodewords.length < dataCw) dataCodewords.push(padBytes[p++ % 2]);

    const blocksData = [];
    let offset = 0;
    for (const [count, dlen] of v.blocks) {
      for (let i = 0; i < count; i++) {
        blocksData.push(dataCodewords.slice(offset, offset + dlen));
        offset += dlen;
      }
    }

    const blocksEc = blocksData.map((block) => rsEncode(block, v.ec));
    const codewords = interleave(blocksData, blocksEc);

    let best = null;
    let bestScore = Infinity;
    for (let mask = 0; mask < 8; mask++) {
      const m = buildMatrix(version, codewords, mask);
      const score = penalty(m);
      if (score < bestScore) {
        bestScore = score;
        best = m;
      }
    }
    return best;
  }

  function toCanvas(canvas, matrix, options) {
    const opts = Object.assign(
      { scale: 4, margin: 2, dark: '#1a1814', light: '#ffffff' },
      options || {}
    );
    const size = matrix.length;
    const n = (size + opts.margin * 2) * opts.scale;
    canvas.width = n;
    canvas.height = n;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = opts.light;
    ctx.fillRect(0, 0, n, n);
    ctx.fillStyle = opts.dark;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(
            (c + opts.margin) * opts.scale,
            (r + opts.margin) * opts.scale,
            opts.scale,
            opts.scale
          );
        }
      }
    }
    return canvas;
  }

  function encodeText(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    return encodeBytes(bytes);
  }

  global.QRMini = { encodeText, encodeBytes, toCanvas };
})(typeof window !== 'undefined' ? window : globalThis);
