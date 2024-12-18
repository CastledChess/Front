import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { ChessboardPanel } from '@/pages/analysis/panels/chessboard/chessboard-panel.tsx';
import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { EngineInterpretation } from '@/pages/analysis/panels/engineInterpretation/engine-interpretation.tsx';
import { EngineLines } from '@/pages/analysis/panels/engineLines/engine-lines.tsx';
import { MoveList } from '@/pages/analysis/panels/moveList/move-list.tsx';

type Layout = {
  chessboard: string;
  engineInterpretation: string;
  engineLines: string;
  moveList: string;
};

const panelIcons: Record<keyof Layout, string> = {
  chessboard: 'fa-solid:chess-king',
  engineInterpretation: 'fa6-solid:hands-asl-interpreting',
  engineLines: 'game-icons:striking-arrows',
  moveList: 'ix:move',
};

const panels = {
  chessboard: <ChessboardPanel />,
  engineInterpretation: <EngineInterpretation />,
  engineLines: <EngineLines />,
  moveList: <MoveList />,
};

export const Analysis = () => {
  const [layout, setLayout] = useState<Layout>({
    chessboard: 'topLeft',
    engineInterpretation: 'bottomLeft',
    engineLines: 'bottomRight',
    moveList: 'bottomRight',
  });

  const onDrop = (item: { id: string }, which: string) => {
    setLayout((prev) => ({ ...prev, [item.id]: which }));
  };

  const topLeftPanels = Object.keys(layout).filter((key) => layout[key as keyof Layout] === 'topLeft');
  const bottomLeftPanels = Object.keys(layout).filter((key) => layout[key as keyof Layout] === 'bottomLeft');
  const topRightPanels = Object.keys(layout).filter((key) => layout[key as keyof Layout] === 'topRight');
  const bottomRightPanels = Object.keys(layout).filter((key) => layout[key as keyof Layout] === 'bottomRight');

  return (
    <div className="h-full w-full flex">
      <DndProvider backend={HTML5Backend}>
        <div className="flex px-[1px] pb-[1px] w-11 flex-col border-r h-full">
          <LayoutSidebar layout={layout} which="topLeft" onDrop={onDrop} justify="start" />
          <LayoutSidebar layout={layout} which="bottomLeft" onDrop={onDrop} justify="end" />
        </div>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={15} id="leftPanel" order={1}>
            <ResizablePanelGroup direction="vertical">
              {topLeftPanels.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel minSize={15} key={key} id={key} order={1 + index}>
                    {panels[key as keyof Layout]}
                  </ResizablePanel>
                  {index < topLeftPanels.length - 1 && topLeftPanels.length > 1 && <ResizableHandle withHandle />}
                </React.Fragment>
              ))}

              {topLeftPanels.length > 0 && bottomLeftPanels.length > 0 && <ResizableHandle withHandle />}

              {bottomLeftPanels.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel minSize={15} key={key} order={1 + topLeftPanels.length + index}>
                    {panels[key as keyof Layout]}
                  </ResizablePanel>
                  {index < bottomLeftPanels.length - 1 && bottomLeftPanels.length > 1 && <ResizableHandle withHandle />}
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={50}
            minSize={15}
            id="rightPanel"
            order={2 + topLeftPanels.length + bottomLeftPanels.length}
          >
            <ResizablePanelGroup direction="vertical">
              {topRightPanels.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel
                    minSize={15}
                    key={key}
                    id={key}
                    order={2 + topLeftPanels.length + bottomLeftPanels.length + index}
                  >
                    {panels[key as keyof Layout]}
                  </ResizablePanel>
                  {index < topRightPanels.length - 1 && topRightPanels.length > 1 && <ResizableHandle withHandle />}
                </React.Fragment>
              ))}

              {bottomRightPanels.length > 0 && topRightPanels.length > 0 && <ResizableHandle withHandle />}

              {bottomRightPanels.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel
                    minSize={15}
                    key={key}
                    id={key}
                    order={2 + topLeftPanels.length + bottomLeftPanels.length + topRightPanels.length + index}
                  >
                    {panels[key as keyof Layout]}
                  </ResizablePanel>
                  {index < bottomRightPanels.length - 1 && bottomRightPanels.length > 1 && (
                    <ResizableHandle withHandle />
                  )}
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
        <div className="px-[1px] pb-[1px] w-11 flex flex-col border-l h-full">
          <LayoutSidebar layout={layout} which="topRight" onDrop={onDrop} justify="start" />
          <LayoutSidebar layout={layout} which="bottomRight" onDrop={onDrop} justify="end" />
        </div>
      </DndProvider>
    </div>
  );
};

type LayoutSidebarProps = {
  which: string;
  layout: Layout;
  onDrop: (item: { id: string }, which: string) => void;
  justify?: 'start' | 'end' | 'center';
};

export const LayoutSidebar = ({ layout, onDrop, justify, which }: LayoutSidebarProps) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'layoutItem',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (item: { id: string }) => onDrop(item, which),
  }));

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop}
      className={cn(
        `flex transition p-1 flex-col items-center gap-1 h-1/2 rounded`,
        isActive && 'ring-1 ring-castled-accent/50 bg-castled-accent/10',
      )}
      style={{
        justifyContent: justify,
      }}
    >
      {Object.keys(layout)
        .filter((key) => layout[key as keyof Layout] === which)
        .map((key) => (
          <LayoutSidebarItem item={key} key={key} />
        ))}
    </div>
  );
};

type LayoutSidebarItemProps = {
  item: string;
};

export const LayoutSidebarItem = ({ item }: LayoutSidebarItemProps) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'layoutItem',
    item: { id: item },
    options: {
      dropEffect: 'guards',
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <Button
      variant="ghost"
      ref={drag}
      className="cursor-pointer border rounded w-8 h-8 flex justify-center p-0 items-center"
    >
      <Icon icon={panelIcons[item as keyof typeof panelIcons]} className="text-foreground/70" />
    </Button>
  );
};
