import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ChevronsUpDown } from 'lucide-react';
import { boardThemes, pieceThemes } from '@/pages/theme/themes.ts';
import { useThemeStore } from '@/store/theme.ts';
import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Chess } from 'chess.js';
import { Api } from 'chessground/api';

const demoPgn =
  '[Event "It (cat.17)"]\n' +
  '[Site "Wijk aan Zee (Netherlands)"]\n' +
  '[Date "1999.??.??"]\n' +
  '[Round "?"]\n' +
  '[White "Garry Kasparov"]\n' +
  '[Black "Veselin Topalov"]\n' +
  '[Result "1-0"]\n' +
  '[Link "https://www.chess.com/fr/games/view/969971"]\n' +
  '\n' +
  '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6\n' +
  'Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4\n' +
  '15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1\n' +
  'd4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+\n' +
  'Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+\n' +
  'Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8\n' +
  'Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0';

export const Theme = () => {
  const [pieceThemeOpen, setPieceThemeOpen] = useState(false);
  const [boardThemeOpen, setBoardThemeOpen] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [chessGround, setChessGround] = useState<Api | null>(null);
  const autoPlayTimeout = useRef<NodeJS.Timeout | null>(null);
  const { setPieceTheme, setBoardTheme, pieceTheme, boardTheme, animationSpeed, setAnimationSpeed } = useThemeStore();
  const chess = useMemo(() => new Chess(), []);

  const handleNextMove = () => {
    chess.move(history[currentMove]);
    chessGround?.set({
      fen: chess.fen(),
    });

    setCurrentMove((currentMove) => currentMove + 1);
  };

  useMemo(() => {
    chess.loadPgn(demoPgn);

    setHistory(chess.history());

    while (chess.history().length > 0) {
      chess.undo();
    }
  }, [chess]);

  useEffect(() => {
    if (currentMove >= history.length) {
      setCurrentMove(0);

      while (chess.history().length > 0) {
        chess.undo();
      }
    }
    autoPlayTimeout.current = setTimeout(handleNextMove, 1000);

    return () => clearTimeout(autoPlayTimeout.current!);
  }, [currentMove]);

  useEffect(() => {
    if (currentMove >= history.length) setCurrentMove(0);
  }, [currentMove, history]);

  useEffect(() => {
    chessGround?.redrawAll();
  }, [pieceTheme, boardTheme]);

  const handleChangeAnimationSpeed = (value: string) => {
    setAnimationSpeed(value);

    chessGround?.set({
      animation: {
        enabled: true,
        duration: parseInt(value),
      },
    });
  };

  return (
    <div className="h-full md:justify-center justify-end gap-6 flex md:flex-row flex-col-reverse p-4 md:p-10">
      <div className="flex flex-col gap-3 w-full md:w-64">
        <Label htmlFor="piece-theme">Piece theme</Label>
        <Popover open={pieceThemeOpen} onOpenChange={setPieceThemeOpen}>
          <PopoverTrigger id="piece-theme" asChild>
            <Button variant="secondary" role="combobox" aria-expanded={pieceThemeOpen} className="justify-between">
              {pieceThemes.find((theme) => theme.value === pieceTheme)?.label ?? 'Select theme...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search theme..." />
              <CommandList>
                <CommandEmpty>Theme not found.</CommandEmpty>
                <CommandGroup>
                  {pieceThemes.map((pieceTheme) => (
                    <CommandItem
                      className={`p-1 ${pieceTheme.value}`}
                      key={pieceTheme.value}
                      value={pieceTheme.value}
                      onSelect={(currentValue) => {
                        setPieceTheme(currentValue);
                        setPieceThemeOpen(false);
                      }}
                    >
                      <div className={`h-8 aspect-square white king bg-cover`} />
                      {pieceTheme.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Label htmlFor="board-theme">Board theme</Label>
        <Popover open={boardThemeOpen} onOpenChange={setBoardThemeOpen}>
          <PopoverTrigger id="board-theme" asChild>
            <Button variant="secondary" role="combobox" aria-expanded={boardThemeOpen} className="justify-between">
              {boardThemes.find((theme) => theme.value === boardTheme)?.label ?? 'Select theme...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search theme..." />
              <CommandList>
                <CommandEmpty>Theme not found.</CommandEmpty>
                <CommandGroup>
                  {boardThemes.map((boardTheme) => (
                    <CommandItem
                      className="p-1"
                      key={boardTheme.value}
                      value={boardTheme.value}
                      onSelect={(currentValue) => {
                        setBoardTheme(currentValue);
                        setBoardThemeOpen(false);
                      }}
                    >
                      <div className={`h-8 w-16 ${boardTheme.theme.thumbnail}`} />
                      {boardTheme.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Label htmlFor="animation-speed">Animation speed</Label>
        <Select defaultValue={animationSpeed.toString()} onValueChange={handleChangeAnimationSpeed}>
          <SelectTrigger id="animation-speed">
            <SelectValue placeholder="Animation speed" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="500">Super slow (500ms)</SelectItem>
            <SelectItem value="350">Slow (350ms)</SelectItem>
            <SelectItem value="250">Normal (250ms)</SelectItem>
            <SelectItem value="150">Fast (150ms)</SelectItem>
            <SelectItem value="75">Super fast (75ms)</SelectItem>
            <SelectItem value="0">Instant (0ms)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="aspect-square md:h-auto h-[calc(100vw-2.5rem)] w-[calc(100vw-2.5rem)] md:w-auto">
        <Chessboard draggable={false} chess={chess} chessGround={chessGround} setChessGround={setChessGround} />
      </div>
    </div>
  );
};
