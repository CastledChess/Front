import { useLayoutStore } from '@/store/layout.ts';
import { useDrop } from 'react-dnd';
import { DragItem, LayoutItem } from '@/types/layout.ts';
import { cn } from '@/lib/utils.ts';
import { LayoutSidebarItem } from '@/pages/analysis/layout-sidebar-item.tsx';

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
