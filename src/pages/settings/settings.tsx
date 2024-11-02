import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ChevronsUpDown } from 'lucide-react';
import { boardThemes, pieceThemes } from '@/pages/settings/themes.ts';
import { useThemeStore } from '@/store/theme.ts';
import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { useAnalysisStore } from '@/store/analysis.ts';

export const Settings = () => {
  const [pieceThemeOpen, setPieceThemeOpen] = useState(false);
  const [boardThemeOpen, setBoardThemeOpen] = useState(false);
  const { setPieceTheme, setBoardTheme, pieceTheme, boardTheme } = useThemeStore();
  const chessGround = useAnalysisStore((state) => state.chessGround);

  return (
    <>
      <h1>Settings</h1>

      <Popover open={pieceThemeOpen} onOpenChange={setPieceThemeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={pieceThemeOpen}
            className="w-[200px] justify-between"
          >
            {pieceThemes.find((theme) => theme.value === pieceTheme)?.label ?? 'Select theme...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search theme..." />
            <CommandList>
              <CommandEmpty>Theme not found.</CommandEmpty>
              <CommandGroup>
                {pieceThemes.map((pieceTheme) => (
                  <CommandItem
                    className="p-1"
                    key={pieceTheme.value}
                    value={pieceTheme.value}
                    onSelect={(currentValue) => {
                      setPieceTheme(currentValue);
                      chessGround?.redrawAll();
                      setPieceThemeOpen(false);
                    }}
                  >
                    <img src={pieceTheme.theme.wK} className="h-8" alt="piece" />
                    {pieceTheme.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={boardThemeOpen} onOpenChange={setBoardThemeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={boardThemeOpen}
            className="w-[200px] justify-between"
          >
            {boardThemes.find((theme) => theme.value === boardTheme)?.label ?? 'Select theme...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
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
                      chessGround?.redrawAll();
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

      <div className="h-[calc(100%-7rem)] aspect-square">
        <Chessboard />
      </div>
    </>
  );
};
