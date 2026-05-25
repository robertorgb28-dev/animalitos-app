import { motion } from 'motion/react';
import { Animal, Sighting, Outing } from '../types';
import AnimalImage from './AnimalImage';

interface ScreenInicioProps {
  animals: Animal[];
  sightings: Sighting[];
  outings: Outing[];
  onNavigate: (screen: 'bienvenida' | 'inicio' | 'lista' | 'detalle' | 'coleccion' | 'mapa' | 'perfil' | 'salidas' | 'nueva_salida' | 'seleccion_animales_salida' | 'resumen_salida') => void;
  onSelectAnimal: (id: string) => void;
  onSelectOuting: (outing: Outing) => void;
  onStartNewOuting: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function ScreenInicio({
  animals,
  sightings,
  outings,
  onNavigate,
  onSelectAnimal,
  onSelectOuting,
  onStartNewOuting,
  onToggleSidebar,
  isSidebarOpen,
}: ScreenInicioProps) {
  // Calculate dynamic stats
  const distinctSpeciesSeen = animals.filter(a => a.seenCount > 0).length;
  const draftOutings = outings.filter(o => o.status === 'borrador');
  const completedOutings = outings.filter(o => o.status === 'finalizado' || !o.status);
  
  const totalOutingsCount = completedOutings.length;
  const totalSightingsCount = completedOutings.reduce((sum, o) => sum + o.animals.reduce((s, a) => s + a.count, 0), 0);

  // Take first 3 completed outings for preview history
  const recentOutings = completedOutings.slice(0, 3);
  const recentSightings = sightings.slice(0, 4);

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
    <div className="bg-[#fbfcfa] text-[#191c1a] min-h-screen pb-32 font-sans relative overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full top-0 sticky z-40 bg-white/95 backdrop-blur-md flex justify-between items-center px-4 py-3.5 border-b border-surface-container-high/60 shadow-xs">
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleSidebar}
            className="text-primary hover:bg-surface-container-low transition-colors active:scale-95 duration-150 p-2.5 rounded-full cursor-pointer"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <span className="font-display text-xl font-bold text-primary tracking-tight">Animlist</span>
        </div>
        
        {/* Rapid stats bubble */}
        <div className="bg-[#e4ece7] text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-[#a0cfae]/20 select-none">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            workspace_premium
          </span>
          <span>{distinctSpeciesSeen} Especies</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-6 pb-12 max-w-xl mx-auto flex flex-col gap-6">
        
        {/* Welcome Block and Nature Logo */}
        <section className="flex items-center gap-4 bg-gradient-to-br from-[#4a7c59]/10 via-[#e4ece7]/30 to-[#fbfcfa] p-5 rounded-3xl border border-[#4a7c59]/10 select-none">
          <div className="w-12 h-12 rounded-2xl bg-[#4a7c59] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              nature_people
            </span>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-primary leading-tight">Tu Bitácora Silvestre</h2>
            <p className="text-on-surface-variant text-xs mt-1.5 leading-relaxed">
              Registra salidas de observación, reúne especies descubiertas en tu álbum portátil y archiva apuntes de campo.
            </p>
          </div>
        </section>

        {/* Dynamic Statistic Widgets */}
        <section className="grid grid-cols-3 gap-3">
          {/* Card Left: Distinct Species */}
          <div className="bg-white rounded-2xl p-3.5 border border-surface-container-high/60 shadow-xs flex flex-col justify-between text-center select-none">
            <span className="material-symbols-outlined text-[#4a7c59] text-[20px] mx-auto opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>
              menu_book
            </span>
            <div className="mt-2.5">
              <p className="font-display text-20px font-bold text-primary leading-none mb-0.5">{distinctSpeciesSeen}</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider leading-tight">Especies</p>
            </div>
          </div>

          {/* Card Middle: Outings */}
          <div className="bg-white rounded-2xl p-3.5 border border-surface-container-high/60 shadow-xs flex flex-col justify-between text-center select-none">
            <span className="material-symbols-outlined text-[#4a7c59] text-[20px] mx-auto opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>
              map
            </span>
            <div className="mt-2.5">
              <p className="font-display text-20px font-bold text-primary leading-none mb-0.5">{totalOutingsCount}</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider leading-tight">Salidas</p>
            </div>
          </div>

