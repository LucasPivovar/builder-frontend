const encoder = new TextEncoder();

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let value = n;
    for (let k = 0; k < 8; k++) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    table[n] = value >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function header(size) {
  const bytes = new Uint8Array(size);
  const view = new DataView(bytes.buffer);
  return {
    bytes,
    u16(offset, value) { view.setUint16(offset, value, true); },
    u32(offset, value) { view.setUint32(offset, value >>> 0, true); }
  };
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

export function safeFileName(value, fallback = 'arquivo') {
  const clean = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return clean || fallback;
}

export function createZipBlob(files) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
    const checksum = crc32(dataBytes);
    const stamp = dosDateTime(file.date ? new Date(file.date) : new Date());

    const local = header(30);
    local.u32(0, 0x04034b50);
    local.u16(4, 20);
    local.u16(6, 0x0800);
    local.u16(8, 0);
    local.u16(10, stamp.time);
    local.u16(12, stamp.date);
    local.u32(14, checksum);
    local.u32(18, dataBytes.length);
    local.u32(22, dataBytes.length);
    local.u16(26, nameBytes.length);
    local.u16(28, 0);
    localParts.push(local.bytes, nameBytes, dataBytes);

    const central = header(46);
    central.u32(0, 0x02014b50);
    central.u16(4, 20);
    central.u16(6, 20);
    central.u16(8, 0x0800);
    central.u16(10, 0);
    central.u16(12, stamp.time);
    central.u16(14, stamp.date);
    central.u32(16, checksum);
    central.u32(20, dataBytes.length);
    central.u32(24, dataBytes.length);
    central.u16(28, nameBytes.length);
    central.u16(30, 0);
    central.u16(32, 0);
    central.u16(34, 0);
    central.u16(36, 0);
    central.u32(38, 0);
    central.u32(42, localOffset);
    centralParts.push(central.bytes, nameBytes);

    localOffset += local.bytes.length + nameBytes.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = header(22);
  end.u32(0, 0x06054b50);
  end.u16(4, 0);
  end.u16(6, 0);
  end.u16(8, files.length);
  end.u16(10, files.length);
  end.u32(12, centralSize);
  end.u32(16, localOffset);
  end.u16(20, 0);

  return new Blob([...localParts, ...centralParts, end.bytes], { type: 'application/zip' });
}
