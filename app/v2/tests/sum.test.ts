// sum.test.ts
//import { sum } from './sum';

export function sum(a: number, b: number): number {
  return a + b;
}

describe('sum function', () => {
  it('should add two positive numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers correctly', () => {
    expect(sum(-1, 5)).toBe(4);
  });

  it('should return 0 when adding 0 to a number', () => {
    expect(sum(0, 7)).toBe(7);
  });
});