import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

type EvalbarProps = {
  orientation: 'white' | 'black';
  winChance: number;
  evaluation: number;
};

export const Evalbar = ({ orientation, winChance, evaluation }: EvalbarProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className="relative flex flex-col h-full overflow-hidden w-10 rounded-lg"
            style={{
              transform: orientation === 'black' ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <motion.div
              animate={{ height: `${100 - winChance}%` }}
              initial={{ height: '50%' }}
              className="w-full bg-white/5"
            />

            <motion.div animate={{ height: `${winChance}%` }} initial={{ height: '50%' }} className="w-full bg-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{evaluation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
