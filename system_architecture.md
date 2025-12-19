 TermSync 시스템 아키텍처 (Sionic Platform 기반)

🎯 핵심 구조
┌─────────────────────────────────────────────────────────┐
│                   프론트엔드 (당신 담당)                  │
│              Next.js + Zustand + Tailwind               │
│                    "껍데기 + UI/UX"                      │
└─────────────────────────────────────────────────────────┘
                           ↕️ REST API
┌─────────────────────────────────────────────────────────┐
│                 Sionic Platform (팀원 담당)              │
│  • 문서 파싱 (STORM Parse)                              │
│  • LLM (GPT-4)                                          │
│  • DB 저장/검색 (STORM Bucket)                          │
│  • 챗봇 로직                                             │
└─────────────────────────────────────────────────────────┘


📂 프론트엔드 구조 (당신 작업)
termsync-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 글로벌 레이아웃
│   ├── page.tsx                  # 랜딩 페이지
│   │
│   ├── workspace/
│   │   ├── page.tsx              # 워크스페이스 선택
│   │   └── [id]/
│   │       ├── page.tsx          # 모드 선택
│   │       ├── unify/            # 용어 통일 모드
│   │       │   ├── upload/       # 파일 업로드
│   │       │   ├── analyze/      # AI 분석 진행
│   │       │   ├── review/       # 그룹 검토 ⭐ 핵심!
│   │       │   ├── confirm/      # 최종 확인
│   │       │   └── result/       # 완료
│   │       │
│   │       └── generate/         # 자동 생성 모드
│   │           ├── page.tsx      # 메인 (탭 전환)
│   │           ├── guide/        # UI 가이드 작성
│   │           └── terms/        # 용어 추천
│   │
│   └── api/                      # API Routes (Sionic 연결)
│       ├── workspace/
│       ├── unify/
│       └── generate/
│
├── components/                   # 재사용 컴포넌트
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ProgressBar.tsx
│   │
│   ├── workspace/
│   │   ├── WorkspaceCard.tsx
│   │   └── WorkspaceCreateModal.tsx
│   │
│   ├── unify/                    # 용어 통일 모드
│   │   ├── TermGroupCard.tsx    # ⭐ 가장 중요!
│   │   ├── TermGroupDetail.tsx
│   │   ├── FileUploader.tsx
│   │   ├── AnalysisProgress.tsx
│   │   └── StatsPanel.tsx       # 우측 통계
│   │
│   ├── generate/                 # 자동 생성 모드
│   │   ├── Chatbot.tsx          # ⭐ 챗봇 컴포넌트
│   │   ├── GuideEditor.tsx
│   │   └── TermRecommendation.tsx
│   │
│   └── ui/                       # shadcn/ui 스타일 컴포넌트
│
├── store/                        # Zustand 상태 관리
│   ├── workspaceStore.ts
│   ├── unifyStore.ts             # 용어 통일 상태
│   ├── generateStore.ts          # 자동 생성 상태
│   └── chatStore.ts              # 챗봇 상태
│
├── lib/
│   ├── api.ts                    # API 호출 함수
│   ├── sionic.ts                 # Sionic Platform SDK
│   └── utils.ts
│
├── types/
│   ├── workspace.ts
│   ├── unify.ts
│   ├── generate.ts
│   └── chat.ts
│
└── styles/
    └── globals.css               # Tailwind 설정

🔌 API 연결 구조
프론트엔드 → Sionic Platform
typescript// lib/api.ts
const SIONIC_API_BASE = process.env.NEXT_PUBLIC_SIONIC_API_URL;

// 예시: 파일 업로드 → 분석 요청
export async function analyzeDocuments(files: File[]) {
  // 1. 프론트엔드에서 FormData 생성
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  // 2. Sionic Platform API 호출
  const response = await fetch(`${SIONIC_API_BASE}/api/unify/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  return await response.json();
}

// 예시: 챗봇 질문
export async function askChatbot(
  workspaceId: string,
  question: string
) {
  const response = await fetch(`${SIONIC_API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspaceId, question }),
  });
  
  return await response.json();
}

🗄️ Zustand Store 구조
1. Unify Store (용어 통일)
typescript// store/unifyStore.ts
import { create } from 'zustand';

