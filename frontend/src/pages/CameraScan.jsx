import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, ShieldCheck, Car, Play, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Card } from '../components/Card';
import Spinner from '../components/Spinner';

/**
 * Dedicated Camera Scan View.
 * Viewport guide targets with a subtle scanning pulse overlay.
 */
const CameraScan = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    vehicleNumber: '',
    vehicleModel: '',
    insuranceType: 'Comprehensive',
    description: ''
  });

  const [cameraStream, setCameraStream] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // environment = rear camera, user = front camera
  const [cameraLoading, setCameraLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startCamera = async () => {
    setCameraLoading(true);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera stream access failed:', err);
      showToast('Camera access blocked. Check browser permissions.', 'error');
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (!imagePreview) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [facingMode, imagePreview]);

  const switchCameraFacing = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      
      const ctx = canvas.getContext('2d');
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setImageFile(file);
          setImagePreview(URL.createObjectURL(blob));
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const retakePhoto = () => {
    setImageFile(null);
    setImagePreview(null);
    startCamera();
  };

  const simulateCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    
    // Draw placeholder canvas graphic
    ctx.fillStyle = '#f4f4f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Outer border ring
    ctx.strokeStyle = '#e4e4e7';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Mock target brackets
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath(); ctx.moveTo(30, 60); ctx.lineTo(30, 30); ctx.lineTo(60, 30); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(canvas.width - 60, 30); ctx.lineTo(canvas.width - 30, 30); ctx.lineTo(canvas.width - 30, 60); ctx.stroke();
    
    // Draw text details
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SIMULATED CAMERA EVIDENCE SCAN', canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.fillStyle = '#71717a';
    ctx.font = '11px monospace';
    ctx.fillText('[DEVICE_WEBCAM_SIMULATOR_ACTIVE]', canvas.width / 2, canvas.height / 2 + 15);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `simulated-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setImageFile(file);
        setImagePreview(URL.createObjectURL(blob));
        stopCamera();
        showToast('Simulated capture frame successfully generated.', 'success');
      }
    }, 'image/jpeg', 0.95);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { ownerName, vehicleNumber, vehicleModel, insuranceType, description } = formData;

    if (!ownerName.trim() || !vehicleNumber.trim() || !vehicleModel.trim() || !description.trim()) {
      showToast('Please fill out all claim details', 'warning');
      return;
    }

    if (!imageFile) {
      showToast('Please capture vehicle damage evidence first', 'warning');
      return;
    }

    setSubmitting(true);
    
    const uploadData = new FormData();
    uploadData.append('ownerName', ownerName.trim());
    uploadData.append('vehicleNumber', vehicleNumber.trim().toUpperCase());
    uploadData.append('vehicleModel', vehicleModel.trim());
    uploadData.append('insuranceType', insuranceType);
    uploadData.append('description', description.trim());
    uploadData.append('image', imageFile);

    try {
      const response = await api.post('/claims', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        showToast('Claim scanned and analyzed successfully', 'success');
        navigate(`/claims/${response.data.data._id}`);
      } else {
        showToast(response.data.message || 'Error processing claim scan', 'error');
      }
    } catch (error) {
      console.error('Scan submission error:', error);
      const msg = error.response?.data?.message || 'Server error processing camera upload.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in bg-zinc-55 bg-zinc-50 dark:bg-black min-h-[calc(100vh-4rem)]">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-950 dark:text-zinc-50">AI Claims Scanner</h2>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
          Position vehicle body damage inside the frame guidelines to capture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Area: Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-4 overflow-hidden relative border border-zinc-200/80 dark:border-zinc-800/80">
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-3">
              Damage Viewfinder
            </h3>
            
            {!imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-950 flex flex-col items-center justify-center shadow-lg border border-zinc-900">
                {cameraLoading ? (
                  <Spinner size="lg" color="white" />
                ) : cameraStream ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}`}
                    />
                    
                    {/* Corner Viewfinder brackets (Thin, Minimal) */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl pointer-events-none" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr pointer-events-none" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl pointer-events-none" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br pointer-events-none" />
                    
                    {/* Subtle Pulsing scanning bar (Clean white overlay) */}
                    <div className="absolute left-6 right-6 h-[1px] bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.6)] animate-laser pointer-events-none" />
                    
                    {/* Viewport Action bar */}
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
                      {/* Capture Snapshot */}
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="p-3.5 rounded-full bg-white text-zinc-950 shadow-md hover:bg-zinc-200 transition-all cursor-pointer"
                        title="Capture damage frame"
                      >
                        <Camera className="w-5.5 h-5.5" />
                      </button>

                      {/* Flip facingMode */}
                      <button
                        type="button"
                        onClick={switchCameraFacing}
                        className="p-3 rounded-full bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-800 text-white shadow-md transition-all cursor-pointer"
                        title="Switch facing mode"
                      >
                        <RefreshCw className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Camera Connection Lost</h4>
                    <p className="text-xs text-zinc-405 text-zinc-400 max-w-xs mx-auto">
                      Webcam or camera stream is offline. Check browser permissions and retry.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-lg shadow-sm cursor-pointer transition-colors"
                      >
                        Retry Connection
                      </button>
                      <button
                        type="button"
                        onClick={simulateCapture}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer transition-colors"
                      >
                        Simulate Capture
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Snapshot Preview */
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-900 flex flex-col items-center justify-center shadow-lg border border-zinc-800">
                <img
                  src={imagePreview}
                  alt="Claim Snapshot Preview"
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="px-4.5 py-2 rounded-lg bg-red-655 bg-red-600 hover:bg-red-750 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Discard & Retake
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Area: Form metadata */}
        <div className="lg:col-span-5">
          <Card className="p-6 border border-zinc-200/80 dark:border-zinc-800/80">
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-505 dark:text-zinc-500 uppercase tracking-wide mb-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-zinc-400" />
              <span>Assessment Profile</span>
            </h3>

            {imagePreview ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Owner Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Vehicle Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs transition-all animate-fade-in"
                    placeholder="Policyholder Full Name"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Vehicle Model */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs transition-all"
                    placeholder="Vehicle Model & Year"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* License plate */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Vehicle License Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs font-mono uppercase transition-all"
                    placeholder="License Plate Number"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Insurance Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Insurance Coverage Type
                  </label>
                  <select
                    name="insuranceType"
                    value={formData.insuranceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-905 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-955 focus:border-zinc-955 text-xs transition-all cursor-pointer"
                    disabled={submitting}
                  >
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Third-Party">Third-Party</option>
                    <option value="Collision">Collision</option>
                    <option value="Liability">Liability</option>
                    <option value="Warranty">Warranty</option>
                  </select>
                </div>

                {/* Damage description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Damage Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-xs resize-none transition-all"
                    placeholder="Describe what occurred. Mention specific locations (e.g. bumper scratches) to help AI assessments."
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Submit trigger */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-850 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Processing claim scan...</span>
                    </>
                  ) : (
                    <span>Process Claim Scan</span>
                  )}
                </button>
              </form>
            ) : (
              /* Idle guidance */
              <div className="text-center py-10 space-y-3 animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-405 text-zinc-500 flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-800">
                  <Play className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-100">Ready to Capture</h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed font-medium">
                    Fit the damaged area of the vehicle inside the viewfinder boundaries and click the camera icon.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CameraScan;
