import { Area, AreaChart, ResponsiveContainer, Tooltip, TooltipProps, YAxis } from 'recharts';
import { useAnalysisStore } from '@/store/analysis.ts';
import {
  classificationToColor,
  classificationToGlyphUrl,
  shouldDisplayClassificationInMoveHistory,
} from '@/pages/analysis/classifications.ts';
import { AnalysisMoveClassification } from '@/types/analysis.ts';
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart';
import { useMemo } from 'react';

type EvalChartDataPoint = {
  name: string;
  classification: AnalysisMoveClassification;
  winChance: number;
};

type EvalChartProps = {
  onClick?: CategoricalChartFunc;
};

export const EvalChart = ({ onClick }: EvalChartProps) => {
  const { analysis } = useAnalysisStore();

  const data = useMemo(
    () =>
      analysis?.moves.map((move) => {
        const result = move.engineResults.sort((a, b) => b.depth! - a.depth!)?.[0];

        return {
          name: move.move.san,
          classification: move.classification,
          mate: result?.mate,
          eval: move.move.color === 'w' ? result.eval : -result.eval!,
          winChance: result.winChance,
        };
      }),
    [analysis],
  );

  return (
    <div className="h-40 w-full bg-foreground/5 rounded">
      <ResponsiveContainer>
        <AreaChart onClick={onClick} data={data}>
          <Tooltip content={<CustomTooltip />} />
          <YAxis type="number" hide domain={[0, 100]} />
          <Area type="monotone" dataKey="winChance" dot={<CustomizedDot />} stroke="#fff" fill="#fff" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload) {
    return (
      <div className="bg-white text-black p-2 rounded-lg shadow-md">
        <p className="flex gap-2 items-center">
          <img
            src={classificationToGlyphUrl[payload[0].payload.classification as AnalysisMoveClassification]}
            alt="classification"
            className="w-4 h-4"
          />
          {payload[0].payload.classification}
        </p>

        <span className="flex gap-2 justify-between">
          {payload[0].payload.name}
          {payload[0].payload.mate ? <p>Mate in {payload[0].payload.mate}</p> : <p>{payload[0].payload.eval}</p>}
        </span>
      </div>
    );
  }

  return null;
};

const CustomizedDot = ({
  cx,
  cy,
  payload,
}: {
  cx?: number;
  cy?: number;
  stroke?: string;
  payload?: EvalChartDataPoint;
  value?: number;
}) => {
  if (shouldDisplayClassificationInMoveHistory[payload!.classification]) {
    return (
      <svg x={cx! - 10} y={cy! - 10} width={20} height={20}>
        <circle cx={10} cy={10} r={3} fill={classificationToColor[payload!.classification]} />
      </svg>
    );
  }
};