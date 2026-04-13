import { useState } from 'react';
import { X, Sparkles, Copy, Check } from 'lucide-react';
import { parseJDApi } from '../../api/ai';
import { useCreateApplication } from '../../hooks/useApplications';
import toast from 'react-hot-toast';

const SENIORITY_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'Not Specified'];

const AddApplicationModal = ({ onClose }) => {
  const [step,    setStep]    = useState('paste');
  const [jdText,  setJdText]  = useState('');
  const [parsing, setParsing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Form state
  const [company,          setCompany]          = useState('');
  const [role,             setRole]             = useState('');
  const [jdLink,           setJdLink]           = useState('');
  const [notes,            setNotes]            = useState('');
  const [salaryRange,      setSalaryRange]      = useState('');
  const [seniority,        setSeniority]        = useState('Not Specified');
  const [location,         setLocation]         = useState('');
  const [requiredSkills,   setRequiredSkills]   = useState([]);
  const [niceToHaveSkills, setNiceToHaveSkills] = useState([]);
  const [resumeSuggestions,setResumeSuggestions]= useState([]);

  const createMutation = useCreateApplication();

  const handleParse = async () => {
    if (jdText.trim().length < 50) {
      toast.error('Please paste a longer job description (at least 50 characters)');
      return;
    }
    setParsing(true);
    try {
      const res = await parseJDApi(jdText);
      const { parsedData, resumeSuggestions: suggestions } = res.data.data;

      // Auto-fill form fields with AI-parsed values
      setCompany(parsedData.company || '');
      setRole(parsedData.role || '');
      setLocation(parsedData.location || '');
      setSeniority(parsedData.seniority || 'Not Specified');
      setRequiredSkills(parsedData.requiredSkills || []);
      setNiceToHaveSkills(parsedData.niceToHaveSkills || []);
      setResumeSuggestions(suggestions || []);

      toast.success('Job description parsed!');
      setStep('form');
    } catch {
      toast.error('AI parsing failed. You can fill in the details manually.');
      setStep('form');
    } finally {
      setParsing(false);
    }
  };

  const handleCopy = async (text, idx) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Copied!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company || !role) { toast.error('Company and role are required'); return; }

    await createMutation.mutateAsync({
      company, role, jdLink, notes, salaryRange,
      seniority, location, requiredSkills,
      niceToHaveSkills, resumeSuggestions,
      status: 'Applied',
      dateApplied: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Application</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Step 1 — Paste JD */}
        {step === 'paste' && (
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">AI-powered parsing</span>
              </div>
              <p className="text-sm text-blue-700">
                Paste the full job description. AI will extract the company, role, skills,
                and generate resume bullet points tailored to the role.
              </p>
            </div>

            <textarea
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the full job description here..."
            />

            <div className="flex gap-3">
              <button
                onClick={handleParse}
                disabled={parsing}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {parsing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Parsing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Parse with AI
                  </>
                )}
              </button>
              <button
                onClick={() => setStep('form')}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Fill manually
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* AI Resume Suggestions */}
            {resumeSuggestions.length > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={15} className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">AI Resume Suggestions</span>
                </div>
                <ul className="space-y-2">
                  {resumeSuggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-green-800 bg-white rounded-lg p-3 border border-green-100">
                      <span className="flex-1">{s}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(s, idx)}
                        className="shrink-0 p-1 hover:bg-green-100 rounded transition-colors"
                      >
                        {copiedIdx === idx
                          ? <Check size={14} className="text-green-600" />
                          : <Copy size={14} className="text-green-600" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Google" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input value={role} onChange={e => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Software Engineer" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seniority</label>
                <select value={seniority} onChange={e => setSeniority(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {SENIORITY_LEVELS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Remote / Bangalore" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">JD Link</label>
                <input value={jdLink} onChange={e => setJdLink(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input value={salaryRange} onChange={e => setSalaryRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12–18 LPA" />
              </div>
            </div>

            {requiredSkills.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <div className="flex flex-wrap gap-1.5">
                  {requiredSkills.map(skill => (
                    <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {niceToHaveSkills.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nice to Have</label>
                <div className="flex flex-wrap gap-1.5">
                  {niceToHaveSkills.map(skill => (
                    <span key={skill} className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any notes about this application..." />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={createMutation.isPending}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {createMutation.isPending ? 'Saving...' : 'Save Application'}
              </button>
              <button type="button" onClick={() => setStep('paste')}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddApplicationModal;