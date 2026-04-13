import { useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../hooks/useApplications';
import KanbanBoard from '../components/board/KanbanBoard';
import AddApplicationModal from '../components/card/AddApplicationModal';
import CardDetailModal from '../components/card/CardDetailModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const BoardPage = () => {
  const { user, logout }                             = useAuth();
  const { data: applications, isLoading, isError }   = useApplications();
  const [showAdd,  setShowAdd]                       = useState(false);
  const [selected, setSelected]                      = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Job Tracker</h1>
            <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Application
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Board area */}
      <main className="max-w-screen-xl mx-auto p-6">
        {isLoading && <LoadingSpinner text="Loading your applications..." />}

        {isError && (
          <div className="text-center py-10 text-red-500 text-sm">
            Failed to load applications. Please refresh the page.
          </div>
        )}

        {!isLoading && !isError && applications && (
          applications.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm mb-4">
                No applications yet. Add your first one!
              </p>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add your first application
              </button>
            </div>
          ) : (
            <KanbanBoard
              applications={applications}
              onCardClick={app => setSelected(app)}
            />
          )
        )}
      </main>

      {/* Modals */}
      {showAdd  && <AddApplicationModal onClose={() => setShowAdd(false)} />}
      {selected && <CardDetailModal application={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default BoardPage;