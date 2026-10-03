const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePng(width, height, isMaskable = false) {
  // Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw Scanlines
  // Each row has 1 filter byte (0) + width * 4 bytes (RGBA)
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) / 2;
  const innerR = maxR * 0.72;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Colors:
      // Background: Deep dark slate / emerald (#020617 / #064e3b)
      let r = 2;
      let g = 6;
      let b = 23;
      let a = 255;

      // Subtle gradient towards center
      const normY = y / height;
      r = Math.round(2 + normY * 4);
      g = Math.round(6 + normY * 20);
      b = Math.round(23 - normY * 8);

      // Outer border circle / squircle
      if (!isMaskable && dist > maxR - 2) {
        // Transparent outside bounds if not maskable
        a = 0;
      }

      // Outer accent ring
      if (Math.abs(dist - innerR) < (width * 0.015)) {
        r = 16;
        g = 185;
        b = 129;
      }

      // Inner hexagon / geometric 'A' emblem
      // Central icon boundary
      const coreR = maxR * 0.45;
      if (dist < coreR) {
        // Triangle/A shape
        const py = (y - (cy - coreR * 0.7)) / (coreR * 1.4);
        const halfWidthAtY = py * (coreR * 0.85);

        if (py >= 0 && py <= 1 && Math.abs(dx) <= halfWidthAtY) {
          // Inside triangle
          // Check crossbar or hollow top
          const isHollowTop = (py > 0.35 && py < 0.65 && Math.abs(dx) < (halfWidthAtY * 0.5));
          const isCrossbar = (py >= 0.55 && py <= 0.75);

          if (!isHollowTop || isCrossbar) {
            // Emerald gradient
            r = Math.round(16 + (1 - py) * 36);
            g = Math.round(185 + (1 - py) * 26);
            b = Math.round(129 + (1 - py) * 24);
          }
        }
      }

      // Accent satellite node
      const satDx = x - (cx + maxR * 0.42);
      const satDy = y - (cy - maxR * 0.38);
      if (Math.sqrt(satDx * satDx + satDy * satDy) < (width * 0.04)) {
        r = 56;
        g = 189;
        b = 248;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // IDAT
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
console.log('Created pwa-192x192.png');

// Generate PWA 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
console.log('Created pwa-512x512.png');

// Generate PWA maskable 512x512 (with safe zone background)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
console.log('Created pwa-maskable-512x512.png');

// Generate Apple Touch Icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, true));
console.log('Created apple-touch-icon.png');
