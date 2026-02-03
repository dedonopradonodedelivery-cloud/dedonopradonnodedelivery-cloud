
        {/* ============================================================
            SEÇÃO FIXA: PATROCINADOR MASTER (Hero Card)
           ============================================================ */}
        {masterStore && activeFilter === 'all' && page === 1 && (
           <div 
               onClick={handleMasterClick}
               className="relative w-full rounded-[2rem] p-[2px] bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.15)] cursor-pointer group active:scale-[0.98] transition-all mb-6 mt-4"
           >
               {/* Etiqueta Reposicionada (Flutuando na borda) */}
               <div className="absolute top-0 right-6 -translate-y-1/2 z-20">
                  <span className="bg-slate-900 text-amber-400 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/30 flex items-center gap-1.5 shadow-lg">
                     <Crown className="w-3 h-3 fill-amber-400" /> Patrocinador Master
                  </span>
               </div>

               <div className="bg-slate-900 dark:bg-slate-900 rounded-[1.9rem] p-5 relative overflow-hidden h-full">
                   {/* Efeito de brilho de fundo */}
                   <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                   <div className="flex gap-4 items-center relative z-10">
                       <div className="w-20 h-20 rounded-2xl bg-white flex-shrink-0 overflow-hidden relative shadow-xl border-2 border-slate-700">
                            <img 
                               src={masterStore.logoUrl || masterStore.image || '/assets/default-logo.png'} 
                               alt={masterStore.name} 
                               className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" 
                           />
                       </div>
                       <div className="flex-1 min-w-0 pt-1">
                           <h3 className="font-black text-lg text-white leading-tight truncate mb-1 tracking-tighter uppercase">{masterStore.name}</h3>
                           <p className="text-[10px] text-slate-400 line-clamp-2 mb-3 font-medium leading-relaxed">{masterStore.description}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                                   <Star className="w-3 h-3 fill-current" />
                                   {masterStore.rating?.toFixed(1)}
                                </div>
                                <div className="bg-slate-800 px-2 py-1 rounded-lg border border-white/5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Holdings</span>
                                </div>
                            </div>
                       </div>
                   </div>
               </div>
           </div>
        )}
