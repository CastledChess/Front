﻿import { api } from '@/api/index.ts';
import { DateRange } from 'react-day-picker';
import { ChessComGame } from '@/pages/start-analysis/chesscom-select.tsx';

export const getUserGames = async (username: string, dateRange: DateRange | undefined) => {
  if (!dateRange || !dateRange?.from || !dateRange?.to) {
    return [];
  }

  if (dateRange.to.toDateString() === new Date().toDateString()) {
    dateRange.to = new Date();
  }

  const fetchedGames: ChessComGame[] = [];
  const startYear = dateRange.from.getFullYear();
  const endYear = dateRange.to.getFullYear();
  const startMonth = dateRange.from.getMonth();
  const endMonth = dateRange.to.getMonth();

  for (let year = startYear; year <= endYear; year++) {
    const monthStart = year === startYear ? startMonth : 0;
    const monthEnd = year === endYear ? endMonth : 11;

    for (let month = monthStart; month <= monthEnd; month++) {
      const formattedMonth = month + 1 < 10 ? `0${month + 1}` : month + 1;
      const {
        data: { games },
      }: { data: { games: ChessComGame[] } } = await api.get(
        `https://api.chess.com/pub/player/${username}/games/${year}/${formattedMonth}`,
      );

      fetchedGames.push(
        ...games.filter(
          (g) => g.end_time >= dateRange.from!.getTime() / 1000 && g.end_time <= dateRange.to!.getTime() / 1000,
        ),
      );
    }
  }

  return fetchedGames;
};
