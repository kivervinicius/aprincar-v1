import { PROTOCOL_VERSION, type GameMessage, type HostResponse } from './protocol.ts';

type Pending = { resolve: (value: any) => void; reject: (reason?: any) => void };
export class AprincarGameClient {
  private port: MessagePort | null = null;
  private pending = new Map<string, Pending>();
  private connectedPromise: Promise<void>;
  private connectedResolve!: () => void;

  constructor() {
    this.connectedPromise = new Promise((resolve) => {
      this.connectedResolve = resolve;
    });
    window.addEventListener('message', (event) => {
      if (
        event.data?.type !== 'APRINCAR_CONNECT' ||
        event.data?.protocolVersion !== PROTOCOL_VERSION ||
        !event.ports?.[0]
      )
        return;
      this.port = event.ports[0];
      this.port.onmessage = (message) => this.onResponse(message.data);
      this.port.start();
      this.connectedResolve();
      this.notify('game.ready', { protocolVersion: PROTOCOL_VERSION });
    });
  }

  async ready(): Promise<void> {
    return this.connectedPromise;
  }
  async request(type: GameMessage['type'], payload: unknown = {}): Promise<any> {
    await this.ready();
    const requestId = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject });
      this.port!.postMessage({ type, requestId, payload } satisfies GameMessage);
    });
  }
  async notify(type: GameMessage['type'], payload: unknown = {}): Promise<void> {
    await this.ready().catch(() => undefined);
    this.port?.postMessage({ type, payload } satisfies GameMessage);
  }
  readonly session = {
    start: (payload: unknown = {}) => this.request('session.start', payload),
    complete: (payload: unknown = {}) => this.request('session.complete', payload),
    abandon: (payload: unknown = {}) => this.request('session.abandon', payload),
  };
  readonly evidence = { submit: (payload: unknown) => this.request('evidence.submit', payload) };
  readonly rewards = { request: (payload: unknown) => this.request('reward.request', payload) };
  readonly storage = {
    get: (key: string, scope: 'device' | 'profile' = 'profile') =>
      this.request('storage.get', { key, scope }),
    set: (key: string, value: unknown, scope: 'device' | 'profile' = 'profile') =>
      this.request('storage.set', { key, value, scope }),
    remove: (key: string, scope: 'device' | 'profile' = 'profile') =>
      this.request('storage.remove', { key, scope }),
  };
  readonly capability = {
    request: (name: string, payload: unknown = {}) => this.request('capability.request', { name, payload }),
  };

  private onResponse(value: HostResponse): void {
    if (value?.type !== 'host.response' || !value.requestId) return;
    const pending = this.pending.get(value.requestId);
    if (!pending) return;
    this.pending.delete(value.requestId);
    value.ok
      ? pending.resolve(value.payload)
      : pending.reject(new Error(value.error ?? 'Host request failed'));
  }
}
