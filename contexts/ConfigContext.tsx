
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FeatureFlags } from '../types';

interface ConfigContextType {
  features: FeatureFlags;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  updateFeatures: (newFeatures: Partial<FeatureFlags>) => Promise<boolean>;
}

const DEFAULT_FEATURES: FeatureFlags = {
  cashbackEnabled: true,
  couponsEnabled: true,
  jobsEnabled: true,
  agencyEnabled: false,
  sponsorMasterBannerEnabled: true,
};

const ConfigContext = createContext<ConfigContextType>({
  features: DEFAULT_FEATURES,
  loading: true,
  refreshConfig: async () => {},
  updateFeatures: async () => false,
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureFlags>(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('*')
        .eq('id', 'features')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFeatures({
          cashbackEnabled: data.cashback_enabled ?? true,
          couponsEnabled: data.coupons_enabled ?? true,
          jobsEnabled: data.jobs_enabled ?? true,
          agencyEnabled: data.agency_enabled ?? false,
          sponsorMasterBannerEnabled: data.sponsor_master_banner_enabled ?? true,
        });
      }
    } catch (err) {
      console.warn('Erro ao carregar Feature Flags, usando defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFeatures = async (newFeatures: Partial<FeatureFlags>) => {
    try {
      const payload = {
        cashback_enabled: newFeatures.cashbackEnabled ?? features.cashbackEnabled,
        coupons_enabled: newFeatures.couponsEnabled ?? features.couponsEnabled,
        jobs_enabled: newFeatures.jobsEnabled ?? features.jobsEnabled,
        agency_enabled: newFeatures.agencyEnabled ?? features.agencyEnabled,
        sponsor_master_banner_enabled: newFeatures.sponsorMasterBannerEnabled ?? features.sponsorMasterBannerEnabled,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('app_config')
        .update(payload)
        .eq('id', 'features');

      if (error) throw error;
      
      // O listener em tempo real (useEffect) atualizará o estado local automaticamente,
      // mas fazemos o merge local para feedback instantâneo na UI
      setFeatures(prev => ({ ...prev, ...newFeatures }));
      return true;
    } catch (err) {
      console.error('Erro ao atualizar Feature Flags:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
    
    const channel = supabase
      .channel('app_config_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'app_config', filter: 'id=eq.features' },
        (payload) => {
          const updated = payload.new as any;
          if (updated) {
              setFeatures({
                cashbackEnabled: updated.cashback_enabled,
                couponsEnabled: updated.coupons_enabled,
                jobsEnabled: updated.jobs_enabled,
                agencyEnabled: updated.agency_enabled, // Fix: Use property name from FeatureFlags interface
                sponsorMasterBannerEnabled: updated.sponsor_master_banner_enabled,
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ features, loading, refreshConfig: fetchConfig, updateFeatures }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
