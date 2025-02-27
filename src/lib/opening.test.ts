import { expect, test } from 'vitest';
import { findOpening } from '@/lib/opening.ts';

test('Should be able to find the opening for any given pgn', async () => {
  expect((await findOpening('1. e4 e5 2. Nf3'))?.name).toBe("King's Knight Opening");
  expect((await findOpening('1. e4 e5 2. Nc3'))?.name).toBe('Vienna Game');
  expect((await findOpening('1. e4 e5 2. d3'))?.name).toBe("King's Pawn Game: Leonardis Variation");
  expect((await findOpening('1. e4 e5 2. d4'))?.name).toBe('Center Game');
  expect((await findOpening('1. e4 e5 2. f4'))?.name).toBe("King's Gambit");
  expect((await findOpening('1. e4 e5 2. g3'))?.name).toBe("King's Pawn Game");
  expect((await findOpening('1. e4 e5 2. h3'))?.name).toBe("King's Pawn Game");
  expect((await findOpening('1. e4 e5 2. a3'))?.name).toBe("King's Pawn Game: Mengarini's Opening");
});
