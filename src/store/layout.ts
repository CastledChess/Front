import { Layout, LayoutItem, Panel, SelectedLayouts } from '@/types/layout';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LayoutState {
  layout: Layout;
  selectedLayouts: SelectedLayouts;
  setLayout: (layout: Layout | ((layout: Layout) => Layout)) => void;
  setSelectedLayouts: (
    selectedLayouts: SelectedLayouts | ((selectedLayouts: SelectedLayouts) => SelectedLayouts),
  ) => void;
  movePanel: (from: LayoutItem, to: LayoutItem, item: Panel, indexFrom: number, indexTo: number) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layout: {
        topLeft: [],
        bottomLeft: [],
        topRight: ['database', 'evalHistory'],
        bottomRight: ['engineLines', 'moveList'],
      },
      selectedLayouts: {
        topLeft: 0,
        bottomLeft: null,
        topRight: 0,
        bottomRight: 0,
      },
      isDragging: false,
      setLayout: (layout: Layout | ((layout: Layout) => Layout)) => {
        set((state) => ({
          layout: typeof layout === 'function' ? layout(state.layout) : layout,
        }));
      },
      setSelectedLayouts: (
        selectedLayouts: SelectedLayouts | ((selectedLayouts: SelectedLayouts) => SelectedLayouts),
      ) => {
        set((state) => ({
          selectedLayouts:
            typeof selectedLayouts === 'function' ? selectedLayouts(state.selectedLayouts) : selectedLayouts,
        }));
      },
      movePanel: (from: LayoutItem, to: LayoutItem, item: Panel, indexFrom: number, indexTo: number) => {
        set((state) => {
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
      partialize: (state) => ({ layout: state.layout, selectedLayouts: state.selectedLayouts }),
    },
  ),
);
