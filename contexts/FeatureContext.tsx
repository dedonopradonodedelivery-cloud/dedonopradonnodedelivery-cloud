
import React, { createContext, useContext, useState, useEffect } from 'react';

export type FeatureKey = 
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

interface FeatureState {
  id: FeatureKey;
  label: string;
  active: boolean;
  category: 'main' | 'growth' | 'other';
}

interface FeatureContextType {
  features: Record<FeatureKey, boolean>;
  toggleFeature: (key: FeatureKey) => void;
  isFeatureActive: (key: FeatureKey) => boolean;
  featureList: FeatureState[];
}

const DEFAULT_FEATURES: FeatureState[] = [
  { id: 'community_feed', label: 'JPA Conversa', active: true, category: 'main' },
  { id: 'explore_guide', label: 'Guia do Bairro', active: true, category: 'main' },
  { id: 'coupons', label: 'Cupons', active: true, category: 'main' },
  { id: 'classifieds', label: 'Classificados', active: true, category: 'main' },
  { id: 'sponsored_ads', label: 'Patrocinados (Ads)', active: true, category: 'growth' },
  { id: 'banner_highlights', label: 'Banners em Destaque', active: true, category: 'growth' },
  { id: 'master_sponsor', label: 'Patrocinador Master', active: true, category: 'growth' },
  { id: 'customer_reviews', label: 'Avaliações de Clientes', active: true, category: 'other' },
  { id: 'service_chat', label: 'Mensagens / Chat', active: true, category: 'other' },
  { id: 'store_feed', label: 'Feed da Loja', active: true, category: 'other' },
  { id: 'explainer_videos', label: 'Vídeos Explicativos', active: true, category: 'other' },
];

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featureSettings, setFeatureSettings] = useState<FeatureState[]>(() => {
    const saved = localStorage.getItem('localizei_feature_flags');
    return saved ? JSON.parse(saved) : DEFAULT_FEATURES;
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
  }, {} as Record<FeatureKey, boolean>);

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
