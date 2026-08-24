import React from 'react';
import { 
  Tv, 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Mic, 
  FolderHeart, 
  Calendar, 
  ShieldAlert, 
  MessageSquare,
  Lock,
  UserCheck,
  Sliders,
  Brain,
  Cpu,
  Server
} from 'lucide-react';
import { UserRolePayload, OSUserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRolePayload;
  setUserRole: (role: UserRolePayload) => void;
}

export const ROLES: Record<string, UserRolePayload> = {
  admin: {
    role: 'admin',
    osRole: 'ADMIN',
    permissions: { canPublish: true, canGenerateAI: true, canEditRepository: true, canManageUsers: true }
  },
  owner: {
    role: 'admin',
    osRole: 'OWNER',
    permissions: { canPublish: true, canGenerateAI: true, canEditRepository: true, canManageUsers: true }
  },
  developer: {
    role: 'admin',
    osRole: 'DEVELOPER',
    permissions: { canPublish: true, canGenerateAI: true, canEditRepository: true, canManageUsers: false }
  },
  editor: {
    role: 'editor',
    osRole: 'EDITOR',
    permissions: { canPublish: false, canGenerateAI: true, canEditRepository: true, canManageUsers: false }
  },
  creator: {
    role: 'creator',
    osRole: 'USER',
    permissions: { canPublish: false, canGenerateAI: true, canEditRepository: false, canManageUsers: false }
  },
  viewer: {
    role: 'viewer',
    osRole: 'VIEWER',
    permissions: { canPublish: false, canGenerateAI: false, canEditRepository: false, canManageUsers: false }
  }
};

export default function Sidebar({ activeTab, setActiveTab, userRole, setUserRole }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard & Insights', icon: LayoutDashboard },
    { id: 'gnn_os', label: 'GNN AI OS Control Plane', icon: Cpu, isNew: true },
    { id: 'aibrain', label: 'GNN AI Brain 🧠 OS', icon: Brain },
    { id: 'news', label: 'Grounded News & Scripts', icon: FileText },
    { id: 'studio', label: 'AI Studio Director', icon: Sparkles },
    { id: 'audio', label: 'Vocal Lab', icon: Mic },
    { id: 'manual_edit', label: 'GNN Manual Edit Panel', icon: Sliders },
    { id: 'repository', label: 'Media Repository', icon: FolderHeart },
    { id: 'scheduler', label: 'Campaign Scheduler', icon: Calendar },
    { id: 'chat', label: 'Broadcast AI Assistant', icon: MessageSquare },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between text-slate-100 min-h-screen">
      <div>
        {/* Brand Banner */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-gradient-to-r from-red-650 to-blue-950/70">
          <div className="w-10 h-10 rounded-lg bg-red-650 flex items-center justify-center shadow-lg shadow-red-500/20 animate-pulse">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-tight text-lg text-white">GNN TV</h1>
            <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">Global News Network</p>
          </div>
        </div>

        {/* User Role Quick Switcher */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Authorized Role
            </span>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono uppercase">
              {userRole.osRole || userRole.role}
            </span>
          </div>
          <select 
            value={
              userRole.osRole === 'OWNER' ? 'owner' :
              userRole.osRole === 'DEVELOPER' ? 'developer' :
              userRole.role
            }
            onChange={(e) => setUserRole(ROLES[e.target.value] || ROLES.admin)}
            className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-red-500 font-sans cursor-pointer transition-colors"
          >
            <option value="owner">Station Owner (OWNER)</option>
            <option value="admin">System Station Director (ADMIN)</option>
            <option value="developer">Platform & Git Engineer (DEVELOPER)</option>
            <option value="editor">Broadcast Chief Editor (EDITOR)</option>
            <option value="creator">Creative News Anchor (USER)</option>
            <option value="viewer">Platform Observer (VIEWER)</option>
          </select>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-sans font-medium transition-all ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-650/15' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold uppercase">
                    OS
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Permissions Footnote */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/80">
        <div className="p-3 bg-slate-900/60 rounded border border-slate-900/50 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            Station Access Profile
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono font-medium text-slate-400">
            <div className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${userRole.permissions.canPublish ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span>Publish</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${userRole.permissions.canGenerateAI ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span>AI Engine</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${userRole.permissions.canEditRepository ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span>Repository</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${userRole.permissions.canManageUsers ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span>Director Mode</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