interface UnifyStore {
  // 상태
  files: File[];
  uploadedFiles: UploadedFile[];
  dbEnabled: boolean;
  analysisStatus: 'idle' | 'uploading' | 'analyzing' | 'complete';
  termGroups: TermGroup[];
  selectedGroups: Set<string>;
  
  // 액션
  setFiles: (files: File[]) => void;
  toggleDB: () => void;
  startAnalysis: () => Promise<void>;
  toggleGroup: (groupId: string) => void;
  toggleTerm: (groupId: string, termId: string) => void;
  updateStandard: (groupId: string, standard: string) => void;
  addManualGroup: (group: ManualGroup) => void;
}

export const useUnifyStore = create<UnifyStore>((set, get) => ({
  files: [],
  uploadedFiles: [],
  dbEnabled: false,
  analysisStatus: 'idle',
  termGroups: [],
  selectedGroups: new Set(),
  
  setFiles: (files) => set({ files }),
  
  toggleDB: () => set(state => ({ 
    dbEnabled: !state.dbEnabled 
  })),
  
  startAnalysis: async () => {
    set({ analysisStatus: 'analyzing' });
    
    // Sionic API 호출
    const result = await analyzeDocuments(get().files);
    
    set({ 
      termGroups: result.termGroups,
      analysisStatus: 'complete'
    });
  },
  
  toggleGroup: (groupId) => set(state => {
    const newSelected = new Set(state.selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    return { selectedGroups: newSelected };
  }),
  
  // ... 기타 액션
}));

2. Chat Store (챗봇)
typescript// store/chatStore.ts
import { create } from 'zustand';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  
  sendMessage: (question: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  
  sendMessage: async (question) => {
    // 사용자 메시지 추가
    set(state => ({
      messages: [
        ...state.messages,
        { role: 'user', content: question }
      ],
      isLoading: true
    }));
    
    // Sionic API 호출
    const response = await askChatbot(
      workspaceId, 
      question
    );
    
    // AI 답변 추가
    set(state => ({
      messages: [
        ...state.messages,
        { 
          role: 'assistant', 
          content: response.answer,
          sources: response.sources  // 원문 링크
        }
      ],
      isLoading: false
    }));
  },
  
  clearMessages: () => set({ messages: [] }),
}));

🎨 핵심 컴포넌트 예시
TermGroupCard (가장 중요!)
typescript// components/unify/TermGroupCard.tsx
'use client';

import { useState } from 'react';
import { useUnifyStore } from '@/store/unifyStore';

