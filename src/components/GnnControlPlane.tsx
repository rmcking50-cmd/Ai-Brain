import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Cpu, 
  Terminal, 
  Layers, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Github, 
  Globe, 
  Server, 
  Database, 
  Activity, 
  UserCheck, 
  Sliders, 
  Clock, 
  ExternalLink, 
  Workflow, 
  Sparkles,
  Share2,
  Box,
  HardDrive,
  Mail,
  Calendar as CalendarIcon,
  FileCode,
  FolderLock,
  Search,
  Code2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OSUserRole, McpPermissionSet, McpServerItem, StructuredTelemetryLog, UserRolePayload } from '../types';

interface GnnControlPlaneProps {
  userRole: UserRolePayload;
  setUserRole: (role: UserRolePayload) => void;
  onNavigateTab?: (tabId: string) => void;
}

const INITIAL_MCP_SERVERS: McpServerItem[] = [
  {
    id: 'github',
    name: 'GitHub MCP',
    type: 'Developer',
    status: 'connected',
    desc: 'Secure repository cloning, automated commits & branch orchestration',
    latencyMs: 34,
    scopesRequired: ['github.read', 'github.write'],
    endpoint: 'mcp://github.gnn.internal:8080/v1',
    lastSync: '2 mins ago',
    authMethod: 'SSH Key'
  },
  {
    id: 'gdrive',
    name: 'Google Drive MCP',
    type: 'Storage',
    status: 'idle',
    desc: 'Auto-sync media assets & cold render archives with cloud storage',
    latencyMs: 120,
    scopesRequired: ['drive.read', 'drive.write'],
    endpoint: 'mcp://drive.google.internal/storage/v2',
    lastSync: '18 mins ago',
    authMethod: 'OAuth 2.0'
  },
  {
    id: 'gmail',
    name: 'Gmail MCP',
    type: 'Workspace',
    status: 'connected',
    desc: 'Automated broadcast summaries & editorial press pitch releases',
    latencyMs: 45,
    scopesRequired: ['drive.read'],
    endpoint: 'mcp://gmail.google.internal/mail/v1',
    lastSync: '5 mins ago',
    authMethod: 'OAuth 2.0'
  },
  {
    id: 'gcalendar',
    name: 'Calendar MCP',
    type: 'Workspace',
    status: 'connected',
    desc: 'Sync editorial boards, live broadcast slots & publication timers',
    latencyMs: 40,
    scopesRequired: ['drive.read'],
    endpoint: 'mcp://calendar.google.internal/cal/v3',
    lastSync: 'Just now',
    authMethod: 'OAuth 2.0'
  },
  {
    id: 'notion',
    name: 'Notion MCP',
    type: 'Integrations',
    status: 'connected',
    desc: 'Pull structured news hooks, editorial scripts & research templates',
    latencyMs: 88,
    scopesRequired: ['database.read'],
    endpoint: 'mcp://notion.internal/v1/blocks',
    lastSync: '12 mins ago',
    authMethod: 'API Key'
  },
  {
    id: 'figma',
    name: 'Figma MCP',
    type: 'Creative',
    status: 'idle',
    desc: 'Sync vector cards, lower-thirds overlays & branding shapes',
    latencyMs: 110,
    scopesRequired: ['drive.read'],
    endpoint: 'mcp://figma.internal/v2/files',
    lastSync: '1 hr ago',
    authMethod: 'OAuth 2.0'
  },
  {
    id: 'blender',
    name: 'Blender MCP',
    type: 'Creative',
    status: 'idle',
    desc: 'Automate 3D virtual studio rendering triggers & camera rig parameters',
    latencyMs: 240,
    scopesRequired: ['cloud.scale'],
    endpoint: 'mcp://blender-render.internal:9999',
    lastSync: '4 hrs ago',
    authMethod: 'IAM Role'
  },
  {
    id: 'ocoya',
    name: 'Ocoya MCP',
    type: 'Publishing',
    status: 'active',
    desc: 'Multi-channel social scheduler & auto-publishing gateway',
    latencyMs: 28,
    scopesRequired: ['social.draft', 'social.publish'],
    endpoint: 'mcp://ocoya.api.internal/social/v3',
    lastSync: 'Live',
    authMethod: 'API Key'
  },
  {
    id: 'database',
    name: 'Database MCP',
    type: 'Database',
    status: 'active',
    desc: 'PostgreSQL instance metrics synchronization & high-density telemetry',
    latencyMs: 14,
    scopesRequired: ['database.read', 'database.write'],
    endpoint: 'postgres://gnn_os_db:5432/gnn_production',
    lastSync: 'Live',
    authMethod: 'IAM Role'
  },
  {
    id: 'docker',
    name: 'Docker MCP',
    type: 'System',
    status: 'connected',
    desc: 'Control virtual render environment containers & ffmpeg pipelines',
    latencyMs: 19,
    scopesRequired: ['cloud.read', 'cloud.scale'],
    endpoint: 'unix:///var/run/docker.sock',
    lastSync: '1 min ago',
    authMethod: 'IAM Role'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes MCP',
    type: 'System',
    status: 'connected',
    desc: 'Scale real-time caption pipelines & high-throughput worker nodes',
    latencyMs: 22,
    scopesRequired: ['cloud.scale'],
    endpoint: 'https://k8s-cluster.gnn.internal',
    lastSync: '1 min ago',
    authMethod: 'IAM Role'
  },
  {
    id: 'cloud',
    name: 'Cloud MCP',
    type: 'System',
    status: 'active',
    desc: 'Google Cloud Run microservices routing logs & container ingress',
    latencyMs: 16,
    scopesRequired: ['cloud.read', 'cloud.scale'],
    endpoint: 'https://ais-dev-pz6tgpgynuzy2yxumtbvjg.asia-southeast1.run.app',
    lastSync: 'Live',
    authMethod: 'IAM Role'
  }
];

