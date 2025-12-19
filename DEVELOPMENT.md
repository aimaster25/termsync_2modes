# TermSync 개발 가이드

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [개발 환경 설정](#개발-환경-설정)
3. [주요 기능 구현](#주요-기능-구현)
4. [백엔드 API 연동](#백엔드-api-연동)
5. [상태 관리](#상태-관리)
6. [스타일 가이드](#스타일-가이드)

## 프로젝트 개요

TermSync는 AI 기반 용어 통일 서비스입니다. 프론트엔드는 Next.js 14 + Zustand + Tailwind CSS로 구성되어 있으며, 백엔드는 Sionic Platform을 사용합니다.

### 핵심 페이지

#### 용어 통일 모드 (5단계)
1. **파일 업로드**: `/workspace/[id]/unify/upload`
2. **AI 분석**: `/workspace/[id]/unify/analyze`
3. **그룹 검토** ⭐: `/workspace/[id]/unify/review`
4. **최종 확인**: `/workspace/[id]/unify/confirm`
5. **완료**: `/workspace/[id]/unify/result`

#### 자동 생성 모드
- **메인**: `/workspace/[id]/generate`
  - UI 가이드 작성 탭
  - 용어 추천 탭
  - 문서 DB 챗봇

## 개발 환경 설정

### 1. 필수 도구

- Node.js 18+
- npm 또는 yarn

### 2. 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm run start
```

### 3. 환경 변수

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SIONIC_API_URL=http://localhost:8000
```

## 주요 기능 구현

### 용어 통일 모드 - 그룹 검토 페이지

가장 중요한 페이지입니다. `TermGroupCard` 컴포넌트가 핵심입니다.

```tsx
// app/workspace/[id]/unify/review/page.tsx
import TermGroupCard from '@/components/unify/TermGroupCard'

const { termGroups } = useUnifyStore()

{termGroups.map((group) => (
  <TermGroupCard key={group.id} group={group} />
))}
```

#### TermGroupCard 주요 기능

- ✅ 그룹 전체 선택/해제
- 📝 표준 용어 선택 (드롭다운)
- 📋 개별 항목 선택/해제
- 🔍 상세 보기 (접기/펼치기)
- 📄 문맥 정보 표시

### 챗봇 (RAG)

```tsx
// components/generate/Chatbot.tsx
const { messages, isLoading, sendMessage } = useGenerateStore()

const handleSubmit = async (e) => {
  e.preventDefault()
  await sendMessage(input)
}
```

#### 챗봇 출처 표시

```tsx
{message.sources?.map((source) => (
  <div key={source.id}>
    📄 {source.docName} - Line {source.line}
    <p>"{source.snippet}"</p>
  </div>
))}
```

## 백엔드 API 연동

### API 유틸리티 함수

`lib/api.ts` 파일 생성 예정:

```typescript
const SIONIC_API_BASE = process.env.NEXT_PUBLIC_SIONIC_API_URL

// 용어 통일 - 분석 시작
export async function analyzeDocuments(files: File[]) {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  
  const response = await fetch(`${SIONIC_API_BASE}/api/unify/analyze`, {
    method: 'POST',
    body: formData,
  })
  
  return await response.json()
}

// 챗봇 - 질문
export async function askChatbot(
  workspaceId: string,
  question: string
) {
  const response = await fetch(`${SIONIC_API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspaceId, question }),
  })
  
  return await response.json()
}
```

### 백엔드 팀에 전달할 API 명세

```yaml
# 용어 통일 모드
POST /api/unify/analyze
  - Request: FormData (files: File[])
  - Response: {
      taskId: string,
      status: 'analyzing'
    }

GET /api/unify/groups/:taskId
  - Response: {
      groups: TermGroup[]
    }

POST /api/unify/apply
  - Request: {
      taskId: string,
      selectedGroups: string[],
      saveToDb: boolean
    }
  - Response: {
      downloadUrl: string
    }

# 자동 생성 모드
POST /api/generate/guide
  - Request: FormData (image: File)
  - Response: {
      guideText: string
    }

POST /api/chat
  - Request: {
      workspaceId: string,
      question: string
    }
  - Response: {
      answer: string,
      sources: Source[]
    }
```

## 상태 관리

### Zustand Store 구조

#### workspaceStore

```typescript
{
  workspaces: Workspace[],
  currentWorkspace: Workspace | null,
  
  setWorkspaces(),
  addWorkspace(),
  selectWorkspace(),
  updateWorkspace(),
  deleteWorkspace(),
}
```

#### unifyStore (용어 통일 모드)

```typescript
{
  files: UploadedFile[],
  dbEnabled: boolean,
  analysisProgress: number,
  termGroups: TermGroup[],
  
  addFiles(),
  toggleDB(),
  setTermGroups(),
  toggleGroup(),
  toggleTerm(),
  updateStandard(),
}
```

#### generateStore (자동 생성 모드)

```typescript
{
  currentTab: 'guide' | 'terms',
  guideImage: File | null,
  guideText: string,
  messages: ChatMessage[],
  
  generateGuide(),
  sendMessage(),
  searchTerms(),
}
```

### Store 사용 예시

```tsx
'use client'

import { useUnifyStore } from '@/store/unifyStore'

export default function MyComponent() {
  const { termGroups, toggleGroup } = useUnifyStore()
  
  return (
    <div>
      {termGroups.map(group => (
        <div key={group.id}>
          <input
            type="checkbox"
            checked={group.checked}
            onChange={() => toggleGroup(group.id)}
          />
          {group.name}
        </div>
      ))}
    </div>
  )
}
```

## 스타일 가이드

### Tailwind 커스텀 색상

```typescript
// tailwind.config.ts
colors: {
  primary: '#2bee79',
  'background-light': '#f6f8f7',
  'background-dark': '#102217',
  'surface-dark': '#1A2C23',
}
```

### 폰트

- **Display**: Spline Sans (헤드라인, 버튼)
- **Body**: Noto Sans KR (본문)

### 컴포넌트 네이밍

- **페이지**: `[Name]Page` (예: `UnifyReviewPage`)
- **컴포넌트**: `[Name]` (예: `TermGroupCard`)
- **모달**: `[Name]Modal` (예: `WorkspaceCreateModal`)
- **탭**: `[Name]Tab` (예: `GuideTab`)

### 스타일 패턴

```tsx
// Card with hover effect
<Card 
  variant="bordered"
  className="hover:border-primary/50 transition-all cursor-pointer"
>

// Primary button
<Button variant="primary" size="lg">
  확인 →
</Button>

// Badge with icon
<Badge variant="primary">
  💾 DB 매칭
</Badge>
```

## 🚀 다음 단계

1. **백엔드 API 연동**
   - `lib/api.ts` 파일 작성
   - 각 페이지에서 실제 API 호출로 변경

2. **에러 처리**
   - API 에러 핸들링
   - 사용자 친화적 에러 메시지

3. **성능 최적화**
   - 이미지 최적화 (next/image)
   - 코드 스플리팅
   - 메모이제이션

4. **테스트**
   - 단위 테스트 (Jest)
   - E2E 테스트 (Playwright)

5. **배포**
   - Vercel 또는 자체 서버
   - 환경 변수 설정

---

**TermSync Development Team** 🚀

