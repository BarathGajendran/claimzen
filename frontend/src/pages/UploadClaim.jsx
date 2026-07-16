import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileUp, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import Spinner from '../components/Spinner';

/**
 * Image-Only Upload Claim Page.
 * Auto-submits on file drop/select and displays recent audits.
 */
const UploadClaim = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recentClaims, setRecentClaims] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/claims');
        if (res.data.success) {
          const sorted = res.data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
          setRecentClaims(sorted);
        }
      } catch (err) {
        console.error('Recent claims load error', err);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, []);

  // Helper to submit the file directly to backend API
  const uploadFileDirectly = async (file) => {
    if (!file) return;
    setSubmitting(true);

    const uploadData = new FormData();
    uploadData.append('ownerName', 'Demo Adjuster');
    uploadData.append('vehicleNumber', 'DL-3C-0001');
    uploadData.append('vehicleModel', 'Standard Sedan');
    uploadData.append('insuranceType', 'Comprehensive');
    uploadData.append('description', file.name || 'Vehicle Damage Photo');
    uploadData.append('image', file);

    try {
      const response = await api.post('/claims', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        showToast('Damage analyzed successfully', 'success');
        navigate(`/claims/${response.data.data._id}`);
      } else {
        showToast(response.data.message || 'Error processing upload', 'error');
      }
    } catch (error) {
      console.error('File upload error:', error);
      const msg = error.response?.data?.message || 'Server error processing file upload.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Only image files (JPEG, PNG, WEBP) are supported.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Maximum image size allowed is 5MB.', 'warning');
      return;
    }

    uploadFileDirectly(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in space-y-8 bg-zinc-50 dark:bg-black min-h-[calc(100vh-4rem)]">
      
      {/* Page Title */}
      <div className="space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-950 dark:text-zinc-50">Upload Damage Evidence</h2>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
          Upload an image file to automatically assess collision repairs.
        </p>
      </div>

      <div className="space-y-6">
        {/* Drag & Drop Upload Zone */}
        <Card className="p-6 border border-zinc-200/80 dark:border-zinc-800/80 relative">
          {submitting ? (
            <div className="min-h-56 flex flex-col items-center justify-center space-y-4">
              <Spinner size="lg" />
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200">Analyzing collision image...</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-550">Processing classification models and estimates...</p>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !submitting && fileInputRef.current && fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-56 ${
                isDragOver
                  ? 'border-zinc-950 bg-zinc-50 dark:bg-zinc-850'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={submitting}
              />
              <div className="p-3.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
                  Drag and drop your image, or <span className="text-zinc-500 underline">browse file</span>
                </p>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wide">
                  Supports JPG, PNG, WEBP up to 5MB size
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Audited Claims Area */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Audited Claims</span>
          </h3>

          {loadingRecent ? (
            <div className="flex items-center justify-center p-6 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl">
              <Spinner size="sm" />
            </div>
          ) : recentClaims.length === 0 ? (
            <Card className="p-6 text-center border border-zinc-200/80 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wide">
                No reports processed yet. Drop a vehicle image above to begin.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentClaims.map((claim) => (
                <div
                  key={claim._id}
                  onClick={() => navigate(`/claims/${claim._id}`)}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group h-20"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[8px] font-extrabold text-zinc-400 dark:text-zinc-555 uppercase tracking-wide block truncate">
                      {claim.damageType}
                    </span>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate">
                      {claim.vehicleModel}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 block leading-none pt-0.5">
                      ₹{(claim.repairCost || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-950 dark:group-hover:bg-white text-zinc-400 group-hover:text-white dark:group-hover:text-zinc-950 transition-colors shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UploadClaim;
