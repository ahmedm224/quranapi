#!/usr/bin/env node
// One-shot multipart uploader. Reads a local file, chunks it, and pushes
// the parts through the temporary /m/admin/upload-* worker endpoints.
//
// Usage: node scripts/upload-multipart.js <localFile> <r2Key>
// Env:   ADMIN_UPLOAD_SECRET (required)

const fs = require('fs');

const BASE = process.env.UPLOAD_BASE || 'https://alfurqan.online/m/admin';
const SECRET = process.env.ADMIN_UPLOAD_SECRET;
const CHUNK_SIZE = 50 * 1024 * 1024; // 50 MB — safely under worker body limits

async function main() {
  const [, , filePath, key] = process.argv;
  if (!filePath || !key) throw new Error('Usage: upload-multipart.js <file> <key>');
  if (!SECRET) throw new Error('ADMIN_UPLOAD_SECRET env var required');

  const size = fs.statSync(filePath).size;
  const fd = fs.openSync(filePath, 'r');
  console.log(`File: ${filePath}`);
  console.log(`Key:  ${key}`);
  console.log(`Size: ${size} bytes (${(size / 1024 / 1024).toFixed(1)} MiB)`);

  const initRes = await fetch(`${BASE}/upload-init?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'X-Admin-Secret': SECRET },
  });
  if (!initRes.ok) throw new Error(`init failed: ${initRes.status} ${await initRes.text()}`);
  const { uploadId } = await initRes.json();
  console.log(`uploadId: ${uploadId}\n`);

  const parts = [];
  let offset = 0;
  let partNumber = 1;
  const totalParts = Math.ceil(size / CHUNK_SIZE);

  try {
    while (offset < size) {
      const chunkSize = Math.min(CHUNK_SIZE, size - offset);
      const buf = Buffer.alloc(chunkSize);
      fs.readSync(fd, buf, 0, chunkSize, offset);

      const url = `${BASE}/upload-part?key=${encodeURIComponent(key)}&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`;
      process.stdout.write(`Part ${partNumber}/${totalParts} (${(chunkSize / 1024 / 1024).toFixed(1)} MiB)... `);
      const t0 = Date.now();
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'X-Admin-Secret': SECRET, 'Content-Type': 'application/octet-stream' },
        body: buf,
      });
      if (!res.ok) throw new Error(`part ${partNumber} failed: ${res.status} ${await res.text()}`);
      const { etag } = await res.json();
      console.log(`ok (${((Date.now() - t0) / 1000).toFixed(1)}s, etag=${etag})`);
      parts.push({ partNumber, etag });
      offset += chunkSize;
      partNumber++;
    }
  } catch (e) {
    console.error('\nUpload failed; aborting…');
    await fetch(`${BASE}/upload-abort?key=${encodeURIComponent(key)}&uploadId=${encodeURIComponent(uploadId)}`, {
      method: 'POST',
      headers: { 'X-Admin-Secret': SECRET },
    });
    throw e;
  } finally {
    fs.closeSync(fd);
  }

  console.log('\nFinalizing…');
  const completeRes = await fetch(
    `${BASE}/upload-complete?key=${encodeURIComponent(key)}&uploadId=${encodeURIComponent(uploadId)}`,
    {
      method: 'POST',
      headers: { 'X-Admin-Secret': SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify(parts),
    }
  );
  if (!completeRes.ok) throw new Error(`complete failed: ${completeRes.status} ${await completeRes.text()}`);
  const result = await completeRes.json();
  console.log('Done:', result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
