
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface UseSwipeableCarouselProps {
  itemCount: number;
  intervalTime?: number; // Tempo por slide em ms (padrão 4000)
  autoPlay?: boolean;
}

export const useSwipeableCarousel = ({ itemCount, intervalTime = 4000, autoPlay = true }: UseSwipeableCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs para controle de gestos e timers
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const resumeTimerRef = useRef<any>(null);

  // --- Lógica de Navegação ---
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % itemCount);
    setProgress(0);
  }, [itemCount]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
    setProgress(0);
  }, [itemCount]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  // --- Lógica de Pausa Inteligente ---
  const pauseAutoPlay = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const resumeAutoPlay = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000); // Retoma após 4 segundos de inatividade
  };

  // --- Autoplay & Progress ---
  useEffect(() => {
    if (!autoPlay || isPaused || itemCount <= 1) return;

    // Atualização do progresso (suave, a cada 30ms)
    const tickRate = 30;
    const increment = (tickRate / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, tickRate);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, itemCount, intervalTime, nextSlide]);

  // --- Handlers de Swipe (Touch & Mouse) ---

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    pauseAutoPlay();
    isDragging.current = true;
    // Normaliza evento de touch ou mouse
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    touchStartX.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    touchEndX.current = clientX;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    resumeAutoPlay();

    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Sensibilidade

    if (distance > minSwipeDistance) {
      // Swipe Left -> Next
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swipe Right -> Prev
      prevSlide();
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return {
    activeIndex,
    progress,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleTouchStart,
      onMouseMove: handleTouchMove,
      onMouseUp: handleTouchEnd,
      onMouseLeave: () => {
        if (isDragging.current) handleTouchEnd();
      }
    },
    isPaused,
    nextSlide,
    prevSlide,
    goToSlide
  };
};
