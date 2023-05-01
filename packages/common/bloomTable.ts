import crypto from 'node:crypto';

export default class BloomTable {
  sizeInBits: number;
  timesToHash: number;
  private arr: Array<number>;

  constructor(sizeInBits: number, timesToHash: number) {
    this.sizeInBits = sizeInBits;
    this.timesToHash = timesToHash;
    this.arr = Array(sizeInBits).fill(0);
  }

  push(input: string) {
    for (let i = 0; i < this.timesToHash; i++) {
      this.arr[this.hash(input, i)] = 1;
    }
  }

  exists(input: string): boolean {
    for (let i = 0; i < this.timesToHash; i++) {
      if (this.arr[this.hash(input, i)] !== 1) {
        return false;
      }
    }
    return true;
  }

  private hash(input: string, seed: number) {
    input = input + seed;
    const hash = crypto.createHash('md5');
    const hashed = hash.update(input).digest('hex');
    const hashValue = parseInt(hashed, 16);
    return hashValue % this.sizeInBits;
  }
}
