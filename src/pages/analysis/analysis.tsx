import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable.tsx';
import { ChessboardPanel } from '@/pages/analysis/panels/chessboard/chessboard-panel.tsx';
import React from 'react';
import { DndProvider, useDrag, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { EngineInterpretation } from '@/pages/analysis/panels/engineInterpretation/engine-interpretation.tsx';
import { EngineLines } from '@/pages/analysis/panels/engineLines/engine-lines.tsx';
import { MoveList } from '@/pages/analysis/panels/moveList/move-list.tsx';
import { useLayoutStore } from '@/store/layout.ts';
import { LayoutItem, Panel } from '@/types/layout';

const panels: Record<Panel, React.ReactNode> = {
  chessboard: <ChessboardPanel />,
  engineInterpretation: <EngineInterpretation />,
  engineLines: <EngineLines />,
  moveList: <MoveList />,
};

const panelIcons: Record<keyof typeof panels, string> = {
  chessboard: 'fa-solid:chess-king',
  engineInterpretation: 'fa6-solid:hands-asl-interpreting',
  engineLines: 'game-icons:striking-arrows',
  moveList: 'ix:move',
};

export const Analysis = () => {
  const { layout } = useLayoutStore();

  return (
    <div className="h-full w-full flex">
      <DndProvider backend={HTML5Backend}>
        <div className="flex px-[1px] pb-[1px] w-11 flex-col border-r h-full">
          <LayoutSidebar which="topLeft" justify="start" />
          <LayoutSidebar which="bottomLeft" justify="end" />
        </div>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={15} id="leftPanel" order={1}>
            <ResizablePanelGroup direction="vertical">
              {layout.topLeft.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel minSize={15} key={key} id={key} order={1 + index}>
                    {panels[key]}
                  </ResizablePanel>
                  {index < layout.topLeft.length - 1 && layout.topLeft.length > 1 && <ResizableHandle withHandle />}
                </React.Fragment>
              ))}

              {layout.topLeft.length > 0 && layout.bottomLeft.length > 0 && <ResizableHandle withHandle />}

              {layout.bottomLeft.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel minSize={15} key={key} order={1 + layout.topLeft.length + index}>
                    {panels[key]}
                  </ResizablePanel>
                  {index < layout.bottomLeft.length - 1 && layout.bottomLeft.length > 1 && (
                    <ResizableHandle withHandle />
                  )}
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={50}
            minSize={15}
            id="rightPanel"
            order={2 + layout.topLeft.length + layout.bottomLeft.length}
          >
            <ResizablePanelGroup direction="vertical">
              {layout.topRight.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel
                    minSize={15}
                    key={key}
                    id={key}
                    order={2 + layout.topLeft.length + layout.bottomLeft.length + index}
                  >
                    {panels[key]}
                  </ResizablePanel>
                  {index < layout.topRight.length - 1 && layout.topRight.length > 1 && <ResizableHandle withHandle />}
                </React.Fragment>
              ))}

              {layout.bottomRight.length > 0 && layout.topRight.length > 0 && <ResizableHandle withHandle />}

              {layout.bottomRight.map((key, index) => (
                <React.Fragment key={index}>
                  <ResizablePanel
                    minSize={15}
                    key={key}
                    id={key}
                    order={2 + layout.topLeft.length + layout.bottomLeft.length + layout.topRight.length + index}
                  >
                    {panels[key]}
                  </ResizablePanel>
                  {index < layout.bottomRight.length - 1 && layout.bottomRight.length > 1 && (
                    <ResizableHandle withHandle />
                  )}
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
        <div className="px-[1px] pb-[1px] w-11 flex flex-col border-l h-full">
          <LayoutSidebar which="topRight" justify="start" />
          <LayoutSidebar which="bottomRight" justify="end" />
        </div>
      </DndProvider>
    </div>
  );
};

type LayoutSidebarProps = {
  which: LayoutItem;
  justify?: 'start' | 'end' | 'center';
};

export const LayoutSidebar = ({ justify, which }: LayoutSidebarProps) => {
  const { layout, movePanel } = useLayoutStore();

  const [{ canDrop, isOver }, drop] = useDrop<DragItem, void, { canDrop: boolean; isOver: boolean }>({
    accept: 'layoutItem',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (dragItem: DragItem, monitor) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      const dragIndex = layout[dragItem.which].indexOf(dragItem.id);
      const hoverIndex = layout[which].length; // Drop at the end of the list

      // Only move if the item is not already in the target list
      if (dragItem.which !== which) {
        movePanel(dragItem.which, which, dragItem.id, dragIndex, hoverIndex);
        dragItem.which = which;
      }
    },
  });
  const isActive: boolean = canDrop && isOver;

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
      {layout[which].map((key) => (
        <LayoutSidebarItem item={key} which={which} key={key} />
      ))}
    </div>
  );
};

type LayoutSidebarItemProps = {
  item: Panel;
  which: LayoutItem;
};

type DragItem = {
  type: 'layoutItem';
  id: Panel;
  which: LayoutItem;
};

export const LayoutSidebarItem = ({ item, which }: LayoutSidebarItemProps) => {
  const { layout, movePanel } = useLayoutStore();
  const ref = React.useRef<HTMLButtonElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'layoutItem',
    item: { id: item, which, type: 'layoutItem' },
    options: {
      dropEffect: 'guards',
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop<DragItem>({
    accept: 'layoutItem',
    hover: (dragItem: DragItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = layout[dragItem.which].indexOf(dragItem.id);
      const hoverIndex = layout[which].indexOf(item);

      // Don't replace items with themselves
      if (dragItem.id === item) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      )
        return;

      movePanel(dragItem.which, which, dragItem.id, dragIndex, hoverIndex);

      // Avoid flickering when hovering over the dragged item
      dragItem.which = which;
    },
  });

  drag(drop(ref));

  return isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <Button
      variant="ghost"
      ref={ref}
      className="cursor-pointer border rounded w-8 h-8 flex justify-center p-0 items-center"
    >
      <Icon icon={panelIcons[item]} className="text-foreground/70" />
    </Button>
  );
};
