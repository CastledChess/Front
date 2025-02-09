import { useLayoutStore } from '@/store/layout.ts';
import React from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { DragItem, LayoutItem, Panel } from '@/types/layout.ts';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { Icon } from '@iconify/react';
import { panels } from './analysis';

type LayoutSidebarItemProps = {
  item: Panel;
  which: LayoutItem;
};

const panelIcons: Record<keyof typeof panels, string> = {
  engineInterpretation: 'fa6-solid:hands-asl-interpreting',
  engineLines: 'game-icons:striking-arrows',
  moveList: 'ix:move',
  evalHistory: 'fa-solid:chart-line',
};

export const LayoutSidebarItem = ({ item, which }: LayoutSidebarItemProps) => {
  const { layout, movePanel, setSelectedLayouts, selectedLayouts } = useLayoutStore();
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

  const isSelected = selectedLayouts[which] === layout[which].indexOf(item);

  return isDragging ? (
    <div ref={dragPreview} />
  ) : (
    <Button
      onClick={() => {
        // if item is already selected, unselect it
        if (layout[which].indexOf(item) === selectedLayouts[which]) {
          setSelectedLayouts((selectedLayouts) => ({
            ...selectedLayouts,
            [which]: null,
          }));
          return;
        }

        setSelectedLayouts((selectedLayouts) => ({
          ...selectedLayouts,
          [which]: layout[which].indexOf(item),
        }));
      }}
      variant="ghost"
      ref={ref}
      className={cn(
        'cursor-pointer border rounded w-8 h-8 flex justify-center p-0 items-center',
        isSelected && 'bg-castled-accent/15 hover:bg-castled-accent/20 border-castled-accent border',
      )}
    >
      <Icon icon={panelIcons[item]} className="text-foreground/70" />
    </Button>
  );
};
