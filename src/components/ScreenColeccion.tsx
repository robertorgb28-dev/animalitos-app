import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Animal, AnimalCategory } from '../types';
import AnimalImage from './AnimalImage';

interface ScreenColeccionProps {
  animals: Animal[];
  onNavigate: (screen: 'bienvenida' | 'inicio' | 'lista' | 'detalle' | 'coleccion' | 'mapa' | 'perfil') => void;
  onSelectAnimal: (id: string) => void;
  onToggleSidebar: () => void;
}

export default function ScreenColeccion({
  animals,
  onNavigate,
  onSelectAnimal,
  onToggleSidebar,
}: ScreenColeccionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Seen animals filtered by search query
  const seenAnimalsFiltered = useMemo(() => {
    return animals.filter(animal => {
      const isSeen = animal.seenCount > 0;
      const matchesSearch = !searchQuery || 
                            animal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            animal.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            animal.type.toLowerCase().includes(searchQuery.toLowerCase());
      return isSeen && matchesSearch;
    });
  }, [animals, searchQuery]);

  // Exact tally of discoveries grouped dynamically by category
  const statsByCategory = useMemo(() => {
    const list: { type: AnimalCategory; label: string; count: number; colorClass: string }[] = [
      { type: 'Aves', label: 'Aves', count: 0, colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      { type: 'Mamíferos', label: 'Mamíferos', count: 0, colorClass: 'bg-amber-100 text-amber-800 border-amber-200' },
      { type: 'Reptiles', label: 'Reptiles', count: 0, colorClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
      { type: 'Anfibios', label: 'Anfibios', count: 0, colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      { type: 'Peces', label: 'Peces', count: 0, colorClass: 'bg-blue-100 text-blue-800 border-blue-200' },
      { type: 'Insectos', label: 'Insectos', count: 0, colorClass: 'bg-purple-100 text-purple-800 border-purple-200' },
      { type: 'Arácnidos', label: 'Arácnidos', count: 0, colorClass: 'bg-red-100 text-red-800 border-red-200' },
      { type: 'Moluscos', label: 'Moluscos', count: 0, colorClass: 'bg-orange-100 text-orange-800 border-orange-200' },
      { type: 'Crustáceos', label: 'Crustáceos', count: 0, colorClass: 'bg-pink-100 text-pink-800 border-pink-200' },
      { type: 'Otros', label: 'Otros', count: 0, colorClass: 'bg-stone-100 text-stone-800 border-stone-200' }
    ];

    list.forEach(categoryObj => {
      categoryObj.count = animals.filter(a => a.type === categoryObj.type && a.seenCount > 0).length;
    });

    // Only return categories that have at least one discovery
    return list.filter(item => item.count > 0);
  }, [animals]);

  const totalDistinctSeen = useMemo(() => {
    return animals.filter(a => a.seenCount > 0).length;
  }, [animals]);

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-sans overflow-x-hidden">
      
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-white/95 backdrop-blur-md flex justify-between items-center px-4 py-3.5 border-b border-surface-container-high/60 shadow-xs">
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleSidebar}
            className="text-primary hover:bg-surface-container-low transition-colors active:scale-95 duration-150 p-2.5 rounded-full"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <span className="font-display text-xl font-bold text-primary tracking-tight">Mi Colección</span>
        </div>

        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold select-none">
          {totalDistinctSeen} Especies
        </div>
      </header>

      {/* Main Canvas Scroll Area */}
      <main className="px-4 pt-6 pb-12 max-w-3xl mx-auto flex flex-col gap-5">
        
        {/* Title and Intro */}
        <div>
          <h2 className="font-display text-24px font-bold text-on-surface leading-tight">Tu álbum personal</h2>
          <p className="text-on-surface-variant text-xs mt-1">Registros fotográficos e inventario de las especies silvestres que has avistado.</p>
        </div>

        {/* Dynamic Badges Summary Panel */}
        {totalDistinctSeen > 0 && (
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container/25 flex flex-col gap-2.5">
            <h3 className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Especies descubiertas por grupo
            </h3>
            <div className="flex flex-wrap gap-2 select-none">
              {statsByCategory.map(cat => (
                <span 
                  key={cat.type} 
                  className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[11px] font-bold ${cat.colorClass}`}
                >
                  {cat.label}: {cat.count}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Search Input Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none select-none">
            search
          </span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface font-sans text-sm rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xs placeholder:text-on-surface-variant/70 font-medium" 
            placeholder="Filtrar por nombre dentro del álbum..." 
            type="text"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-medium active:scale-90 transition-all cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Collection Grid Catalog of seen species */}
        <div className="w-full">
          <AnimatePresence mode="popLayout">
            {seenAnimalsFiltered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {seenAnimalsFiltered.map((animal) => (
                  <motion.article 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    key={animal.id}
                    onClick={() => onSelectAnimal(animal.id)}
                    className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer border border-surface-container/15 w-full"
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface-container select-none">
                      <AnimalImage
                        imageUrl={animal.imageUrl}
                        imageVerified={animal.imageVerified}
                        category={animal.type}
                        name={animal.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        iconSize="text-3xl"
                      />
                      
                      {/* Floating tag multiplier badge */}
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center justify-center shadow-xs border border-surface-container-high/60">
                        <span className="font-display text-xs text-primary font-bold">Visto x{animal.seenCount}</span>
                      </div>

                      {/* Overly type category block */}
                      <span className="absolute bottom-2 left-2 inline-block bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {animal.type}
                      </span>
                    </div>
                    
                    <div className="p-3.5 text-center flex-1 flex flex-col justify-center min-w-0 bg-surface-container-lowest">
                      <h3 className="font-display font-bold text-sm text-on-surface leading-tight px-1 group-hover:text-primary transition-colors truncate">
                        {animal.name}
                      </h3>
                      <p className="text-[10px] italic text-on-surface-variant mt-1.5 font-sans truncate">
                        {animal.scientificName}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              /* Beautiful empty state when no species matches or discovered */
              <div className="py-16 text-center bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/60 font-sans flex flex-col items-center justify-center gap-3.5 px-4 select-none animate-fade-in">
                <span className="material-symbols-outlined text-4xl text-outline-variant text-[#4a7c59]">
                  emoji_events
                </span>
                <div>
                  <h3 className="font-display font-bold text-sm text-on-surface">Tu colección está vacía.</h3>
                  <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto leading-relaxed">
                    {totalDistinctSeen === 0 
                      ? 'Los animales que registres aparecerán en esta sección.' 
                      : 'No hay especies vistas bajo este término de búsqueda.'}
                  </p>
                </div>
                {totalDistinctSeen === 0 && (
                  <button 
                    onClick={() => onNavigate('lista')}
                    className="mt-1 bg-[#4a7c59] text-white font-display font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-[#3d664a] active:scale-95 transition-all shadow-xs cursor-pointer border-none"
                  >
                    Abrir catálogo
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
