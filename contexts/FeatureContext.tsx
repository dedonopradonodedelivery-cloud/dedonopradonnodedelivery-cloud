import React, { createContext, useContext, useState, useEffect } from 'react';

export type FeatureKey = 
  | 'home_tab'
  | 'community_feed' 
  | 'explore_guide' 
  | 'coupons' 
  | 'classifieds' 
  | 'sponsored_ads' 
  | 'banner_highlights' 
  | 'master_sponsor' 
  | 'customer_reviews' 
  | 'service_chat' 
  | 'store_feed' 
  | 'explainer_videos';

export interface FeatureState {
  id: FeatureKey;
  label: string;
  active: boolean;
  category: 'navigation' | 'main' | 'growth' | 'other' | string;
}

const DEFAULT_FEATURES: FeatureState[] = [
  { id: 'home_tab', label: 'Aba: Home', active: true, category: 'navigation' },
  { id: 'explore_guide', label: 'Aba: Guia do Bairro', active: true, category: 'navigation' },
  { id: 'classifieds', label: 'Aba: Classificados', active: true, category: 'navigation' },
  { id: 'coupons', label: 'Aba: Cupons', active: true, category: 'navigation' },
  { id: 'community_feed', label: 'Aba: JPA Conversa', active: true, category: 'navigation' },
];

interface FeatureContextType {
  features: Record<string, boolean>;
  toggleFeature: (key: FeatureKey) => void;
  isFeatureActive: (key: FeatureKey) => boolean;
  featureList: FeatureState[];
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featureSettings, setFeatureSettings] = useState<FeatureState[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_FEATURES;
    const saved = localStorage.getItem('localizei_feature_flags');
    if (!saved) return DEFAULT_FEATURES;
    try {
      const parsed = JSON.parse(saved);
      return DEFAULT_FEATURES.map(def => {
        const existing = parsed.find((p: any) => p.id === def.id);
        return existing ? { ...def, active: existing.active } : def;
      });
    } catch (e) {
      return DEFAULT_FEATURES;
    }
  });

  useEffect(() => {
    localStorage.setItem('localizei_feature_flags', JSON.stringify(featureSettings));
  }, [featureSettings]);

  const toggleFeature = (key: FeatureKey) => {
    setFeatureSettings(prev => prev.map(f => f.id === key ? { ...f, active: !f.active } : f));
  };

  const isFeatureActive = (key: FeatureKey) => {
    return featureSettings.find(f => f.id === key)?.active ?? false;
  };

  const features = featureSettings.reduce((acc, curr) => {
    acc[curr.id] = curr.active;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <FeatureContext.Provider value={{ features, toggleFeature, isFeatureActive, featureList: featureSettings }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (!context) throw new Error('useFeatures must be used within FeatureProvider');
  return context;
};