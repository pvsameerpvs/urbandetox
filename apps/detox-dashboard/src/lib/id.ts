let _counter = 0;

export function generateId(prefix: string): string {
  _counter += 1;
  return `${prefix}-${_counter}`;
}
