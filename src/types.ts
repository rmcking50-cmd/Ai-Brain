export type AssetType = 'video' | 'image' | 'audio' | 'script' | 'subtitles';

export interface RepositoryAsset {
  id: string;
  name: string;
  type: AssetType;
  url: string; // Blob URL, base64 data, or remote url
  duration?: string;
  size?: string;
  createdAt: string;
  resolution?: string;
  lyrics_or_text?: string;
  language?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedDate: string;
  category: string;
}

export interface GeneratedScript {
  id: string;
  articleId?: string;
  title: string;
  headline: string;
  hook: string;
  body: string;
  outro: string;
  voiceoverText: string;
  language: string;
  status: 'draft' | 'approved' | 'published';
  createdAt: string;
}

export interface SocialPost {
  id: string;
  scriptId?: string;
  assetId?: string;
  platforms: ('youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter')[];
  caption: string;
  tags: string[];
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: string;
}

export type OSUserRole = 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'EDITOR' | 'USER' | 'VIEWER';

export interface UserRolePayload {
  role: 'admin' | 'editor' | 'creator' | 'viewer';
  osRole?: OSUserRole;
  permissions: {
    canPublish: boolean;
    canGenerateAI: boolean;
    canEditRepository: boolean;
    canManageUsers: boolean;
  };
}

export interface McpPermissionSet {
  'github.read': boolean;
  'github.write': boolean;
  'github.deploy': boolean;
  'drive.read': boolean;
  'drive.write': boolean;
  'database.read': boolean;
  'database.write': boolean;
  'social.draft': boolean;
  'social.publish': boolean;
  'cloud.read': boolean;
  'cloud.scale': boolean;
}

export interface McpServerItem {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'active' | 'idle' | 'error';
  desc: string;
  latencyMs: number;
  scopesRequired: (keyof McpPermissionSet)[];
  endpoint?: string;
  lastSync?: string;
  authMethod: 'OAuth 2.0' | 'SSH Key' | 'API Key' | 'IAM Role';
}

export interface StructuredTelemetryLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  source: 'AI Planner' | 'MCP Gateway' | 'Database' | 'Workflow Engine' | 'Cloud' | 'Social Gateway' | 'GitHub MCP' | 'Google Drive MCP' | 'Ocoya MCP' | 'Timing Optimizer';
  event: string;
  project: string;
  status: 'running' | 'completed' | 'pending' | 'blocked';
  text: string;
}

export interface TimingOptimizationPlan {
  industryStream: 'Local/National News' | 'Tech & Security' | 'Sports Broadcaster' | 'Viral Creator';
  targetHour: string;
  engagementGain: string;
  retentionScore: number;
  optimalDays: string[];
  audienceHotspot: string;
  recommendation: string;
}

export interface VideoGenerationStatus {
  id: string;
  operationName: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  quality: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
  resultUrl?: string;
}
