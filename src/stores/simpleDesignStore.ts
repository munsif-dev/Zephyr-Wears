import { create } from 'zustand';

export type Placement = 'chest' | 'back';

interface SimpleDesignState {
  // Design data
  imageUrl: string | null;
  placement: Placement;
  productId: string | null;
  selectedVariant: {
    id: string;
    size: string;
    color: string;
    colorHex?: string;
    price: number;
    stock: number;
  } | null;
  quantity: number;

  // Actions
  setImage: (url: string) => void;
  setPlacement: (placement: Placement) => void;
  setProductId: (id: string) => void;
  setSelectedVariant: (variant: {
    id: string;
    size: string;
    color: string;
    colorHex?: string;
    price: number;
    stock: number;
  }) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  clearDesign: () => void;

  // Computed
  isComplete: () => boolean;
  getTotalPrice: () => number;
}

export const useSimpleDesignStore = create<SimpleDesignState>((set, get) => ({
  // Initial state
  imageUrl: null,
  placement: 'chest',
  productId: null,
  selectedVariant: null,
  quantity: 1,

  // Actions
  setImage: (url) => set({ imageUrl: url }),

  setPlacement: (placement) => set({ placement }),

  setProductId: (id) => set({ productId: id }),

  setSelectedVariant: (variant) => set({ selectedVariant: variant }),

  setQuantity: (quantity) =>
    set({ quantity: Math.max(1, Math.min(quantity, get().selectedVariant?.stock || 99)) }),

  incrementQuantity: () => {
    const state = get();
    const maxStock = state.selectedVariant?.stock || 99;
    set({ quantity: Math.min(state.quantity + 1, maxStock) });
  },

  decrementQuantity: () => {
    set((state) => ({ quantity: Math.max(1, state.quantity - 1) }));
  },

  clearDesign: () =>
    set({
      imageUrl: null,
      placement: 'chest',
      productId: null,
      selectedVariant: null,
      quantity: 1,
    }),

  // Computed
  isComplete: () => {
    const state = get();
    return !!(state.imageUrl && state.selectedVariant && state.productId);
  },

  getTotalPrice: () => {
    const state = get();
    if (!state.selectedVariant) return 0;

    const { price } = state.selectedVariant;
    const customizationFee = 5.0; // From constants
    const total = (price + customizationFee) * state.quantity;
    return total;
  },
}));
