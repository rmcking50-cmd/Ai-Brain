import React, { useState, createContext, useContext, useEffect } from 'react';
import Sidebar, { ROLES } from './components/Sidebar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import NewsEditor from './components/NewsEditor';
import StudioDirector from './components/StudioDirector';
import AudioTools from './components/AudioTools';
import ManualEditPanel from './components/ManualEditPanel';
import AssetRepository from './components/AssetRepository';
import SocialScheduler from './components/SocialScheduler';
import ChatAssistant from './components/ChatAssistant';
import AiBrainStudio from './components/AiBrainStudio';
import GnnControlPlane from './components/GnnControlPlane';
import EmptyState from './components/EmptyState';
import { 
  Search, 
  Sparkles, 
  Plus, 
  FileText, 
  Image, 
  Trash2, 
  HelpCircle, 
  Tv, 
  Zap, 
  RefreshCw, 
  Check, 
  X,
  PlusCircle,
  Eye,
  EyeOff,
  Github,
  Lock,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { RepositoryAsset, GeneratedScript, SocialPost, ChatMessage, UserRolePayload } from './types';

// AUTHENTICATION CONTEXT & PROVIDER
export interface AuthUser {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  role: string;
  scopes: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGitHub: () => void;
  logout: () => void;
  hasPermission: (scope: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('gnn_jwt_token', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      setToken(urlToken);
    } else {
      const storedToken = localStorage.getItem('gnn_jwt_token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('gnn_jwt_token');
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          setUser({
            id: 'gh-user-9981',
            login: 'GNN-Studio-Agent',
            name: 'GNN Station Director',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            role: 'OWNER',
            scopes: ['github.read', 'github.write', 'github.deploy', 'drive.read', 'drive.write', 'database.read', 'database.write', 'social.draft', 'social.publish', 'cloud.read', 'cloud.scale']
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      setUser({
        id: 'gh-user-9981',
        login: 'GNN-Studio-Agent',
        name: 'GNN Station Director',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'OWNER',
        scopes: ['github.read', 'github.write', 'github.deploy', 'drive.read', 'drive.write', 'database.read', 'database.write', 'social.draft', 'social.publish', 'cloud.read', 'cloud.scale']
      });
      setIsLoading(false);
    }
  }, [token]);

  const loginWithGitHub = () => {
    window.location.href = '/api/auth/github/callback?code=mock_github_auth_code_9981';
  };

  const logout = () => {
    localStorage.removeItem('gnn_jwt_token');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (scope: string) => {
    if (!user) return false;
    if (user.role === 'OWNER' || user.role === 'ADMIN') return true;
    return user.scopes?.includes(scope) || user.scopes?.includes('*');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, loginWithGitHub, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRolePayload>(ROLES.admin);

  // Initial High Fidelity Assets
  const [assets, setAssets] = useState<RepositoryAsset[]>([
    {
      id: 'asset-video-init',
      name: 'GNN News Intro Loop (Landscape)',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-news-studio-studio-desk-broadcasting-41554-large.mp4',
      duration: '0:12',
      size: '3.4 MB',
      resolution: '1080p',
      createdAt: '2026-06-19',
    },
    {
      id: 'asset-video-init-portrait',
      name: 'Mobile Anchor Intro (Portrait)',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-news-anchor-on-chroma-key-studio-41551-large.mp4',
      duration: '0:15',
      size: '2.9 MB',
      resolution: '720p',
      createdAt: '2026-06-19',
    },
    {
      id: 'asset-img-init',
      name: 'Dynamic Studio Backdrop Plate',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
      size: '1.2 MB',
      resolution: '2560x1440',
      createdAt: '2026-06-19',
    },
    {
      id: 'asset-sub-init',
      name: 'Bengali Caption Template SRT',
      type: 'subtitles',
      url: '#',
      size: '2 KB',
      createdAt: '2026-06-19',
      lyrics_or_text: "1\n00:00:01,000 --> 00:00:05,000\nজিএনএন বাংলা স্টুডিও থেকে সরাসরি সম্প্রচারিত তথ্য।\n\n2\n00:00:05,100 --> 00:00:10,000\nআজকের প্রধান খবরগুলো নিয়ে আমি আপনাদের সাথে আছি কাহিনুর রহমান।",
      language: 'Bangla',
    }
  ]);

  // Initial High-Fidelity News Scripts
  const [scripts, setScripts] = useState<GeneratedScript[]>([
    {
      id: 'script-init-1',
      headline: 'Breakthrough Fusion Grid Accomplishes Net Thermal Yield',
      hook: 'Welcome to GNN Science desk. Today, we bring you historical developments on clean energy.',
      body: 'Leading experimental physics centers stabilized high-energy core fusion plasma for over 18 minutes, demonstrating feasibility of thermal containment models.',
      outro: 'Stay tuned with GNN networks for local updates. GNN studio.',
      voiceoverText: 'Welcome to GNN Science desk. Today, we bring you historical developments on clean energy. Leading experimental physics centers stabilized high-energy core fusion plasma for over 18 minutes, demonstrating feasibility of thermal containment models. Stay tuned with GNN networks for local updates.',
      language: 'English',
      status: 'draft',
      createdAt: '2026-06-19',
    }
  ]);

  // Initial Scheduled Posts
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: 'post-init-1',
      scriptId: 'script-init-1',
      platforms: ['youtube', 'tiktok'],
      caption: "🚨 CLEAN ENERGY RECORD SHATTERED 🚨\n\nNet-positive fusion trial containment reaches historic 18+ minute marker!\n\n#science #cleanpower #energy #breaking #gnntv",
      tags: ['#science', '#cleanpower', '#energy', '#breaking'],
      scheduledTime: `${new Date().getFullYear()}-06-25 18:15`,
      status: 'scheduled',
    }
  ]);

  // Chat Conversational assistant messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-welcome',
      role: 'model',
      parts: [{ text: "Hello! Welcome to the GNN Newsroom Assistant. Select a specialist model (Lead TV Producer, Viral Marketer, Voice Coach) on the left panel, and let us shape highly engaging broad media layouts together!" }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  // Helpers to push to global states
  const handleAddScript = (newScript: GeneratedScript) => {
    setScripts((prev) => [newScript, ...prev]);
  };

  const handleAddAsset = (newAsset: any) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleAddMessage = (text: string) => {
    const customMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: 'model',
      parts: [{ text }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, customMsg]);
  };

  // Additional UX States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEmptyStateActive, setIsEmptyStateActive] = useState<boolean>(false);
  const [showQuickActionMenu, setShowQuickActionMenu] = useState<boolean>(false);
  const [showNewScriptModal, setShowNewScriptModal] = useState<boolean>(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Action Forms local state
  const [quickScriptTitle, setQuickScriptTitle] = useState<string>('');
  const [quickScriptBody, setQuickScriptBody] = useState<string>('');
  const [quickScriptLang, setQuickScriptLang] = useState<string>('Bangla');
  
  const [quickAssetName, setQuickAssetName] = useState<string>('');
  const [quickAssetType, setQuickAssetType] = useState<'video' | 'image' | 'audio' | 'subtitles'>('video');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateQuickScript = () => {
    if (!quickScriptTitle.trim()) return;
    const bodyText = quickScriptBody || 'জিএনএন গ্লোবাল নেটওয়ার্ক সরাসরি সম্প্রচার।';
    const newScript: GeneratedScript = {
      id: `script-quick-${Date.now()}`,
      title: quickScriptTitle,
      headline: quickScriptTitle,
      hook: `স্বাগতম জিএনএন বাংলা নিউজ ডেস্কে। আজকের বিশেষ খবর...`,
      body: bodyText,
      outro: 'জিএনএন বাংলা স্টুডিও, ঢাকা।',
      voiceoverText: `স্বাগতম জিএনএন বাংলা নিউজ ডেস্কে। 오늘의 বিশেষ খবর... ${bodyText} জিএনএন বাংলা স্টুডিও, ঢাকা।`,
      language: quickScriptLang,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    handleAddScript(newScript);
    triggerToast(`Success! Generated news script "${quickScriptTitle}" inside workspace.`);
    setQuickScriptTitle('');
    setQuickScriptBody('');
    setShowNewScriptModal(false);
    setShowQuickActionMenu(false);
  };

  const handleCreateQuickAsset = () => {
    if (!quickAssetName.trim()) return;
    const sizeMap = { video: '5.2 MB', image: '1.4 MB', audio: '2.1 MB', subtitles: '3 KB' };
    const resMap = { video: '1080p', image: '1920x1080', audio: 'Stereo Hi-Fi', subtitles: 'SRT Template' };
    const placeholderUrl = quickAssetType === 'image' 
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000'
      : 'https://assets.mixkit.co/videos/preview/mixkit-news-studio-studio-desk-broadcasting-41554-large.mp4';

    const newAsset: RepositoryAsset = {
      id: `asset-quick-${Date.now()}`,
      name: quickAssetName,
      type: quickAssetType,
      url: placeholderUrl,
      size: sizeMap[quickAssetType],
      resolution: resMap[quickAssetType],
      createdAt: new Date().toISOString().split('T')[0]
    };
    handleAddAsset(newAsset);
    triggerToast(`Success! Injected media asset "${quickAssetName}" to repository.`);
    setQuickAssetName('');
    setShowNewAssetModal(false);
    setShowQuickActionMenu(false);
  };

  const handlePopulateDemo = () => {
    const demoScripts: GeneratedScript[] = [
      {
        id: `script-demo-${Date.now()}-1`,
        title: 'Bangladesh Tech Growth Hits Record Benchmark',
        headline: 'Bangladesh Tech Growth Hits Record Benchmark',
        hook: 'জিএনএন বাংলা টেক ডেস্কে আপনাদের স্বাগত জানাচ্ছি।',
        body: 'বাংলাদেশ ডিজিটাল ফ্রিল্যান্সিং এবং সফটওয়্যার রপ্তানিতে নতুন মাইলফলক স্পর্শ করেছে। তথ্যপ্রযুক্তি খাতে গত প্রান্তিকে রেকর্ড প্রবৃদ্ধি অর্জিত হয়েছে।',
        outro: 'জিএনএন স্টুডিওর সাথে থাকুন। ধন্যবাদ।',
        voiceoverText: 'জিএনএন বাংলা টেক ডেস্কে আপনাদের স্বাগত জানাচ্ছি। বাংলাদেশ ডিজিটাল ফ্রিল্যান্সিং এবং সফটওয়্যার রপ্তানিতে নতুন মাইলফলক স্পর্শ করেছে। তথ্যপ্রযুক্তি খাতে গত প্রান্তিকে রেকর্ড প্রবৃদ্ধি অর্জিত হয়েছে। জিএনএন স্টুডিওর সাথে থাকুন। ধন্যবাদ।',
        language: 'Bangla',
        status: 'approved',
        createdAt: new Date().toISOString().split('T')[0]
      }
    ];

    demoScripts.forEach(s => handleAddScript(s));
    setIsEmptyStateActive(false);
    triggerToast('Perfect! Pre-loaded high fidelity GNN Bangla demo templates.');
  };

  // Dynamic filter query selectors
  const filteredScripts = scripts.filter(s => 
    s.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.body && s.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.title && s.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPosts = posts.filter(p => 
    p.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-slate-950 font-sans min-h-screen text-slate-150">
      
      {/* Drawer Section */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole} 
        setUserRole={setUserRole} 
      />

      {/* Primary Workspace screen */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6 relative">
        
        {/* Workspace Card Container - Styled with High-Fidelity Glassmorphism */}
        <div 
          id="workspace-card" 
          className="bg-slate-900/35 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 md:p-6 transition-all duration-300 relative"
        >
          
          {/* Header of workspace card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
            
            {/* Header info */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Tv className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-sans font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                  Workspace
                  <span className="text-[10px] bg-red-600/10 border border-red-650/20 text-red-400 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                    {activeTab}
                  </span>
                </h2>
                <p className="text-[10px] text-slate-400 font-mono">GNN TV News Operating Suite</p>
              </div>
            </div>

            {/* Filter Search bar */}
            <div className="relative w-full max-w-xs md:max-w-md">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder={`Filter elements in ${activeTab.toUpperCase()} tab...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800/80 focus:border-red-500/40 focus:ring-1 focus:ring-red-500/10 rounded-full pl-10 pr-4 py-2 text-xs font-mono text-slate-200 outline-none transition-all placeholder:text-slate-650"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2 text-slate-500 hover:text-white font-mono text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right side actions (Empty state toggle) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsEmptyStateActive(!isEmptyStateActive);
                  triggerToast(isEmptyStateActive ? 'Switched to active workspace tab view' : 'Switched to Empty Workspace Guidance Deck');
                }}
                className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isEmptyStateActive 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isEmptyStateActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isEmptyStateActive ? 'Show Content' : 'Force Empty State'}</span>
              </button>
            </div>

          </div>

          {/* Active Workspace View / Empty state fallback */}
          {isEmptyStateActive ? (
            <EmptyState 
              onPopulateDemo={handlePopulateDemo} 
              onOpenQuickScript={() => setShowNewScriptModal(true)} 
              onOpenQuickAsset={() => setShowNewAssetModal(true)} 
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <AnalyticsDashboard 
                  scripts={filteredScripts} 
                  posts={filteredPosts} 
                />
              )}
              {activeTab === 'gnn_os' && (
                <GnnControlPlane 
                  userRole={userRole}
                  setUserRole={setUserRole}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'aibrain' && (
                <AiBrainStudio />
              )}
              {activeTab === 'news' && (
                <NewsEditor 
                  userRole={userRole} 
                  onAddScript={handleAddScript} 
                  onAddAsset={handleAddAsset} 
                  onAddMessage={handleAddMessage} 
                />
              )}
              {activeTab === 'studio' && (
                <StudioDirector 
                  userRole={userRole} 
                  onAddAsset={handleAddAsset} 
                />
              )}
              {activeTab === 'audio' && (
                <AudioTools 
                  userRole={userRole} 
                  onAddAsset={handleAddAsset} 
                />
              )}
              {activeTab === 'manual_edit' && (
                <ManualEditPanel 
                  userRole={userRole} 
                  onAddAsset={handleAddAsset} 
                />
              )}
              {activeTab === 'repository' && (
                <AssetRepository 
                  userRole={userRole} 
                  assets={filteredAssets} 
                  setAssets={setAssets} 
                />
              )}
              {activeTab === 'scheduler' && (
                <SocialScheduler 
                  userRole={userRole} 
                  scripts={filteredScripts} 
                  posts={filteredPosts} 
                  setPosts={setPosts} 
                />
              )}
              {activeTab === 'chat' && (
                <ChatAssistant 
                  userRole={userRole} 
                  messages={messages} 
                  setMessages={setMessages} 
                />
              )}
            </>
          )}

          {/* Floating 'Quick Action' FAB Menu */}
          <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-2">
            {showQuickActionMenu && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 shadow-2xl flex flex-col gap-1 text-xs font-mono animate-fade-in text-slate-300 w-44">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest p-1 border-b border-slate-900 block mb-1">
                  ⚡ Quick Action
                </span>
                
                <button 
                  onClick={() => {
                    setShowNewScriptModal(true);
                    setShowQuickActionMenu(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-red-500/5 hover:text-red-400 transition-colors text-left cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📝 New Script</span>
                </button>

                <button 
                  onClick={() => {
                    setShowNewAssetModal(true);
                    setShowQuickActionMenu(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-red-500/5 hover:text-red-400 transition-colors text-left cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>🎨 New Asset</span>
                </button>

                <button 
                  onClick={() => {
                    setIsEmptyStateActive(!isEmptyStateActive);
                    setShowQuickActionMenu(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-red-500/5 hover:text-red-400 transition-colors text-left cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>🔄 Empty Workspace</span>
                </button>
              </div>
            )}

            <button 
              onClick={() => setShowQuickActionMenu(!showQuickActionMenu)}
              className="w-12 h-12 rounded-full bg-red-650 hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-950/45 cursor-pointer transition-transform hover:scale-110 border border-red-500/30"
              title="Quick GNN Menu"
            >
              {showQuickActionMenu ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>

        </div>

      </main>

      {/* Instant New Script Overlay Modal */}
      {showNewScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-sans font-black tracking-widest uppercase text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500 animate-pulse" /> Instant GNN News Script
              </h3>
              <button 
                onClick={() => setShowNewScriptModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Script Title / Headline</label>
                <input 
                  type="text"
                  placeholder="e.g. Fusion Reactor Breakthrough stable trail"
                  value={quickScriptTitle}
                  onChange={(e) => setQuickScriptTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Body Text Content (Bengali / English)</label>
                <textarea 
                  rows={4}
                  placeholder="এআই নিউজ স্টুডিওর মেইন বডি টেক্সট এখানে প্রদান করুন..."
                  value={quickScriptBody}
                  onChange={(e) => setQuickScriptBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-red-500 font-mono resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Language</label>
                <select 
                  value={quickScriptLang}
                  onChange={(e) => setQuickScriptLang(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-slate-300 outline-none cursor-pointer"
                >
                  <option value="Bangla">Bangla (বাংলা)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={() => setShowNewScriptModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateQuickScript}
                className="flex-1 bg-red-650 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Inject Script
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant New Asset Overlay Modal */}
      {showNewAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-sans font-black tracking-widest uppercase text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-red-500 animate-pulse" /> Add Instant Media Asset
              </h3>
              <button 
                onClick={() => setShowNewAssetModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Asset Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Bangladesh Anchor Chroma backdrop"
                  value={quickAssetName}
                  onChange={(e) => setQuickAssetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Asset Category</label>
                <select 
                  value={quickAssetType}
                  onChange={(e: any) => setQuickAssetType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-slate-300 outline-none cursor-pointer"
                >
                  <option value="video">🎥 News Studio Video clip</option>
                  <option value="image">🖼️ Backdrop High-Res image</option>
                  <option value="audio">🎵 Vocal voice-over track</option>
                  <option value="subtitles">📝 SRT Subtitles lyrics</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={() => setShowNewAssetModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateQuickAsset}
                className="flex-1 bg-red-650 hover:bg-red-700 text-white py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Add to Repository
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled success toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-950 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-slate-200">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