const INITIAL_TELEMETRY_LOGS: StructuredTelemetryLog[] = [
  {
    id: 'log-1',
    timestamp: '23:24:45',
    level: 'INFO',
    source: 'AI Planner',
    event: 'audience_model_recalculation',
    project: 'gnn-ai-studio',
    status: 'running',
    text: 'AI Planner: Recalculating demographic engagement coefficient based on new Bangladesh viewership.'
  },
  {
    id: 'log-2',
    timestamp: '23:24:30',
    level: 'INFO',
    source: 'Database',
    event: 'index_telemetry_batch',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'Database MCP: Running standard indexing protocol for high-density social performance logs.'
  },
  {
    id: 'log-3',
    timestamp: '23:23:48',
    level: 'SUCCESS',
    source: 'Google Drive MCP',
    event: 'backup_archive_push',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'Google Drive MCP: Sync completed. Pushed backup copy of captioned reels.'
  },
  {
    id: 'log-4',
    timestamp: '23:23:13',
    level: 'INFO',
    source: 'AI Planner',
    event: 'demographic_coefficient_update',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'AI Planner: Recalculating demographic engagement coefficient based on new Bangladesh viewership.'
  },
  {
    id: 'log-5',
    timestamp: '23:22:40',
    level: 'INFO',
    source: 'GitHub MCP',
    event: 'auto_commit_templates',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'GitHub MCP: Automated commit of latest News Studio layout templates.'
  },
  {
    id: 'log-6',
    timestamp: '19:38:02',
    level: 'SUCCESS',
    source: 'Workflow Engine',
    event: 'os_init_layers',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'GNN AI OS initialization complete. Layer 1-5 online.'
  },
  {
    id: 'log-7',
    timestamp: '19:38:05',
    level: 'INFO',
    source: 'GitHub MCP',
    event: 'ssh_key_verified',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'GitHub MCP loaded. SSH Key status verified.'
  },
  {
    id: 'log-8',
    timestamp: '19:38:10',
    level: 'SUCCESS',
    source: 'Ocoya MCP',
    event: 'social_gateway_synced',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'Ocoya MCP channel sync: TikTok, YouTube, Instagram Reels connected.'
  },
  {
    id: 'log-9',
    timestamp: '19:38:12',
    level: 'INFO',
    source: 'Timing Optimizer',
    event: 'peak_window_calculated',
    project: 'gnn-ai-studio',
    status: 'completed',
    text: 'SEO Engine optimization active: calculated optimal post time as 18:15 (+24.5% Gain).'
  }
];

