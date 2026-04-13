import { Draggable } from '@hello-pangea/dnd';
import { Calendar, MapPin } from 'lucide-react';

const ApplicationCard = ({ application, index, onClick }) => {
  return (
    <Draggable draggableId={application._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded-xl border p-3 cursor-pointer transition-shadow
            ${snapshot.isDragging
              ? 'shadow-lg border-blue-300'
              : 'border-gray-200 hover:shadow-md hover:border-gray-300'}`}
        >
          <p className="font-medium text-gray-900 text-sm">{application.company}</p>
          <p className="text-gray-500 text-xs mt-0.5">{application.role}</p>

          {application.seniority !== 'Not Specified' && (
            <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
              {application.seniority}
            </span>
          )}

          {application.location && (
            <div className="flex items-center gap-1 mt-2">
              <MapPin size={11} className="text-gray-400" />
              <span className="text-xs text-gray-400">{application.location}</span>
            </div>
          )}

          <div className="flex items-center gap-1 mt-1">
            <Calendar size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">
              {new Date(application.dateApplied).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short'
              })}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ApplicationCard;