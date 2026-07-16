import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Trash2, 
  Eye, 
  SlidersHorizontal, 
  X, 
  FileText, 
  Car, 
  Plus 
} from 'lucide-react';
import { api } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [insuranceType, setInsuranceType] = useState('All');

  // Deletion Modal state
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [selectedClaimModel, setSelectedClaimModel] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.append('search', search.trim());
      if (severity !== 'All') queryParams.append('severity', severity);
      if (insuranceType !== 'All') queryParams.append('insuranceType', insuranceType);

      const response = await api.get(`/claims?${queryParams.toString()}`);
      setClaims(response.data.data || []);
    } catch (err) {
      console.error('Error fetching claims history:', err);
      showToast('Failed to fetch claims list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Run search when parameters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchClaims();
    }, 400); // Debounce typing search

    return () => clearTimeout(delayDebounceFn);
  }, [search, severity, insuranceType]);

  const openDeleteModal = (id, model) => {
    setSelectedClaimId(id);
    setSelectedClaimModel(model);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClaim = async () => {
    if (!selectedClaimId) return;
    setDeleting(true);
    try {
      await api.delete(`/claims/${selectedClaimId}`);
      showToast('Claim and evidence successfully deleted', 'success');
      // Remove deleted item from client state array
      setClaims(prev => prev.filter(item => item._id !== selectedClaimId));
    } catch (err) {
      console.error('Error deleting claim:', err);
      showToast('Failed to delete claim.', 'error');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedClaimId(null);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSeverity('All');
    setInsuranceType('All');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-md md:text-lg font-bold text-slate-800 dark:text-slate-100">Claims Repository</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, filter, and inspect AI vehicle assessment reports.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-premium transition-all active:scale-95"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>File New Claim</span>
        </Link>
      </div>

      {/* Search & Filter Dashboard Panel */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-350 border-b border-slate-100 dark:border-slate-850 pb-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Search & Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Text Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs transition-all"
              placeholder="Search Owner, Plate or Model..."
            />
          </div>

          {/* Severity filter select */}
          <div>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs transition-all cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Low">Low Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="High">High Severity</option>
            </select>
          </div>

          {/* Insurance Type select */}
          <div>
            <select
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs transition-all cursor-pointer"
            >
              <option value="All">All Coverage Types</option>
              <option value="Comprehensive">Comprehensive</option>
              <option value="Collision">Collision</option>
              <option value="Third-Party">Third-Party</option>
              <option value="Liability">Liability</option>
              <option value="Warranty">Warranty</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(search || severity !== 'All' || insuranceType !== 'All') ? (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-950/20 bg-rose-50/30 hover:bg-rose-50 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-all"
            >
              <X className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      </Card>

      {/* Claims List Table Container */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-405 mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No matching claim entries located in repository database.
            </p>
            {(search || severity !== 'All' || insuranceType !== 'All') && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-brand-500 hover:underline"
              >
                Clear all filters and search again
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-850 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Owner Name</th>
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4">Plate Number</th>
                  <th className="py-3 px-4">Insurance</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Estimated Cost</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                {claims.map((claim) => (
                  <tr 
                    key={claim._id}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-100">
                      {claim.ownerName}
                    </td>
                    <td className="py-4 px-4 text-slate-655 dark:text-slate-400">
                      {claim.vehicleModel}
                    </td>
                    <td className="py-4 px-4 text-slate-550 dark:text-slate-400 font-mono">
                      {claim.vehicleNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {claim.insuranceType}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        claim.severity === 'High' 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-350' 
                          : claim.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-350'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350'
                      }`}>
                        {claim.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                      ₹{(claim.repairCost || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 flex items-center justify-center gap-2">
                      <Link
                        to={`/claims/${claim._id}`}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="View Damage Report"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(claim._id, claim.vehicleModel)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-950/20 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete Claim Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Confirm Claim Deletion"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850 text-xs font-semibold transition-colors"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClaim}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Permanently</span>
                </>
              )}
            </button>
          </>
        }
      >
        <p className="text-xs leading-relaxed">
          Are you sure you want to permanently delete this damage assessment report for <strong>{selectedClaimModel}</strong>?
          This action will permanently erase the database claim records and clean up the uploaded image from server storage. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ClaimHistory;
