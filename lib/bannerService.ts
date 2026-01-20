import { mockUserBanners } from '../data/mockBanners';
import { BannerItem } from '../types';
import { supabase } from './supabaseClient';

// FIX: Added optional chaining to prevent runtime error if import.meta.env is undefined.
const useMock = (((import.meta as any).env)?.VITE_USE_MOCK_BANNERS ?? "true") === "true";

export async function fetchHomeBanner(): Promise<BannerItem | null> {
    if (useMock) {
        // Simula latência de rede
        await new Promise((r) => setTimeout(r, 150));
        // Retorna um banner aleatório do mock
        return mockUserBanners[Math.floor(Math.random() * mockUserBanners.length)];
    }

    // A chamada ao Supabase está temporariamente desativada para corrigir o build.
    // Mesmo com VITE_USE_MOCK_BANNERS=false, usaremos o mock como fallback.
    console.warn("VITE_USE_MOCK_BANNERS is false, but Supabase call is temporarily disabled for build fix. Returning mock data as fallback.");
    await new Promise((r) => setTimeout(r, 50));
    return mockUserBanners[0];
    
    /*
    // --- IMPLEMENTAÇÃO FUTURA QUANDO AS ENVS DO SUPABASE ESTIVEREM GARANTIDAS NA VERCEL ---
    if (!supabase) return mockUserBanners[0]; 

    try {
        const { data, error } = await supabase
            .from('published_banners')
            .select('id, config, merchant_id')
            .eq('target', 'home')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found, which is not an error
             throw error;
        }

        if (data) {
            return {
                id: `user-banner-${data.id}`,
                isUserBanner: true,
                config: data.config,
                target: data.merchant_id,
            };
        }
        return null; // Nenhum banner encontrado no Supabase

    } catch (e: any) {
        console.error("Failed to fetch home banner from Supabase, returning mock data:", e.message || e);
        return mockUserBanners[0]; // Fallback em caso de erro
    }
    */
}