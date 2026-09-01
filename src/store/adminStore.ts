import {create} from 'zustand'

interface AdminStore {
  isCollapse: boolean
  toggleCollapse: () => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  isCollapse: false,
  toggleCollapse: () => set((state) => ({isCollapse: !state.isCollapse})),
}))