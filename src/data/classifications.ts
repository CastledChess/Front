import { AnalysisMoveClassification } from '@/types/analysis.ts';
import { KeyValuePair } from 'tailwindcss/types/config';

import brilliantRaw from '@/assets/icons/analysis/classification-brilliant.svg?raw';
import bestRaw from '@/assets/icons/analysis/classification-best.svg?raw';
import excellentRaw from '@/assets/icons/analysis/classification-excellent.svg?raw';
import goodRaw from '@/assets/icons/analysis/classification-good.svg?raw';
import inaccuracyRaw from '@/assets/icons/analysis/classification-inaccuracy.svg?raw';
import mistakeRaw from '@/assets/icons/analysis/classification-mistake.svg?raw';
import blunderRaw from '@/assets/icons/analysis/classification-blunder.svg?raw';
import forcedRaw from '@/assets/icons/analysis/classification-forced.svg?raw';

import brilliant from '@/assets/icons/analysis/classification-brilliant.svg?url';
import best from '@/assets/icons/analysis/classification-best.svg?url';
import excellent from '@/assets/icons/analysis/classification-excellent.svg?url';
import good from '@/assets/icons/analysis/classification-good.svg?url';
import inaccuracy from '@/assets/icons/analysis/classification-inaccuracy.svg?url';
import mistake from '@/assets/icons/analysis/classification-mistake.svg?url';
import blunder from '@/assets/icons/analysis/classification-blunder.svg?url';
import forced from '@/assets/icons/analysis/classification-forced.svg?url';

export const classificationToGlyph: KeyValuePair<AnalysisMoveClassification, string> = {
  [AnalysisMoveClassification.Brilliant]: brilliantRaw,
  [AnalysisMoveClassification.Best]: bestRaw,
  [AnalysisMoveClassification.Excellent]: excellentRaw,
  [AnalysisMoveClassification.Good]: goodRaw,
  [AnalysisMoveClassification.Inaccuracy]: inaccuracyRaw,
  [AnalysisMoveClassification.Mistake]: mistakeRaw,
  [AnalysisMoveClassification.Blunder]: blunderRaw,
  [AnalysisMoveClassification.Forced]: forcedRaw,
  [AnalysisMoveClassification.None]: '',
};

export const classificationToGlyphUrl: KeyValuePair<AnalysisMoveClassification, string> = {
  [AnalysisMoveClassification.Brilliant]: brilliant,
  [AnalysisMoveClassification.Best]: best,
  [AnalysisMoveClassification.Excellent]: excellent,
  [AnalysisMoveClassification.Good]: good,
  [AnalysisMoveClassification.Inaccuracy]: inaccuracy,
  [AnalysisMoveClassification.Mistake]: mistake,
  [AnalysisMoveClassification.Blunder]: blunder,
  [AnalysisMoveClassification.Forced]: forced,
  [AnalysisMoveClassification.None]: '',
};

export const classificationToColor: KeyValuePair<AnalysisMoveClassification, string> = {
  [AnalysisMoveClassification.Brilliant]: 'blue',
  [AnalysisMoveClassification.Best]: 'green',
  [AnalysisMoveClassification.Excellent]: 'green',
  [AnalysisMoveClassification.Good]: 'green',
  [AnalysisMoveClassification.Inaccuracy]: 'yellow',
  [AnalysisMoveClassification.Mistake]: 'orange',
  [AnalysisMoveClassification.Blunder]: 'red',
  [AnalysisMoveClassification.Forced]: 'gray',
  [AnalysisMoveClassification.None]: '',
};

export const classificationToTailwindColor: KeyValuePair<AnalysisMoveClassification, string> = {
  [AnalysisMoveClassification.Brilliant]: 'text-sky-500',
  [AnalysisMoveClassification.Best]: 'text-green-500',
  [AnalysisMoveClassification.Excellent]: 'text-green-500',
  [AnalysisMoveClassification.Good]: 'text-green-500',
  [AnalysisMoveClassification.Inaccuracy]: 'text-yellow-500',
  [AnalysisMoveClassification.Mistake]: 'text-orange-500',
  [AnalysisMoveClassification.Blunder]: 'text-red-500',
  [AnalysisMoveClassification.Forced]: 'gray',
  [AnalysisMoveClassification.None]: '',
};

export const shouldDisplayClassificationInMoveHistory: KeyValuePair<AnalysisMoveClassification, boolean> = {
  [AnalysisMoveClassification.Brilliant]: true,
  [AnalysisMoveClassification.Best]: false,
  [AnalysisMoveClassification.Excellent]: false,
  [AnalysisMoveClassification.Good]: false,
  [AnalysisMoveClassification.Inaccuracy]: true,
  [AnalysisMoveClassification.Mistake]: true,
  [AnalysisMoveClassification.Blunder]: true,
  [AnalysisMoveClassification.Forced]: false,
  [AnalysisMoveClassification.None]: false,
};

export const moveIsBad: KeyValuePair<AnalysisMoveClassification, boolean> = {
  [AnalysisMoveClassification.Brilliant]: false,
  [AnalysisMoveClassification.Best]: false,
  [AnalysisMoveClassification.Excellent]: false,
  [AnalysisMoveClassification.Good]: false,
  [AnalysisMoveClassification.Inaccuracy]: true,
  [AnalysisMoveClassification.Mistake]: true,
  [AnalysisMoveClassification.Blunder]: true,
  [AnalysisMoveClassification.Forced]: false,
  [AnalysisMoveClassification.None]: false,
};

export const pieceToValue: KeyValuePair<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};
