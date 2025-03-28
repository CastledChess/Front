import { Panel } from '@/types/layout';
import { MosaicNode, MosaicPath } from 'react-mosaic-component';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LayoutState {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean | ((isDragging: boolean) => boolean)) => void;
  panelsPaths: Map<Panel, MosaicPath>;
  setPanelsPaths: (panelsPaths: Map<Panel, MosaicPath>) => void;
  layout: MosaicNode<Panel> | null;
  setLayout: (
    layout: (MosaicNode<Panel> | null) | ((layout: MosaicNode<Panel> | null) => MosaicNode<Panel> | null),
  ) => void;
}

export const defaultLayout: MosaicNode<Panel> | null = {
  direction: 'row',
  first: {
    direction: 'column',
    first: 'database',
    second: 'evalHistory',
    splitPercentage: 70,
  },
  second: {
    direction: 'column',
    first: 'interpretation',
    second: 'moveList',
    splitPercentage: 40,
  },
  splitPercentage: 50,
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isDragging: false,
      setIsDragging: (isDragging: boolean | ((isDragging: boolean) => boolean)) => {
        set((state) => ({
          isDragging: typeof isDragging === 'function' ? isDragging(state.isDragging) : isDragging,
        }));
      },
      layout: defaultLayout,
      setLayout: (
        layout: (MosaicNode<Panel> | null) | ((layout: MosaicNode<Panel> | null) => MosaicNode<Panel> | null),
      ) => {
        set((state) => ({
          layout: typeof layout === 'function' ? layout(state.layout) : layout,
        }));
      },
      panelsPaths: new Map(),
      setPanelsPaths: (panelsPaths: Map<Panel, MosaicPath>) => {
        set({ panelsPaths });
      },
    }),
    {
      name: 'layout',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ layout: state.layout }),
    },
  ),
);
