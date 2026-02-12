import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export const useFavorites = (user: User | null) => {
  const [favoritesIds, setFavoritesIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !supabase) {
      setFavoritesIds([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('business_id')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          setFavoritesIds(data.map((item: any) => item.business_id));
        }
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = useCallback(async (storeId: string) => {
    if (!user || !supabase) return false;

    const isCurrentlyFavorite = favoritesIds.includes(storeId);
    
    setFavoritesIds(prev => 
      isCurrentlyFavorite 
        ? prev.filter(id => id !== storeId) 
        : [...prev, storeId]
    );

    try {
      if (isCurrentlyFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, business_id: storeId });
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, business_id: storeId });
        
        if (error) throw error;
      }
      return true;
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err);
      setFavoritesIds(prev => 
        isCurrentlyFavorite 
          ? [...prev, storeId] 
          : prev.filter(id => id !== storeId)
      );
      return false;
    }
  }, [user, favoritesIds]);

  const isFavorite = (storeId: string) => favoritesIds.includes(storeId);

  return { favoritesIds, toggleFavorite, isFavorite, loading };
};