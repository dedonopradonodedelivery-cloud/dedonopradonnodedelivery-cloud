
import React from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MasterSponsorBadgeProps {
  onClick?: () => void;
}

export const MasterSponsorBadge: React.FC<MasterSponsorBadgeProps> = ({ onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="flex items-center gap-2 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:bg-white/50 dark:hover:bg-gray-700/50 cursor-pointer group active:scale-95"
    >
      <div className="p-1 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
        <Crown size={12} className="text-amber-500 fill-amber-500/10" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[7px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] leading-none mb-0.5">Master</span>
        <span className="text-[9px] font-bold text-gray-900 dark:text-white leading-none">Esquematiza</span>
      </div>
    </motion.div>
  );
};
