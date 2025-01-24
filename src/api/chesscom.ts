import { api } from '@/api/index.ts';
import { DateRange } from 'react-day-picker';
import { ChessComGame } from '@/pages/start-analysis/chesscom-select.tsx';

/**
 * Fetches the user's games from Chess.com within a specified date range.
 *
 * @param {string} username - The Chess.com username.
 * @param {DateRange | undefined} dateRange - The date range for fetching games.
 * @returns {Promise<ChessComGame[]>} - A promise that resolves to an array of ChessComGame objects.
 */
export const getUserGames = async (username: string, dateRange: DateRange | undefined): Promise<ChessComGame[]> => {
  // Return an empty array if the date range is not defined or invalid
  if (!dateRange || !dateRange?.from || !dateRange?.to) {
    return [];
  }

  // Adjust the end date to the current date if it matches today's date
  if (dateRange.to.toDateString() === new Date().toDateString()) {
    dateRange.to = new Date();
  }

  const fetchedGames: ChessComGame[] = [];
  const startYear = dateRange.from.getFullYear();
  const endYear = dateRange.to.getFullYear();
  const startMonth = dateRange.from.getMonth();
  const endMonth = dateRange.to.getMonth();

  // Loop through each year and month within the date range
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

      // Filter and add games within the specified date range
      fetchedGames.push(
        ...games.filter(
          (g) => g.end_time >= dateRange.from!.getTime() / 1000 && g.end_time <= dateRange.to!.getTime() / 1000,
        ),
      );
    }
  }

  return fetchedGames;
};
