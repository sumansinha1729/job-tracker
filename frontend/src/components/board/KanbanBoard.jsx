import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { useUpdateApplication } from '../../hooks/useApplications';

const COLUMNS = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

const KanbanBoard = ({ applications, onCardClick }) => {
  const updateMutation = useUpdateApplication();

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // dropped outside any column
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return; // dropped in same spot

    // Update status to the column it was dropped into
    await updateMutation.mutateAsync({
      id:   draggableId,
      data: { status: destination.droppableId }
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            applications={applications.filter(a => a.status === status)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;