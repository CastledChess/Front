import { useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Api } from 'chessground/api';
import { Chessboard } from '@/components/chessboard/chessboard.tsx';
import { Chess } from 'chess.js';
import { AnimatePresence, motion } from 'framer-motion';
import { TooltipPortal } from '@radix-ui/react-tooltip';

type ChessboardTooltipProps = {
  children: React.ReactNode;
  fen: string;
};

export const ChessboardTooltip = ({ children, fen }: ChessboardTooltipProps) => {
  const [chessGround, setChessGround] = useState<Api | null>(null);
  const [open, setOpen] = useState(false);
  const chess = useMemo(() => new Chess(fen), [fen]);

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={0} onOpenChange={setOpen}>
        <TooltipTrigger className="w-full">{children}</TooltipTrigger>
        <AnimatePresence mode="wait">
          {open && (
            <TooltipPortal forceMount>
              <TooltipContent
                forceMount
                side="bottom"
                sideOffset={10}
                align="end"
                asChild
                className="p-0 preview-tooltip"
              >
                <motion.div
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-40 h-40"
                >
                  <Chessboard
                    chess={chess}
                    chessGround={chessGround}
                    setChessGround={setChessGround}
                    disableCoordinates
                  />
                </motion.div>
              </TooltipContent>
            </TooltipPortal>
          )}
        </AnimatePresence>
      </Tooltip>
    </TooltipProvider>
  );
};
