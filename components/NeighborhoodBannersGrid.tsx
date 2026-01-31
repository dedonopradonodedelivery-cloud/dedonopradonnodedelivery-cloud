import React from 'react';

const BAIRROS = [
  { name: 'Taquara', slug: 'taquara', color: 'bg-blue-600' },
  { name: 'Freguesia', slug: 'freguesia', color: 'bg-orange-600' },
  { name: 'Pechincha', slug: 'pechincha', color: 'bg-emerald-600' },
  { name: 'Curicica', slug: 'curicica', color: 'bg-purple-600' },
  { name: 'Anil', slug: 'anil', color: 'bg-rose-600' },
  { name: 'Tanque', slug: 'tanque', color: 'bg-amber-600' },
  { name: 'Praça Seca', slug: 'praca-seca', color: 'bg-indigo-600' },
  { name: 'Gardênia Azul', slug: 'gardenia-azul', color: 'bg-teal-600' },
  { name: 'Cidade de Deus', slug: 'cidade-de-deus', color: 'bg-slate-800' },
];

export const NeighborhoodBannersGrid: React.FC = () => {
  const handleClick = (slug: string) => {
    window.location.href = `/vender-banners?bairro=${slug}`;
  };

  return (
    <div className="w-full h-full bg-slate-900 p-4 flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1 opacity-80">Publicidade Regional</h3>
        <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Banners por Bairro</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-1.5 flex-1">
        {BAIRROS.map((b) => (
          <button
            key={b.slug}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(b.slug);
            }}
            className={`${b.color} rounded-xl p-1.5 flex items-center justify-center text-center transition-all active:scale-95 border border-white/10 hover:brightness-110 shadow-sm h-full`}
          >
            <span className="text-[7px] font-black text-white uppercase leading-tight tracking-tighter">
              {b.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Toque no bairro para anunciar</span>
      </div>
    </div>
  );
};
