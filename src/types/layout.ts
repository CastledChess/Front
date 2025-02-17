export type LayoutItem = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';
export type Panel = 'database' | 'engineLines' | 'moveList' | 'evalHistory';
export type Layout = Record<LayoutItem, Panel[]>;
export type SelectedLayouts = Record<LayoutItem, number | null>;
export type DragItem = {
  type: 'layoutItem';
  id: Panel;
  which: LayoutItem;
};
