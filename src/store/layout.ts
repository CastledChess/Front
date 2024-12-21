import { Layout, LayoutItem, Panel } from '@/types/layout';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LayoutState {
  layout: Layout;
  setLayout: (layout: Layout | ((layout: Layout) => Layout)) => void;
  movePanel: (from: LayoutItem, to: LayoutItem, item: Panel, indexFrom: number, indexTo: number) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layout: {
        topLeft: [],
        bottomLeft: [],
        topRight: ['chessboard'],
        bottomRight: ['engineInterpretation', 'engineLines', 'moveList'],
      },
      setLayout: (layout: Layout | ((layout: Layout) => Layout)) => {
        set((state) => ({
          layout: typeof layout === 'function' ? layout(state.layout) : layout,
        }));
      },
      movePanel: (from: LayoutItem, to: LayoutItem, item: Panel, indexFrom: number, indexTo: number) => {
        set((state) => {
          console.log(`move ${item} from ${from} at index ${indexFrom} to ${to} at ${indexTo}`);

          state.layout[from].splice(indexFrom, 1);
          state.layout[to].splice(indexTo, 0, item);

          return {
            layout: state.layout,
          };
        });
      },
    }),
    {
      name: 'layout',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
