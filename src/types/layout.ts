export type LayoutItem = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';
export type Panel = 'chessboard' | 'engineInterpretation' | 'engineLines' | 'moveList';
export type Layout = Record<LayoutItem, Panel[]>;
