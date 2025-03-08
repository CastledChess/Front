import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { Analysis as AnalysisType } from '@/types/analysis.ts';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Database } from '@/pages/analysis/panels/database/database.tsx';
import { MoveList } from '@/pages/analysis/panels/moveList/move-list.tsx';
import { EvalHistory } from '@/pages/analysis/panels/evalHistory/eval-history.tsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useParams } from 'react-router-dom';
import { useAnalysisStore } from '@/store/analysis.ts';
import { getAnalysisById } from '@/api/analysis.ts';
import { Controls } from '@/pages/analysis/panels/controls/controls.tsx';
import { ChessboardPanel } from '@/pages/analysis/panels/chessboard/chessboard-panel.tsx';
import { Interpretation } from './panels/interpretation/interpretation';
import { isMobile } from 'react-device-detect';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.tsx';
import { defaultLayout, useLayoutStore } from '@/store/layout.ts';
import { Panel } from '@/types/layout.ts';
import dropRight from 'lodash/dropRight';
import {
  Mosaic,
  MosaicWindow,
  createExpandUpdate,
  MosaicPath,
  updateTree,
  MosaicNode,
  getPathToCorner,
  Corner,
  getNodeAtPath,
  MosaicParent,
  MosaicDirection,
  getOtherDirection,
  createRemoveUpdate,
  createHideUpdate,
  getLeaves,
  createBalancedTreeFromLeaves,
} from 'react-mosaic-component';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { panelIcons, panels, panelTitles } from '@/data/layout.tsx';
import { useTheme } from '@/components/theme-provider.tsx';

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
  const panelsPaths = useRef<Map<Panel, MosaicPath>>(new Map());
  const hiddenPanels = useRef<Map<Panel, MosaicPath>>(new Map());
  const [renderedInWindow, setRenderedInWindow] = useState<Map<Panel, MosaicPath>>(new Map());

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

  const handleSeparateWindowClick = (id: Panel, path: MosaicPath) => {
    const hideUpdate = createHideUpdate(path);

    setRenderedInWindow((prev) => new Map(prev.set(id, path)));

    setLayout((layout) => layout && (updateTree(layout, [hideUpdate]) as MosaicNode<Panel>));
  };

  const handleRemovePanel = (panel: Panel) => {
    const path = panelsPaths.current.get(panel);

    if (!path) return;

    const hideUpdate = createRemoveUpdate(layout, path);

    hiddenPanels.current.set(panel, path);

    setLayout((layout) => layout && updateTree(layout, [hideUpdate]));
  };

  const handleCloseWindow = (id: Panel) => {
    const path = renderedInWindow.get(id);

    if (!path) return;

    setRenderedInWindow((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });

    const expandUpdate = createExpandUpdate(path, 50);

    setLayout((layout) => layout && (updateTree(layout, [expandUpdate]) as MosaicNode<Panel>));
  };

  const handleResetLayout = () => {
    setLayout(defaultLayout);
  };

  const addToTopRight = (id: Panel) => {
    hiddenPanels.current.delete(id);

    if (!layout) return setLayout(id);

    const path = getPathToCorner(layout, Corner.TOP_RIGHT);
    const parent = getNodeAtPath(layout, dropRight(path)) as unknown as MosaicParent<Panel>;
    const destination = getNodeAtPath(layout, path) as MosaicNode<Panel>;
    const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : 'row';

    const first = direction === 'row' ? destination : id;
    const second = direction === 'row' ? id : destination;

    const newLayout = updateTree(layout, [
      {
        path,
        spec: {
          $set: {
            direction,
            first,
            second,
          },
        },
      },
    ]);

    setLayout(newLayout);
  };

  const balanceLayout = () => {
    const leaves = getLeaves(layout);

    setLayout(createBalancedTreeFromLeaves(leaves));
  };

  return (
    <div className="h-full w-full flex">
      {Array.from(renderedInWindow.entries()).map(([key, value]) =>
        value ? (
          <RenderInWindow onClose={() => handleCloseWindow(key)} key={key}>
            {panels[key]}
          </RenderInWindow>
        ) : null,
      )}

      <DndProvider backend={HTML5Backend}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={40} order={0}>
            <ChessboardPanel />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={40} order={0} className="bg-secondary-bg/30">
            <div className="flex w-full shrink-0 p-[6px] pb-0">
              <div className="flex gap-1 w-full bg-secondary-bg justify-end rounded-lg">
                <Button variant="ghost" className="hover:bg-foreground/5 h-8 rounded" onClick={handleResetLayout}>
                  <Icon icon="iconamoon:do-undo" />
                  Reset
                </Button>

                <Button variant="ghost" className="hover:bg-foreground/5 h-8 rounded" onClick={balanceLayout}>
                  <Icon icon="mynaui:layout" />
                  Balance
                </Button>

                {hiddenPanels.current.size > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hover:bg-foreground/5 h-8 rounded">
                        <Icon icon="fluent:panel-left-48-filled" /> Panels
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuGroup>
                        {hiddenPanels.current
                          .entries()
                          .toArray()
                          .map(([panel]) => {
                            return (
                              <DropdownMenuItem key={panel} onClick={() => addToTopRight(panel)}>
                                {panelTitles[panel]}
                              </DropdownMenuItem>
                            );
                          })}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <div className="flex w-full flex-1 h-[calc(100%-3rem)]">
              <Mosaic<Panel>
                value={layout}
                initialValue={layout}
                onRelease={setLayout}
                onChange={setLayout}
                renderTile={(id, path) => (
                  <MosaicWindow<Panel>
                    path={path}
                    ref={() => panelsPaths.current.set(id, path)}
                    renderPreview={() => <div />}
                    renderToolbar={() => (
                      <div className="flex h-full items-center px-2 py-1 gap-2 rounded-t-lg w-full bg-secondary-bg">
                        <PanelToolbar
                          handleRemovePanel={handleRemovePanel}
                          handleSeparateWindowClick={() => handleSeparateWindowClick(id, path)}
                          id={id}
                        />
                      </div>
                    )}
                    title={panelTitles[id]}
                  >
                    {panels[id]}
                  </MosaicWindow>
                )}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DndProvider>
    </div>
  );
};

