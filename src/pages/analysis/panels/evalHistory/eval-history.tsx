import { EvalChart } from '@/components/evalchart/evalchart.tsx';
import { CategoricalChartState } from 'recharts/types/chart/types';
import { useAnalysisStore } from '@/store/analysis.ts';

export const EvalHistory = () => {
  const { setCurrentMove, analysis, chess, chessGround } = useAnalysisStore();

  const handleSkipToMove = (index: number) => {
    const moves = chess.history();

    for (let i = 0; i < moves.length; i++) {
      chess.undo();
    }

    for (let i = 0; i < index; i++) {
      chess.move(analysis!.moves[i].move);
    }

    chessGround?.set({
      fen: chess.fen(),
    });
    setCurrentMove(index);
    chessGround?.redrawAll();
  };

  const handleClickEvalChart = (nextState: CategoricalChartState) => {
    if (nextState.activeTooltipIndex) handleSkipToMove(nextState.activeTooltipIndex + 1);
  };

  return (
    <div className="p-6 h-full w-full">
      <EvalChart onClick={handleClickEvalChart} />
    </div>
  );
};
