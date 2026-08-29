import test from 'node:test';
import assert from 'node:assert/strict';
import { AprincarGameClient } from '../extension-sdk/src/client.ts';
import { PROTOCOL_VERSION } from '../extension-sdk/src/protocol.ts';

test('capability request forwards the capability payload to the host', async () => {
  const fakeWindow = new EventTarget();
  Object.assign(globalThis, { window: fakeWindow });

  const client = new AprincarGameClient();
  const channel = new MessageChannel();
  const received: any[] = [];
  channel.port2.onmessage = (event) => {
    received.push(event.data);
    if (event.data?.requestId) {
      channel.port2.postMessage({
        type: 'host.response',
        requestId: event.data.requestId,
        ok: true,
        payload: { recognized: true },
      });
    }
  };
  channel.port2.start();

  fakeWindow.dispatchEvent(
    new MessageEvent('message', {
      data: { type: 'APRINCAR_CONNECT', protocolVersion: PROTOCOL_VERSION },
      ports: [channel.port1],
    }),
  );

  const strokes = [
    [
      { x: 0.1, y: 0.9 },
      { x: 0.5, y: 0.1 },
    ],
  ];
  const result = await client.capability.request('handwriting.evaluate', { symbol: 'A', strokes });
  assert.deepEqual(result, { recognized: true });

  const capabilityMessage = received.find((message) => message.type === 'capability.request');
  assert.deepEqual(capabilityMessage.payload, {
    name: 'handwriting.evaluate',
    payload: { symbol: 'A', strokes },
  });

  channel.port1.close();
  channel.port2.close();
});
