import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { StartAnalysisFormSchema } from '@/schema/analysis.ts';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useDebounceCallback } from 'usehooks-ts';
import { getUserGames } from '@/api/chesscom.ts';
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
import { Calendar } from '@/components/ui/calendar.tsx';
import { CaptionLabelProps, DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';

type ChesscomSelectProps = {
  isLoading: boolean;
  form: UseFormReturn<z.infer<typeof StartAnalysisFormSchema>>;
};

export type ChessComGame = {
  accuracies: { white: number; black: number };
  black: { rating: number; result: string; username: string; uuid: string };
  white: { rating: number; result: string; username: string; uuid: string };
  eco: string;
  end_time: number;
  fen: string;
  initial_setup: string;
  pgn: string;
  rated: boolean;
  rules: string;
  tcn: string;
  time_class: string;
  time_control: string;
  url: string;
  uuid: string;
};

const ChesscomGame = ({ game }: { game: ChessComGame | undefined }) => {
  const { t } = useTranslation('analysis', { keyPrefix: 'newAnalysis' });

  if (!game) return <div className="text-sm text-muted-foreground">{t('noGameSelected')}</div>;

  const dateSince = formatDistance(new Date(game.end_time * 1000), new Date(), { addSuffix: true });

  return (
    <div className="flex items-center p-2 gap-3 w-full">
      <div className="flex items-center">
        <span className="text-sm font-medium">{game.white.username}</span>
        <span className="text-xs text-muted-foreground ml-1">({game.white.rating})</span>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium">{game.black.username}</span>
        <span className="text-xs text-muted-foreground ml-1">({game.black.rating})</span>
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

export const ChesscomSelect = ({ form, isLoading }: ChesscomSelectProps) => {
  const { t } = useTranslation('analysis', { keyPrefix: 'newAnalysis' });
  const [games, setGames] = useState<ChessComGame[]>([]);
  const [seachOpen, setSearchOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const searchGames = async (username: string) => {
    if (username !== userName) setUserName(username);

    try {
      const games = await getUserGames(username, dateRange);

      setGames(games.filter((g) => g.rules === 'chess').sort((a, b) => b.end_time - a.end_time));
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSearchGames = useDebounceCallback(searchGames, 300);

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

    const game = games.find((game) => game.uuid === selectedGame);

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
        <PopoverTrigger disabled={isLoading} id="chesscom-search" asChild>
          <Button variant="secondary" role="combobox" aria-expanded={seachOpen} className="justify-between w-full">
            <ChesscomGame game={games.find((game) => game.uuid === selectedGame)} />
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0 w-full">
          <Command
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSearchGames(e.target.value)}
            shouldFilter={false}
          >
            <CommandInput disabled={isLoading} placeholder={t('searchPlayer')} />

            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger disabled={isLoading} id="chesscom-search-date" asChild>
                <Button variant="ghost" role="combobox" aria-expanded={seachOpen} className="justify-between w-full">
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
                    key={game.uuid}
                    value={game.uuid}
                    onSelect={(id) => {
                      setSelectedGame(id);
                      setSearchOpen(false);
                    }}
                  >
                    <ChessboardTooltip fen={game.fen} key={game.uuid}>
                      <ChesscomGame game={game} />
                    </ChessboardTooltip>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty>{t('noResults')}</CommandEmpty>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedGame && (
        <Textarea
          disabled
          spellCheck="false"
          id="pgn"
          className="h-full resize-none custom-scrollbar"
          value={games.find((g) => g.uuid === selectedGame)?.pgn}
        />
      )}
    </>
  );
};
