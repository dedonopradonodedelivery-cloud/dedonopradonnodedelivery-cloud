
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';

const getSavedPosts = (user: User | null): string[] => {
  if (!user) return [];
  try {
    const saved = localStorage.getItem(`saved_posts_jpa_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const setSavedPosts = (user: User | null, postIds: string[]) => {
  if (!user) return;
  try {
    localStorage.setItem(`saved_posts_jpa_${user.id}`, JSON.stringify(postIds));
  } catch (e) {
    console.error("Failed to save posts to localStorage", e);
  }
};

export const useSavedPosts = (user: User | null) => {
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSavedPostIds(getSavedPosts(user));
    setLoading(false);
  }, [user]);

  const toggleSavePost = useCallback((postId: string) => {
    if (!user) return false;
    
    const isCurrentlySaved = savedPostIds.includes(postId);
    const newSavedIds = isCurrentlySaved
      ? savedPostIds.filter(id => id !== postId)
      : [postId, ...savedPostIds]; // Add new saved post to the beginning

    setSavedPostIds(newSavedIds);
    setSavedPosts(user, newSavedIds);
    return true;
  }, [user, savedPostIds]);

  const isPostSaved = (postId: string) => savedPostIds.includes(postId);

  return { savedPostIds, toggleSavePost, isPostSaved, loading };
};
