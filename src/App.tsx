import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Animal, Sighting, Outing, OutingAnimal, INITIAL_ANIMALS, INITIAL_OUTINGS } from './types';
import ScreenBienvenida from './components/ScreenBienvenida';
import ScreenInicio from './components/ScreenInicio';
import ScreenLista from './components/ScreenLista';
import ScreenDetalle from './components/ScreenDetalle';
import ScreenColeccion from './components/ScreenColeccion';
import ScreenMapa from './components/ScreenMapa';
import ScreenPerfil from './components/ScreenPerfil';
import ScreenNuevaSalida from './components/ScreenNuevaSalida';
import ScreenSeleccionAnimalesSalida from './components/ScreenSeleccionAnimalesSalida';
import ScreenResumenSalida from './components/ScreenResumenSalida';
import ScreenSalidas from './components/ScreenSalidas';

export default function App() {
  // Persistent state loader from LocalStorage
  const [animals, setAnimals] = useState<Animal[]>(() => {
    const saved = localStorage.getItem('animlist_animals_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ANIMALS;
      }
    }
    return INITIAL_ANIMALS;
  });

  const [outings, setOutings] = useState<Outing[]>(() => {
    const saved = localStorage.getItem('animlist_outings_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_OUTINGS;
      }
    }
    return INITIAL_OUTINGS;
  });

  const [currentScreen, setCurrentScreen] = useState<
    | 'bienvenida'
    | 'inicio'
    | 'lista'
    | 'detalle'
    | 'coleccion'
    | 'mapa'
    | 'perfil'
    | 'salidas'
    | 'nueva_salida'
    | 'seleccion_animales_salida'
    | 'resumen_salida'
  >('bienvenida');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedOuting, setSelectedOuting] = useState<Outing | null>(null);
  const [activeOuting, setActiveOuting] = useState<Partial<Outing> | null>(null);

  // Save to Web storage upon any updates
  useEffect(() => {
    localStorage.setItem('animlist_animals_state', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('animlist_outings_state', JSON.stringify(outings));
  }, [outings]);

  // Derive all sightings dynamically from stored outings for map and summary feeds
  const sightings = useMemo<Sighting[]>(() => {
    const list: Sighting[] = [];
    outings.forEach(outing => {
      // Avoid showing sightings from drafts in general lists
      if (outing.status === 'borrador') return;

      outing.animals.forEach((oa, index) => {
        list.push({
          id: `${outing.id}-${oa.animalId}-${index}`,
          animalId: oa.animalId,
          animalName: oa.animalName,
          location: oa.location || outing.location || 'Entorno Natural',
          timestamp: outing.date,
          time: oa.time || outing.time,
          context: (outing.context === 'Andando' ? 'Andando' : outing.context === 'En coche' ? 'Coche' : outing.context === 'En moto' ? 'Moto' : outing.context === 'En bici' ? 'Bici' : 'Otro') as any,
          notes: oa.notes || outing.notes || '',
          photos: oa.photo ? [oa.photo] : [oa.imageUrl],
          mapImage: oa.photo || oa.imageUrl,
          latitude: oa.latitude !== undefined ? oa.latitude : outing.latitude,
          longitude: oa.longitude !== undefined ? oa.longitude : outing.longitude,
          locationSource: oa.locationSource ? (oa.locationSource === 'gps' ? 'GPS' : 'manual') : outing.locationSource,
          outingId: outing.id,
        });
      });
    });
    return list;
  }, [outings]);

  // Handle checking/unchecking animal directly from the field checklist
  const handleToggleSeen = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    if (animal.seenCount > 0) {
      // Uncheck is seen: set counts back to zero
      setAnimals(prev => prev.map(a => a.id === animalId ? { ...a, seenCount: 0 } : a));
      // Wipe associated auto outings containing ONLY this checked animal
      setOutings(prev => prev.map(o => {
        return {
          ...o,
          animals: o.animals.filter(oa => oa.animalId !== animalId)
        };
      }).filter(o => o.animals.length > 0));
    } else {
      // Check as seen: create a fast auto-outing registered locally
      setAnimals(prev => prev.map(a => a.id === animalId ? { ...a, seenCount: 1 } : a));
      const quickOuting: Outing = {
        id: `outing-quick-${Date.now()}`,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs',
        location: 'Región Local',
        context: 'Andando',
        notes: 'Avistamiento rápido registrado desde el catálogo general de especies.',
        animals: [{
          animalId: animal.id,
          animalName: animal.name,
          scientificName: animal.scientificName,
          imageUrl: animal.imageUrl,
          type: animal.type,
          count: 1,
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs'
        }]
      };
      setOutings(prev => [quickOuting, ...prev]);
    }
  };

  // Preset an outing when clicking quick register inside Detalle screen
  const handleOpenAddModal = (animal?: Animal) => {
    const freshOuting: Outing = {
      id: `outing-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs',
      location: 'Región Local',
      context: 'Andando',
      notes: animal ? `Salida organizada tras avistar un ejemplar de ${animal.name}.` : '',
      animals: animal ? [{
        animalId: animal.id,
        animalName: animal.name,
        scientificName: animal.scientificName,
        imageUrl: animal.imageUrl,
        type: animal.type,
        count: 1,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs'
      }] : []
    };
    setActiveOuting(freshOuting);
    if (animal) {
      setCurrentScreen('seleccion_animales_salida');
    } else {
      setCurrentScreen('nueva_salida');
    }
  };

  // Initialize a new draft outing from the startup parameters
  const handleStartOuting = (outingData: {
    location: string;
    context: Outing['context'];
    notes: string;
    latitude?: number;
    longitude?: number;
    locationSource?: 'GPS' | 'manual';
  }) => {
    const freshOuting: Partial<Outing> = {
      id: `outing-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs',
      location: outingData.location || 'Entorno Natural',
      context: outingData.context || 'Andando',
      notes: outingData.notes || '',
      latitude: outingData.latitude,
      longitude: outingData.longitude,
      locationSource: outingData.locationSource,
      animals: []
    };
    setActiveOuting(freshOuting);
    setCurrentScreen('seleccion_animales_salida');
  };

  // Update selected animals with counts during an active session
  const handleUpdateActiveAnimals = (updatedAnimals: OutingAnimal[]) => {
    if (activeOuting) {
      setActiveOuting({ ...activeOuting, animals: updatedAnimals });
    }
  };

  // Archive draft permanently in the outings collection
  const handleSaveActiveOuting = () => {
    if (!activeOuting) return;

    const finalized: Outing = {
      id: activeOuting.id || `outing-${Date.now()}`,
      date: activeOuting.date || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: activeOuting.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs',
      location: activeOuting.location || 'Entorno Natural',
      context: activeOuting.context || 'Andando',
      notes: activeOuting.notes || '',
      animals: activeOuting.animals || [],
      status: 'finalizado',
      latitude: activeOuting.latitude,
      longitude: activeOuting.longitude,
      locationSource: activeOuting.locationSource
    };

    // Filter out if overwrite an existing ID, then stack newest on top
    setOutings(prev => {
      const cleaned = prev.filter(o => o.id !== finalized.id);
      return [finalized, ...cleaned];
    });

    // Recalculate seen Count & prep and append specimen photos to animal galleries
    setAnimals(prev => prev.map(animal => {
      const logged = finalized.animals.find(x => x.animalId === animal.id);
      if (logged) {
        const updatedGallery = [...animal.gallery];
        if (logged.photo && !updatedGallery.includes(logged.photo)) {
          updatedGallery.unshift(logged.photo);
        }
        return {
          ...animal,
          seenCount: Math.max(0, animal.seenCount) + logged.count,
          gallery: updatedGallery
        };
      }
      return animal;
    }));

    setActiveOuting(null);
    setCurrentScreen('inicio');
  };

  // Save active session as draft
  const handleSaveActiveOutingAsDraft = () => {
    if (!activeOuting) return;

    const draftOuting: Outing = {
      id: activeOuting.id || `outing-${Date.now()}`,
      date: activeOuting.date || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: activeOuting.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs',
      location: activeOuting.location || 'Entorno Natural',
      context: activeOuting.context || 'Andando',
      notes: activeOuting.notes || '',
      animals: activeOuting.animals || [],
      status: 'borrador',
      latitude: activeOuting.latitude,
      longitude: activeOuting.longitude,
      locationSource: activeOuting.locationSource
    };

    setOutings(prev => {
      const cleaned = prev.filter(o => o.id !== draftOuting.id);
      return [draftOuting, ...cleaned];
    });

    setActiveOuting(null);
    setCurrentScreen('inicio');
  };

  const handleSelectAnimal = (animalId: string) => {
    setSelectedAnimalId(animalId);
    setCurrentScreen('detalle');
  };

  const handleSelectOutingReview = (outing: Outing) => {
    setSelectedOuting(outing);
    setCurrentScreen('resumen_salida');
  };

  const handleAddPhotoToGallery = (animalId: string, photoUrl: string) => {
    setAnimals(prev => prev.map(animal => {
      if (animal.id === animalId) {
        return {
          ...animal,
          gallery: [photoUrl, ...animal.gallery]
        };
      }
      return animal;
    }));
  };

  const handleResetData = () => {
    localStorage.removeItem('animlist_animals_state');
    localStorage.removeItem('animlist_outings_state');
    setAnimals(INITIAL_ANIMALS);
    setOutings(INITIAL_OUTINGS);
    setCurrentScreen('inicio');
  };

  const activeAnimalForDetail = selectedAnimalId
    ? animals.find(a => a.id === selectedAnimalId)
    : null;

  // View state router
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'bienvenida':
        return <ScreenBienvenida onStart={() => setCurrentScreen('inicio')} />;
      case 'inicio':
        return (
          <ScreenInicio
            animals={animals}
            sightings={sightings}
            outings={outings}
            onNavigate={setCurrentScreen}
            onSelectAnimal={handleSelectAnimal}
            onSelectOuting={handleSelectOutingReview}
            onStartNewOuting={() => setCurrentScreen('nueva_salida')}
            onToggleSidebar={() => setIsSidebarOpen(true)}
            isSidebarOpen={isSidebarOpen}
          />
        );
      case 'lista':
        return (
          <ScreenLista
            animals={animals}
            onNavigate={setCurrentScreen}
            onSelectAnimal={handleSelectAnimal}
            onOpenAddModal={handleOpenAddModal}
            onToggleSeen={handleToggleSeen}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        );
      case 'detalle':
        if (activeAnimalForDetail) {
          return (
            <ScreenDetalle
              animal={activeAnimalForDetail}
              sightings={sightings}
              onBack={() => setCurrentScreen('lista')}
              onOpenAddModal={handleOpenAddModal}
              onAddPhotoToGallery={handleAddPhotoToGallery}
            />
          );
        }
        return <div className="p-8 text-center text-on-surface-variant font-sans">Especie no encontrada.</div>;
      case 'coleccion':
        return (
          <ScreenColeccion
            animals={animals}
            onNavigate={setCurrentScreen}
            onSelectAnimal={handleSelectAnimal}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        );
      case 'mapa':
        return (
          <ScreenMapa
            sightings={sightings}
            animals={animals}
            onSelectAnimal={handleSelectAnimal}
            onSelectOuting={(outingId) => {
              const o = outings.find(x => x.id === outingId);
              if (o) {
                handleSelectOutingReview(o);
              }
            }}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        );
      case 'perfil':
        return (
          <ScreenPerfil
            animals={animals}
            sightings={sightings}
            onNavigate={setCurrentScreen}
            onResetData={handleResetData}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        );
      case 'salidas':
        return (
          <ScreenSalidas
            outings={outings}
            onSelectOuting={handleSelectOutingReview}
            onStartNewOuting={() => setCurrentScreen('nueva_salida')}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        );
      case 'nueva_salida':
        return (
          <ScreenNuevaSalida
            onStart={handleStartOuting}
            onBack={() => setCurrentScreen('inicio')}
          />
        );
      case 'seleccion_animales_salida':
        if (activeOuting) {
          return (
            <ScreenSeleccionAnimalesSalida
              activeOuting={activeOuting}
              animalsCatalog={animals}
              onUpdateOutingAnimals={handleUpdateActiveAnimals}
              onFinalize={() => setCurrentScreen('resumen_salida')}
              onSaveDraft={handleSaveActiveOutingAsDraft}
              onCancel={() => {
                setActiveOuting(null);
                setCurrentScreen('inicio');
              }}
            />
          );
        }
        return <div className="p-8 text-center text-on-surface-variant font-sans">Sin salida activa cargada.</div>;
      case 'resumen_salida':
        // Double duty: handles active register draft OR viewing reading historic outings
        if (selectedOuting) {
          return (
            <ScreenResumenSalida
              outing={selectedOuting}
              readOnly={true}
              onClose={() => {
                setSelectedOuting(null);
                setCurrentScreen('salidas');
              }}
            />
          );
        }
        if (activeOuting) {
          return (
            <ScreenResumenSalida
              outing={activeOuting}
              readOnly={false}
              onSave={handleSaveActiveOuting}
              onEdit={() => setCurrentScreen('seleccion_animales_salida')}
            />
          );
        }
        return <div className="p-8 text-center text-[#999] font-sans">No hay resumen disponible.</div>;
      default:
        return <ScreenBienvenida onStart={() => setCurrentScreen('inicio')} />;
    }
  };

  // Toggle active bottom navigation
  const shouldShowBottomNav = ['inicio', 'lista', 'salidas', 'coleccion', 'mapa', 'perfil'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#fbfcfa] text-[#191c1a] relative flex flex-col md:flex-row antialiased">
      
      {/* Sidebar Navigation Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-[4px_0_24px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between select-none"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      nature_people
                    </span>
                    <span className="font-display font-bold text-lg text-primary">Animlist</span>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <hr className="border-surface-container-high/40" />

                <nav className="flex flex-col gap-1">
                  {[
                    { screen: 'inicio', label: 'Inicio', icon: 'home' },
                    { screen: 'lista', label: 'Catálogo de campo', icon: 'menu_book' },
                    { screen: 'salidas', label: 'Historial de salidas', icon: 'history_edu' },
                    { screen: 'coleccion', label: 'Mi colección', icon: 'auto_stories' },
                    { screen: 'mapa', label: 'Mapa', icon: 'map' },
                    { screen: 'perfil', label: 'Perfil y logros', icon: 'person' }
                  ].map((item) => {
                    const isActive = currentScreen === item.screen;
                    return (
                      <button
                        key={item.screen}
                        onClick={() => {
                          setCurrentScreen(item.screen as any);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-primary-container text-on-primary-container shadow-xs'
                            : 'text-on-surface-variant hover:bg-[#eaf0ec]/50'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="text-center font-sans text-[10px] text-on-surface-variant/80">
                <p>© 2026 Animlist Naturalist</p>
                <p className="mt-1 italic">Colecciona con respeto la vida silvestre</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main rendering viewport */}
      <div className="flex-grow w-full">
        {renderActiveScreen()}
      </div>

      {/* Persistent Bottom navigation tabs controller */}
      {shouldShowBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full z-40 bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.05)] py-2.5 px-3 flex justify-evenly items-center border-t border-surface-container-high/60 select-none">
          {[
            { screen: 'inicio', label: 'Inicio', icon: 'home' },
            { screen: 'lista', label: 'Catálogo', icon: 'menu_book' },
            { screen: 'salidas', label: 'Salidas', icon: 'history_edu' },
            { screen: 'coleccion', label: 'Colección', icon: 'auto_stories' },
            { screen: 'mapa', label: 'Mapa', icon: 'map' },
            { screen: 'perfil', label: 'Perfil', icon: 'person' }
          ].map((tab) => {
            const isActive = currentScreen === tab.screen;
            return (
              <button
                key={tab.screen}
                onClick={() => setCurrentScreen(tab.screen as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all active:scale-90 font-display text-[9px] uppercase tracking-wider font-extrabold gap-1 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container px-3.5 py-2 shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {tab.icon}
                </span>
                <span className="text-[8px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

    </div>
  );
}
