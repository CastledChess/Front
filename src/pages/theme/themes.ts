export type PieceTheme = {
  label: string;
  value: string;
};
export type BoardTheme = {
  label: string;
  value: string;
  theme: Record<string, string>;
};

export const pieceThemes = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Anarcandy', value: 'anarcandy' },
  { label: 'Caliente', value: 'caliente' },
  { label: 'California', value: 'california' },
  { label: 'Cardinal', value: 'cardinal' },
  { label: 'Cburnett', value: 'cburnett' },
  { label: 'Celtic', value: 'celtic' },
  { label: 'Chess7', value: 'chess7' },
  { label: 'Chessnut', value: 'chessnut' },
  { label: 'Companion', value: 'companion' },
  { label: 'Cooke', value: 'cooke' },
  { label: 'Disguised', value: 'disguised' },
  { label: 'Dubrovny', value: 'dubrovny' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Fresca', value: 'fresca' },
  { label: 'Gioco', value: 'gioco' },
  { label: 'Governor', value: 'governor' },
  { label: 'Horsey', value: 'horsey-p' },
  { label: 'Icpieces', value: 'icpieces' },
  { label: 'Kiwen Suwi', value: 'kiwen-suwi' },
  { label: 'Kosal', value: 'kosal' },
  { label: 'Leipzig', value: 'leipzig' },
  { label: 'Letter', value: 'letter' },
  { label: 'Maestro', value: 'maestro' },
  { label: 'Merida', value: 'merida' },
  { label: 'Monarchy', value: 'monarchy' },
  { label: 'Mpchess', value: 'mpchess' },
  { label: 'Pirouetti', value: 'pirouetti' },
  { label: 'Pixel', value: 'pixel' },
  { label: 'Reillycraig', value: 'reillycraig' },
  { label: 'Riohacha', value: 'riohacha' },
  { label: 'Shapes', value: 'shapes' },
  { label: 'Spatial', value: 'spatial' },
  { label: 'Staunty', value: 'staunty' },
  { label: 'Tatiana', value: 'tatiana' },
] as PieceTheme[];

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
] as BoardTheme[];
