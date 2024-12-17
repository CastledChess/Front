import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

type EvalbarProps = {
  orientation: 'white' | 'black';
  winChance: number;
  evaluation: number;
  mate?: number;
};

export const Evalbar = ({ orientation, winChance, evaluation, mate }: EvalbarProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className="relative flex flex-col h-full overflow-hidden w-6 rounded"
            style={{
              transform: orientation === 'black' ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <motion.div
              animate={{ height: `${100 - winChance}%`, transition: { duration: 1 } }}
              initial={{ height: '50%' }}
              className="w-full bg-white/5"
            />

            <motion.div
              animate={{ height: `${winChance}%`, transition: { duration: 1 } }}
              initial={{ height: '50%' }}
              className="w-full bg-white"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{mate ? `M${mate}` : evaluation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
