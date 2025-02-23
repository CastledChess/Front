import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Analysis as AnalysisType } from '@/types/analysis.ts';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Database } from '@/pages/analysis/panels/database/database.tsx';
import { MoveList } from '@/pages/analysis/panels/moveList/move-list.tsx';
import { EvalHistory } from '@/pages/analysis/panels/evalHistory/eval-history.tsx';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAnalysisStore } from '@/store/analysis.ts';
import { getAnalysisById } from '@/api/analysis.ts';
import { Controls } from '@/pages/analysis/panels/controls/controls.tsx';
import { ChessboardPanel } from '@/pages/analysis/panels/chessboard/chessboard-panel.tsx';
import { Interpretation } from './panels/interpretation/interpretation';
import { isMobile } from 'react-device-detect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx';
import { useLayoutStore } from '@/store/layout.ts';
import { Panel } from '@/types/layout.ts';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { Icon } from '@iconify/react';
import { panelIcons, panels, panelTitles } from '@/data/layout.tsx';
import '@/styles/window-tiling.css';

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
  const { layout, setLayout } = useLayoutStore();
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

  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="h-[100vw] my-4 flex flex-shrink-0">
          <ChessboardPanel />
        </div>
        <Accordion type="single" collapsible className="flex-1 px-2 overflow-y-auto custom-scrollbar">
          <AccordionItem value="intepretation">
            <AccordionTrigger>Interpretation</AccordionTrigger>

            <AccordionContent>
              <Interpretation />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="database">
            <AccordionTrigger>Database</AccordionTrigger>

            <AccordionContent>
              <Database />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="move-list">
            <AccordionTrigger>Move List</AccordionTrigger>

            <AccordionContent>
              <MoveList />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="eval-history">
            <AccordionTrigger>Evaluation History</AccordionTrigger>

            <AccordionContent>
              <EvalHistory />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="sticky bottom-0 z-10 w-full bg-background">
          <Controls />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex">
      <DndProvider backend={HTML5Backend}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={40} order={0}>
            <ChessboardPanel />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={40} order={0} className="bg-secondary-bg/30">
            <Mosaic<Panel>
              value={layout}
              initialValue={layout}
              onChange={setLayout}
              renderTile={(id, path) => (
                <MosaicWindow<Panel>
                  path={path}
                  renderPreview={() => <div />}
                  renderToolbar={() => <PanelToolbar id={id} />}
                  title={panelTitles[id]}
                >
                  {panels[id]}
                </MosaicWindow>
              )}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </DndProvider>
    </div>
  );
};

const PanelToolbar = ({ id }: { id: Panel }) => {
  return (
    <div className="flex h-full items-center px-2 gap-4 rounded-t-lg w-full bg-secondary-bg">
      <Icon icon={panelIcons[id]} /> {panelTitles[id]}
    </div>
  );
};
