
import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { Category } from '@/types';
import { CATEGORIES, SUBCATEGORIES } from '@/constants';

interface MoreCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
}

export const MoreCategoriesModal: React.FC<MoreCategoriesModalProps> = ({ isOpen, onClose, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return CATEGORIES;
    return CATEGORIES.filter(cat => 
        cat.name.toLowerCase().includes(term) ||