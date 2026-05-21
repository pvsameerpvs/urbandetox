"use client";

export interface StorageAdapter<T> {
  load(key: string, fallback: T): T;
  save(key: string, data: T): void;
  clear(key: string): void;
}

export const localStorageAdapter: StorageAdapter<unknown> = {
  load(key, fallback) {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  save(key, data) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  },
  clear(key) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

export class Repository<T extends { id: string }> {
  constructor(
    private key: string,
    private fallback: T[],
    private adapter: StorageAdapter<T[]> = localStorageAdapter as StorageAdapter<T[]>
  ) {}

  getAll(): T[] {
    return this.adapter.load(this.key, this.fallback);
  }

  getById(id: string): T | undefined {
    return this.getAll().find((item) => item.id === id);
  }

  create(item: T): void {
    const all = this.getAll();
    all.push(item);
    this.adapter.save(this.key, all);
  }

  update(id: string, patch: Partial<T>): void {
    const all = this.getAll();
    const idx = all.findIndex((item) => item.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], ...patch };
    this.adapter.save(this.key, all);
  }

  delete(id: string): void {
    const all = this.getAll().filter((item) => item.id !== id);
    this.adapter.save(this.key, all);
  }

  count(predicate?: (item: T) => boolean): number {
    const all = this.getAll();
    return predicate ? all.filter(predicate).length : all.length;
  }

  reset(): void {
    this.adapter.save(this.key, this.fallback);
  }
}
