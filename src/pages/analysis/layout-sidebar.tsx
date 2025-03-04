import { useLayoutStore } from '@/store/layout.ts';
import { useDragDropManager, useDrop } from 'react-dnd';
import { DragItem, LayoutItem } from '@/types/layout.ts';
import { cn } from '@/lib/utils.ts';
import { LayoutSidebarItem } from '@/pages/analysis/layout-sidebar-item.tsx';

type LayoutSidebarProps = {
  which: LayoutItem;
  justify?: 'start' | 'end' | 'center';
};

/**
 * LayoutSidebar component is responsible for rendering a sidebar layout that supports drag-and-drop functionality.
 * It allows items to be moved between different sections of the layout.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.justify - The CSS justify-content property to align the sidebar content.
 * @param {string} props.which - The identifier for the current sidebar section.
 *
 * @returns {JSX.Element} The rendered sidebar layout component.
 *
 * @component
 *
 * @example
 * // Usage example:
 * <LayoutSidebar justify="center" which="leftSidebar" />
 *
 * @typedef {Object} LayoutSidebarProps
 * @property {string} justify - The CSS justify-content property to align the sidebar content.
 * @property {string} which - The identifier for the current sidebar section.
 */
export const LayoutSidebar = ({ justify, which }: LayoutSidebarProps) => {
  const { layout, movePanel } = useLayoutStore();

  const manager = useDragDropManager();

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
  const monitorIsDragging = manager.getMonitor().isDragging();

  return (
    <div
      ref={drop}
      className={cn(`flex relative transition p-1 flex-col items-center gap-1 h-1/2 rounded`)}
      style={{
        justifyContent: justify,
      }}
    >
      {monitorIsDragging && (
        <div
          className={cn(
            'z-10 absolute rounded transition top-0 w-64 h-full',
            which.includes('Right') && 'right-full',
            which.includes('Left') && 'left-full',
            isActive && ' bg-primary/10',
          )}
        />
      )}
      {layout[which].map((key) => (
        <LayoutSidebarItem item={key} which={which} key={key} />
      ))}
    </div>
  );
};
