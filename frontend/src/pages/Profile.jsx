import React from 'react';
import { User, Mail, KeyRound, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';

/**
 * Adjuster Profile page.
 * Displays details of the logged-in user in a clean, flat corporate card layout.
 */
const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-3">
        <p className="text-xs text-zinc-500">Loading adjuster profile context...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 animate-fade-in bg-zinc-55 bg-zinc-50 dark:bg-black min-h-[calc(100vh-4rem)]">
      {/* Title */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-zinc-950 dark:text-zinc-50">Profile Settings</h2>
        <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
          View your active claims adjuster account credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Account Details Card */}
        <Card className="p-6 border border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <div className="w-14 h-14 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg uppercase shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h3>
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest mt-0.5 block">
                Active Claim Adjuster
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium">
            {/* Name detail row */}
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-zinc-400" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block">Full Name</span>
                <p className="text-zinc-900 dark:text-zinc-200">{user.name}</p>
              </div>
            </div>

            {/* Email detail row */}
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-zinc-400" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block">Email Address</span>
                <p className="text-zinc-900 dark:text-zinc-200">{user.email}</p>
              </div>
            </div>

            {/* Authorization level detail row */}
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-zinc-400" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block">Authorization Level</span>
                <p className="text-zinc-900 dark:text-zinc-200">Read & Write Access (Claims Admin)</p>
              </div>
            </div>

            {/* Database Hub detail row */}
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-zinc-400" />
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase block">Database Hub</span>
                <p className="text-zinc-900 dark:text-zinc-200">Connected to HackathonVision Cluster0</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