const PanelToolbar = ({
  id,
  handleRemovePanel,
  handleSeparateWindowClick,
}: {
  id: Panel;
  handleRemovePanel: (id: Panel) => void;
  handleSeparateWindowClick: () => void;
}) => {
  return (
    <>
      <Icon className="text-foreground/70" icon={panelIcons[id]} />
      <p>{panelTitles[id]}</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="ml-auto px-1 text-foreground/50 h-full">
            <Icon icon="ph:dots-three-bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>{panelTitles[id]}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSeparateWindowClick}>
              Open in new window
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" className="px-1 text-foreground/50 h-full" onClick={() => handleRemovePanel(id)}>
        <Icon icon="mdi:close" />
      </Button>
    </>
  );
};

const RenderInWindow = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const newWindow = useRef<Window | null>(null);

  function copyStyles(src: Document, dest: Document) {
    Array.from(src.styleSheets).forEach((styleSheet) => {
      const styleElement = styleSheet.ownerNode?.cloneNode(true);

      dest.head.appendChild(styleElement!);
    });
    Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
  }

  useEffect(() => {
    setContainer(document.createElement('div'));
  }, []);

  const { theme } = useTheme();

  useEffect(() => {
    if (container) {
      newWindow.current = window.open('', '', 'width=600,height=400,left=200,top=200');
      if (!newWindow.current) return;

      newWindow.current.document.body.className = theme;
      newWindow.current.document.body.appendChild(container);

      const curWindow = newWindow.current;

      copyStyles(document, curWindow.document);

      newWindow.current.onbeforeunload = onClose;

      return () => {
        curWindow.close();
      };
    }
  }, [container]);

  return container && createPortal(children, container);
};
