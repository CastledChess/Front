import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { StartAnalysisFormSchema } from '@/schema/analysis.ts';
import { ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useDebounceCallback } from 'usehooks-ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { format, formatDistance, lastDayOfMonth } from 'date-fns';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea.tsx';
import { ChessboardTooltip } from '@/components/chessboard/chessboard-tooltip.tsx';
import { CaptionLabelProps, DateRange } from 'react-day-picker';
import { autoCompleteUsernames, getUserGames } from '@/api/lichessorg.ts';
import { Calendar } from '@/components/ui/calendar.tsx';
import { useTranslation } from 'react-i18next';

type ChesscomSelectProps = {
  form: UseFormReturn<z.infer<typeof StartAnalysisFormSchema>>;
};

export type LichessOrgGame = {
  id: string;
  lastFen: string;
  rated: boolean;
  variant: string;
  speed: string;
  perf: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: {
      user: {
        name: string;
        id: string;
        title: string;
        patron: boolean;
      };
      rating: number;
      ratingDiff: number;
    };
    black: {
      user: {
        name: string;
        id: string;
        title: string;
        patron: boolean;
      };
      rating: number;
      ratingDiff: number;
    };
  };
  opening: {
    eco: string;
    name: string;
    ply: number;
  };
  moves: string;
  clock: {
    initial: number;
    increment: number;
    totalTime: number;
  };
  pgn: string;
};

const LichessorgGame = ({ game }: { game: LichessOrgGame | undefined }) => {
  const { t } = useTranslation('analysis', { keyPrefix: 'newAnalysis' });

  if (!game) return <div className="text-sm text-muted-foreground">{t('noGameSelected')}</div>;

  const dateSince = formatDistance(new Date(game.lastMoveAt), new Date(), { addSuffix: true });

  return (
    <div className="flex items-center p-2 gap-3 w-full">
      <div className="flex items-center">
        <span className="text-sm font-medium">{game.players.white.user.name}</span>
        <span className="text-xs text-muted-foreground ml-1">({game.players.white.rating})</span>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium">{game.players.black.user.name}</span>
        <span className="text-xs text-muted-foreground ml-1">({game.players.black.rating})</span>
      </div>
      <div className="ml-auto text-xs text-muted-foreground">{dateSince}</div>
    </div>
  );
};

const CustomDateCaptionLabel = ({
  id,
  displayMonth,
  onClick,
}: CaptionLabelProps & { onClick: (month: Date) => void }) => {
  return (
    <Button variant="ghost" id={id} className="flex justify-between p-2" onClick={() => onClick(displayMonth)}>
      {format(displayMonth, 'MMMM yyyy')}
    </Button>
  );
};

const MAX_RANGE_DAYS = 31;

export const LichessorgSelect = ({ form }: ChesscomSelectProps) => {
  const { t } = useTranslation('analysis', { keyPrefix: 'newAnalysis' });
  const [games, setGames] = useState<LichessOrgGame[]>([]);
  const [seachOpen, setSearchOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [autoCompletedUsernames, setAutoCompletedUsernames] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const onSearchGamesMessage = (game: LichessOrgGame) => {
    setGames((games) => [...games, game]);
  };
  const searchGames = (username: string) => {
    setGames([]);

    try {
      getUserGames(username, dateRange, onSearchGamesMessage, () => {});
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSearchGames = useDebounceCallback(searchGames, 300);

  const searchUserByUserName = async (username: string) => {
    try {
      const usernames = await autoCompleteUsernames(username);

      setAutoCompletedUsernames(usernames);
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedsearchUserByUserName = useDebounceCallback(searchUserByUserName, 300);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const diffDays = (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays > MAX_RANGE_DAYS) {
        return;
      }
    }

    setDateRange(range);
  };

  const onDateLabelClick = (month: Date) => {
    const firstDay = new Date(month);
    const lastDay = lastDayOfMonth(month);

    firstDay.setDate(1);

    setDateRange({ from: firstDay, to: lastDay });
    setDateOpen(false);
  };

  useEffect(() => {
    if (!selectedGame) return;

    const game = games.find((game) => game.id === selectedGame);

    if (!game) return;

    form.setValue('pgn', game.pgn);
  }, [selectedGame]);

  useEffect(() => {
    if (!userName) return;

    debouncedSearchGames(userName);
  }, [dateRange]);

  return (
    <>
      <Popover open={seachOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger id="lichessorg-search" asChild>
          <Button variant="outline" role="combobox" aria-expanded={seachOpen} className="justify-between w-full">
            <LichessorgGame game={games.find((game) => game.id === selectedGame)} />
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0 w-full">
          <Command
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedsearchUserByUserName(e.target.value)}
            shouldFilter={false}
          >
            {userName !== null ? (
              <>
                <CommandInput
                  disabled
                  value={userName}
                  icon={
                    <Button
                      onClick={() => setUserName(null)}
                      variant="ghost"
                      className="p-0 flex items-center justify-center aspect-square h-max mr-2 "
                    >
                      <X className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  }
                />

                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger id="lichessorg-search-date" asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={seachOpen}
                      className="justify-between w-full"
                    >
                      From {dateRange?.from?.toLocaleDateString()} to {dateRange?.to?.toLocaleDateString()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent side="right" align="start" className="p-0 w-full">
                    <Calendar
                      components={{
                        CaptionLabel: (props: CaptionLabelProps) => (
                          <CustomDateCaptionLabel {...props} onClick={onDateLabelClick} />
                        ),
                      }}
                      mode="range"
                      selected={dateRange}
                      defaultMonth={dateRange?.from}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <CommandList className="custom-scrollbar">
                  <CommandGroup>
                    {games.map((game) => (
                      <CommandItem
                        className="p-1"
                        key={game.id}
                        value={game.id}
                        onSelect={(id) => {
                          setSelectedGame(id);
                          setSearchOpen(false);
                        }}
                      >
                        <ChessboardTooltip fen={game.lastFen} key={game.id}>
                          <LichessorgGame game={game} />
                        </ChessboardTooltip>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandEmpty>{t('noResults')}</CommandEmpty>
                </CommandList>
              </>
            ) : (
              <>
                <CommandInput placeholder={t('searchPlayer')} />
                <CommandList className="custom-scrollbar">
                  <CommandGroup>
                    {autoCompletedUsernames.map((username) => (
                      <CommandItem
                        className="p-1"
                        key={username}
                        value={username}
                        onSelect={(username) => {
                          setUserName(username);
                          searchGames(username);
                        }}
                      >
                        {username}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandEmpty>{t('noResults')}</CommandEmpty>
                </CommandList>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      {selectedGame && (
        <Textarea
          disabled
          spellCheck="false"
          id="pgn"
          className="h-56 resize-none custom-scrollbar"
          value={games.find((g) => g.id === selectedGame)?.pgn}
        />
      )}
    </>
  );
};
