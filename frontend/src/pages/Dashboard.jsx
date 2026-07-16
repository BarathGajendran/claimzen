import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Hourglass, 
  CheckCircle2, 
  Plus, 
  ShieldAlert, 
  ArrowUpRight, 
  Car, 
  TrendingUp, 
  Camera 
} from 'lucide-react';
import { api } from '../context/AuthContext';
import { StatCard, Card } from '../components/Card';
import Spinner from '../components/Spinner';

/**
 * Enterprise Dashboard Overview.
 * Displays statistics, smooth Bezier SVG curves, and recent filings lists.
 */
const Dashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalCost: 0,
    highFraud: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get('/claims');
        const data = res.data.data || [];
        setClaims(data);
        
        // Calculate statistics
        const total = data.length;
        const pending = data.filter(c => c.fraudRisk === 'High' || c.fraudRisk === 'Medium' || c.severity === 'High').length;
        const completed = total - pending;
        const totalCost = data.reduce((sum, c) => sum + (c.repairCost || 0), 0);
        const highFraud = data.filter(c => c.fraudRisk === 'High').length;

        setStats({
          total,
          pending,
          completed,
          totalCost,
          highFraud
        });
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Get last 7 assessment values
  const recentPayouts = claims
    .slice(0, 7)
    .reverse()
    .map(c => c.repairCost || 0);

  // Fallbacks if no claims are created yet
  const chartPoints = recentPayouts.length >= 2 ? recentPayouts : [1200, 2600, 800, 4200, 1800, 3100, 1500];
  const maxVal = Math.max(...chartPoints, 5000);
  
  // SVG coordinates definitions
  const chartWidth = 600;
  const chartHeight = 150;
  const paddingX = 20;
  const paddingY = 15;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  const points = chartPoints.map((val, idx) => {
    const x = paddingX + (idx / (chartPoints.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - (val / maxVal) * graphHeight;
    return { x, y, val };
  });

  // Calculate smooth Bezier Curve SVG pathways (Cubic Hermite/Spline Approximation)
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    // Start of line path
    linePath = `M ${points[0].x},${points[0].y}`;
    
    // Start of filled area path (anchored at first bottom x coordinate)
    areaPath = `M ${points[0].x},${paddingY + graphHeight} L ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      
      // Control points for smooth horizontal S-curve transitions
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = next.x - (next.x - curr.x) / 2;
      const cp2y = next.y;

      const segment = ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
      linePath += segment;
      areaPath += segment;
    }

    // Anchor at last bottom x coordinate to close the polygon
    areaPath += ` L ${points[points.length - 1].x},${paddingY + graphHeight} Z`;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto animate-fade-in min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-black">
      
      {/* Premium Corporate Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-6 md:p-8 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5 max-w-lg">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
              Diagnostic Core
            </span>
            <h2 className="text-md md:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Assess Collision Damage Instantly</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Run real-time vehicle camera diagnostics. Capture photographs or drop image files to identify bumper fractures, dent boundaries, and windshield cracks.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/scan')}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>AI Camera Scan</span>
            </button>
            
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-white hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-bold text-xs border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Claims"
          value={stats.total}
          icon={FileText}
          color="brand"
          subtitle="Submitted filings repository"
        />
        <StatCard
          title="Manual Audit Required"
          value={stats.pending}
          icon={Hourglass}
          color="amber"
          subtitle="Adjustment flags active"
        />
        <StatCard
          title="Completed Claims"
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Verified & cleared"
        />
        <StatCard
          title="Assessed Repair Cost"
          value={`₹${stats.totalCost.toLocaleString()}`}
          icon={TrendingUp}
          color="purple"
          subtitle="Aggregated repair estimates"
        />
      </div>

      {/* SVG Chart & Fraud Risk panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Trend Chart */}
        <Card className="lg:col-span-2 space-y-4 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Repair Cost Assessments</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-550">Timeline visualization of estimated claims payouts</p>
            </div>
            <span className="text-[9px] font-bold text-zinc-950 bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
              {stats.total > 0 ? 'Active Stream' : 'Evaluation Model'}
            </span>
          </div>

          <div className="pt-4 pr-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
              <defs>
                {/* Clean Ocean-blue area gradient fill */}
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
              <line x1={paddingX} y1={paddingY} x2={paddingX + graphWidth} y2={paddingY} stroke="#f4f4f5" strokeWidth="1" className="stroke-zinc-100 dark:stroke-zinc-900/60" />
              <line x1={paddingX} y1={paddingY + graphHeight * 0.25} x2={paddingX + graphWidth} y2={paddingY + graphHeight * 0.25} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" className="stroke-zinc-100 dark:stroke-zinc-900/40" />
              <line x1={paddingX} y1={paddingY + graphHeight * 0.5} x2={paddingX + graphWidth} y2={paddingY + graphHeight * 0.5} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" className="stroke-zinc-100 dark:stroke-zinc-900/40" />
              <line x1={paddingX} y1={paddingY + graphHeight * 0.75} x2={paddingX + graphWidth} y2={paddingY + graphHeight * 0.75} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" className="stroke-zinc-100 dark:stroke-zinc-900/40" />
              <line x1={paddingX} y1={paddingY + graphHeight} x2={paddingX + graphWidth} y2={paddingY + graphHeight} stroke="#e4e4e7" strokeWidth="1" className="stroke-zinc-200 dark:stroke-zinc-800" />
              
              {/* Bezier Curved Area under the line */}
              {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}
              
              {/* Smooth Bezier Line Path */}
              {linePath && <path d={linePath} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />}
              
              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx} className="group cursor-pointer">
                  {/* Subtle hover ring */}
                  <circle cx={p.x} cy={p.y} r="7" fill="#0284c7" fillOpacity="0" className="transition-all group-hover:fill-opacity-10" />
                  {/* Outer circle */}
                  <circle cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                  {/* Tooltip bubble on hover */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <rect x={p.x - 30} y={p.y - 28} width="60" height="18" rx="4" fill="#09090b" className="fill-zinc-950 dark:fill-zinc-55 dark:fill-zinc-50" />
                    <text x={p.x} y={p.y - 16} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold" className="fill-white dark:fill-zinc-950">
                      ₹{p.val}
                    </text>
                  </g>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 dark:text-zinc-550 pt-2.5 border-t border-zinc-100 dark:border-zinc-900">
            <span>Older Uploads</span>
            <span>Latest Report</span>
          </div>
        </Card>

        {/* Fraud Risk Panel */}
        <Card className="flex flex-col justify-between space-y-4 p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <ShieldAlert className="w-5 h-5 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-wide">Fraud Control</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed font-medium">
              Evaluates damage timestamp history, checking for metal rust mismatches and plate registration anomalies.
            </p>
          </div>

          <div className="py-4 border-y border-zinc-150 dark:border-zinc-800 my-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">High Risk Detections</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${stats.highFraud > 0 ? 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'}`}>
                {stats.highFraud} flagged
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Claims in Queue</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                {stats.total} total
              </span>
            </div>
          </div>

          <Link
            to="/history"
            className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Review Flags</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </Link>
        </Card>
      </div>

      {/* Recent Uploads Grid */}
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-100 uppercase tracking-wide">Recent Damage Uploads</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-550">Quick list of the latest vehicle filings</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-bold text-zinc-550 hover:text-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            View Repository
          </Link>
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mx-auto">
              <Car className="w-5.5 h-5.5" />
            </div>
            <p className="text-xs text-zinc-500">No damage claims filed yet.</p>
            <button
              onClick={() => navigate('/scan')}
              className="text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:underline"
            >
              Scan your first vehicle now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800/80 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-3">Vehicle Owner</th>
                  <th className="pb-3">Model</th>
                  <th className="pb-3 font-mono">Plate Number</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Est. Repair Cost</th>
                  <th className="pb-3 text-right pr-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60 text-xs">
                {claims.slice(0, 5).map((claim) => (
                  <tr 
                    key={claim._id} 
                    className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="py-3.5 pl-3 font-semibold text-zinc-900 dark:text-zinc-250">
                      {claim.ownerName}
                    </td>
                    <td className="py-3.5 text-zinc-550 dark:text-zinc-400">
                      {claim.vehicleModel}
                    </td>
                    <td className="py-3.5 text-zinc-400 dark:text-zinc-500 font-mono">
                      {claim.vehicleNumber}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold ${
                        claim.severity === 'High' 
                          ? 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400' 
                          : claim.severity === 'Medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          claim.severity === 'High' ? 'bg-red-500' : claim.severity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span>{claim.severity}</span>
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-zinc-900 dark:text-zinc-105">
                      ₹{(claim.repairCost || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right pr-3">
                      <Link
                        to={`/claims/${claim._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-350 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