          {/* Card Right: Total Sightings */}
          <div className="bg-white rounded-2xl p-3.5 border border-surface-container-high/60 shadow-xs flex flex-col justify-between text-center select-none">
            <span className="material-symbols-outlined text-[#4a7c59] text-[20px] mx-auto opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>
              pets
            </span>
            <div className="mt-2.5">
              <p className="font-display text-20px font-bold text-primary leading-none mb-0.5">{totalSightingsCount}</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider leading-tight">Ejemplares</p>
            </div>
          </div>
        </section>

        {/* CORE ACTION: Start New Outing Sighting Button */}
        <section>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onStartNewOuting}
            className="w-full bg-[#4a7c59] hover:bg-[#3d664a] text-white py-4.5 px-6 rounded-2xl font-display font-extrabold text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(74,124,89,0.25)] hover:shadow-[0_8px_24px_rgba(74,124,89,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer border-none"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              add_location
            </span>
            <span>Registrar salida de campo</span>
          </motion.button>
        </section>

        {/* Draft Outings Section */}
        {draftOutings.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1 select-none">
              <span className="material-symbols-outlined text-amber-600 animate-pulse text-xl">pending_actions</span>
              <h3 className="font-display text-sm font-bold text-amber-800 uppercase tracking-wider">Avistamientos en progreso</h3>
            </div>

            <div className="space-y-3">
              {draftOutings.map((outing) => {
                const activeIcon = contextIcons[outing.context] || 'location_on';
                const speciesTally = outing.animals.length;

                return (
                  <div
                    key={outing.id}
                    onClick={() => onSelectOuting(outing)}
                    className="bg-amber-50/30 hover:bg-amber-50/60 rounded-2xl p-4 border border-amber-200/50 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-2 relative overflow-hidden group"
                  >
                    {/* Pulsing indicator dot */}
                    <div className="absolute top-4 right-4 h-2 w-2 bg-amber-500 rounded-full" />

                    <div className="flex items-center justify-between gap-1 pr-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-sm text-[#5d4037] truncate">
                            {outing.location}
                          </h4>
                        </div>
                        <p className="text-[10px] text-amber-700/80 font-sans tracking-tight mt-0.5">
                          Iniciado el {outing.date} a las {outing.time}
                        </p>
                      </div>

                      <span className="flex items-center gap-1 font-sans text-[10px] text-amber-800 bg-amber-100 border border-amber-200/40 px-2 py-0.5 rounded-md font-bold select-none shrink-0 uppercase tracking-tight">
                        <span className="material-symbols-outlined text-[11px]">{activeIcon}</span>
                        <span>{outing.context}</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5d4037] mt-1 flex items-center gap-1">
                      <span className="font-bold">
                        {speciesTally === 0 
                          ? 'Sin especies anotadas aún.' 
                          : `${speciesTally} ${speciesTally === 1 ? 'especie anotada' : 'especies anotadas'}`
                        }
                      </span>
                      <span className="text-amber-700 font-extrabold flex items-center gap-0.5 ml-auto">
                        Reanudar <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent Outings History List */}
        <section className="space-y-3.5">
          <div className="flex justify-between items-end px-1 select-none">
            <h3 className="font-display text-sm font-bold text-[#4a7c59] uppercase tracking-wider">Últimas salidas de campo</h3>
            {totalOutingsCount > 0 && (
              <button 
                onClick={() => onNavigate('salidas')}
                className="text-xs font-bold text-[#4a7c59]/90 hover:opacity-80 transition-opacity"
              >
                Ver historial
              </button>
            )}
          </div>

          <div className="space-y-3">
            {recentOutings.map((outing) => {
              const activeIcon = contextIcons[outing.context] || 'location_on';
              const speciesTally = outing.animals.length;

              return (
                <div
                  key={outing.id}
                  onClick={() => onSelectOuting(outing)}
                  className="bg-white rounded-2xl p-4 border border-surface-container-high/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display font-bold text-sm text-on-surface truncate">
                        {outing.location}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant/80 font-sans tracking-tight mt-0.5">
                        {outing.date} a las {outing.time}
                      </p>
                    </div>

                    <span className="flex items-center gap-1 font-sans text-xs text-primary bg-[#eaf2ed] border border-primary/10 px-2 py-1 rounded-lg font-bold select-none shrink-0 uppercase tracking-tight">
                      <span className="material-symbols-outlined text-[13px]">{activeIcon}</span>
                      <span>{outing.context}</span>
                    </span>
                  </div>

                  {outing.notes && (
                    <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed italic line-clamp-1 opacity-90">
                      "{outing.notes}"
                    </p>
                  )}

                  {/* Species miniature overlaps inside this outing card */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-dashed border-surface-container">
                    <div className="flex -space-x-2 overflow-hidden select-none shrink-0">
                      {outing.animals.slice(0, 4).map((oa, idx) => {
                        const origAnimal = animals.find(x => x.id === oa.animalId);
                        return (
                          <div key={idx} className="inline-block h-7 w-7 rounded-full ring-2 ring-white overflow-hidden bg-surface-container shadow-xs shrink-0">
                            <AnimalImage
                              imageUrl={oa.photo || oa.imageUrl}
                              imageVerified={origAnimal?.imageVerified}
                              category={oa.type}
                              name={oa.animalName}
                            />
                          </div>
                        );
                      })}
                      {speciesTally > 4 && (
                        <div className="inline-flex items-center justify-center h-7 w-7 rounded-full ring-2 ring-white bg-[#f0f3f1] text-[#4a7c59] text-[9px] font-black border border-primary/5">
                          +{speciesTally - 4}
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-[#4a7c59] tracking-wider uppercase font-sans">
                      {speciesTally} {speciesTally === 1 ? 'Especie' : 'Especies'} vista
                    </span>
                  </div>
                </div>
              );
            })}

            {totalOutingsCount === 0 && (
              <div className="py-12 bg-white rounded-2xl border border-dashed border-outline-variant/50 text-center flex flex-col items-center justify-center gap-2 px-4 select-none">
                <span className="material-symbols-outlined text-outline-variant text-[32px]">add_road</span>
                <p className="text-xs text-on-surface-variant font-bold">Aún no hay salidas registradas.</p>
                <p className="text-[10px] text-on-surface-variant/75 max-w-xs leading-relaxed">
                  Pulsa el botón de arriba "Registrar salida de campo" para empezar tu aventura.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recently Seen Animals Mini Section */}
        <section className="space-y-3.5 pb-8">
          <div className="flex justify-between items-end px-1 select-none">
            <h3 className="font-display text-sm font-bold text-[#4a7c59] uppercase tracking-wider">Registro de avistamientos recientes</h3>
            {totalSightingsCount > 0 && (
              <button 
                onClick={() => onNavigate('lista')}
                className="text-xs font-bold text-[#4a7c59]/95 hover:opacity-80 transition-opacity"
              >
                Ver catálogo
              </button>
            )}
          </div>

          <div className="space-y-3">
            {recentSightings.map((sighting) => {
              const animal = animals.find(a => a.id === sighting.animalId);
              const customPhoto = sighting.photos[0] || (animal ? animal.imageUrl : '');

              return (
                <div
                  key={sighting.id}
                  onClick={() => onSelectAnimal(sighting.animalId)}
                  className="bg-white rounded-2xl p-3 border border-surface-container-high/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex items-center gap-3.5 min-w-0"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-surface-container-high/40 bg-surface-container">
                    <AnimalImage
                      imageUrl={customPhoto}
                      imageVerified={animal?.imageVerified}
                      category={animal ? animal.type : 'Otros'}
                      name={sighting.animalName}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-display font-bold text-sm text-on-surface truncate">
                        {sighting.animalName}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant shrink-0 font-semibold font-sans">
                        {sighting.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium leading-none mt-1 flex items-center gap-0.5 truncate">
                      <span className="material-symbols-outlined text-[13px] text-[#4a7c59]/80">location_on</span>
                      {sighting.location}
                    </p>
                    <span className="inline-block bg-[#eaf2ed] text-[#4a7c59] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1.5 font-sans">
                      {animal ? animal.type : 'Especie'}
                    </span>
                  </div>
                </div>
              );
            })}

            {totalSightingsCount === 0 && (
              <div className="py-10 bg-white rounded-2xl border border-dashed border-outline-variant/30 text-center flex flex-col items-center justify-center gap-3 px-4 select-none">
                <span className="material-symbols-outlined text-outline-variant text-[28px] text-[#4a7c59]">emoji_nature</span>
                <p className="text-xs text-[#1e3325] font-bold">Aún no has registrado ningún avistamiento.</p>
                <p className="text-[10px] text-[#445b4c] max-w-xs leading-relaxed">
                  Cuando veas un animal, pulsa Registrar avistamiento para guardarlo.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
