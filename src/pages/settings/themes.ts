import alpha from '@/assets/themes/piece/alpha';
import anarcandy from '@/assets/themes/piece/anarcandy';
import caliente from '@/assets/themes/piece/caliente';
import california from '@/assets/themes/piece/california';
import cardinal from '@/assets/themes/piece/cardinal';
import cburnett from '@/assets/themes/piece/cburnett';
import celtic from '@/assets/themes/piece/celtic';
import chess7 from '@/assets/themes/piece/chess7';
import chessnut from '@/assets/themes/piece/chessnut';
import companion from '@/assets/themes/piece/companion';
import cooke from '@/assets/themes/piece/cooke';
import disguised from '@/assets/themes/piece/disguised';
import dubrovny from '@/assets/themes/piece/dubrovny';
import fantasy from '@/assets/themes/piece/fantasy';
import fresca from '@/assets/themes/piece/fresca';
import gioco from '@/assets/themes/piece/gioco';
import governor from '@/assets/themes/piece/governor';
import horsey from '@/assets/themes/piece/horsey';

export type Theme = {
  label: string;
  value: string;
  theme: Record<string, string>;
};

export const pieceThemes = [
  { label: 'Alpha', value: 'alpha', theme: alpha },
  { label: 'Anarcandy', value: 'anarcandy', theme: anarcandy },
  { label: 'Caliente', value: 'caliente', theme: caliente },
  { label: 'California', value: 'california', theme: california },
  { label: 'Cardinal', value: 'cardinal', theme: cardinal },
  { label: 'Cburnett', value: 'cburnett', theme: cburnett },
  { label: 'Celtic', value: 'celtic', theme: celtic },
  { label: 'Chess7', value: 'chess7', theme: chess7 },
  { label: 'Chessnut', value: 'chessnut', theme: chessnut },
  { label: 'Companion', value: 'companion', theme: companion },
  { label: 'Cooke', value: 'cooke', theme: cooke },
  { label: 'Disguised', value: 'disguised', theme: disguised },
  { label: 'Dubrovny', value: 'dubrovny', theme: dubrovny },
  { label: 'Fantasy', value: 'fantasy', theme: fantasy },
  { label: 'Fresca', value: 'fresca', theme: fresca },
  { label: 'Gioco', value: 'gioco', theme: gioco },
  { label: 'Governor', value: 'governor', theme: governor },
  { label: 'Horsey', value: 'horsey', theme: horsey },
] as Theme[];

export const boardThemes = [
  { label: 'Blue 2', value: 'blue2', theme: { board: 'blue2', thumbnail: 'blue2-thumbnail' } },
  { label: 'Blue 3', value: 'blue3', theme: { board: 'blue3', thumbnail: 'blue3-thumbnail' } },
  {
    label: 'Blue Marble',
    value: 'blue-marble',
    theme: { board: 'blue-marble', thumbnail: 'blue-marble-thumbnail' },
  },
  { label: 'Canvas 2', value: 'canvas2', theme: { board: 'canvas2', thumbnail: 'canvas2-thumbnail' } },
  {
    label: 'Green Plastic',
    value: 'green-plastic',
    theme: { board: 'green-plastic', thumbnail: 'green-plastic-thumbnail' },
  },
  { label: 'Grey', value: 'grey', theme: { board: 'grey', thumbnail: 'grey-thumbnail' } },
  { label: 'Horsey', value: 'horsey', theme: { board: 'horsey', thumbnail: 'horsey-thumbnail' } },
  { label: 'Leather', value: 'leather', theme: { board: 'leather', thumbnail: 'leather-thumbnail' } },
  { label: 'Maple', value: 'maple', theme: { board: 'maple', thumbnail: 'maple-thumbnail' } },
  { label: 'Maple 2', value: 'maple2', theme: { board: 'maple2', thumbnail: 'maple2-thumbnail' } },
  { label: 'Marble', value: 'marble', theme: { board: 'marble', thumbnail: 'marble-thumbnail' } },
  { label: 'Metal', value: 'metal', theme: { board: 'metal', thumbnail: 'metal-thumbnail' } },
  { label: 'Olive', value: 'olive', theme: { board: 'olive', thumbnail: 'olive-thumbnail' } },
  {
    label: 'Pink Pyramid',
    value: 'pink-pyramid',
    theme: { board: 'pink-pyramid', thumbnail: 'pink-pyramid-thumbnail' },
  },
  {
    label: 'Purple Diag',
    value: 'purple-diag',
    theme: { board: 'purple-diag', thumbnail: 'purple-diag-thumbnail' },
  },
  { label: 'Wood', value: 'wood', theme: { board: 'wood', thumbnail: 'wood-thumbnail' } },
  { label: 'Wood 2', value: 'wood2', theme: { board: 'wood2', thumbnail: 'wood2-thumbnail' } },
  { label: 'Wood 3', value: 'wood3', theme: { board: 'wood3', thumbnail: 'wood3-thumbnail' } },
  { label: 'Wood 4', value: 'wood4', theme: { board: 'wood4', thumbnail: 'wood4-thumbnail' } },
] as Theme[];
