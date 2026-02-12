import { useEffect, useState } from 'react';
// FIX: Corrected supabase import path from ../services/supabaseClient to ../lib/supabaseClient
import { supabase } from '@/lib/supabaseClient';
import { Store, AdType } from '@/types';

interface UseStoresResult {
  stores: Store[];
  loading: boolean;
  error: string | null;
}

export function useStores(): UseStoresResult {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStores() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('estabelecimentos').select('*');
        if (error) throw error;
        const mapped: Store[] = (data ?? []).map((row: any) => ({
          id: row.id,
          name: row.nome,
          category: row.categoria ?? 'Outros',
          description: row.descricao ?? row.endereco ?? '',
          image: row.image_url ?? 'https://via.placeholder.com/300x300?text=Localizei',
          rating: row.rating ?? 0,
          reviewsCount: row.total_reviews ?? 0,
          distance: 'Freguesia • RJ',
          adType: (row.ad_type as AdType) ?? AdType.ORGANIC,
          subcategory: row.subcategoria ?? '',
          address: row.endereco,
          phone: row.telefone,
          hours: row.horario_funcionamento,
        }));
        setStores(mapped);
      } catch (e: any) {
        setError(e?.message ?? 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  return { stores, loading, error };
}