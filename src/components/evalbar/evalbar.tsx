import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

type EvalbarProps = {
  winChance: number;
  evaluation: number;
};

export const Evalbar = ({ winChance, evaluation }: EvalbarProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="relative flex flex-col h-full overflow-hidden w-10 rounded-lg">
            <motion.div animate={{ height: `${winChance}%` }} className="w-full bg-white/5" />
            <div className="w-full flex-1 bg-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{evaluation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
