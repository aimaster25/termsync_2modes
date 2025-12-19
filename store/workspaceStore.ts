import { create } from 'zustand'

export interface Workspace {
  id: string
  name: string
  description?: string
  termCount: number
  documentCount: number
  lastUpdated: Date
  learningRate?: number
}

interface WorkspaceStore {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  
  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void
  addWorkspace: (workspace: Workspace) => void
  selectWorkspace: (id: string) => void
  updateWorkspace: (id: string, data: Partial<Workspace>) => void
  deleteWorkspace: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  
  setWorkspaces: (workspaces) => set({ workspaces }),
  
  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),
  
  selectWorkspace: (id) =>
    set((state) => ({
      currentWorkspace: state.workspaces.find((w) => w.id === id) || null,
    })),
  
  updateWorkspace: (id, data) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === id ? { ...w, ...data } : w
      ),
    })),
  
  deleteWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== id),
      currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace,
    })),
}))

