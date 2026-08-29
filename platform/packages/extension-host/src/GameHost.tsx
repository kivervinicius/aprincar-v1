import { useEffect, useRef } from 'react';
import { PROTOCOL_VERSION, isGameMessage, type HostResponse } from '../../extension-sdk/src/protocol.ts';
import type { ExtensionManifest } from '../../extension-contracts/src/types.ts';
import { buildSandboxDocument } from './sandbox.ts';
export interface GameHostServices {
  handle(
    message: { type: string; requestId?: string; payload?: unknown },
    manifest: ExtensionManifest,
  ): Promise<unknown>;
}
export function GameHost({
  html,
  manifest,
  services,
  title,
}: {
  html: string;
  manifest: ExtensionManifest;
  services: GameHostServices;
  title?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    const onLoad = () => {
      const channel = new MessageChannel();
      channel.port1.onmessage = async (event) => {
        const message = event.data;
        if (!isGameMessage(message)) return;
        if (!message.requestId) {
          await services.handle(message, manifest);
          return;
        }
        try {
          const payload = await services.handle(message, manifest);
          channel.port1.postMessage({
            type: 'host.response',
            requestId: message.requestId,
            ok: true,
            payload,
          } satisfies HostResponse);
        } catch (error) {
          channel.port1.postMessage({
            type: 'host.response',
            requestId: message.requestId,
            ok: false,
            error: error instanceof Error ? error.message : 'Host error',
          } satisfies HostResponse);
        }
      };
      channel.port1.start();
      frame.contentWindow?.postMessage({ type: 'APRINCAR_CONNECT', protocolVersion: PROTOCOL_VERSION }, '*', [
        channel.port2,
      ]);
    };
    frame.addEventListener('load', onLoad);
    return () => frame.removeEventListener('load', onLoad);
  }, [html, manifest, services]);
  return (
    <iframe
      ref={ref}
      title={title ?? manifest.name['pt-BR'] ?? manifest.id}
      srcDoc={buildSandboxDocument(html, manifest)}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      style={{ width: '100%', height: '100%', border: 0, background: '#fff' }}
    />
  );
}