export default function GnnControlPlane({ userRole, setUserRole, onNavigateTab }: GnnControlPlaneProps) {
  const [activeSubView, setActiveSubView] = useState<'architecture' | 'mcp_gateway' | 'auth_security' | 'telemetry' | 'database_schema'>('architecture');
  const [mcpList, setMcpList] = useState<McpServerItem[]>(INITIAL_MCP_SERVERS);
  const [telemetryLogs, setTelemetryLogs] = useState<StructuredTelemetryLog[]>(INITIAL_TELEMETRY_LOGS);
  const [isLiveListening, setIsLiveListening] = useState<boolean>(true);
  const [selectedMcpConfig, setSelectedMcpConfig] = useState<McpServerItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [filterSource, setFilterSource] = useState<string>('all');
  
  // SSH Key state (using user-provided key specification)
  const [sshKey, setSshKey] = useState<string>(
    'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDQza5597369bb77a9197264... GNN-Studio-Agent@GNN-OS'
  );
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);

  // User Auth & RBAC state
  const [currentOsRole, setCurrentOsRole] = useState<OSUserRole>('ADMIN');
  const [mcpPermissions, setMcpPermissions] = useState<McpPermissionSet>({
    'github.read': true,
    'github.write': true,
    'github.deploy': true,
    'drive.read': true,
    'drive.write': true,
    'database.read': true,
    'database.write': true,
    'social.draft': true,
    'social.publish': true,
    'cloud.read': true,
    'cloud.scale': false,
  });

  // Simulated live event pump
  useEffect(() => {
    if (!isLiveListening) return;

    const interval = setInterval(() => {
      const sources: StructuredTelemetryLog['source'][] = [
        'AI Planner', 'MCP Gateway', 'Database', 'Workflow Engine', 'Cloud', 'Social Gateway', 'GitHub MCP', 'Timing Optimizer'
      ];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const sampleEvents = [
        { source: 'AI Planner', event: 'demographic_refinement', text: 'AI Planner: Tuned Bangladesh market retention weights for portrait video loops.' },
        { source: 'MCP Gateway', event: 'health_check_ping', text: 'MCP Gateway: Health check verified on 12 active servers. Roundtrip latency: 18ms.' },
        { source: 'Database', event: 'metrics_sync_cycle', text: 'Database MCP: Telemetry metrics written to PostgreSQL production partition.' },
        { source: 'Workflow Engine', event: 'approval_gate_check', text: 'Workflow Engine: Evaluated user role permissions before triggering background job.' },
        { source: 'Social Gateway', event: 'queue_telemetry', text: 'Ocoya Gateway: Queue depth nominal (1 queued, 0 retrying).' },
        { source: 'GitHub MCP', event: 'branch_sync', text: 'GitHub MCP: Checked remote branch origin/main — up to date with SSH credentials.' },
        { source: 'Cloud', event: 'ingress_route_ok', text: 'Cloud MCP: Google Cloud Run ingress telemetry streaming on port 3000.' },
        { source: 'Timing Optimizer', event: 'recalculate_window', text: 'Timing Optimizer: Confirmed optimal publish window for Tech & Security remains 18:15.' }
      ];

      const match = sampleEvents.find(e => e.source === randomSource) || sampleEvents[0];
      const newLog: StructuredTelemetryLog = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        level: Math.random() > 0.85 ? 'SUCCESS' : 'INFO',
        source: randomSource,
        event: match.event,
        project: 'gnn-ai-studio',
        status: 'completed',
        text: match.text
      };

      setTelemetryLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveListening]);

  const handleCopySshKey = () => {
    navigator.clipboard.writeText(sshKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      setSshKey('ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDQza5597369bb77a9197264... GNN-Studio-Agent@GNN-OS');
      setIsGeneratingKey(false);
      
      const timeStr = new Date().toTimeString().split(' ')[0];
      setTelemetryLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'SUCCESS',
          source: 'GitHub MCP',
          event: 'ssh_key_regenerated',
          project: 'gnn-ai-studio',
          status: 'completed',
          text: 'GitHub MCP: Generated fresh RSA 4096-bit public keypair. Private key securely stored in Google Secret Manager.'
        },
        ...prev
      ]);
    }, 700);
  };

  const handlePingMcp = (id: string) => {
    setMcpList(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          latencyMs: Math.floor(Math.random() * 25) + 10,
          lastSync: 'Just now'
        };
      }
      return m;
    }));

    const target = mcpList.find(m => m.id === id);
    const timeStr = new Date().toTimeString().split(' ')[0];
    setTelemetryLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        level: 'SUCCESS',
        source: 'MCP Gateway',
        event: 'manual_ping_handshake',
        project: 'gnn-ai-studio',
        status: 'completed',
        text: `MCP Gateway: Handshake ping successful for [${target?.name}]. Verified latency: ${target?.latencyMs}ms.`
      },
      ...prev
    ]);
  };

  const filteredLogs = filterSource === 'all' 
    ? telemetryLogs 
    : telemetryLogs.filter(l => l.source.toLowerCase().includes(filterSource.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header Banner: GNN AI OS Unified Control Layer */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-cyan-500 to-emerald-500" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-red-600/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                GNN AI OS Core
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Control Layer v1.0
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-6 h-6 text-red-500" />
              GNN AI Operating System & Control Plane
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Unified Master AI, Model Context Protocol (MCP) Gateway, RBAC Security Suite & Timing Optimizer
            </p>
          </div>

          {/* Quick Sub-navigation tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'architecture', label: 'Architecture & Engine', icon: Layers },
              { id: 'mcp_gateway', label: 'MCP Gateway (12)', icon: Server },
              { id: 'auth_security', label: 'Auth, RBAC & SSH', icon: Shield },
              { id: 'telemetry', label: 'System Telemetry', icon: Activity },
              { id: 'database_schema', label: 'DB Schema', icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubView(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-950/40' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- SUBVIEW 1: UNIFIED ARCHITECTURE & MASTER AI --- */}
      {activeSubView === 'architecture' && (
        <div className="space-y-6">
          {/* Architecture Visualizer Card */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-cyan-400" />
                  Unified GNN AI OS Architectural Hierarchy
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Master AI coordinates Planning, Memory, Reasoning, Workflow execution, and MCP Gateways
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                Core State: <strong className="text-emerald-400">NOMINAL (100%)</strong>
              </span>
            </div>

            {/* Visual Node Hierarchy */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 font-mono">
              {/* Top Node: GNN AI OS */}
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-red-950/50 border border-red-500/40 text-center">
                  <div className="text-sm">GNN AI OS</div>
                  <div className="text-[10px] text-red-200 font-normal">Unified Operating System Core</div>
                </div>
              </div>

              {/* Connecting line */}
              <div className="w-px h-6 bg-slate-700 mx-auto" />
              <div className="w-2/3 h-px bg-slate-700 mx-auto" />

              {/* Level 2: GNN Master AI vs OS Control Plane */}
              <div className="grid grid-cols-2 gap-8 my-4">
                {/* Left Branch: GNN Master AI */}
                <div className="space-y-3">
                  <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-4 text-center shadow-lg shadow-cyan-950/20">
                    <div className="text-cyan-400 font-bold text-xs uppercase flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      GNN Master AI
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Autonomous Agent Orchestration</div>
                  </div>

                  {/* Tri-split: Planner, Memory, Reasoner */}
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                      <span className="text-emerald-400 block font-bold">Planner</span>
                      <span className="text-slate-500 text-[9px]">Goal Decomp</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                      <span className="text-purple-400 block font-bold">Memory</span>
                      <span className="text-slate-500 text-[9px]">Episodic & Vector</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                      <span className="text-yellow-400 block font-bold">Reasoner</span>
                      <span className="text-slate-500 text-[9px]">Multi-Step LLM</span>
                    </div>
                  </div>

                  <div className="w-px h-4 bg-slate-700 mx-auto" />

                  {/* Workflow Engine Node */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-white font-bold text-xs flex items-center justify-center gap-1.5">
                      <Workflow className="w-3.5 h-3.5 text-red-400" />
                      Workflow Engine
                    </div>
                    <div className="text-[9px] text-slate-400">Task Queues · Schedulers · Approval Gates</div>
                  </div>
                </div>

                {/* Right Branch: OS Control Plane */}
                <div className="space-y-3">
                  <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 text-center shadow-lg shadow-emerald-950/20">
                    <div className="text-emerald-400 font-bold text-xs uppercase flex items-center justify-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      OS Control Plane
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Policy & System Telemetry Core</div>
                  </div>

                  {/* Tri-split: Telemetry, Security, Config */}
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                      <span className="text-cyan-400 block font-bold">Telemetry</span>
                      <span className="text-slate-500 text-[9px]">Real-time Logs</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                      <span className="text-red-400 block font-bold">Security</span>
                      <span className="text-slate-500 text-[9px]">RBAC & SSH</span>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                      <span className="text-amber-400 block font-bold">Config</span>
                      <span className="text-slate-500 text-[9px]">Secrets & Env</span>
                    </div>
                  </div>

                  <div className="w-px h-4 bg-slate-700 mx-auto" />

                  {/* Permission Layer Guard */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-white font-bold text-xs flex items-center justify-center gap-1.5">
                      <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
                      Permission Layer Guard
                    </div>
                    <div className="text-[9px] text-slate-400">Policy Authorization · Rate Limiting · Audit Log</div>
                  </div>
                </div>
              </div>

              {/* Connecting to MCP Gateway */}
              <div className="w-px h-6 bg-slate-700 mx-auto" />

              {/* MCP Gateway Hub */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 rounded-xl p-4 text-center">
                <div className="text-cyan-400 font-bold text-sm flex items-center justify-center gap-2">
                  <Server className="w-4 h-4" />
                  Model Context Protocol (MCP) Gateway Hub
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  12 Enterprise MCP Handshakes: GitHub · Drive · Gmail · Calendar · Notion · Figma · Blender · Ocoya · DB · Docker · K8s · Cloud
                </p>
              </div>
            </div>
          </div>

          {/* 7 OS Subsystems Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'AI OS',
                icon: Cpu,
                color: 'text-red-400',
                border: 'border-red-500/30',
                items: ['Master AI', 'Planner Engine', 'Memory Store', 'Reasoner', 'Agent Runtime']
              },
              {
                title: 'MCP OS',
                icon: Server,
                color: 'text-cyan-400',
                border: 'border-cyan-500/30',
                items: ['Server Registry', 'OAuth Gateway', 'Permissions Matrix', 'Tool Discovery', 'Health Handshakes']
              },
              {
                title: 'Workflow OS',
                icon: Workflow,
                color: 'text-purple-400',
                border: 'border-purple-500/30',
                items: ['Task Queues', 'Priority Schedulers', 'Approval Policies', 'Background Workers', 'Retry Deadletters']
              },
              {
                title: 'Media & SEO OS',
                icon: Sparkles,
                color: 'text-yellow-400',
                border: 'border-yellow-500/30',
                items: ['News Scraper', 'Timing Optimizer (18:15)', 'Social Publisher (Ocoya)', 'Analytics Desk', 'Auto-Captions']
              }
            ].map((sub, i) => (
              <div key={i} className={`bg-slate-950 border ${sub.border} rounded-xl p-4 shadow-lg`}>
                <div className="flex items-center gap-2 mb-3">
                  <sub.icon className={`w-4 h-4 ${sub.color}`} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{sub.title}</h4>
                </div>
                <ul className="space-y-1.5 font-mono text-[10px] text-slate-400">
                  {sub.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBVIEW 2: REAL-TIME MCP GATEWAY REGISTRY --- */}
      {activeSubView === 'mcp_gateway' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  Model Context Protocol (MCP) Server Registry
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Live connection states, roundtrip latency telemetry, and fine-grained authorization gates
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  8 Connected / Active
                </span>
                <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg">
                  4 Idle Standby
                </span>
              </div>
            </div>

            {/* MCP Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mcpList.map(mcp => (
                <div 
                  key={mcp.id}
                  className="bg-slate-900/40 border border-slate-850 hover:border-slate-750 rounded-xl p-4 transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    mcp.status === 'active' ? 'bg-emerald-500' :
                    mcp.status === 'connected' ? 'bg-cyan-500' : 'bg-slate-700'
                  }`} />

                  <div>
                    <div className="flex justify-between items-start mb-2 pt-1">
                      <div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                          {mcp.type}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{mcp.name}</h4>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          mcp.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                          mcp.status === 'connected' ? 'bg-cyan-400' : 'bg-slate-500'
                        }`} />
                        <span className="text-[10px] font-mono text-slate-400 capitalize">{mcp.status}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-mono leading-relaxed mb-3">
                      {mcp.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-850 text-[10px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Auth Method:</span>
                      <span className="text-slate-200 font-semibold">{mcp.authMethod}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Latency:</span>
                      <span className="text-cyan-400 font-semibold">{mcp.latencyMs}ms</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Last Sync:</span>
                      <span className="text-slate-300">{mcp.lastSync}</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handlePingMcp(mcp.id)}
                        className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 py-1.5 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Ping Handshake</span>
                      </button>
                      <button
                        onClick={() => setSelectedMcpConfig(mcp)}
                        className="px-2.5 bg-slate-800 hover:bg-slate-750 text-cyan-400 py-1.5 rounded text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Config
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 3: AUTH, RBAC & SSH KEY MANAGEMENT --- */}
      {activeSubView === 'auth_security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Identity & RBAC Matrix Card */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-red-500" />
                    Role-Based Access Control (RBAC) & Identity
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    User identity, session management, and role hierarchies
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-600/10 border border-red-500/20 text-red-400 font-bold">
                  {currentOsRole} MODE
                </span>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Switch Active OS Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['OWNER', 'ADMIN', 'DEVELOPER', 'EDITOR', 'USER', 'VIEWER'] as OSUserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentOsRole(role);
                        const isHigh = role === 'OWNER' || role === 'ADMIN' || role === 'DEVELOPER';
                        setUserRole({
                          role: role === 'VIEWER' ? 'viewer' : role === 'EDITOR' ? 'editor' : 'admin',
                          osRole: role,
                          permissions: {
                            canPublish: role === 'OWNER' || role === 'ADMIN',
                            canGenerateAI: role !== 'VIEWER',
                            canEditRepository: isHigh,
                            canManageUsers: role === 'OWNER' || role === 'ADMIN'
                          }
                        });
                      }}
                      className={`p-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                        currentOsRole === role
                          ? 'bg-red-600 text-white shadow-lg shadow-red-950/40 border border-red-500/40'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Permission Matrix */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-slate-400 uppercase block">Fine-Grained MCP Permissions</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(mcpPermissions).map(([key, val]) => (
                    <label 
                      key={key} 
                      className="p-2.5 bg-slate-900/60 border border-slate-850 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-900"
                    >
                      <span className="text-slate-300">{key}</span>
                      <input 
                        type="checkbox"
                        checked={val}
                        onChange={(e) => {
                          setMcpPermissions(prev => ({ ...prev, [key]: e.target.checked }));
                        }}
                        className="rounded text-red-600 focus:ring-red-500 bg-slate-950 border-slate-700"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Approval Policy Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs font-mono text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Approval Policy Active:</strong> High-risk operations (Publish, Deploy, Branch Push, DB Mutation, Infrastructure Scaling) require explicit operator sign-off before Master AI execution.
                </p>
              </div>
            </div>

            {/* GitHub OAuth & SSH Key Management Card */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Github className="w-5 h-5 text-white" />
                    GitHub Developer Mode & SSH Key
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Cloning repositories, pulling commits, triggers
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                  RSA 4096-BIT
                </span>
              </div>

              {/* Public SSH Key Output Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 uppercase">Public Key (Add to your GitHub Settings)</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ✓ SSH Key generation complete
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 break-all leading-relaxed relative group select-all">
                  {sshKey}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopySshKey}
                    className="flex-1 bg-slate-800 hover:bg-slate-750 text-white font-mono text-xs font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Key Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Key</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRegenerateKey}
                    disabled={isGeneratingKey}
                    className="bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 font-mono text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingKey ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>Generate RSA SSH Key</span>
                  </button>
                </div>
              </div>

              {/* Security Guideline Callout */}
              <div className="bg-slate-900/80 border border-slate-850 rounded-xl p-4 space-y-2 text-xs font-mono">
                <div className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-cyan-400" />
                  KMS Private Key Protection
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Private keys are never exposed in browser runtime or client bundles. Private keys are encrypted via Google Cloud KMS / Secret Manager. Git push/pull operations occur through secure server-side worker containers.
                </p>
                <div className="pt-2 text-[10px] text-slate-500">
                  Authorized Callback URI: <code>https://auth.gnnaistudio.com/oauth/github/callback</code>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- SUBVIEW 4: STRUCTURED SYSTEM TELEMETRY EVENT STREAM --- */}
      {activeSubView === 'telemetry' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Live Structured System Telemetry Stream
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Real-time event logging across AI Planner, MCP Gateways, DB indexes, and Cloud workers
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter source */}
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 outline-none"
                >
                  <option value="all">All Sources</option>
                  <option value="AI Planner">AI Planner</option>
                  <option value="MCP Gateway">MCP Gateway</option>
                  <option value="GitHub MCP">GitHub MCP</option>
                  <option value="Database">Database MCP</option>
                  <option value="Timing Optimizer">Timing Optimizer</option>
                </select>

                {/* Live listening toggle */}
                <button
                  onClick={() => setIsLiveListening(!isLiveListening)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isLiveListening 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isLiveListening ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  <span>{isLiveListening ? 'Live Listening' : 'Stream Paused'}</span>
                </button>
              </div>
            </div>

            {/* High-density Terminal Body */}
            <div className="bg-slate-950 rounded-xl border border-slate-900 p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2 scrollbar-thin">
              {filteredLogs.map(log => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-900/40 transition-colors"
                >
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                    log.level === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    log.level === 'WARN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-400 font-bold shrink-0">[{log.source}]:</span>
                  <span className="text-slate-200 flex-1">{log.text}</span>
                </div>
              ))}
            </div>

            {/* Live System Status Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { label: 'AI Planner', status: 'RUNNING', color: 'text-emerald-400' },
                { label: 'MCP Gateway', status: 'RUNNING', color: 'text-emerald-400' },
                { label: 'Database Indexer', status: 'RUNNING', color: 'text-emerald-400' },
                { label: 'Workflow Engine', status: 'RUNNING', color: 'text-emerald-400' }
              ].map((s, idx) => (
                <div key={idx} className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">{s.label}</span>
                  <span className={`font-bold flex items-center gap-1 ${s.color}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 5: DATABASE SCHEMA & TABLES --- */}
      {activeSubView === 'database_schema' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-900 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                GNN AI OS Database Entity Schema
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                PostgreSQL schema definition for users, encrypted OAuth accounts, sessions, and audit logs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {[
                {
                  table: 'users',
                  columns: ['id (UUID, PK)', 'email (VARCHAR, UNIQUE)', 'display_name (VARCHAR)', 'avatar_url (TEXT)', 'created_at (TIMESTAMP)']
                },
                {
                  table: 'oauth_accounts',
                  columns: ['id (UUID, PK)', 'user_id (UUID, FK)', 'provider (VARCHAR)', 'provider_account_id (VARCHAR)', 'access_token_encrypted (TEXT)', 'refresh_token_encrypted (TEXT)', 'expires_at (TIMESTAMP)', 'scopes (TEXT[])']
                },
                {
                  table: 'sessions',
                  columns: ['id (UUID, PK)', 'user_id (UUID, FK)', 'token_hash (VARCHAR)', 'expires_at (TIMESTAMP)', 'ip_address (INET)', 'user_agent (TEXT)']
                },
                {
                  table: 'roles & permissions',
                  columns: ['role_id (VARCHAR, PK)', 'permission_key (VARCHAR, PK)', 'description (TEXT)', 'created_at (TIMESTAMP)']
                },
                {
                  table: 'mcp_connections',
                  columns: ['id (UUID, PK)', 'mcp_server_id (VARCHAR)', 'status (VARCHAR)', 'auth_method (VARCHAR)', 'endpoint (TEXT)', 'latency_ms (INT)', 'last_ping (TIMESTAMP)']
                },
                {
                  table: 'audit_logs',
                  columns: ['id (UUID, PK)', 'user_id (UUID)', 'action (VARCHAR)', 'target_entity (VARCHAR)', 'mcp_server (VARCHAR)', 'payload (JSONB)', 'timestamp (TIMESTAMP)']
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-purple-400 font-bold text-sm flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      {t.table}
                    </span>
                    <span className="text-[10px] text-slate-500">PostgreSQL</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {t.columns.map((col, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span className={col.includes('encrypted') ? 'text-amber-400 font-semibold' : ''}>
                          {col}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MCP Configuration Modal */}
      <AnimatePresence>
        {selectedMcpConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedMcpConfig.name} Configuration</h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedMcpConfig.endpoint}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMcpConfig(null)}
                  className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-bold capitalize">{selectedMcpConfig.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auth Method:</span>
                    <span className="text-slate-200">{selectedMcpConfig.authMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Roundtrip Latency:</span>
                    <span className="text-cyan-400">{selectedMcpConfig.latencyMs}ms</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase text-[10px] block">Required Scopes</label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMcpConfig.scopesRequired.map((sc, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px]">
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    handlePingMcp(selectedMcpConfig.id);
                    setSelectedMcpConfig(null);
                  }}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Ping Handshake & Save
                </button>
                <button
                  onClick={() => setSelectedMcpConfig(null)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-xs py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
