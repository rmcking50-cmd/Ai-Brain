Gemini CLI-এর কাজের রিপোর্ট দেখে এখন **Foundation-এর একটি গুরুত্বপূর্ণ অংশ ইতিমধ্যেই তৈরি হয়েছে**—বিশেষ করে GitHub OAuth, JWT session এবং MCP permission middleware।

এখন আমি এটাকে GNN AI Studio-এর মূল architecture-এর সঙ্গে মিলিয়ে পরবর্তী কাজগুলো
GNN AI Studio
│
├── Web UI
├── Node API
│
├── Authentication
│   ├── GitHub OAuth       ✅
│   ├── JWT Session        ✅
│   ├── /auth/me           ✅
│   └── Logout             ✅
│
├── MCP Security
│   ├── Permission Check   ✅
│   ├── Role Hierarchy     ✅
│   └── /mcp/execute       ✅
│
└── এখন যোগ হবে
    ├── Gemini AI Core
    ├── MCP Gateway
    ├── Workflow Engine
    ├── Plugin System
    ├── Database
    ├── Social Automation
    └── Expo/EAS Mobile
```
SSH/GitHub সংক্রান্ত নথিও Foundation-এর সঙ্গে সামঞ্জস্যপূর্ণ। 

### পরবর্তী Core Architecture

আমি বিশেষভাবে এই তিনটি layer আলাদা রাখার পক্ষে:

**AI Engine**

```text
Gemini
OpenAI
Claude
   ↓
GNN AI Gateway
   ↓
Master Agent
```

**MCP Gateway**

```text
GNN Master Agent
       ↓
MCP Gateway
       ├── GitHub
       ├── Google Drive
       ├── Figma
       ├── Notion
       ├── Ocoya
       └── Custom MCP
```

**Execution**

```text
AI Plan
  ↓
Permission Check
  ↓
User Approval (যেখানে দরকার)
  ↓
Workflow/Worker
  ↓
MCP/API
  ↓
Result
  ↓
Audit Log
```

এতে AI-কে সরাসরি unrestricted access না দিয়ে **permission + approval + audit** রাখা যায়।

### Gemini

আপনার দেওয়া Gemini Interactions API-কে আমরা `ai-engine` provider হিসেবে রাখব। ভবিষ্যতে Gemini API পরিবর্তন হলেও পুরো অ্যাপ বদলাতে হবে না—শুধু provider adapter পরিবর্তন করা যাবে।

### Mobile

Expo + EAS থাকবে:

```text
GNN Web
GNN Mobile
     ↓
Shared packages
     ↓
GNN API
```
এতে Android APK/AAB এবং iOS build একই মূল codebase থেকে নেওয়া যাবে।
Security Fix

Gemini API key, revoke key 
GitHub OAuth secret, JWT secret, Firebase credentials এবং SSH private key source code-

GNN AI Studio Foundation v0.1`-
runnable  GitHub authentication code-কে ভিত্তি করে AI Gateway + MCP Gateway + database + workflow engine + Expo app একসাথে যুক্ত ।**
