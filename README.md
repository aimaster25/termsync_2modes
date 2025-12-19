# TermSync Frontend

AI 기반 용어 통일 서비스의 프론트엔드 애플리케이션입니다.

## 🚀 주요 기능

### 1. 용어 통일 모드
- 📁 문서 업로드 (DOCX, PDF)
- 🤖 GPT-4 기반 AI 용어 분석
- 💾 DB 용어 자동 매칭
- ⚙️ 용어 그룹 검토 및 선택
- 📦 통일된 문서 다운로드

### 2. 자동 생성 모드
- 📝 UI 스크린샷 → 가이드 자동 작성
- 📖 키워드 기반 용어 추천
- 💬 문서 DB 챗봇 (RAG)

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **File Upload**: react-dropzone

## 📁 프로젝트 구조

```
termsync-frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 글로벌 레이아웃
│   ├── page.tsx                # 랜딩 페이지
│   ├── workspace/              # 워크스페이스
│   │   ├── page.tsx            # 워크스페이스 선택
│   │   └── [id]/
│   │       ├── page.tsx        # 모드 선택
│   │       ├── unify/          # 용어 통일 모드
│   │       │   ├── upload/
│   │       │   ├── analyze/
│   │       │   ├── review/     # ⭐ 핵심 페이지
│   │       │   ├── confirm/
│   │       │   └── result/
│   │       └── generate/       # 자동 생성 모드
│   └── globals.css
│
├── components/                 # 컴포넌트
│   ├── common/                 # 공통 컴포넌트
│   ├── layout/                 # 레이아웃 컴포넌트
│   ├── workspace/              # 워크스페이스 관련
│   ├── unify/                  # 용어 통일 모드
│   │   ├── TermGroupCard.tsx   # ⭐ 가장 중요
│   │   ├── FileUploader.tsx
│   │   └── StatsPanel.tsx
│   └── generate/               # 자동 생성 모드
│       ├── Chatbot.tsx         # ⭐ 챗봇
│       ├── GuideTab.tsx
│       └── TermsTab.tsx
│
├── store/                      # Zustand 상태 관리
│   ├── workspaceStore.ts
│   ├── unifyStore.ts
│   └── generateStore.ts
│
├── tailwind.config.ts          # Tailwind 설정
├── tsconfig.json               # TypeScript 설정
└── package.json
```

## 🚦 시작하기

### 1. 패키지 설치

```bash
npm install
# 또는
yarn install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 내용을 추가하세요:

```env
NEXT_PUBLIC_SIONIC_API_URL=http://localhost:8000
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📡 백엔드 연동

이 프로젝트는 **Sionic Platform**과 연동됩니다.

### API 엔드포인트 (예상)

```typescript
// 용어 통일 모드
POST /api/unify/analyze         # 문서 업로드 + 분석 시작
GET  /api/unify/groups/:taskId  # 분석 결과 조회
POST /api/unify/apply            # 용어 통일 실행

// 자동 생성 모드
POST /api/generate/guide         # UI 가이드 생성
GET  /api/generate/terms         # 용어 검색
POST /api/chat                   # 챗봇 질문

// 워크스페이스
GET  /api/workspace              # 워크스페이스 목록
POST /api/workspace              # 워크스페이스 생성
```

## 🎨 디자인 시스템

### 색상

- **Primary**: `#2bee79` (밝은 초록)
- **Background Dark**: `#102217` (진한 초록/검정)
- **Surface Dark**: `#1A2C23`

### 폰트

- **Display**: Spline Sans
- **Body**: Noto Sans KR

## 🔧 주요 컴포넌트

### TermGroupCard

용어 그룹을 표시하고 관리하는 핵심 컴포넌트입니다.

```tsx
import TermGroupCard from '@/components/unify/TermGroupCard'

<TermGroupCard group={termGroup} />
```

### Chatbot

문서 DB 기반 RAG 챗봇 컴포넌트입니다.

```tsx
import Chatbot from '@/components/generate/Chatbot'

<Chatbot />
```

## 📦 빌드

```bash
npm run build
npm run start
```

## 🤝 기여

백엔드 팀과 협업 시 `system_architecture.md`의 API 명세를 참고하세요.

## 📄 라이선스

MIT

---

**TermSync** - AI 기반 용어 통일 서비스

