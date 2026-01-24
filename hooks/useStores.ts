

import { useEffect, useState } from 'react';
// FIX: Corrected supabase import path from ../services/supabaseClient to ../lib/supabaseClient
import { supabase } from '../lib/supabaseClient';
import { Store, AdType } from '../types';

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
    // FIX: Explicitly set return type of fetchStores to Promise<void>
    async function fetchStores(): Promise<void> {
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
          image: row.image_url