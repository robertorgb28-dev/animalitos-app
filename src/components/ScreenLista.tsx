import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Animal, AnimalCategory } from '../types';
import AnimalImage from './AnimalImage';

interface ScreenListaProps {
  animals: Animal[];
  onNavigate: (screen: 'bienvenida' | 'inicio' | 'lista' | 'detalle' | 'coleccion' | 'mapa' | 'perfil') => void;
  onSelectAnimal: (id: string) => void;
  onOpenAddModal: (animal: Animal) => void;
  onToggleSeen: (animalId: string) => void;
  onToggleSidebar: () => void;
}

type CategoryFilter = 'Todos' | AnimalCategory;
type SeenFilter = 'Todos' | 'Vistos' | 'No vistos';

export default function ScreenLista({
  animals,
  onNavigate,
  onSelectAnimal,
  onOpenAddModal,
  onToggleSeen,
  onToggleSidebar,
}: ScreenListaProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todos');
  const [selectedSeenFilter, setSelectedSeenFilter] = useState<SeenFilter>('Todos');

  // List of all categories with localized labels & nice icons
  const categoriesList: { value: CategoryFilter; label: string; icon: string }[] = [
    { value: 'Todos', label: 'Todos', icon: 'border_all' },
    { value: 'Aves', label: 'Aves', icon: 'flutter_dash' },
    { value: 'Mamíferos', label: 'Mamíferos', icon: 'pets' },
    { value: 'Reptiles', label: 'Reptiles', icon: 'healing' },
    { value: 'Anfibios', label: 'Anfibios', icon: 'water_drop' },
    { value: 'Peces', label: 'Peces', icon: 'scuba_diving' },
    { value: 'Insectos', label: 'Insectos', icon: 'bug_report' },
    { value: 'Arácnidos', label: 'Arácnidos', icon: 'wifi_channel' },
    { value: 'Moluscos', label: 'Moluscos', icon: 'brightness_low' },
    { value: 'Crustáceos', label: 'Crustáceos', icon: 'waves' },
    { value: 'Otros', label: 'Otros', icon: 'category' }
  ];

  // List of state filters
  const seenFiltersList: { value: SeenFilter; label: string; icon: string }[] = [
    { value: 'Todos', label: 'Todos', icon: 'visibility' },
    { value: 'Vistos', label: 'Vistos', icon: 'check_circle' },
    { value: 'No vistos', label: 'No vistos', icon: 'radio_button_unchecked' }
  ];

  // Combined filters logic
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
                            animal.name.toLowerCase().includes(query) ||
                            animal.scientificName.toLowerCase().includes(query) ||
                            (animal.description && animal.description.toLowerCase().includes(query));

      // 2. Category Filter
      const matchesCategory = selectedCategory === 'Todos' || animal.type === selectedCategory;

      // 3. Seen State Filter
      const isSeen = animal.seenCount > 0;
      let matchesSeen = true;
      if (selectedSeenFilter === 'Vistos') {
        matchesSeen = isSeen;
      } else if (selectedSeenFilter === 'No vistos') {
        matchesSeen = !isSeen;
      }

      return matchesSearch && matchesCategory && matchesSeen;
    });
  }, [animals, searchQuery, selectedCategory, selectedSeenFilter]);

  // Statistics
  const totalInFilter = filteredAnimals.length;
  const seenInFilter = filteredAnimals.filter(a => a.seenCount > 0).length;

  const handleCheckClick = (e: React.MouseEvent, animal: Animal) => {
    e.stopPropagation(); // Evita navegar a la pantalla de detalles
    onToggleSeen(animal.id);
  };

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
          <span className="font-display text-xl font-bold text-primary tracking-tight">Animlist</span>
        </div>
        
        {/* Floating indicator */}
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold select-none flex items-center gap-1.5 border border-primary/20">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span>
            {animals.filter(a => a.seenCount > 0).length}/{animals.length} Vistos
          </span>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="w-full max-w-2xl mx-auto px-4 pt-6 pb-12 flex flex-col gap-5">
        
        {/* Title and search info */}
        <div>
          <h2 className="font-display text-24px md:text-28px font-bold text-on-surface leading-tight">Catalogo de Campo</h2>
          <p className="text-on-surface-variant text-xs mt-1">Busca especies locales y márcalas como vistas en tiempo real con un toque.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant leading-none pointer-events-none select-none">
            search
          </span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 text-on-surface font-sans text-sm rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xs placeholder:text-on-surface-variant/70 font-medium"
            placeholder="Buscar por nombre común o científico..." 
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

        {/* Filtro 1: Categoría de Especie - Horizontal Scroll with safe pads */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold tracking-wider text-on-surface-variant/80 uppercase px-1">
            Categoría de especie
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1.5 -mx-4 px-4 no-scrollbar select-none">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 font-display text-xs font-semibold px-3.5 py-2 rounded-full transition-all active:scale-95 whitespace-nowrap border cursor-pointer ${
                    isActive 
                      ? 'bg-primary border-primary text-on-primary shadow-xs' 
                      : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-outline hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro 2: Estado de Vista - Horizontal Scroll or fit */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold tracking-wider text-on-surface-variant/80 uppercase px-1">
            Estado de avistamiento
          </span>
          <div className="grid grid-cols-3 gap-2 w-full select-none">
            {seenFiltersList.map((filter) => {
              const isActive = selectedSeenFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setSelectedSeenFilter(filter.value)}
                  className={`flex items-center justify-center gap-1.5 font-display text-[11px] sm:text-xs font-semibold py-2.5 px-1 rounded-xl transition-all active:scale-95 border cursor-pointer text-center w-full truncate ${
                    isActive 
                      ? 'bg-[#e2e9ec] border-[#6b7972] text-[#191c1a] shadow-xs' 
                      : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {filter.icon}
                  </span>
                  <span className="truncate">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteo de resultados */}
        <div className="flex justify-between items-center mt-1 px-1 text-xs text-on-surface-variant/95 font-medium">
          <span>{totalInFilter} {totalInFilter === 1 ? 'especie' : 'especies'} encontradas</span>
          {totalInFilter > 0 && (
            <span className="font-semibold text-primary">{seenInFilter} vistas en esta selección</span>
          )}
        </div>

        {/* Animals Checklist */}
        <div className="flex flex-col gap-3.5 mt-1">
          <AnimatePresence mode="popLayout">
            {filteredAnimals.map((animal) => {
              const isSeen = animal.seenCount > 0;
              return (
                <motion.article 
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={animal.id}
                  onClick={() => onSelectAnimal(animal.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container/20 group cursor-pointer shadow-xs hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 min-w-0 w-full`}
                >
                  {/* Photo & text info grouped */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    
                    {/* Visual Thumb representation */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface-container border border-surface-container-high shrink-0">
                      <AnimalImage
                        imageUrl={animal.imageUrl}
                        imageVerified={animal.imageVerified}
                        category={animal.type}
                        name={animal.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        iconSize="text-base"
                      />

                      {/* Mini category tag indicator overlay */}
                      <div className="absolute bottom-0 inset-x-0 text-[8px] font-bold text-center bg-black/60 text-white/95 uppercase tracking-wide py-0.5 select-none truncate">
                        {animal.type}
                      </div>
                    </div>

                    {/* Metadata column */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <h3 className="font-display font-bold text-base text-on-surface leading-tight truncate group-hover:text-primary transition-colors">
                          {animal.name}
                        </h3>
                      </div>
                      <p className="text-xs italic text-on-surface-variant/80 font-sans truncate mt-0.5">
                        {animal.scientificName}
                      </p>
                      
                      {animal.description && (
                        <p className="text-xs text-on-surface-variant/90 font-sans mt-1.5 hidden sm:block truncate pr-4 line-clamp-1">
                          {animal.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action checklist status area */}
                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    <button 
                      onClick={(e) => handleCheckClick(e, animal)}
                      className={`w-11 h-11 rounded-full flex flex-col items-center justify-center transition-all active:scale-90 border-2 select-none group/btn ${
                        isSeen 
                          ? 'bg-[#4a7c59] border-[#4a7c59] text-white shadow-xs' 
                          : 'border-outline-variant text-[#a5b2a9] hover:border-primary hover:text-primary hover:bg-primary-container/10'
                      }`}
                      aria-label={isSeen ? "Marcar especie como no vista" : "Marcar especie como vista"}
                    >
                      <span 
                        className="material-symbols-outlined text-[22px]" 
                        style={isSeen ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {isSeen ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      {animal.seenCount > 1 && (
                        <span className="text-[9px] font-bold leading-none -mt-0.5 bg-white/20 px-1 rounded-sm">
                          x{animal.seenCount}
                        </span>
                      )}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {/* Fallback empty view */}
          {filteredAnimals.length === 0 && (
            <div className="py-14 text-center bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/60 font-sans flex flex-col items-center justify-center gap-3 px-4">
              <span className="material-symbols-outlined text-4xl text-outline-variant select-none">
                nature_people
              </span>
              <div>
                <p className="font-display font-bold text-sm text-on-surface">No hay especies que coincidan</p>
                <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Prueba cambiando el buscador o seleccionando otra categoría para ampliar la exploración culmen.
                </p>
              </div>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); setSelectedSeenFilter('Todos'); }}
                className="mt-2 text-xs font-semibold text-primary px-4 py-2 hover:bg-primary/5 active:bg-primary/10 rounded-xl transition-all border border-primary/20 cursor-pointer"
              >
                Restablecer todos los filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
