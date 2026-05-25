import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Animal, AnimalCategory, Outing, OutingAnimal } from '../types';
import AnimalImage from './AnimalImage';

interface ScreenSeleccionAnimalesSalidaProps {
  activeOuting: Partial<Outing>;
  animalsCatalog: Animal[];
  onUpdateOutingAnimals: (animals: OutingAnimal[]) => void;
  onFinalize: () => void;
  onCancel: () => void;
  onSaveDraft?: () => void;
}

type ActiveTab = 'catalogo' | 'seleccionados';

export default function ScreenSeleccionAnimalesSalida({
  activeOuting,
  animalsCatalog,
  onUpdateOutingAnimals,
  onFinalize,
  onCancel,
  onSaveDraft,
}: ScreenSeleccionAnimalesSalidaProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalogo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | AnimalCategory>('Todos');
  const [showExitModal, setShowExitModal] = useState(false);

  // Individual animal location capture states
  const [sightingLocationPrompt, setSightingLocationPrompt] = useState<Animal | null>(null);
  const [animalMapPicker, setAnimalMapPicker] = useState<{ animalId: string; animalName: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const animalMapPickerContainerRef = useRef<HTMLDivElement>(null);
  const animalPickerMapRef = useRef<any>(null);
  const animalPickerMarkerRef = useRef<any>(null);

  // Input ref helpers for file uploads (custom photos for animals)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Derive selected animals map for quick access
  const selectedAnimalsMap = useMemo(() => {
    const map = new Map<string, OutingAnimal>();
    if (activeOuting.animals) {
      activeOuting.animals.forEach(x => {
        map.set(x.animalId, x);
      });
    }
    return map;
  }, [activeOuting.animals]);

  // Handle checking / unchecking animal in catalog tab
  const handleToggleAddAnimal = (animal: Animal) => {
    const list = [...(activeOuting.animals || [])];
    const isAlreadyAdded = selectedAnimalsMap.has(animal.id);

    if (isAlreadyAdded) {
      // Remove it
      const updated = list.filter(item => item.animalId !== animal.id);
      onUpdateOutingAnimals(updated);
    } else {
      // If the active Outing has positive coordinates, we inherit them automatically
      if (activeOuting.latitude !== undefined && activeOuting.longitude !== undefined) {
        const newEntry: OutingAnimal = {
          animalId: animal.id,
          animalName: animal.name,
          scientificName: animal.scientificName,
          imageUrl: animal.imageUrl,
          type: animal.type,
          count: 1,
          notes: '',
          location: activeOuting.location || 'Entorno Natural',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs',
          latitude: activeOuting.latitude,
          longitude: activeOuting.longitude,
          locationSource: 'inherited'
        };
        onUpdateOutingAnimals([...list, newEntry]);
      } else {
        // If the outing has NO location, prompt user nicely before adding!
        setSightingLocationPrompt(animal);
      }
    }
  };

  // Helper to append the animal to the active list with optional coords
  const handleAddAnimalWithLocation = (
    animal: Animal,
    lat?: number,
    lng?: number,
    source?: 'gps' | 'manual' | null
  ) => {
    const list = [...(activeOuting.animals || [])];
    if (selectedAnimalsMap.has(animal.id)) return;

    const newEntry: OutingAnimal = {
      animalId: animal.id,
      animalName: animal.name,
      scientificName: animal.scientificName,
      imageUrl: animal.imageUrl,
      type: animal.type,
      count: 1,
      notes: '',
      location: activeOuting.location || 'Entorno Natural',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs',
      latitude: lat,
      longitude: lng,
      locationSource: source
    };
    onUpdateOutingAnimals([...list, newEntry]);
    setSightingLocationPrompt(null);
  };

  // Geolocation trigger for prompt modal
  const handleCaptureGPSForPrompt = (animal: Animal) => {
    setLocationLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('La geolocalización no está soportada en tu navegador o entorno.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleAddAnimalWithLocation(animal, latitude, longitude, 'gps');
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        setGpsError('No se pudo acceder a la ubicación GPS. Puedes elegirla manualmente.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Render and handle manual selector map for specific animal
  useEffect(() => {
    if (!animalMapPicker) return;
    const L = (window as any).L;
    if (!L || !animalMapPickerContainerRef.current) return;

    if (animalPickerMapRef.current) {
      animalPickerMapRef.current.remove();
    }

    // Default center focuses on Cádiz / Andalusia since it is the focus of AnimList!
    const centerPoint: [number, number] = [36.529787, -6.292649];

    const map = L.map(animalMapPickerContainerRef.current, {
      center: centerPoint,
      zoom: 12,
      zoomControl: true,
    });
    animalPickerMapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let selectedCoords: { lat: number; lng: number } | null = null;

    const updateMarker = (lat: number, lng: number) => {
      selectedCoords = { lat, lng };
      if (animalPickerMarkerRef.current) {
        animalPickerMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const iconHtml = `
          <div class="flex items-center justify-center relative w-8 h-8 rounded-full border-2 border-white shadow-md bg-[#c2410c] text-white">
            <span class="material-symbols-outlined font-bold text-center" style="font-size: 16px;">pin_drop</span>
          </div>
        `;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-pin-animal',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        animalPickerMarkerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      }
    };

    map.on('click', (e: any) => {
      updateMarker(e.latlng.lat, e.latlng.lng);
    });

    // Try to focus map if geolocation is available as reference center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.setView([pos.coords.latitude, pos.coords.longitude], 14);
          updateMarker(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // If search fails, just place marker at center point
          updateMarker(centerPoint[0], centerPoint[1]);
        },
        { timeout: 3000 }
      );
    } else {
      updateMarker(centerPoint[0], centerPoint[1]);
    }

    // Expose capture callback
    (window as any)._lastSightingCoordsInput = () => selectedCoords;

    return () => {
      if (animalPickerMapRef.current) {
        animalPickerMapRef.current.remove();
        animalPickerMarkerRef.current = null;
        animalPickerMapRef.current = null;
      }
    };
  }, [animalMapPicker]);

  const handleSaveManualCoordinates = () => {
    if (!animalMapPicker) return;
    const getter = (window as any)._lastSightingCoordsInput;
    const coords = getter ? getter() : null;

    if (coords) {
      // If it exists in outing already, update coordinates
      if (selectedAnimalsMap.has(animalMapPicker.animalId)) {
        handleUpdateAnimalField(animalMapPicker.animalId, {
          latitude: coords.lat,
          longitude: coords.lng,
          locationSource: 'manual'
        });
      } else {
        // Find the full animal from catalog
        const catalogAnimal = animalsCatalog.find(a => a.id === animalMapPicker.animalId);
        if (catalogAnimal) {
          handleAddAnimalWithLocation(catalogAnimal, coords.lat, coords.lng, 'manual');
        }
      }
    }
    setAnimalMapPicker(null);
    setSightingLocationPrompt(null);
  };

  // Modify quantities / fields for already selected ones
  const handleUpdateAnimalField = (animalId: string, updates: Partial<OutingAnimal>) => {
    const list = (activeOuting.animals || []).map(item => {
      if (item.animalId === animalId) {
        return { ...item, ...updates };
      }
      return item;
    });
    onUpdateOutingAnimals(list);
  };

  const handlePhotoUpload = (animalId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      handleUpdateAnimalField(animalId, { photo: base64data });
    };
    reader.readAsDataURL(file);
  };

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return animalsCatalog.filter(animal => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        animal.name.toLowerCase().includes(query) ||
        animal.scientificName.toLowerCase().includes(query) ||
        (animal.description && animal.description.toLowerCase().includes(query));

      const matchesCategory = selectedCategory === 'Todos' || animal.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [animalsCatalog, searchQuery, selectedCategory]);

  const categoriesList: { value: 'Todos' | AnimalCategory; label: string; icon: string }[] = [
    { value: 'Todos', label: 'Todos', icon: 'border_all' },
    { value: 'Aves', label: 'Aves', icon: 'flutter_dash' },
    { value: 'Mamíferos', label: 'Mamíferos', icon: 'pets' },
    { value: 'Reptiles', label: 'Reptiles', icon: 'healing' },
    { value: 'Anfibios', label: 'Anfibios', icon: 'water_drop' },
    { value: 'Peces', label: 'Peces', icon: 'scuba_diving' },
    { value: 'Insectos', label: 'Insectos', icon: 'bug_report' },
    { value: 'Arácnidos', label: 'Arácnidos', icon: 'grain' },
    { value: 'Moluscos', label: 'Moluscos', icon: 'waves' },
    { value: 'Crustáceos', label: 'Crustáceos', icon: 'waves' },
    { value: 'Otros', label: 'Otros', icon: 'category' }
  ];

  const totalSelectedCount = activeOuting.animals ? activeOuting.animals.length : 0;
  const totalIndividualAnimals = activeOuting.animals
    ? activeOuting.animals.reduce((total, a) => total + a.count, 0)
    : 0;

  return (
    <div className="bg-[#fbfcfa] min-h-screen pb-36 font-sans text-on-background relative">
      {/* Top sticky app header */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-surface-container-high/60">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowExitModal(true)}
              className="p-2 -ml-2 rounded-full hover:bg-surface-container active:scale-95 text-on-surface-variant cursor-pointer"
              aria-label="Cancelar avistamiento"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <div>
              <h1 className="font-display font-bold text-base text-primary leading-tight">Registrando salida</h1>
              <p className="text-[10px] text-on-surface-variant leading-none mt-0.5 font-medium truncate max-w-[180px]">
                {activeOuting.location || 'Entorno Natural'}
              </p>
            </div>
          </div>

          <div className="bg-[#f3f6f4] py-1 px-3 border border-primary/20 rounded-full flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Sesión Activa</span>
          </div>
        </div>

        {/* Tab buttons to choose Catalog vs Selected */}
        <div className="flex border-t border-surface-container-high/40 select-none">
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`flex-1 py-3 text-center font-display text-xs font-bold uppercase tracking-wider relative cursor-pointer border-none bg-transparent ${
              activeTab === 'catalogo' ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            Añadir especies
            {activeTab === 'catalogo' && (
              <motion.div layoutId="activetabline" className="absolute bottom-0 inset-x-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('seleccionados')}
            className={`flex-1 py-3 text-center font-display text-xs font-bold uppercase tracking-wider relative flex items-center justify-center gap-1.5 cursor-pointer border-none bg-transparent ${
              activeTab === 'seleccionados' ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span>Detalles de vistos</span>
            {totalSelectedCount > 0 && (
              <span className="bg-[#4a7c59] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {totalSelectedCount}
              </span>
            )}
            {activeTab === 'seleccionados' && (
              <motion.div layoutId="activetabline" className="absolute bottom-0 inset-x-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport Content Area */}
      <main className="max-w-xl mx-auto p-4 pt-5">
        <AnimatePresence mode="wait">
          {activeTab === 'catalogo' ? (
            <motion.div
              key="catalogo-pane"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {/* Search Bar */}
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-4.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none select-none">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-outline-variant/50 text-on-surface font-sans text-sm rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xs placeholder:text-on-surface-variant/70 font-medium"
                  placeholder="Buscar animal por nombre..."
                  type="text"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-90 transition-all cursor-pointer border-none bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Category Badges horizontal scroll */}
              <div className="flex flex-col gap-1.5">
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
                        className={`flex-shrink-0 flex items-center gap-1.5 font-display text-xs font-semibold px-3.5 py-2.5 rounded-full transition-all active:scale-95 whitespace-nowrap border cursor-pointer ${
                          isActive
                            ? 'bg-primary border-primary text-on-primary shadow-xs'
                            : 'bg-white border-outline-variant/40 text-on-surface-variant hover:border-outline hover:bg-surface-container-low'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* List of Animals */}
              <div className="space-y-3 pt-1.5">
                {filteredCatalog.map((animal) => {
                  const isSelected = selectedAnimalsMap.has(animal.id);
                  const entry = selectedAnimalsMap.get(animal.id);

                  return (
                    <div
                      key={animal.id}
                      onClick={() => handleToggleAddAnimal(animal)}
                      className={`flex items-center justify-between p-3 rounded-2xl bg-white border cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md ${
                        isSelected ? 'border-[#4a7c59] bg-[#f4f7f5]/80' : 'border-surface-container-high/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-surface-container-high/40 bg-surface-container">
                          <AnimalImage
                            imageUrl={animal.imageUrl}
                            imageVerified={animal.imageVerified}
                            category={animal.type}
                            name={animal.name}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-bold text-sm text-on-surface leading-snug truncate">
                            {animal.name}
                          </h3>
                          <p className="text-[10px] italic text-on-surface-variant/80 truncate">
                            {animal.scientificName}
                          </p>
                          <span className="inline-block bg-[#e8edeb] text-primary font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-md mt-1 font-sans">
                            {animal.type}
                          </span>
                        </div>
                      </div>

                      {/* Select Action Checkbox / Badge */}
                      <div className="pl-3 pr-1 shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#4a7c59] text-white'
                              : 'bg-white border-2 border-outline-variant text-[#a0ada5]'
                          }`}
                        >
                          {isSelected ? (
                            <div className="flex flex-col items-center">
                              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                check
                              </span>
                              {entry && entry.count > 1 && (
                                <span className="text-[9px] font-bold leading-none -mt-1 bg-black/20 px-1 rounded-sm">
                                  {entry.count}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="material-symbols-outlined text-lg">add</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredCatalog.length === 0 && (
                  <div className="py-14 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 font-sans flex flex-col items-center justify-center gap-2.5 px-4">
                    <span className="material-symbols-outlined text-3xl text-outline-variant">pets</span>
                    <p className="font-display font-bold text-sm text-on-surface">No hay resultados</p>
                    <p className="text-xs text-on-surface-variant">Prueba con otro término de búsqueda.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="seleccionados-pane"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {/* Selected List with rich details panel */}
              {totalSelectedCount > 0 ? (
                <div className="space-y-4">
                  <div className="bg-primary-container/10 border border-primary/15 p-3.5 rounded-2xl">
                    <h4 className="font-display text-xs font-bold text-[#4a7c59] uppercase tracking-wider mb-0.5">
                      Instrucciones
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                      Define la cantidad que has visto de cada especie seleccionada. Opcionalmente puedes agregar una hora específica, foto subida, coordenadas o notas particulares para culminar tu reporte de campo.
                    </p>
                  </div>

                  {(activeOuting.animals || []).map((animal) => {
                    const orig = animalsCatalog.find(a => a.id === animal.animalId);
                    return (
                      <div
                        key={animal.animalId}
                        className="bg-white rounded-3xl p-4 shadow-sm border border-surface-container-high/60 flex flex-col gap-4"
                      >
                        {/* Species header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-surface-container-high/40 bg-surface-container">
                              <AnimalImage
                                imageUrl={animal.photo || animal.imageUrl}
                                imageVerified={orig?.imageVerified}
                                category={animal.type}
                                name={animal.animalName}
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-display font-bold text-sm text-on-surface leading-tight truncate">
                                {animal.animalName}
                              </h3>
                              <p className="text-[10px] italic text-on-surface-variant truncate">
                                {animal.scientificName}
                              </p>
                            </div>
                          </div>

                          {/* Remove item button */}
                          <button
                            onClick={() => {
                              const filtered = (activeOuting.animals || []).filter(
                                x => x.animalId !== animal.animalId
                              );
                              onUpdateOutingAnimals(filtered);
                            }}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-full text-on-surface-variant transition-colors cursor-pointer border-none bg-transparent"
                            aria-label="Eliminar de esta salida"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>

                        {/* Detail controls */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-surface-container">
                          {/* Quantity Counter */}
                          <div className="bg-[#fbfcfa] border border-surface-container-high p-2.5 rounded-2xl flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                              Cantidad vista
                            </span>
                            <div className="flex items-center justify-between mt-1 px-1 select-none">
                              <button
                                type="button"
                                onClick={() => {
                                  if (animal.count > 1) {
                                    handleUpdateAnimalField(animal.animalId, { count: animal.count - 1 });
                                  }
                                }}
                                className="w-8 h-8 rounded-full bg-surface-container-medium hover:bg-surface-container-highest font-bold text-base flex items-center justify-center active:scale-90 transition-all cursor-pointer border-none"
                              >
                                -
                              </button>
                              <span className="font-display font-bold text-sm text-primary">{animal.count}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateAnimalField(animal.animalId, { count: animal.count + 1 });
                                }}
                                className="w-8 h-8 rounded-full bg-surface-container-medium hover:bg-surface-container-highest font-bold text-base flex items-center justify-center active:scale-90 transition-all cursor-pointer border-none"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Custom specific Time */}
                          <div className="bg-[#fbfcfa] border border-surface-container-high p-2.5 rounded-2xl flex flex-col justify-between">
                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                              Hora observada
                            </span>
                            <input
                              type="text"
                              value={animal.time || ''}
                              onChange={(e) =>
                                handleUpdateAnimalField(animal.animalId, { time: e.target.value })
                              }
                              placeholder="Ej. 18:32"
                              className="bg-transparent text-xs font-bold text-on-surface border-none focus:outline-none focus:ring-0 w-full mt-1 font-sans"
                            />
                          </div>
                        </div>

                        {/* Animal-specific Location Capture/Management */}
                        <div className="bg-[#fbfcfa] border border-surface-container-high p-3 rounded-2xl flex flex-col gap-1.5 font-sans">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                              Ubicación específica del animal
                            </span>
                            {animal.locationSource && (
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide leading-none ${
                                animal.locationSource === 'gps'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : animal.locationSource === 'manual'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-neutral-100 text-neutral-800'
                              }`}>
                                {animal.locationSource === 'gps'
                                  ? 'GPS directo'
                                  : animal.locationSource === 'manual'
                                  ? 'Manual'
                                  : 'Heredada'}
                              </span>
                            )}
                          </div>

                          {animal.latitude !== undefined && animal.longitude !== undefined ? (
                            <div className="flex items-center justify-between gap-1 mt-0.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="material-symbols-outlined text-[15px] text-primary shrink-0">pin_drop</span>
                                <span className="font-mono text-[10px] text-on-surface-variant truncate font-medium">
                                  {animal.latitude.toFixed(6)}, {animal.longitude.toFixed(6)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setAnimalMapPicker({ animalId: animal.animalId, animalName: animal.animalName })}
                                  className="bg-surface-container hover:bg-surface-container-medium text-[9px] text-on-surface px-2 py-1 rounded-lg border-none cursor-pointer font-bold uppercase tracking-wider"
                                >
                                  Editar mapa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateAnimalField(animal.animalId, {
                                      latitude: undefined,
                                      longitude: undefined,
                                      locationSource: null
                                    });
                                  }}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded-lg border-none cursor-pointer flex items-center justify-center"
                                  title="Eliminar ubicación"
                                >
                                  <span className="material-symbols-outlined text-sm">location_off</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5 mt-0.5">
                              <p className="text-[10px] text-on-surface-variant/85 leading-snug">
                                Sin coordenadas. No se colocará marker particular en el mapa general.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (navigator.geolocation) {
                                      navigator.geolocation.getCurrentPosition(
                                        (pos) => {
                                          handleUpdateAnimalField(animal.animalId, {
                                            latitude: pos.coords.latitude,
                                            longitude: pos.coords.longitude,
                                            locationSource: 'gps'
                                          });
                                        },
                                        () => {
                                          alert('No se pudo acceder al GPS para la captura directa.');
                                        },
                                        { enableHighAccuracy: true, timeout: 5000 }
                                      );
                                    }
                                  }}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-[#0f766e] text-[9px] py-1.5 px-2.5 rounded-lg border-none cursor-pointer flex items-center gap-1 font-bold uppercase tracking-wider"
                                >
                                  <span className="material-symbols-outlined text-[11px]">my_location</span>
                                  Fijar GPS
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAnimalMapPicker({ animalId: animal.animalId, animalName: animal.animalName })}
                                  className="bg-blue-50 hover:bg-blue-100 text-[#1d4ed8] text-[9px] py-1.5 px-2.5 rounded-lg border-none cursor-pointer flex items-center gap-1 font-bold uppercase tracking-wider"
                                >
                                  <span className="material-symbols-outlined text-[11px]">map</span>
                                  Mapa manual
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Specific Notes & Sighting Photo */}
                        <div className="space-y-3">
                          {/* Custom Photo Selector */}
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => {
                                fileInputRefs.current[animal.animalId] = el;
                              }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handlePhotoUpload(animal.animalId, e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            {animal.photo ? (
                              <div className="relative w-full h-24 rounded-2xl overflow-hidden group border border-outline-variant">
                                <img
                                  alt="Foto cargada"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  src={animal.photo}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateAnimalField(animal.animalId, { photo: undefined })}
                                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-rose-600 transition-colors border-none"
                                >
                                  <span className="material-symbols-outlined text-[14px]">close</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[animal.animalId]?.click()}
                                className="w-full border border-dashed border-outline-variant/60 rounded-2xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:bg-[#eaf0ec]/30 transition-all cursor-pointer bg-white"
                              >
                                <span className="material-symbols-outlined text-base">add_a_photo</span>
                                <span>Añadir foto del espécimen</span>
                              </button>
                            )}
                          </div>

                          {/* Specimen Notes */}
                          <input
                            type="text"
                            value={animal.notes || ''}
                            onChange={(e) => handleUpdateAnimalField(animal.animalId, { notes: e.target.value })}
                            placeholder="Notas (ej. Macho plumaje nupcial, cantando sobre un árbol)"
                            className="w-full bg-[#f8f9f8] border border-outline-variant/40 rounded-xl py-2.5 px-3.5 text-xs text-on-surface-variant focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60"
                          />
                        </div>
                      </div>
                    )})}
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 font-sans flex flex-col items-center justify-center gap-3 px-4 select-none">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">add_task</span>
                  <div>
                    <h3 className="font-display font-bold text-sm text-on-surface">No has añadido especies todavía</h3>
                    <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs mx-auto leading-relaxed">
                      Ve al catálogo pulsando la pestaña superior y selecciona los animales observados en el campo.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('catalogo')}
                    className="mt-1 bg-primary-container text-on-primary-container font-display text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-center cursor-pointer border-none"
                  >
                    Ver Catálogo
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed bottom interactive summary and submit action bar */}
      <footer className="fixed bottom-0 inset-x-0 bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.06)] border-t border-surface-container-high/60 py-4 px-5 z-40 select-none">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3.5 flex-wrap">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider leading-none">
              Resumen actual
            </span>
            <span className="font-display font-medium text-xs text-on-surface-variant mt-1.5 leading-none">
              <strong className="text-[#4a7c59] text-base">{totalSelectedCount}</strong> especies ({totalIndividualAnimals} ejemp.)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-grow sm:flex-grow-0 justify-end">
            <button
              onClick={onSaveDraft}
              type="button"
              className="bg-surface-container-low hover:bg-[#e4ece7] text-primary px-4 py-3.5 rounded-2xl font-display font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-none shadow-xs"
            >
              Guardar Borrador
            </button>

            <button
              onClick={onFinalize}
              type="button"
              disabled={totalSelectedCount === 0}
              className={`px-5 py-3.5 rounded-2xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer border-none shadow-sm ${
                totalSelectedCount > 0
                  ? 'bg-[#4a7c59] text-white hover:bg-[#3d664a]'
                  : 'bg-surface-container-medium text-[#aaa] cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>Finalizar</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Dynamic Sighting Location Prompt Modal (if outing coordinates are undefined) */}
      <AnimatePresence>
        {sightingLocationPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSightingLocationPrompt(null)}
              className="fixed inset-0 bg-black/60 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl z-55 max-w-sm mx-auto space-y-4 border border-surface-container font-sans text-on-background"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">my_location</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm text-on-surface leading-tight">Ubicación del avistamiento</h3>
                  <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{sightingLocationPrompt.name}</p>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Esta salida fue iniciada sin ubicación GPS. ¿Quieres registrar coordenadas reales de campo específicas para el avistamiento de esta especie?
              </p>

              {gpsError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[10px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{gpsError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1 font-display">
                <button
                  onClick={() => handleCaptureGPSForPrompt(sightingLocationPrompt)}
                  disabled={locationLoading}
                  type="button"
                  className="w-full bg-[#4a7c59] hover:bg-[#3d664a] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none flex items-center justify-center gap-1"
                >
                  <span className={`material-symbols-outlined text-base ${locationLoading ? 'animate-spin' : ''}`}>
                    {locationLoading ? 'sync' : 'gps_fixed'}
                  </span>
                  <span>{locationLoading ? 'Obteniendo GPS...' : 'Sí, capturar GPS real'}</span>
                </button>

                <button
                  onClick={() => {
                    setAnimalMapPicker({
                      animalId: sightingLocationPrompt.id,
                      animalName: sightingLocationPrompt.name
                    });
                  }}
                  type="button"
                  className="w-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">map</span>
                  <span>Elegir punto en el mapa</span>
                </button>

                <button
                  onClick={() => handleAddAnimalWithLocation(sightingLocationPrompt)}
                  type="button"
                  className="w-full bg-white hover:bg-neutral-50 text-neutral-600 py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-none"
                >
                  Guardar sin coordenadas
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manual Pin Map picker Modal */}
      <AnimatePresence>
        {animalMapPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnimalMapPicker(null)}
              className="fixed inset-0 bg-black/60 z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-5 shadow-2xl z-55 max-w-sm mx-auto space-y-4 border border-surface-container font-sans text-on-background"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">pin_drop</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-on-surface">Ubicación exacta</h3>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-0.5 truncate max-w-[240px]">
                    {animalMapPicker.animalName}
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider flex items-center gap-1 leading-none">
                <span className="material-symbols-outlined text-xs text-primary">info</span>
                <span>Toca en el mapa para marcar el avistamiento</span>
              </p>

              {/* Map body wrapper */}
              <div 
                ref={animalMapPickerContainerRef} 
                className="w-full h-56 rounded-2xl border border-surface-container-high overflow-hidden" 
                style={{ position: 'relative', zIndex: 1 }}
              />

              <div className="flex gap-2.5 pt-1.5 font-display select-none">
                <button
                  onClick={() => setAnimalMapPicker(null)}
                  type="button"
                  className="flex-1 bg-surface-container hover:bg-surface-container-medium text-on-surface py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none text-center"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveManualCoordinates}
                  type="button"
                  className="flex-1 bg-[#4a7c59] hover:bg-[#3d664a] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none text-center shadow-xs"
                >
                  Guardar punto
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Exit confirmation Warning modal */}
      <AnimatePresence>
        {showExitModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitModal(false)}
              className="fixed inset-0 bg-black/60 z-55 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl z-55 max-w-sm mx-auto space-y-4 border border-surface-container"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl font-bold">warning</span>
                </div>
                <h3 className="font-display font-bold text-base text-on-surface">¿Salir de esta sesión?</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Estás registrando una salida de campo. Si sales ahora, puedes guardar el progreso actual como borrador o descartarlo definitivamente.
              </p>
              <div className="flex flex-col gap-2 pt-1 font-display">
                <button
                  onClick={() => {
                    setShowExitModal(false);
                    if (onSaveDraft) onSaveDraft();
                  }}
                  type="button"
                  className="w-full bg-[#4a7c59] hover:bg-[#3d664a] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none"
                >
                  Guardar Borrador y Salir
                </button>
                <button
                  onClick={() => {
                    setShowExitModal(false);
                    onCancel();
                  }}
                  type="button"
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none"
                >
                  Descartar Salida de Campo
                </button>
                <button
                  onClick={() => setShowExitModal(false)}
                  type="button"
                  className="w-full bg-surface-container hover:bg-surface-container-medium text-on-surface py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none"
                >
                  Volver a la edición
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
