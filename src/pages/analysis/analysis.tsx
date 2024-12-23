import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { ChessboardPanel } from '@/pages/analysis/panels/chessboard/chessboard-panel.tsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EngineInterpretation } from '@/pages/analysis/panels/engineInterpretation/engine-interpretation.tsx';
import { EngineLines } from '@/pages/analysis/panels/engineLines/engine-lines.tsx';
import { MoveList } from '@/pages/analysis/panels/moveList/move-list.tsx';
import { EvalHistory } from '@/pages/analysis/panels/evalHistory/eval-history.tsx';
import { useLayoutStore } from '@/store/layout.ts';
import { LayoutSidebar } from '@/pages/analysis/layout-sidebar.tsx';
import { Layout, LayoutItem, Panel, SelectedLayouts } from '@/types/layout';
import React from 'react';

export const panels: Record<Panel, React.ReactNode> = {
  chessboard: <ChessboardPanel />,
  engineInterpretation: <EngineInterpretation />,
  engineLines: <EngineLines />,
  moveList: <MoveList />,
  evalHistory: <EvalHistory />,
};

const hasSelectedPanels = (selectedLayouts: SelectedLayouts, layout: Layout, items: LayoutItem[]): boolean => {
  return items.some((item) => selectedLayouts[item] !== null && layout[item].length > 0);
};

export const Analysis = () => {
  const { layout, selectedLayouts } = useLayoutStore();

  return (
    <div className="h-full w-full flex">
      <DndProvider backend={HTML5Backend}>
        <div className="flex px-[1px] pb-[1px] w-11 flex-col border-r h-full">
          <LayoutSidebar which="topLeft" justify="start" />
          <LayoutSidebar which="bottomLeft" justify="end" />
        </div>
        <ResizablePanelGroup direction="horizontal">
          {hasSelectedPanels(selectedLayouts, layout, ['topLeft', 'bottomLeft']) && (
            <ResizablePanel defaultSize={50} minSize={15} id="leftPanel" order={1}>
              <ResizablePanelGroup direction="vertical">
                {selectedLayouts.topLeft !== null && layout.topLeft.length > 0 && (
                  <ResizablePanel id="topLeft" defaultSize={50} minSize={15} order={2}>
                    {panels[layout.topLeft[selectedLayouts.topLeft]]}
                  </ResizablePanel>
                )}

                {selectedLayouts.topLeft !== null &&
                  selectedLayouts.bottomLeft !== null &&
                  layout.topLeft.length > 0 &&
                  layout.bottomLeft.length > 0 && <ResizableHandle withHandle />}

                {selectedLayouts.bottomLeft !== null && layout.bottomLeft.length > 0 && (
                  <ResizablePanel id="bottomLeft" defaultSize={50} minSize={15} order={3}>
                    {panels[layout.bottomLeft[selectedLayouts.bottomLeft]]}
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
          )}

          {hasSelectedPanels(selectedLayouts, layout, ['topLeft', 'bottomLeft']) &&
            hasSelectedPanels(selectedLayouts, layout, ['topRight', 'bottomRight']) && <ResizableHandle withHandle />}

          {hasSelectedPanels(selectedLayouts, layout, ['topRight', 'bottomRight']) && (
            <ResizablePanel defaultSize={50} minSize={15} id="rightPanel" order={4}>
              <ResizablePanelGroup direction="vertical">
                {selectedLayouts.topRight !== null && layout.topRight.length > 0 && (
                  <ResizablePanel id="topRight" defaultSize={50} minSize={15} order={5}>
                    {panels[layout.topRight[selectedLayouts.topRight]]}
                  </ResizablePanel>
                )}

                {selectedLayouts.topRight !== null &&
                  selectedLayouts.bottomRight !== null &&
                  layout.topRight.length > 0 &&
                  layout.bottomRight.length > 0 && <ResizableHandle withHandle />}

                {selectedLayouts.bottomRight !== null && layout.bottomRight.length > 0 && (
                  <ResizablePanel id="bottomRight" defaultSize={50} minSize={15} order={6}>
                    {panels[layout.bottomRight[selectedLayouts.bottomRight]]}
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
        <div className="px-[1px] pb-[1px] w-11 flex flex-col border-l h-full">
          <LayoutSidebar which="topRight" justify="start" />
          <LayoutSidebar which="bottomRight" justify="end" />
        </div>
      </DndProvider>
    </div>
  );
};
