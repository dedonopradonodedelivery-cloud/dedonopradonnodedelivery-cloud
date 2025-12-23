

import React, { useState, useEffect } from 'react';
import { Plus, X, Camera, Video } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { STORIES } from '../constants';

export const StatusView: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCreationMenuOpen, setIsCreationMenuOpen] = useState(false);

  const activeStory = activeStoryIndex !== null ? STORIES[activeStoryIndex] : null;

  // ===============================
  // TIMER DO STORY (15s)
  // ===============================
  useEffect(() => {
    let interval: any;
    if (activeStory) {
      setProgress(0);
      const duration = 15000;
      const step = 50;

      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (step / duration) * 100;
        });
      }, step);
    }
    return () => clearInterval(interval);
  }, [activeStoryIndex]);

  const handleNext = () => {
    if (activeStoryIndex !== null) {
      if (activeStoryIndex < STORIES.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
      } else {
        setActiveStoryIndex(null);
      }
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  // ===============================
  // UPLOAD STORY (IMAGEM / VÍDEO)
  // ===============================
  const uploadStory = async (file: File) => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    const storyId = crypto.randomUUID();
    const path = `stories/${user.id}/${storyId}/${file.name}`;

    const { error } = await supabase.storage
      .from('stories')
      .upload(path, file);

    if (error) {
      console.error(error);
      alert('Erro ao subir story');
      return;
    }

    alert('Story enviado com sucesso!');
    setIsCreationMenuOpen(false);
  };

  // ===============================
  // HANDLERS FILE
  // ===============================
  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadStory(file);
  };

  const handleVideoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = async () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > 15) {
        alert('Vídeo deve ter no máximo 15 segundos');
        return;
      }
      await uploadStory(file);
    };
  };

  return (
    <div className="relative min-h-full bg-white">
      <div className="p-5 pb-24">
        <h2 className="text-2xl font-bold mb-6">Status</h2>

        {/* MEU STATUS */}
        <div
          onClick={() => setIsCreationMenuOpen(true)}
          className="flex items-center gap-4 mb-8 cursor-pointer"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              <img
                src="https://ui-avatars.com/api/?name=Eu"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 border-2 border-white">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg">Meu Status</h3>
            <p className="text-sm text-gray-500">Toque para atualizar</p>
          </div>
        </div>

        {/* STORIES */}
        <div className="flex gap-4 overflow-x-auto">
          {STORIES.map((story, index) => (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                <img src={story.image} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs">{story.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PLAYER */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <img
            src={activeStory.image}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 text-white"
          >
            <X size={32} />
          </button>
          <div className="absolute inset-y-0 left-0 w-1/3" onClick={handlePrev} />
          <div className="absolute inset-y-0 right-0 w-1/3" onClick={handleNext} />
        </div>
      )}

      {/* MENU CRIAR */}
      {isCreationMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end"
          onClick={() => setIsCreationMenuOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-center font-bold text-xl mb-6">
              Criar novo status
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Camera />
                <span>Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImagePick}
                />
              </label>

              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Video />
                <span>Vídeo</span>
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleVideoPick}
                />
              </label>
            </div>

            <button
              onClick={() => setIsCreationMenuOpen(false)}
              className="mt-6 w-full py-3 bg-gray-100 rounded-xl font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};