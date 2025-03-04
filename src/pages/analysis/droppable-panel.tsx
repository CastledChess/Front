import React from 'react';
import { ResizablePanel } from '@/components/ui/resizable.tsx';
import { DragItem, LayoutItem } from '@/types/layout.ts';
import { useLayoutStore } from '@/store/layout.ts';
import { useDrop } from 'react-dnd';
import { cn } from '@/lib/utils.ts';

/**
 * A component that wraps a `ResizablePanel` and provides drag-and-drop functionality
 * for layout items. It uses the `useDrop` hook from `react-dnd` to handle dropping
 * items into the panel and updating the layout state accordingly.
 *
 * @param {Object} props - The props for the component.
 * @param {LayoutItem} props.id - The unique identifier for the layout item.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the panel.
 * @param {React.ComponentPropsWithoutRef<typeof ResizablePanel>} props - Additional props to be passed to the `ResizablePanel`.
 *
 * @returns {JSX.Element} The rendered `DroppablePanel` component.
 */
export const DroppablePanel = ({
  id,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ResizablePanel> & {
  id: LayoutItem;
  children: React.ReactNode;
}) => {
  const { layout, movePanel, setSelectedLayouts } = useLayoutStore();

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
      const hoverIndex = layout[id].length; // Drop at the end of the list

      // Only move if the item is not already in the target list
      if (dragItem.which !== id) {
        movePanel(dragItem.which, id, dragItem.id, dragIndex, hoverIndex);
        dragItem.which = id;
      }
    },
    drop: (dragItem: DragItem) => {
      setSelectedLayouts((selectedLayouts) => ({
        ...selectedLayouts,
        [id]: layout[id].indexOf(dragItem.id),
      }));
    },
  });

  const isActive: boolean = canDrop && isOver;

  return (
    <ResizablePanel {...props} className="h-full w-full">
      <div ref={drop} className={cn('h-full w-full', isActive && 'bg-primary/10')}>
        {children}
      </div>
    </ResizablePanel>
  );
};
