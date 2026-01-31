
import { CategoryBannerSlot } from '../types';

const STORAGE_KEY = 'category_banner_slots_v1';

export const categoryBannerService = {
  getSlots: (): CategoryBannerSlot[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    
    // Lógica para limpar reservas expiradas antes de retornar
    const now = new Date().getTime();
    const all = JSON.parse(saved) as CategoryBannerSlot[];
    const cleaned = all.map(slot => {
      if (slot.status === 'reserved' && slot.expiresAt && new Date(slot.expiresAt).getTime() < now) {
        // FIX: Added 'as const' to status to prevent widening to 'string' and match SlotStatus union.
        return { ...slot, status: 'available' as const, merchantId: undefined, merchantName: undefined, expiresAt: undefined };
      }
      return slot;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    return cleaned;
  },

  getSlot: (bairroSlug: string, categoriaSlug: string, slotNumber: 1 | 2): CategoryBannerSlot => {
    const key = `${bairroSlug}:${categoriaSlug}:slot${slotNumber}`;
    const all = categoryBannerService.getSlots();
    const found = all.find(s => s.uniqueKey === key);
    
    return found || {
      uniqueKey: key,
      bairroSlug,
      categoriaSlug,
      slotNumber,
      status: 'available'
    };
  },

  reserveSlot: (key: string, merchantId: string, merchantName: string) => {
    const all = categoryBannerService.getSlots();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 min

    const updated = all.filter(s => s.uniqueKey !== key);
    const [b, c, s] = key.split(':');
    
    const newSlot: CategoryBannerSlot = {
      uniqueKey: key,
      bairroSlug: b,
      categoriaSlug: c,
      slotNumber: s.replace('slot', '') as any,
      status: 'reserved',
      merchantId,
      merchantName,
      expiresAt
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...updated, newSlot]));
    return newSlot;
  },

  confirmPurchase: (key: string, config: { image: string; title: string; subtitle: string }) => {
    const all = categoryBannerService.getSlots();
    const existing = all.find(s => s.uniqueKey === key);
    
    if (!existing) return false;

    const updated = all.map(s => {
      if (s.uniqueKey === key) {
        // FIX: Added 'as const' to status to match SlotStatus union.
        return {
          ...s,
          status: 'sold' as const,
          image: config.image,
          title: config.title,
          subtitle: config.subtitle,
          expiresAt: undefined
        };
      }
      return s;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  }
};
