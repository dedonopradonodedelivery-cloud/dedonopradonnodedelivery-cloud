const NovidadesDaSemana: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const newArrivals = useMemo(() => stores.filter(s => (s.image || s.logoUrl) && ['f-3', 'f-5', 'f-8', 'f-12', 'f-15'].includes(s.id)), [stores]);
  if (newArrivals.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-950 pt-2 pb-2 px-5">
      <SectionHeader icon={Sparkles} title="Novidades da Semana" subtitle="Recém chegados" onSeeMore={() => onNavigate('explore')} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5">
        {newArrivals.map((store) => (
          <button key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="flex-shrink-0 w-[150px] aspect-[4/5] rounded-[2.5rem] overflow-hidden relative snap-center shadow-2xl group active:scale-[0.98] transition-all">
            <img src={store.image || store.logoUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-left">
              <span className="w-fit bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-1.5 shadow-lg">Novo</span>
              <h3 className="text-sm font-black text-white leading-tight mb-0.5 truncate drop-shadow-md">{store.name}</h3>
              <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest truncate">{store.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};