export function TermGroupCard({ group }: { group: TermGroup }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleGroup, toggleTerm, updateStandard } = useUnifyStore();
  
  return (
    <div className={`
      border-2 rounded-xl p-5 transition-all
      ${group.checked 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-300 bg-gray-50 opacity-70'
      }
    `}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={group.checked}
            onChange={() => toggleGroup(group.id)}
            className="w-5 h-5"
          />
          <h3 className="font-bold text-lg">
            {group.name} ({group.totalCount}건)
          </h3>
          {group.source === 'db' && (
            <span className="badge">💾 DB 매칭</span>
          )}
          {group.source === 'ai' && (
            <span className="badge">🤖 AI 분석</span>
          )}
        </div>
        
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '▲ 접기' : '▼ 상세 보기'}
        </button>
      </div>
      
      {/* 요약 (접힌 상태) */}
      {!isExpanded && (
        <div className="mt-3 text-sm text-gray-600">
          🔍 {group.variants.join(', ')}
          → 🎯 {group.standard}
        </div>
      )}
      
      {/* 상세 (펼친 상태) */}
      {isExpanded && (
        <div className="mt-5">
          {/* 표준 용어 선택 */}
          <div className="mb-4">
            <label>🎯 표준 용어 선택:</label>
            <select 
              value={group.standard}
              onChange={(e) => updateStandard(group.id, e.target.value)}
            >
              {group.variants.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          
          {/* 각 문서별 발견 항목 */}
          {group.occurrences.map(occ => (
            <div key={occ.id} className="border rounded p-3 mb-2">
              <input
                type="checkbox"
                checked={occ.checked}
                onChange={() => toggleTerm(group.id, occ.id)}
              />
              <div className="ml-6">
                <div className="flex gap-2">
                  <span className="bg-red-100 px-2 rounded">
                    {occ.before}
                  </span>
                  →
                  <span className="bg-green-100 px-2 rounded">
                    {occ.after}
                  </span>
                </div>
                <p className="text-sm mt-2 text-gray-700">
                  📝 {occ.sentence}
                </p>
                <p className="text-xs text-gray-500">
                  💡 {occ.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Chatbot 컴포넌트
typescript// components/generate/Chatbot.tsx
'use client';

import { useState } from 'react';
import { useChatStore } from '@/store/chatStore';

export function Chatbot() {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChatStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput('');
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h3>💬 문서 DB 챗봇</h3>
        <div className="text-sm text-gray-600">
          📚 문서 3개 • 📖 용어 9개
        </div>
      </div>
      
      {/* 대화 내역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`
            ${msg.role === 'user' ? 'text-right' : 'text-left'}
          `}>
            <div className={`
              inline-block max-w-[80%] p-3 rounded-lg
              ${msg.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100'
              }
            `}>
              {msg.content}
            </div>
            
            {/* 출처 표시 (AI 답변만) */}
            {msg.role === 'assistant' && msg.sources && (
              <div className="mt-2 text-sm">
                {msg.sources.map(src => (
                  <div key={src.id} className="border rounded p-2 mb-1">
                    📄 {src.docName} - {src.line}행
                    <button className="text-blue-500 ml-2">
                      원문 보기 →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="text-gray-500">
            🤖 검색 중...
          </div>
        )}
      </div>
      
      {/* 입력 */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문 입력..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded"
          >
            🔍 검색
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## 🚀 당신이 할 일 (우선순위)

### **Phase 1: 기본 껍데기 (Day 1-2)**
```
✅ 1. Next.js 프로젝트 셋업
   - App Router 구조
   - Tailwind 설정
   - Zustand 설치

✅ 2. 라우팅 구조
   - 랜딩 → 워크스페이스 → 모드 선택
   - 각 페이지 빈 껍데기

✅ 3. 기본 컴포넌트
   - Button, Input, Modal
   - 레이아웃 구조
```

### **Phase 2: 핵심 UI (Day 3-4) ⭐**
```
✅ 4. 용어 통일 모드
   - 파일 업로드 UI
   - TermGroupCard (가장 중요!)
   - 우측 통계 패널

✅ 5. 자동 생성 모드
   - 챗봇 컴포넌트
   - UI 가이드 미리보기
```

### **Phase 3: API 연결 준비 (Day 5)**
```
✅ 6. API 함수 정의
   - lib/api.ts에 모든 API 함수 타입만 작성
   - 팀원에게 "이런 API 필요해요" 전달

✅ 7. Mock 데이터
   - 팀원 작업 전까지 사용할 가짜 데이터
   - 실제 API 완성되면 교체

📦 팀원에게 전달할 것
API 명세서 (예시)
typescript// API 명세 (팀원에게 전달)

// 1. 용어 통일 - 분석
POST /api/unify/analyze
Request:
  - files: File[]
  - dbEnabled: boolean
  - workspaceId: string
Response:
  {
    termGroups: TermGroup[],
    stats: { totalTerms, dbMatches, aiAnalyzed }
  }

// 2. 용어 통일 - 문서 생성
POST /api/unify/generate
Request:
  - termGroups: TermGroup[]
  - options: { saveToDb: boolean }
Response:
  {
    files: GeneratedFile[],
    downloadUrl: string
  }

// 3. 챗봇 - 질문
POST /api/chat
Request:
  - workspaceId: string
  - question: string
Response:
  {
    answer: string,
    sources: Source[],
    suggestions: string[]
  }

// 4. UI 가이드 생성
POST /api/generate/guide
Request:
  - images: File[]
  - options: { useDbStyle: boolean }
Response:
  {
    content: string,
    format: 'markdown',
    appliedTerms: string[]
  }
```

---

## ⚡ 핵심 요약
```
당신 역할:
┌──────────────────────────────────┐
│  프론트엔드 "껍데기" 구축         │
│  • Next.js 라우팅               │
│  • Zustand 상태 관리            │
│  • Tailwind UI 컴포넌트         │
│  • API 함수 타입 정의           │
└──────────────────────────────────┘

팀원 역할:
┌──────────────────────────────────┐
│  Sionic Platform 백엔드          │
│  • STORM Parse (문서 파싱)      │
│  • GPT-4 (AI 분석)              │
│  • STORM Bucket (DB)            │
│  • 챗봇 로직                    │
└──────────────────────────────────┘

연결:
프론트엔드 ←→ REST API ←→ Sionic Platform
