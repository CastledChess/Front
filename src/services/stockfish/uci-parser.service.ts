import { InfoResult } from '@/types/analysis.ts';

export class UciParserService {
  constructor() {}

  public parse(data: string, isWhite: boolean) {
    const tokens: string[] = data.split(' ').reverse();
    const type = tokens.pop();

    if (type === 'info') return this.parseInfo(tokens, isWhite);
    if (type === 'bestmove') return this.parseBestMove(tokens);
  }

  private computeWinChance(cp: number, isWhite: boolean) {
    return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * (isWhite ? cp : cp * -1))) - 1);
  }

  private parseInfo(tokens: string[], isWhite: boolean) {
    const info: InfoResult = { type: 'info' };

    while (tokens.length) {
      const token = tokens.pop();

      if (!token) continue;

      if (token === 'depth') info.depth = Number(tokens.pop());
      if (token === 'seldepth') info.selDepth = Number(tokens.pop());
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
      if (token === 'pv') {
        const nextToken = tokens.pop();

        if (!nextToken) continue;

        info.move = nextToken;
        info.from = nextToken.slice(0, 2);
        info.to = nextToken.slice(2, 4);
      }
      if (token === 'string') return null;
    }

    return info;
  }

  private parseBestMove(tokens: string[]) {
    return {
      type: 'bestmove',
      move: tokens.pop(),
    };
  }
}
