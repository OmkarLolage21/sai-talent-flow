import { create } from 'zustand';

interface NavigationState {
  activeSection: string;
  activeSubItem?: string;
  expandedItems: string[];
  setActiveSection: (section: string, subItem?: string) => void;
  toggleExpanded: (itemId: string) => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  activeSection: 'dashboard',
  activeSubItem: undefined,
  expandedItems: ['dashboard'],
  
  setActiveSection: (section: string, subItem?: string) => 
    set({ activeSection: section, activeSubItem: subItem }),
    
  toggleExpanded: (itemId: string) => 
    set((state) => ({
      expandedItems: state.expandedItems.includes(itemId)
        ? state.expandedItems.filter(id => id !== itemId)
        : [...state.expandedItems, itemId]
    }))
}));