import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { BsDesignFile } from '../types.js';

export async function parseBsDesign(filePath: string): Promise<BsDesignFile> {
  const raw = await readFile(filePath);

  const magic = raw.readUInt16BE(0);
  if (magic === 0x1f8b) {
    const decompressed = gunzipSync(raw);
    return JSON.parse(decompressed.toString('utf-8')) as BsDesignFile;
  }

  return JSON.parse(raw.toString('utf-8')) as BsDesignFile;
}

export function parseBsDesignSync(filePath: string): BsDesignFile {
  const fs = require('node:fs');
  const raw = fs.readFileSync(filePath);

  const magic = raw.readUInt16BE(0);
  if (magic === 0x1f8b) {
    const decompressed = gunzipSync(raw);
    return JSON.parse(decompressed.toString('utf-8')) as BsDesignFile;
  }

  return JSON.parse(raw.toString('utf-8')) as BsDesignFile;
}
