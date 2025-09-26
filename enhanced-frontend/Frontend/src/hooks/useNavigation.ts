import { create } from 'zustand';

interface NavigationState {
  activeSection: string;
  activeSubItem?: string;
  expandedItems: string[];
  selectedPlayerId?: string;
  setActiveSection: (section: string, subItem?: string) => void;
  setSelectedPlayerId: (id?: string) => void;
  toggleExpanded: (itemId: string) => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  activeSection: 'dashboard',
  activeSubItem: undefined,
  expandedItems: ['dashboard'],
  selectedPlayerId: undefined,
  
  setActiveSection: (section: string, subItem?: string) => 
    set({ activeSection: section, activeSubItem: subItem }),
  setSelectedPlayerId: (id?: string) =>
    set({ selectedPlayerId: id }),
    
  toggleExpanded: (itemId: string) => 
    set((state) => ({
      expandedItems: state.expandedItems.includes(itemId)
        ? state.expandedItems.filter(id => id !== itemId)
        : [...state.expandedItems, itemId]
    }))
}));