
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ConfigFeatures {
  cashbackEnabled: boolean;
  couponsEnabled: boolean;
  jobsEnabled: boolean;
  agencyEnabled: boolean;
  communityEnabled: boolean;
}

interface ConfigContextType {
  features: ConfigFeatures;
  updateFeatures: (newFeatures: Partial<ConfigFeatures>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Configurações padrão (Feature Flags)
  const [features, setFeatures] = useState<ConfigFeatures>(() => {
    const saved = localStorage.getItem('localizei_features');
    return saved ? JSON.parse(saved) : {
      cashbackEnabled: true,
      couponsEnabled: true,
      jobsEnabled: true,
      agencyEnabled: true,
      communityEnabled: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('localizei_features', JSON.stringify(features));
  }, [features]);

  const updateFeatures = (newFeatures: Partial<ConfigFeatures>) => {
    setFeatures(prev => ({ ...prev, ...newFeatures }));
  };

  return (
    <ConfigContext.Provider value={{ features, updateFeatures }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider');
  }
  return context;
};
