import { create } from 'zustand'

export interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
}

export interface TermOccurrence {
  id: string
  before: string
  after: string
  sentence: string
  context: string
  line: number
  checked: boolean
}

export interface TermGroup {
  id: string
  name: string
  checked: boolean
  source: 'db' | 'ai'
  totalCount: number
  variants: string[]
  standard: string
  confidence: number
  occurrences: TermOccurrence[]
}

interface UnifyStore {
  // State
  files: UploadedFile[]
  dbEnabled: boolean
  analysisStatus: 'idle' | 'uploading' | 'analyzing' | 'complete'
  analysisProgress: number
  logs: string[]
  termGroups: TermGroup[]
  selectedGroups: Set<string>

  // Actions
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  toggleDB: () => void
  setAnalysisStatus: (status: 'idle' | 'uploading' | 'analyzing' | 'complete') => void
  setAnalysisProgress: (progress: number) => void
  addLog: (log: string) => void
  setTermGroups: (groups: TermGroup[]) => void
  toggleGroup: (groupId: string) => void
  toggleTerm: (groupId: string, termId: string) => void
  updateStandard: (groupId: string, standard: string) => void
  addManualGroup: (group: TermGroup) => void
  reset: () => void
}

export const useUnifyStore = create<UnifyStore>((set, get) => ({
  // Initial State
  files: [],
  dbEnabled: false,
  analysisStatus: 'idle',
  analysisProgress: 0,
  logs: [],
  termGroups: [],
  selectedGroups: new Set(),

  // Actions
  addFiles: (newFiles) =>
    set((state) => ({
      files: [
        ...state.files,
        ...newFiles.map((file) => ({
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          size: file.size,
          file,
        })),
      ],
    })),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),

  clearFiles: () => set({ files: [] }),

  toggleDB: () =>
    set((state) => ({
      dbEnabled: !state.dbEnabled,
    })),

  setAnalysisStatus: (status) => set({ analysisStatus: status }),

  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),

  setTermGroups: (groups) =>
    set({
      termGroups: groups,
      selectedGroups: new Set(groups.map((g) => g.id)),
    }),

  toggleGroup: (groupId) =>
    set((state) => {
      const newTermGroups = state.termGroups.map((group) =>
        group.id === groupId ? { ...group, checked: !group.checked } : group
      )
      return { termGroups: newTermGroups }
    }),

  toggleTerm: (groupId, termId) =>
    set((state) => {
      const newTermGroups = state.termGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              occurrences: group.occurrences.map((occ) =>
                occ.id === termId ? { ...occ, checked: !occ.checked } : occ
              ),
            }
          : group
      )
      return { termGroups: newTermGroups }
    }),

  updateStandard: (groupId, standard) =>
    set((state) => ({
      termGroups: state.termGroups.map((group) =>
        group.id === groupId ? { ...group, standard } : group
      ),
    })),

  addManualGroup: (group) =>
    set((state) => ({
      termGroups: [...state.termGroups, group],
    })),

  reset: () =>
    set({
      files: [],
      dbEnabled: false,
      analysisStatus: 'idle',
      analysisProgress: 0,
      logs: [],
      termGroups: [],
      selectedGroups: new Set(),
    }),
}))

