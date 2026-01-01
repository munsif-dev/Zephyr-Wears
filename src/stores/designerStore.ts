import { create } from 'zustand';
import { DesignLayerType } from '@/types';

interface DesignerStore {
  layers: DesignLayerType[];
  selectedLayerId: string | null;
  tool: 'select' | 'text' | 'image';
  zoom: number;
  productId: string | null;
  designId: string | null;

  // Layer actions
  addLayer: (layer: DesignLayerType) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<DesignLayerType>) => void;
  duplicateLayer: (id: string) => void;
  reorderLayer: (id: string, direction: 'up' | 'down') => void;

  // Selection
  selectLayer: (id: string | null) => void;

  // Tool
  setTool: (tool: DesignerStore['tool']) => void;

  // Zoom
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // Layer visibility and locking
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;

  // Design management
  setProductId: (id: string) => void;
  setDesignId: (id: string | null) => void;
  loadDesign: (layers: DesignLayerType[], designId: string) => void;
  clearDesign: () => void;

  // Helpers
  getSelectedLayer: () => DesignLayerType | null;
  canMoveLayerUp: (id: string) => boolean;
  canMoveLayerDown: (id: string) => boolean;
}

export const useDesignerStore = create<DesignerStore>((set, get) => ({
  layers: [],
  selectedLayerId: null,
  tool: 'select',
  zoom: 1,
  productId: null,
  designId: null,

  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, layer],
      selectedLayerId: layer.id,
    })),

  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    })),

  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),

  duplicateLayer: (id) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (!layer) return state;

      const newLayer: DesignLayerType = {
        ...layer,
        id: crypto.randomUUID(),
        x: layer.x + 10,
        y: layer.y + 10,
      };

      return {
        layers: [...state.layers, newLayer],
        selectedLayerId: newLayer.id,
      };
    }),

  reorderLayer: (id, direction) =>
    set((state) => {
      const index = state.layers.findIndex((l) => l.id === id);
      if (index === -1) return state;

      const newLayers = [...state.layers];
      const newOrder = direction === 'up' ? index + 1 : index - 1;

      if (newOrder < 0 || newOrder >= newLayers.length) return state;

      [newLayers[index], newLayers[newOrder]] = [newLayers[newOrder], newLayers[index]];

      // Update order property
      return {
        layers: newLayers.map((layer, idx) => ({ ...layer, order: idx })),
      };
    }),

  selectLayer: (id) => set({ selectedLayerId: id }),

  setTool: (tool) => set({ tool }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),

  zoomIn: () => set((state) => ({ zoom: Math.min(3, state.zoom + 0.1) })),

  zoomOut: () => set((state) => ({ zoom: Math.max(0.1, state.zoom - 0.1) })),

  resetZoom: () => set({ zoom: 1 }),

  toggleLayerVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } : l
      ),
    })),

  toggleLayerLock: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, locked: !l.locked } : l
      ),
    })),

  setProductId: (id) => set({ productId: id }),

  setDesignId: (id) => set({ designId: id }),

  loadDesign: (layers, designId) =>
    set({
      layers,
      designId,
      selectedLayerId: null,
    }),

  clearDesign: () =>
    set({
      layers: [],
      selectedLayerId: null,
      designId: null,
      tool: 'select',
      zoom: 1,
    }),

  getSelectedLayer: () => {
    const state = get();
    return state.layers.find((l) => l.id === state.selectedLayerId) || null;
  },

  canMoveLayerUp: (id) => {
    const state = get();
    const index = state.layers.findIndex((l) => l.id === id);
    return index < state.layers.length - 1;
  },

  canMoveLayerDown: (id) => {
    const state = get();
    const index = state.layers.findIndex((l) => l.id === id);
    return index > 0;
  },
}));
