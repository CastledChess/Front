import { api } from '@/api/index.ts';
import { DateRange } from 'react-day-picker';
import { LichessOrgGame } from '@/pages/start-analysis/lichessorg-select.tsx';

/**
 * Fetches autocomplete suggestions for usernames from Lichess.org.
 *
 * @param {string} query - The query string to search for usernames.
 * @returns {Promise<string[]>} - A promise that resolves to an array of suggested usernames.
 */
export const autoCompleteUsernames = async (query: string) => {
  const { data }: { data: string[] } = await api.get(`https://lichess.org/api/player/autocomplete?term=${query}`);

  return data;
};

/**
 * Fetches the user's games from Lichess.org within a specified date range and processes each game.
 *
 * @param {string} username - The Lichess.org username.
 * @param {DateRange | undefined} dateRange - The date range for fetching games.
 * @param {function} onMessage - Callback function to process each game.
 * @param {function} onComplete - Callback function to call when the fetching is complete.
 * @returns {Promise<void>} - A promise that resolves when the fetching is complete.
 */
export const getUserGames = (
  username: string,
  dateRange: DateRange | undefined,
  onMessage: (game: LichessOrgGame) => void,
  onComplete: () => void,
) => {
  if (!dateRange || !dateRange?.from || !dateRange?.to) {
    return [];
  }

  if (dateRange.to.toDateString() === new Date().toDateString()) {
    dateRange.to = new Date();
  }

  const stream = fetch(
    `https://lichess.org/api/games/user/${username}?since=${dateRange.from.getTime()}&until=${dateRange.to.getTime()}&pgnInJson=true&lastFen=true&perfType=blitz,rapid,classical`,
    {
      headers: {
        Accept: 'application/x-ndjson',
      },
    },
  );

  stream.then(readStream(onMessage)).then(onComplete);
};

/**
 * Reads a stream of newline-delimited JSON (NDJSON) and processes each line.
 *
 * @param {function} processLine - Callback function to process each line of the stream.
 * @returns {function} - A function that takes a response and reads the stream.
 */
const readStream = (processLine: any) => (response: any) => {
  const stream = response.body.getReader();
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf = '';

  const loop = () =>
    stream.read().then(({ done, value }: any) => {
      if (done) {
        if (buf.length > 0) processLine(JSON.parse(buf));
      } else {
        const chunk = decoder.decode(value, {
          stream: true,
        });
        buf += chunk;

        const parts = buf.split(matcher);
        buf = parts.pop() || '';
        for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));
        return loop();
      }
    });

  return loop();
};
