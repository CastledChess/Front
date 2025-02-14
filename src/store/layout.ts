import { Panel } from '@/types/layout';
import { MosaicNode } from 'react-mosaic-component';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LayoutState {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean | ((isDragging: boolean) => boolean)) => void;
  layout: MosaicNode<Panel> | null;
  setLayout: (
    layout: (MosaicNode<Panel> | null) | ((layout: MosaicNode<Panel> | null) => MosaicNode<Panel> | null),
  ) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isDragging: false,
      setIsDragging: (isDragging: boolean | ((isDragging: boolean) => boolean)) => {
        set((state) => ({
          isDragging: typeof isDragging === 'function' ? isDragging(state.isDragging) : isDragging,
        }));
      },
      layout: {
        direction: 'row',
        first: 'database',
        second: {
          direction: 'column',
          first: 'interpretation',
          second: 'moveList',
        },
        splitPercentage: 40,
      },
      setLayout: (
        layout: (MosaicNode<Panel> | null) | ((layout: MosaicNode<Panel> | null) => MosaicNode<Panel> | null),
      ) => {
        set((state) => ({
          layout: typeof layout === 'function' ? layout(state.layout) : layout,
        }));
      },
    }),
    {
      name: 'layout',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ layout: state.layout }),
    },
  ),
);
