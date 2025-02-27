import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Analysis as AnalysisType } from '@/types/analysis.ts';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Database } from '@/pages/analysis/panels/database/database.tsx';
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
import { Interpretation } from './panels/interpretation/interpretation';

/**
 * A record that maps panel names to their corresponding React components.
 *
 * @type {Record<Panel, React.ReactNode>}
 * @property {React.ReactNode} database - The component for the database panel.
 * @property {React.ReactNode} engineLines - The component for the engine lines panel.
 * @property {React.ReactNode} moveList - The component for the move list panel.
 * @property {React.ReactNode} evalHistory - The component for the evaluation history panel.
 */
export const panels: Record<Panel, React.ReactNode> = {
  database: <Database />,
  engineLines: <EngineLines />,
  moveList: <MoveList />,
  evalHistory: <EvalHistory />,
  interpretation: <Interpretation />,
};

/**
 * Checks if there are any selected panels in the given layout.
 *
 * @param selectedLayouts - An object representing the selected layouts.
 * @param layout - An object representing the layout configuration.
 * @param items - An array of layout items to check.
 * @returns A boolean indicating whether any of the specified items have selected panels.
 */
const hasSelectedPanels = (selectedLayouts: SelectedLayouts, layout: Layout, items: LayoutItem[]): boolean => {
  return items.some((item) => selectedLayouts[item] !== null && layout[item].length > 0);
};

/**
 * The `Analysis` component is responsible for rendering the analysis page.
 * It fetches the analysis data based on the `id` parameter from the URL and displays
 * a layout with draggable and resizable panels.
 *
 * @component
 * @returns {JSX.Element | null} The rendered analysis page or null if analysis data is not available.
 *
 * @remarks
 * This component uses several custom hooks and components:
 * - `useLayoutStore` to get the layout and selected layouts.
 * - `useAnalysisStore` to get and set the analysis data.
 * - `useParams` to get the `id` parameter from the URL.
 * - `useEffect` to fetch the analysis data when the `id` changes.
 *
 * The layout consists of a main panel with a chessboard and optional side panels
 * that can be resized and rearranged using the `ResizablePanelGroup` and `ResizablePanel` components.
 * The `DndProvider` is used to enable drag-and-drop functionality.
 *
 * @example
 * ```tsx
 * import { Analysis } from './analysis';
 *
 * const App = () => (
 *   <div>
 *     <Analysis />
 *   </div>
 * );
 * ```
 */
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

  return (
    <div className="h-full w-full flex">
      <DndProvider backend={HTML5Backend}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={20} order={1}>
            <Controls />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={40} order={2}>
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
