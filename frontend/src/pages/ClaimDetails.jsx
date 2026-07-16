import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Printer, 
  Car, 
  User, 
  FileText, 
  ShieldAlert, 
  Coins, 
  Percent, 
  AlertTriangle,
  CalendarCheck2,
  Edit
} from 'lucide-react';
import { api } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

/**
 * Returns the target cost range based on the damage classification.
 */
const getCostRange = (damageType) => {
  const type = (damageType || '').toLowerCase();
  if (type.includes('front bumper')) return '₹15,000–₹30,000';
  if (type.includes('scratch')) return '₹2,000–₹8,000';
  if (type.includes('windshield')) return '₹8,000–₹20,000';
  if (type.includes('rear bumper')) return '₹12,000–₹25,000';
  if (type.includes('headlight')) return '₹4,000–₹12,000';
  return '₹5,000–₹15,000';
};

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    damageType: '',
    severity: 'Medium',
    repairCost: 0,
    recommendation: '',
    fraudRisk: 'Low'
  });

  // Construct absolute URL for uploads
  const backendBaseURL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:5000';

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const response = await api.get(`/claims/${id}`);
        setClaim(response.data.data);
      } catch (err) {
        console.error('Error fetching claim details:', err);
        showToast('Failed to load claim report.', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetails();
  }, [id, navigate, showToast]);

  // Synchronize edit form fields when claim is loaded
  useEffect(() => {
    if (claim) {
      setEditFormData({
        damageType: claim.damageType || 'Front Bumper Dent',
        severity: claim.severity || 'Medium',
        repairCost: claim.repairCost || 0,
        recommendation: claim.recommendation || '',
        fraudRisk: claim.fraudRisk || 'Low'
      });
    }
  }, [claim, isEditModalOpen]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/claims/${claim._id}`, editFormData);
      if (response.data.success) {
        showToast('Assessment report adjusted successfully', 'success');
        setClaim(response.data.data);
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to update claim assessment', err);
      showToast(err.response?.data?.message || 'Error updating assessment', 'error');
    }
  };

  const handleDeleteClaim = async () => {
    setDeleting(true);
    try {
      await api.delete(`/claims/${id}`);
      showToast('Claim and image files deleted successfully', 'success');
      navigate('/history');
    } catch (err) {
      console.error('Error deleting claim:', err);
      showToast('Failed to delete claim. Please try again.', 'error');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!claim) return null;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in print:p-0 print:bg-white print:text-black">
      {/* Top Header - Hidden when printing */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-55 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div>
            <h2 className="text-md md:text-lg font-bold text-slate-800 dark:text-slate-100">Claims Report details</h2>
            <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500">ID: {claim._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Print button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-350 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          {/* Adjust button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-350 transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Adjust Report</span>
          </button>
          
          {/* Delete button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-955 dark:hover:bg-rose-950/20 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete Claim</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Uploaded Image */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 print:border-none print:shadow-none">
            <h3 className="text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider mb-3">
              Uploaded Damage Evidence
            </h3>
            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[450px] bg-slate-50 dark:bg-slate-950">
              <img
                src={`${backendBaseURL}${claim.imageUrl}`}
                alt="Claim Damage Evidence"
                className="w-full h-full object-contain mx-auto print:max-h-[300px]"
              />
            </div>
          </Card>
        </div>

        {/* Right Side: Damage report content */}
        <div className="lg:col-span-7 space-y-6 print:col-span-12">
          {/* Vehicle Metadata Summary */}
          <Card className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-500" />
                <span>Owner</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{claim.ownerName}</p>
            </div>
            
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-brand-500" />
                <span>Vehicle Model</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{claim.vehicleModel}</p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-500" />
                <span>Plate Number</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono truncate">{claim.vehicleNumber}</p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                <CalendarCheck2 className="w-3.5 h-3.5 text-brand-500" />
                <span>Created Date</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {new Date(claim.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </Card>

          {/* AI Assessment Report Header */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
              <ShieldAlert className="w-5 h-5 text-brand-500" />
              <span>AI Assessment Report</span>
            </h3>

            {/* Assessment Metrics Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Severity Card */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between h-28">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Severity Level</span>
                <span className={`text-xl font-extrabold w-fit px-3 py-0.5 rounded-full ${
                  claim.severity === 'High' 
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-350' 
                    : claim.severity === 'Medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-350'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350'
                }`}>
                  {claim.severity}
                </span>
              </div>

              {/* Confidence Score */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between h-28">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  <span>Confidence Score</span>
                  <Percent className="w-3.5 h-3.5 text-brand-500" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-slate-855 dark:text-slate-50">{claim.confidence}%</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-brand-500 h-1.5 rounded-full" 
                      style={{ width: `${claim.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Fraud Risk Indicator */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between h-28">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  <span>Fraud Risk</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-brand-500" />
                </div>
                <span className={`text-xl font-extrabold w-fit px-3 py-0.5 rounded-full ${
                  claim.fraudRisk === 'High' 
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 animate-pulse' 
                    : claim.fraudRisk === 'Medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                }`}>
                  {claim.fraudRisk}
                </span>
              </div>
            </div>

            {/* Assessment Details Descriptions */}
            <Card className="space-y-5">
              {/* Damage type & cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Damage Classification
                  </h4>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                    {claim.damageType}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Estimated Repair Cost</span>
                  </h4>
                  <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-450 leading-none">
                    ₹{(claim.repairCost || 0).toLocaleString()}
                  </p>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-1.5 uppercase tracking-wide">
                    Benchmark Range: {getCostRange(claim.damageType)}
                  </span>
                </div>
              </div>

              {/* User Description */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Owner-Reported Incident Log
                </h4>
                <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  "{claim.description}"
                </p>
              </div>

              {/* AI Recommendation */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Assessment Actions & Recommendation
                </h4>
                <div className={`p-4 rounded-xl border flex gap-3 ${
                  claim.fraudRisk === 'High'
                    ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-800 dark:text-rose-200'
                    : 'bg-brand-50/50 border-brand-100 dark:bg-brand-950/20 dark:border-brand-900/40 text-brand-800 dark:text-blue-200'
                }`}>
                  {claim.fraudRisk === 'High' ? (
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 shrink-0 text-brand-500 mt-0.5" />
                  )}
                  <p className="text-xs font-semibold leading-relaxed">
                    {claim.recommendation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Confirm Claim Deletion"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
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
          Are you sure you want to permanently delete this damage assessment report for <strong>{claim.vehicleModel}</strong> ({claim.vehicleNumber})?
          This action will permanently erase the database claim records and clean up the uploaded image from server storage. This action cannot be undone.
        </p>
      </Modal>

      {/* Adjust Report Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Adjust Claim Assessment"
        footer={
          <>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-premium transition-all cursor-pointer"
            >
              Save Adjustments
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {/* Damage Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Damage Classification
            </label>
            <select
              value={editFormData.damageType}
              onChange={(e) => setEditFormData({ ...editFormData, damageType: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            >
              <option value="Front Bumper Dent">Front Bumper Dent</option>
              <option value="Side Door Scratch">Side Door Scratch</option>
              <option value="Broken Windshield">Broken Windshield</option>
              <option value="Rear Bumper Collision">Rear Bumper Collision</option>
              <option value="Broken Headlight">Broken Headlight</option>
            </select>
          </div>

          {/* Severity & Fraud Risk */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Severity Level
              </label>
              <select
                value={editFormData.severity}
                onChange={(e) => setEditFormData({ ...editFormData, severity: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-550 dark:text-slate-500 uppercase tracking-wide">
                Fraud Risk
              </label>
              <select
                value={editFormData.fraudRisk}
                onChange={(e) => setEditFormData({ ...editFormData, fraudRisk: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          {/* Repair Cost */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-550 dark:text-slate-500 uppercase tracking-wide">
              Adjusted Repair Cost (₹)
            </label>
            <input
              type="number"
              value={editFormData.repairCost}
              onChange={(e) => setEditFormData({ ...editFormData, repairCost: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              placeholder="Enter cost value in INR"
              required
            />
          </div>

          {/* Recommendation */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-550 dark:text-slate-500 uppercase tracking-wide">
              Actions & Recommendations
            </label>
            <textarea
              value={editFormData.recommendation}
              onChange={(e) => setEditFormData({ ...editFormData, recommendation: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none"
              placeholder="AI diagnostic override actions details..."
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClaimDetails;
