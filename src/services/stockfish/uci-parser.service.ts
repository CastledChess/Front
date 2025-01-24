import { InfoResult } from '@/types/analysis.ts';

/**
 * Service for parsing UCI (Universal Chess Interface) engine output.
 */
export class UciParserService {
  constructor() {}

  /**
   * Parses the given UCI data string.
   * @param {string} data - The UCI data string to parse.
   * @param {boolean} isWhite - Indicates if the player is white.
   * @returns {InfoResult | { type: string, move: string } | null} The parsed result.
   */
  public parse(data: string, isWhite: boolean) {
    const tokens: string[] = data.split(' ').reverse();
    const type = tokens.pop();

    if (type === 'info') return this.parseInfo(tokens, isWhite);
    if (type === 'bestmove') return this.parseBestMove(tokens);
  }

  /**
   * Computes the win chance based on centipawn evaluation.
   * @param {number} cp - The centipawn evaluation.
   * @param {boolean} isWhite - Indicates if the player is white.
   * @returns {number} The computed win chance.
   */
  private computeWinChance(cp: number, isWhite: boolean) {
    return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * (isWhite ? cp : cp * -1))) - 1);
  }

  /**
   * Parses the 'info' type UCI data.
   * @param {string[]} tokens - The tokens of the UCI data string.
   * @param {boolean} isWhite - Indicates if the player is white.
   * @returns {InfoResult | null} The parsed info result.
   */
  private parseInfo(tokens: string[], isWhite: boolean) {
    const info: InfoResult = { type: 'info', pv: [] };

    while (tokens.length) {
      const token = tokens.pop();

      if (!token) continue;

      if (token === 'depth') info.depth = Number(tokens.pop());
      if (token === 'seldepth') info.selDepth = Number(tokens.pop());
      if (token === 'pv') {
        const nextToken = tokens.pop();

        if (!nextToken) break;

        info.move = nextToken;
        info.from = nextToken.slice(0, 2);
        info.to = nextToken.slice(2, 4);

        info.pv.push(nextToken);

        while (tokens.length) {
          const nextToken = tokens.pop();

          if (!nextToken) break;

          info.pv.push(nextToken);
        }
      }
      if (token === 'score') {
        const nextToken = tokens.pop();

        if (nextToken === 'mate') {
          info.mate = Number(tokens.pop());
          info.winChance = isWhite && info.mate > 0 ? 100 : !isWhite && info.mate < 0 ? 100 : 0;
          info.eval = isWhite && info.mate > 0 ? 100 : !isWhite && info.mate < 0 ? -100 : 0;
        }

        if (nextToken === 'cp') {
          info.centiPawns = Number(tokens.pop());
          info.winChance = this.computeWinChance(info.centiPawns, isWhite);
          info.eval = info.centiPawns / 100;
        }
      }
      if (token === 'string') return null;
    }

    return info;
  }

  /**
   * Parses the 'bestmove' type UCI data.
   * @param {string[]} tokens - The tokens of the UCI data string.
   * @returns {{ type: string, move: string }} The parsed best move result.
   */
  private parseBestMove(tokens: string[]) {
    return {
      type: 'bestmove',
      move: tokens.pop(),
    };
  }
}
