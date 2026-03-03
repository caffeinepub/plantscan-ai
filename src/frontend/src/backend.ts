// Stub backend module — platform-generated file for canister deployment
// This file exists to satisfy imports when backend canister bindings are unavailable

import type { Identity } from "@dfinity/agent";

export interface backendInterface {
  [key: string]: (...args: unknown[]) => Promise<unknown>;
}

export interface CreateActorOptions {
  agentOptions?: {
    identity?: Identity | Promise<Identity>;
    host?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class ExternalBlob {
  private _bytes: Uint8Array = new Uint8Array(0);
  private _url: string = "";

  async getBytes(): Promise<Uint8Array> {
    return this._bytes;
  }

  onProgress?: (progress: number) => void;

  static fromURL(url: string): ExternalBlob {
    const blob = new ExternalBlob();
    blob._url = url;
    return blob;
  }

  getURL(): string {
    return this._url;
  }
}

export async function createActor(
  _canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  _options?: CreateActorOptions
): Promise<backendInterface> {
  console.warn("Backend canister not available — using stub actor");
  return new Proxy({} as backendInterface, {
    get: (_target, prop) => {
      return () =>
        Promise.reject(
          new Error(`Backend not available: ${String(prop)}`)
        );
    },
  });
}
