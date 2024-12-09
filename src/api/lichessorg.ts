import { api } from '@/api/index.ts';
import { DateRange } from 'react-day-picker';
import { LichessOrgGame } from '@/pages/start-analysis/lichessorg-select.tsx';

export const autoCompleteUsernames = async (query: string) => {
  const { data }: { data: string[] } = await api.get(`https://lichess.org/api/player/autocomplete?term=${query}`);

  return data;
};
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

// https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e
/* eslint-disable */
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
/* eslint-enable */
