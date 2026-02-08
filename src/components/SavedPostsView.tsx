
import React from 'react';
import { ChevronLeft, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { MOCK_COMMUNITY_POSTS } from '@/constants';
import { PostCard } from '@/components/PostCard';
import { Store } from '@/types';

interface SavedPostsViewProps {
    onBack: () => void;
    onStoreClick: (store: Store) => void;
    onRequireLogin: () => void;
}

export const SavedPostsView: React.FC<SavedPostsViewProps> = ({ onBack, onStoreClick, onRequireLogin }) => {
    const { user } = useAuth();
    const { savedPostIds, isPostSaved, toggleSavePost } = useSavedPosts(user);

    const savedPosts = MOCK_COMMUNITY_POSTS
        .filter(post => savedPostIds.includes(post.id))
        .sort((a, b) => {
            const indexA = savedPostIds.indexOf(a.id);
            const indexB = savedPostIds.indexOf(b.id);
            return indexA - indexB;
        });

    return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans animate-in fade-in duration-500">
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Bookmark className="w-5 h-5" /> Postagens Salvas
                </h1>
            </header>

            <main className="max-w-md mx-auto py-4 space-y-4 w-full px-4">
                {savedPosts.length > 0 ? (
                    savedPosts.map(post => (
                        <PostCard 
                            key={post.id}
                            post={post}
                            onStoreClick={onStoreClick}
                            user={user}
                            onRequireLogin={onRequireLogin}
                            isSaved={isPostSaved(post.id)}
                            onToggleSave={() => toggleSavePost(post.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 opacity-40 flex flex-col items-center">
                        <Bookmark size={48} className="mb-4" />
                        <p className="text-sm font-bold">Nenhuma postagem salva</p>
                        <p className="text-xs text-gray-500 mt-1">Toque no ícone de salvar em um post para guardá-lo aqui.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
