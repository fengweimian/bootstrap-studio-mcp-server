import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { BsDesignFile } from '../types.js';
import { readFileSync } from 'node:fs';

export async function parseBsDesign(filePath: string): Promise<BsDesignFile> {
  const raw = await readFile(filePath);

  const magic = raw.readUInt16BE(0);
  if (magic === 0x1f8b) {
    const decompressed = gunzipSync(raw);
    return JSON.parse(decompressed.toString('utf-8')) as BsDesignFile;
  }

  return JSON.parse(raw.toString('utf-8')) as BsDesignFile;
}

export async function saveBsDesign(filePath: string, data: BsDesignFile): Promise<void> {
  const json = JSON.stringify({version: data.version, timestamp: Date.now(), design: data.design});
  const compressed = gzipSync(json);
  await writeFile(filePath, compressed);
}

export function parseBsDesignSync(filePath: string): BsDesignFile {
  const raw = readFileSync(filePath);

  const magic = raw.readUInt16BE(0);
  if (magic === 0x1f8b) {
    const decompressed = gunzipSync(raw);
    return JSON.parse(decompressed.toString('utf-8')) as BsDesignFile;
  }

  return JSON.parse(raw.toString('utf-8')) as BsDesignFile;
}
