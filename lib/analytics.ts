import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

export type OrganicEventType =
  | 'store_view'
  | 'store_click_whatsapp'
  | 'store_click_call'
  | 'store_click_instagram'
  | 'store_click_directions'
  | 'store_click_share'
  | 'store_click_favorite'
  | 'store_click_promo'
  | 'store_click_product';

/**
 * Tracks an organic user interaction event and sends it to Supabase.
 * @param eventType The type of event to track.
 * @param storeId The ID of the store the interaction is related to.
 * @param neighborhood The current neighborhood context.
 * @param user The authenticated user object, if available.
 */
export const trackOrganicEvent = async (
  eventType: OrganicEventType,
  storeId: string,
  neighborhood: string | undefined,
  user: User | null
) => {
  // Fallback for local development or if Supabase is not initialized
  if (!supabase) {
    console.log('[Analytics Event]', { eventType, storeId, neighborhood: neighborhood || 'unknown', userId: user?.id || 'anonymous' });
    return;
  }

  try {
    const { error } = await supabase.from('store_organic_events').insert({
      event_type: eventType,
      store_id: storeId,
      user_id: user?.id || null,
      neighborhood: neighborhood || 'unknown',
      source: 'organic', // Hardcoded as per requirement
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    // Log errors to the console without blocking the UI
    console.error('Error tracking organic event:', error);
  }
};

export type AdEventType = 'ad_impression' | 'ad_click';

/**
 * Tracks a paid ad interaction event and sends it to Supabase.
 */
export const trackAdEvent = async (
  eventType: AdEventType,
  bannerId: string,
  storeId: string | undefined | null,
  placement: 'home' | 'category' | 'subcategory',
  category: string | null,
  subcategory: string | null,
  neighborhood: string | undefined
) => {
  if (!supabase) {
    console.log('[Ad Event]', { eventType, bannerId, storeId, placement, category, subcategory, neighborhood });
    return;
  }

  try {
    const { error } = await supabase.from('store_ad_events').insert({
      event_type: eventType,
      banner_id: bannerId,
      store_id: storeId,
      placement,
      category,
      subcategory,
      neighborhood: neighborhood || 'unknown',
      source: 'paid', // Hardcoded as per requirement
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error tracking ad event:', error);
  }
};
