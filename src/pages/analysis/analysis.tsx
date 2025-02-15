import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Analysis as AnalysisType } from '@/types/analysis.ts';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EngineInterpretation } from '@/pages/analysis/panels/engineInterpretation/engine-interpretation.tsx';
import { EngineLines } from '@/pages/analysis/panels/engineLines/engine-lines.tsx';
import { MoveList } from '@/pages/analysis/panels/moveList/move-list.tsx';
import { EvalHistory } from '@/pages/analysis/panels/evalHistory/eval-history.tsx';
import { useLayoutStore } from '@/store/layout.ts';
import { LayoutSidebar } from '@/pages/analysis/layout-sidebar.tsx';
import { Layout, LayoutItem, Panel, SelectedLayouts } from '@/types/layout';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAnalysisStore } from '@/store/analysis.ts';
import { getAnalysisById } from '@/api/analysis.ts';
import { Controls } from '@/pages/analysis/panels/controls/controls.tsx';
import { ChessboardPanel } from '@/pages/analysis/panels/chessboard/chessboard-panel.tsx';

export const panels: Record<Panel, React.ReactNode> = {
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
  const { analysis, setAnalysis } = useAnalysisStore();
  const { id } = useParams();

  useEffect(() => {
    if (analysis?.id == id) return;

    // Fetch analysis
    const fetchAnalysis = async () => {
      try {
        const res = await getAnalysisById(id as string);

        setAnalysis(res.data as AnalysisType);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalysis();
  }, [id, setAnalysis]);

  if (!analysis) return null;

  console.log(analysis);

  return (
    <div className="h-full w-full flex">
      <DndProvider backend={HTML5Backend}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={20} order={1}>
            <Controls />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={50} order={2}>
            <ChessboardPanel />
          </ResizablePanel>

          {hasSelectedPanels(selectedLayouts, layout, ['topRight', 'bottomRight']) && <ResizableHandle withHandle />}

          {hasSelectedPanels(selectedLayouts, layout, ['topRight', 'bottomRight']) && (
            <ResizablePanel defaultSize={50} minSize={15} id="rightPanel" order={3}>
              <ResizablePanelGroup direction="vertical">
                {selectedLayouts.topRight !== null && layout.topRight.length > 0 && (
                  <ResizablePanel id="topRight" defaultSize={50} minSize={15} order={4}>
                    {panels[layout.topRight[selectedLayouts.topRight]]}
                  </ResizablePanel>
                )}

                {selectedLayouts.topRight !== null &&
                  selectedLayouts.bottomRight !== null &&
                  layout.topRight.length > 0 &&
                  layout.bottomRight.length > 0 && <ResizableHandle withHandle />}

                {selectedLayouts.bottomRight !== null && layout.bottomRight.length > 0 && (
                  <ResizablePanel id="bottomRight" defaultSize={50} minSize={15} order={5}>
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
