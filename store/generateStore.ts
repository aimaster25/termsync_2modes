import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: {
    id: string
    docName: string
    line: number
    snippet: string
  }[]
  timestamp: Date
}

export interface TermRecommendation {
  id: string
  term: string
  definition: string
  category: string
  source: string
  confidence: number
}

interface GenerateStore {
  // State
  currentTab: 'guide' | 'terms'
  
  // Guide state
  guideImage: File | null
  guideImageUrl: string | null
  guideText: string
  guideStatus: 'idle' | 'analyzing' | 'generating' | 'complete'
  
  // Terms state
  searchQuery: string
  termRecommendations: TermRecommendation[]
  selectedTerms: Set<string>
  
  // Chat state
  messages: ChatMessage[]
  isLoading: boolean

  // Actions
  setCurrentTab: (tab: 'guide' | 'terms') => void
  
  // Guide actions
  setGuideImage: (file: File | null) => void
  setGuideImageUrl: (url: string | null) => void
  setGuideText: (text: string) => void
  setGuideStatus: (status: 'idle' | 'analyzing' | 'generating' | 'complete') => void
  generateGuide: () => Promise<void>
  
  // Terms actions
  setSearchQuery: (query: string) => void
  setTermRecommendations: (terms: TermRecommendation[]) => void
  toggleTerm: (termId: string) => void
  searchTerms: (query: string) => Promise<void>
  
  // Chat actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  
  // Reset
  reset: () => void
}

export const useGenerateStore = create<GenerateStore>((set, get) => ({
  // Initial State
  currentTab: 'guide',
  
  guideImage: null,
  guideImageUrl: null,
  guideText: '',
  guideStatus: 'idle',
  
  searchQuery: '',
  termRecommendations: [],
  selectedTerms: new Set(),
  
  messages: [],
  isLoading: false,

  // Actions
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  setGuideImage: (file) => set({ guideImage: file }),
  setGuideImageUrl: (url) => set({ guideImageUrl: url }),
  setGuideText: (text) => set({ guideText: text }),
  setGuideStatus: (status) => set({ guideStatus: status }),
  
  generateGuide: async () => {
    set({ guideStatus: 'analyzing' })
    
    // Simulate image analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    set({ guideStatus: 'generating' })
    
    // Simulate guide generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockGuide = `# UI 가이드

## 셔터 버튼 사용법

1. **반셔터 (초점 맞추기)**
   - 셔터 버튼을 반쯤 눌러 초점을 맞춥니다
   - 초점이 맞으면 피사체에 녹색 프레임이 표시됩니다

2. **전셔터 (촬영하기)**
   - 셔터 버튼을 완전히 눌러 사진을 촬영합니다
   - 촬영음이 들리면 촬영이 완료된 것입니다

## 주의사항

- 손떨림 방지를 위해 버튼을 부드럽게 누르세요
- 어두운 곳에서는 플래시가 자동으로 작동합니다`

    set({ 
      guideText: mockGuide,
      guideStatus: 'complete' 
    })
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setTermRecommendations: (terms) => set({ termRecommendations: terms }),
  
  toggleTerm: (termId) =>
    set((state) => {
      const newSelected = new Set(state.selectedTerms)
      if (newSelected.has(termId)) {
        newSelected.delete(termId)
      } else {
        newSelected.add(termId)
      }
      return { selectedTerms: newSelected }
    }),
  
  searchTerms: async (query) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockTerms: TermRecommendation[] = [
      {
        id: '1',
        term: '셔터 버튼',
        definition: '사진을 촬영하기 위해 누르는 버튼',
        category: '하드웨어',
        source: '카메라_매뉴얼.pdf',
        confidence: 100,
      },
      {
        id: '2',
        term: '노출',
        definition: '사진의 밝기를 결정하는 요소',
        category: '촬영 설정',
        source: '기본_가이드.docx',
        confidence: 95,
      },
    ]
    
    set({ termRecommendations: mockTerms })
  },
  
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    })),
  
  sendMessage: async (content) => {
    // Add user message
    const { addMessage } = get()
    addMessage({ role: 'user', content })
    
    set({ isLoading: true })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Add assistant response
    addMessage({
      role: 'assistant',
      content: '셔터 버튼은 카메라 상단에 위치한 촬영 버튼입니다. 반쯤 누르면 초점이 맞춰지고, 완전히 누르면 사진이 촬영됩니다.',
      sources: [
        {
          id: '1',
          docName: '카메라_매뉴얼.pdf',
          line: 42,
          snippet: '셔터 버튼을 반쯤 누르면 초점이 맞춰집니다...',
        },
      ],
    })
    
    set({ isLoading: false })
  },
  
  clearChat: () => set({ messages: [] }),
  
  reset: () =>
    set({
      currentTab: 'guide',
      guideImage: null,
      guideImageUrl: null,
      guideText: '',
      guideStatus: 'idle',
      searchQuery: '',
      termRecommendations: [],
      selectedTerms: new Set(),
      messages: [],
      isLoading: false,
    }),
}))

