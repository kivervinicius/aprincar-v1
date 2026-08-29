import type { RegistryEntry, ResolvedExtension } from '../../extension-contracts/src/types.ts';
import { validateExtensionManifest } from '../../extension-contracts/src/validate.ts';

export interface ExtensionCache {
  get(key: string): Promise<ResolvedExtension | null>;
  put(key: string, value: ResolvedExtension): Promise<void>;
  remove(key: string): Promise<void>;
}
export interface FetchLikeResponse {
  ok: boolean;
  text(): Promise<string>;
  json(): Promise<any>;
}
export interface ExtensionNetwork {
  fetch(url: string): Promise<FetchLikeResponse>;
}

export class ExtensionManager {
  private readonly cache: ExtensionCache;
  private readonly network: ExtensionNetwork;
  constructor(cache: ExtensionCache, network: ExtensionNetwork) {
    this.cache = cache;
    this.network = network;
  }
  key(entry: Pick<RegistryEntry, 'id' | 'version'>): string {
    return `${entry.id}@${entry.version}`;
  }
  async resolve(entry: RegistryEntry): Promise<ResolvedExtension> {
    const key = this.key(entry);
    const cached = await this.cache.get(key);
    if (cached) return { ...cached, source: 'cache' };
    const [manifestResponse, htmlResponse] = await Promise.all([
      this.network.fetch(entry.manifestUrl),
      this.network.fetch(entry.entryUrl),
    ]);
    if (!manifestResponse.ok || !htmlResponse.ok) throw new Error(`Unable to fetch extension ${key}`);
    const manifestRaw = await manifestResponse.json();
    const validation = validateExtensionManifest(manifestRaw);
    if (!validation.ok || !validation.manifest)
      throw new Error(`Invalid extension manifest: ${validation.errors.join('; ')}`);
    if (validation.manifest.id !== entry.id || validation.manifest.version !== entry.version)
      throw new Error('Registry entry does not match extension manifest identity');
    const html = await htmlResponse.text();
    if (/<script[^>]+src=["']https?:\/\//i.test(html) || /import\s*\([^)]*https?:\/\//i.test(html))
      throw new Error('Remote executable code is forbidden');
    if (entry.integrity) {
      const actual = await sha256(html);
      if (actual !== entry.integrity) throw new Error('Extension integrity mismatch');
    }
    const resolved: ResolvedExtension = {
      manifest: validation.manifest,
      html,
      source: 'remote',
      resolvedAt: new Date().toISOString(),
    };
    await this.cache.put(key, resolved);
    return resolved;
  }
  async unpin(entry: Pick<RegistryEntry, 'id' | 'version'>): Promise<void> {
    await this.cache.remove(this.key(entry));
  }
}

export async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
