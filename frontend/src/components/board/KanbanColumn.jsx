import { Droppable } from '@hello-pangea/dnd';
import ApplicationCard from '../card/ApplicationCard';

const COLUMN_COLORS = {
  'Applied':      'bg-blue-500',
  'Phone Screen': 'bg-yellow-500',
  'Interview':    'bg-purple-500',
  'Offer':        'bg-green-500',
  'Rejected':     'bg-red-400',
};

const KanbanColumn = ({ status, applications, onCardClick }) => {
  return (
    <div className="flex flex-col bg-gray-50 rounded-2xl p-3 min-w-[240px] w-64 shrink-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${COLUMN_COLORS[status]}`} />
        <span className="text-sm font-medium text-gray-700">{status}</span>
        <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 min-h-[100px] rounded-xl p-1 transition-colors
              ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
          >
            {applications.map((app, index) => (
              <ApplicationCard
                key={app._id}
                application={app}
                index={index}
                onClick={() => onCardClick(app)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;