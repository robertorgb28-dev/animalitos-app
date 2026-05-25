import { motion } from 'motion/react';
import { Outing, INITIAL_ANIMALS } from '../types';
import AnimalImage from './AnimalImage';

interface ScreenSalidasProps {
  outings: Outing[];
  onSelectOuting: (outing: Outing) => void;
  onStartNewOuting: () => void;
  onToggleSidebar: () => void;
}

export default function ScreenSalidas({
  outings,
  onSelectOuting,
  onStartNewOuting,
  onToggleSidebar,
}: ScreenSalidasProps) {
  
  const contextIcons: Record<string, string> = {
    'Andando': 'directions_walk',
    'En el campo': 'terrain',
    'En parque': 'park',
    'En río o lago': 'water',
    'En playa': 'beach_access',
    'En ciudad': 'location_city',
    'En coche': 'directions_car',
    'En bici': 'directions_bike',
    'En moto': 'motorcycle',
    'Otro': 'more_horiz'
  };

  return (
    <div className="bg-[#fbfcfa] min-h-screen pb-28 font-sans text-on-background">
      {/* Top Header */}
      <header className="w-full bg-white px-4 py-3.5 border-b border-surface-container-high/60 flex items-center justify-between shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleSidebar}
            className="text-primary hover:bg-surface-container-low transition-colors active:scale-95 duration-150 p-2.5 rounded-full cursor-pointer"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <span className="font-display text-xl font-bold text-primary tracking-tight">Historial de Salidas</span>
        </div>

        <button
          onClick={onStartNewOuting}
          className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Registrar</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto p-4 pt-6 space-y-5">
        
        {/* Helper guide */}
        <div>
          <h2 className="font-display text-24px font-bold text-on-surface leading-tight">Cuaderno de Salidas</h2>
          <p className="text-on-surface-variant text-xs mt-1">Explora las excursiones y cuadernos de avistamientos pasados para repasar tu progreso naturalista.</p>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {outings.map((outing) => {
            const activeIcon = contextIcons[outing.context] || 'location_on';
            const totalSpecies = outing.animals.length;
            const totalIndividuals = outing.animals.reduce((sum, a) => sum + a.count, 0);

            return (
              <motion.article
                key={outing.id}
                onClick={() => onSelectOuting(outing)}
                whileHover={{ y: -2, scale: 1.005 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-5 border border-surface-container-high/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-3.5 min-w-0"
              >
                {/* Outing Top Row - Location + context */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-on-surface truncate group-hover:text-primary transition-colors">
                        {outing.location}
                      </h3>
                      {outing.status === 'borrador' && (
                        <span className="shrink-0 bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md leading-none select-none">
                          Borrador
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-bold font-sans mt-0.5 tracking-wider uppercase">
                      {outing.date} • {outing.time}
                    </p>
                  </div>

                  <span className="bg-[#e4ece7] text-primary px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0 select-none">
                    <span className="material-symbols-outlined text-[14px]">{activeIcon}</span>
                    <span>{outing.context}</span>
                  </span>
                </div>

                {/* Sighting brief note block */}
                {outing.notes && (
                  <p className="text-xs text-on-surface-variant/90 line-clamp-2 leading-relaxed italic border-l-2 border-[#4a7c59]/40 pl-3 py-0.5">
                    "{outing.notes}"
                  </p>
                )}

                {/* Sighting thumb avatars overlap row + statistic details */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-surface-container gap-4">
                  {/* Overlap avatars */}
                  <div className="flex -space-x-2.5 overflow-hidden select-none shrink-0">
                    {outing.animals.slice(0, 4).map((oa, index) => {
                      const orig = INITIAL_ANIMALS.find(a => a.id === oa.animalId);
                      return (
                        <div key={index} className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-surface-container shadow-xs shrink-0">
                          <AnimalImage
                            imageUrl={oa.photo || oa.imageUrl}
                            imageVerified={orig?.imageVerified}
                            category={oa.type}
                            name={oa.animalName}
                          />
                        </div>
                      );
                    })}
                    {totalSpecies > 4 && (
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-[#f0f4f2] text-primary text-[10px] font-extrabold border border-primary/10">
                        +{totalSpecies - 4}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-on-surface-variant/80 uppercase tracking-widest leading-none font-sans font-bold">Avistamientos</p>
                    <p className="font-display font-semibold text-xs text-primary mt-1">
                      <strong className="text-base text-[#4a7c59] font-bold">{totalSpecies}</strong> especies ({totalIndividuals} ejemp.)
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}

          {outings.length === 0 && (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 font-sans flex flex-col items-center justify-center gap-3.5 px-4 select-none">
              <span className="material-symbols-outlined text-4xl text-outline-variant text-[#4a7c59]">
                history_edu
              </span>
              <div>
                <h3 className="font-display font-bold text-sm text-on-surface">Aún no hay salidas registradas.</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Comienza pulsando "Registrar salida de campo" en la página de inicio o arriba a la derecha.
                </p>
              </div>
              <button
                onClick={onStartNewOuting}
                className="mt-1 bg-[#4a7c59] text-white font-display font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-[#3d664a] active:scale-95 transition-all shadow-xs cursor-pointer border-none"
              >
                Crear Mi Primera Salida
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
