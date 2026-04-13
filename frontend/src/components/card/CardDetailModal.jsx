import { useState } from 'react';
import { X, Trash2, Copy, Check } from 'lucide-react';
import { useUpdateApplication, useDeleteApplication } from '../../hooks/useApplications';
import toast from 'react-hot-toast';

const STATUSES = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

const CardDetailModal = ({ application, onClose }) => {
  const [notes,     setNotes]     = useState(application.notes || '');
  const [status,    setStatus]    = useState(application.status);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: application._id, data: { notes, status } });
      onClose();
    } catch {
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteMutation.mutateAsync(application._id);
      onClose();
    } catch {
      toast.error('Failed to delete application. Please try again.');
    }
  };

  const handleCopy = async (text, idx) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">{application.company}</h2>
            <p className="text-sm text-gray-500">{application.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDelete} disabled={deleteMutation.isPending}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} className="text-red-500" />
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">

          {/* Status selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                    ${status === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {application.location && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-gray-700">{application.location}</p>
              </div>
            )}
            {application.seniority !== 'Not Specified' && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Seniority</p>
                <p className="text-gray-700">{application.seniority}</p>
              </div>
            )}
            {application.salaryRange && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Salary Range</p>
                <p className="text-gray-700">{application.salaryRange}</p>
              </div>
            )}
          </div>

          {/* Required skills */}
          {application.requiredSkills?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {application.requiredSkills.map(s => (
                  <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Resume suggestions */}
          {application.resumeSuggestions?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Resume Suggestions</p>
              <ul className="space-y-2">
                {application.resumeSuggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 rounded-lg p-3">
                    <span className="flex-1">{s}</span>
                    <button type="button" onClick={() => handleCopy(s, i)} className="shrink-0">
                      {copiedIdx === i
                        ? <Check size={14} className="text-green-600" />
                        : <Copy size={14} className="text-gray-400 hover:text-gray-600" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes..." />
          </div>

          <button onClick={handleSave} disabled={updateMutation.isPending}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;