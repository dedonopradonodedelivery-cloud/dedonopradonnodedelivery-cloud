
import React, { createContext, useContext, useState, useEffect } from 'react';

export const NEIGHBORHOODS = [
  "Freguesia",
  "Taquara",
  "Pechincha",
  "Tanque",
  "Anil",
  "Curicica",
  "Gardênia Azul",
  "Cidade de Deus",
  "Praça Seca"
];

interface NeighborhoodContextType {
  currentNeighborhood: string;
  isAll: boolean;
  setNeighborhood: (name: string) => void;
  isSelectorOpen: boolean;
  toggleSelector: () => void;
}

const NeighborhoodContext = createContext<NeighborhoodContextType>({
  currentNeighborhood: 'Freguesia',
  isAll: false,
  setNeighborhood: () => {},
  isSelectorOpen: false,
  toggleSelector: () => {},
});

export const NeighborhoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNeighborhood, setCurrentNeighborhood] = useState(() => {
    return localStorage.getItem('localizei_neighborhood') || 'Freguesia';
  });
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('localizei_neighborhood', currentNeighborhood);
  }, [currentNeighborhood]);

  const setNeighborhood = (name: string) => {
    setCurrentNeighborhood(name);
    setIsSelectorOpen(false);
  };

  const toggleSelector = () => setIsSelectorOpen(prev => !prev);

  const isAll = currentNeighborhood === 'Jacarepaguá (todos)';

  return (
    <NeighborhoodContext.Provider value={{ 
      currentNeighborhood, 
      isAll, 
      setNeighborhood, 
      isSelectorOpen, 
      toggleSelector 
    }}>
      {children}
    </NeighborhoodContext.Provider>
  );
};

export const useNeighborhood = () => useContext(NeighborhoodContext);
