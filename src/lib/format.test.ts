import { expect, test } from 'vitest';
import { toPieceNotation } from '@/lib/format';

test('Pieces initials should be replaced by their ascii representation', () => {
  expect(toPieceNotation('Nf3', 'w')).toBe('♞f3');
  expect(toPieceNotation('Nf3', 'b')).toBe('♘f3');
  expect(toPieceNotation('Bf3', 'w')).toBe('♝f3');
  expect(toPieceNotation('Bf3', 'b')).toBe('♗f3');
  expect(toPieceNotation('Rf3', 'w')).toBe('♜f3');
  expect(toPieceNotation('Rf3', 'b')).toBe('♖f3');
  expect(toPieceNotation('Qf3', 'w')).toBe('♛f3');
  expect(toPieceNotation('Qf3', 'b')).toBe('♕f3');
  expect(toPieceNotation('Kf3', 'w')).toBe('♚f3');
  expect(toPieceNotation('Kf3', 'b')).toBe('♔f3');
});
