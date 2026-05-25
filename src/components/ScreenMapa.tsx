import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Animal, Sighting, AnimalCategory } from '../types';

interface ScreenMapaProps {
  sightings: Sighting[];
  animals: Animal[];
  onSelectAnimal: (id: string) => void;
  onSelectOuting: (outingId: string) => void;
  onToggleSidebar: () => void;
}

export default function ScreenMapa({
  sightings,
  animals,
  onSelectAnimal,
  onSelectOuting,
  onToggleSidebar,
}: ScreenMapaProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkersGroupRef = useRef<any>(null);
  const [activeSighting, setActiveSighting] = useState<Sighting | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | AnimalCategory>('Todos');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [onlyCadiz, setOnlyCadiz] = useState(false);
  const [msgToast, setMsgToast] = useState<string | null>(null);

  // Helper to trigger temporary feedback messages
  const showToast = (msg: string) => {
    setMsgToast(msg);
    setTimeout(() => {
      setMsgToast(null);
    }, 4000);
  };

  // Derive category markers configuration
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'Aves': return { color: '#0284c7', icon: 'flutter_dash' };
      case 'Mamíferos': return { color: '#b45309', icon: 'pets' };
      case 'Reptiles': return { color: '#16a34a', icon: 'healing' };
      case 'Anfibios': return { color: '#0d9488', icon: 'water_drop' };
      case 'Peces': return { color: '#2563eb', icon: 'scuba_diving' };
      case 'Insectos': return { color: '#c2410c', icon: 'bug_report' };
      case 'Arácnidos': return { color: '#7c3aed', icon: 'grid_view' };
      case 'Moluscos': return { color: '#db2777', icon: 'brightness_low' };
      case 'Crustáceos': return { color: '#e11d48', icon: 'waves' };
      default: return { color: '#4b5563', icon: 'category' };
    }
  };

  // Combined filters logic
  const filteredSightings = useMemo(() => {
    return sightings.filter(s => {
      // 1. Must contain valid coordinates
      if (s.latitude === undefined || s.longitude === undefined) return false;

      // 2. Search Query
      const query = searchQuery.trim().toLowerCase();
      const animal = animals.find(a => a.id === s.animalId);
      const matchesSearch = !query || 
                            s.animalName.toLowerCase().includes(query) || 
                            s.location.toLowerCase().includes(query) ||
                            (animal?.scientificName && animal.scientificName.toLowerCase().includes(query));

      // 3. Category Filter
      const sightingCategory = animal ? animal.type : 'Otros';
      const matchesCategory = selectedCategory === 'Todos' || sightingCategory === selectedCategory;

      // 4. Cádiz Focus Filter
      const matchesCadiz = !onlyCadiz || (animal?.cadizCommon === true);

      // 5. Date Filter (e.g. "today", "week", "month")
      let matchesDate = true;
      if (dateFilter !== 'all') {
        try {
          // Parse sighting date: e.g. "25 May 2026"
          const parts = s.timestamp.split(' ');
          // Basic approximation: if it fails, fallback to true
          const now = new Date();
          const recordDate = new Date(s.timestamp);
          const diffTime = Math.abs(now.getTime() - recordDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (dateFilter === 'today') {
            matchesDate = diffDays <= 1;
          } else if (dateFilter === 'week') {
            matchesDate = diffDays <= 7;
          } else if (dateFilter === 'month') {
            matchesDate = diffDays <= 30;
          }
        } catch (_) {
          matchesDate = true;
        }
      }

      return matchesSearch && matchesCategory && matchesCadiz && matchesDate;
    });
  }, [sightings, animals, searchQuery, selectedCategory, dateFilter, onlyCadiz]);

  // Handle building Leaflet markers on the map
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    // 1. Create or initialize the map instance
    if (!leafletMapRef.current) {
      // Choose Cádiz region center as start center
      const defaultCenter: [number, number] = [36.529787, -6.292649];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 10,
        zoomControl: true,
      });
      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Add feature group for markers to easily handle fitBounds
      leafletMarkersGroupRef.current = L.featureGroup().addTo(map);
    }

    const map = leafletMapRef.current;
    const markersGroup = leafletMarkersGroupRef.current;

    // Clear existing markers
    markersGroup.clearLayers();

    // Map to offset coordinates for overlapping locations (Jitter)
    const sightingCountMap = new Map<string, number>();

    // Add markers for filtered sightings
    filteredSightings.forEach(sighting => {
      const animal = animals.find(a => a.id === sighting.animalId);
      const sightingCategory = animal ? animal.type : 'Otros';
      const customPhoto = sighting.photos[0] || (animal ? animal.imageUrl : '');
      const firstLetter = sighting.animalName ? sighting.animalName.trim().charAt(0).toUpperCase() : '?';

      let lat = sighting.latitude!;
      let lng = sighting.longitude!;

      // Jitter overlapping markers inside a clean spiral offset
      const coordKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      const indexAtCoord = sightingCountMap.get(coordKey) || 0;
      sightingCountMap.set(coordKey, indexAtCoord + 1);

      if (indexAtCoord > 0) {
        const angle = (indexAtCoord * 2 * Math.PI) / 8;
        const radius = 0.00018 * Math.sqrt(indexAtCoord); // ~15 meters shift per overlapping item
        lat = lat + Math.sin(angle) * radius;
        lng = lng + Math.cos(angle) * radius;
      }

      const catStyle = getCategoryStyles(sightingCategory);

      // Custom divIcon matching categories perfectly
      const iconHtml = `
        <div class="flex items-center justify-center relative w-9 h-9 rounded-full border-2 border-white shadow-lg text-white font-sans animate-fade-in" style="background-color: ${catStyle.color};">
          <span class="material-symbols-outlined" style="font-size: 16px;">${catStyle.icon}</span>
          <div class="absolute -bottom-1 -right-1 bg-white border border-[#4a7c59] text-primary text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            1
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersGroup);

      const notesText = sighting.notes ? `<p class="m-0 italic text-gray-600 mt-1 pl-1 border-l border-primary/40 leading-snug">"${sighting.notes}"</p>` : '';
      const photoHtml = customPhoto 
        ? `<img src="${customPhoto}" class="w-11 h-11 rounded-lg object-cover border shrink-0 bg-gray-50" />` 
        : `<div class="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border font-bold text-sm shrink-0 font-display">${firstLetter}</div>`;

      // Popup with full buttons: Ver detalle (view detailed sheet) & Ver salida (open parent outing review)
      const popupHtml = `
        <div class="p-2 font-sans text-xs flex flex-col gap-2 min-w-[210px]">
          <div class="flex items-center gap-2.5">
            ${photoHtml}
            <div class="min-w-0 flex-1">
              <p class="font-bold text-gray-800 m-0 text-sm truncate leading-snug">${sighting.animalName}</p>
              <p class="text-[9px] text-gray-500 m-0 mt-0.5">${sighting.timestamp} • ${sighting.time}</p>
            </div>
          </div>
          <div class="border-t border-gray-100 pt-1.5 flex flex-col gap-1 text-[10px] text-gray-700">
            <p class="m-0 flex items-center gap-1">📍 <span class="font-semibold text-gray-500">Lugar:</span> <span class="truncate font-medium">${sighting.location}</span></p>
            <p class="m-0 flex items-center gap-1">💬 <span class="font-semibold text-gray-500">Contexto:</span> <span class="font-medium">${sighting.context}</span></p>
            ${notesText}
          </div>
          <div class="flex gap-1.5 mt-2">
            <button id="map-btn-ficha-${sighting.id}" class="flex-1 bg-[#4a7c59] text-white text-[9px] font-bold py-1.5 px-2 rounded-lg hover:bg-[#3d664a] transition-all cursor-pointer border-none shadow-xs uppercase tracking-wider block text-center">
              Ver Ficha
            </button>
            ${sighting.outingId ? `
              <button id="map-btn-salida-${sighting.id}" class="flex-1 bg-surface-container-high text-on-surface text-[9px] font-bold py-1.5 px-2 rounded-lg hover:bg-surface-container-highest transition-all cursor-pointer border-none shadow-xs uppercase tracking-wider block text-center">
                Ver Salida
              </button>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260, minWidth: 210 });

      marker.on('popupopen', () => {
        setActiveSighting(sighting);
        setTimeout(() => {
          // Setup custom detail action buttons
          const btnFicha = document.getElementById(`map-btn-ficha-${sighting.id}`);
          if (btnFicha) {
            btnFicha.onclick = (e) => {
              e.preventDefault();
              onSelectAnimal(sighting.animalId);
            };
          }
          const btnSalida = document.getElementById(`map-btn-salida-${sighting.id}`);
          if (btnSalida && sighting.outingId) {
            btnSalida.onclick = (e) => {
              e.preventDefault();
              onSelectOuting(sighting.outingId!);
            };
          }
        }, 80);
      });
    });

    // Auto fitbounds only once at beginning when we have pins
    if (filteredSightings.length > 0) {
      map.fitBounds(markersGroup.getBounds(), { padding: [50, 50] });
    }

    // Call map invalidate sizes to fit exactly in hidden spaces or responsive flips
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [filteredSightings, animals]);

  // Center on real-time live capture coordinate of the mobile device
  const handleCenterOnMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('La geolocalización no está soportada en tu navegador.');
      return;
    }

    if (leafletMapRef.current) {
      leafletMapRef.current.locate({ setView: true, maxZoom: 14 });
      showToast('Obteniendo GPS en tiempo real...');
    }
  };

  // Center and fit bounds of all mapped biological sightings
  const handleFitAllSightings = () => {
    if (leafletMapRef.current && leafletMarkersGroupRef.current) {
      const layers = leafletMarkersGroupRef.current.getLayers();
      if (layers.length > 0) {
        leafletMapRef.current.fitBounds(leafletMarkersGroupRef.current.getBounds(), { padding: [50, 50] });
        showToast(`Centrado en todos tus ${layers.length} avistamientos.`);
      } else {
        showToast('No tienes pines activos en el mapa para ajustar.');
      }
    }
  };

  const activeAnimal = activeSighting 
    ? animals.find(a => a.id === activeSighting.animalId) 
    : null;

  return (
    <div className="bg-[#fbfcfa] text-on-background h-screen w-full flex flex-col overflow-hidden relative font-sans">
      
      {/* TopAppBar */}
      <header className="bg-white text-primary w-full top-0 sticky flex justify-between items-center px-4 py-3.5 shadow-xs z-20 border-b border-surface-container-high/40">
        <button 
          onClick={onToggleSidebar}
          className="hover:bg-surface-container-low transition-colors duration-200 text-on-surface-variant p-2 -ml-2 rounded-full cursor-pointer border-none bg-transparent flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h1 className="font-display text-xl font-bold tracking-tight text-primary">Mapa Biológico</h1>
        <div className="w-10"></div>
      </header>

      {/* Embedded Rich Biological Filters Panel */}
      <div className="bg-white px-4 py-3 border-b border-surface-container-high/40 flex flex-col gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 font-sans">
        <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
          {/* Search bar inside map */}
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base pointer-events-none select-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar especie o término de lugar..."
              className="w-full bg-[#f8faf8] border border-outline-variant/40 rounded-xl py-2 pl-9 pr-8 text-xs text-on-surface focus:outline-none focus:border-primary transition-all font-medium placeholder:text-on-surface-variant/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant/85 hover:bg-surface-container p-0.5 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Cádiz Filter switch tag */}
          <button
            onClick={() => setOnlyCadiz(!onlyCadiz)}
            className={`flex items-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold select-none cursor-pointer border transition-all shrink-0 ${
              onlyCadiz
                ? 'bg-[#1e3a1e]/10 border-primary text-[#1e3a1e] font-bold'
                : 'bg-white border-outline-variant/40 text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{onlyCadiz ? 'check_box' : 'check_box_outline_blank'}</span>
            <span>Comunes de Cádiz</span>
          </button>
        </div>

        {/* Categories selector horizontal roll */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full transition-all border cursor-pointer ${
              selectedCategory === 'Todos'
                ? 'bg-primary border-primary text-white font-extrabold shadow-xs'
                : 'bg-[#f8faf8] border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            Todos
          </button>
          {(['Aves', 'Mamíferos', 'Reptiles', 'Anfibios', 'Peces', 'Insectos', 'Arácnidos', 'Moluscos', 'Crustáceos', 'Otros'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary border-primary text-white font-extrabold shadow-xs'
                  : 'bg-[#f8faf8] border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date Filter selector buttons */}
        <div className="flex gap-2 items-center text-[10px] text-on-surface-variant pt-1 select-none font-medium">
          <span className="font-bold uppercase tracking-wider text-[9px] text-on-surface-variant/65">Lapso:</span>
          <div className="flex bg-neutral-100 rounded-lg p-0.5 border border-outline-variant/30">
            {(['all', 'today', 'week', 'month'] as const).map(option => (
              <button
                key={option}
                onClick={() => setDateFilter(option)}
                className={`py-1 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-tight border-none cursor-pointer transition-colors ${
                  dateFilter === option
                    ? 'bg-white text-primary shadow-xs font-black'
                    : 'bg-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {option === 'all'
                  ? 'Siempre'
                  : option === 'today'
                  ? 'Hoy'
                  : option === 'week'
                  ? 'Semana'
                  : 'Mes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Content Container */}
      <main className="flex-grow relative w-full h-[calc(100vh-230px)] bg-surface-dim">
        <div ref={mapContainerRef} className="w-full h-full relative" style={{ zIndex: 1 }} />

        {filteredSightings.length === 0 && (
          <div className="absolute inset-x-4 top-[15%] bottom-[15%] flex flex-col items-center justify-center p-6 text-center bg-white/95 backdrop-blur-md border border-dashed border-outline-variant/60 rounded-3xl z-10 select-none space-y-3.5 shadow-xl max-w-sm mx-auto">
            <span className="material-symbols-outlined text-[40px] text-[#4a7c59]">explore_off</span>
            <div className="space-y-1">
              <h2 className="font-display font-black text-sm text-on-surface uppercase tracking-wider leading-tight">
                {sightings.length === 0 ? "Aún no hay pines en el mapa." : "No hay avistamientos coincidentes"}
              </h2>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                {sightings.length === 0 
                  ? "Los animales con ubicación aparecerán aquí." 
                  : "Prueba relajando tus filtros seleccionados o realiza una nueva salida capturando tu GPS real para ver tus pines."}
              </p>
            </div>
            {sightings.length > 0 && (searchQuery || selectedCategory !== 'Todos' || onlyCadiz || dateFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                  setOnlyCadiz(false);
                  setDateFilter('all');
                }}
                className="mt-1 bg-[#4a7c59] text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-all border-none cursor-pointer uppercase tracking-wider"
              >
                Limpiar filtros del mapa
              </button>
            )}
          </div>
        )}

        {/* Map Floating Controls: Centrar en mí, Ver todos */}
        <div className="absolute bottom-[4%] right-4 z-20 flex flex-col gap-2">
          {/* Centrar en mi ubicación */}
          <button 
            onClick={handleCenterOnMyLocation}
            className="w-11 h-11 bg-white rounded-full shadow-[0_8px_24px_rgba(49,99,66,0.2)] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95 cursor-pointer border-none"
            title="Centrar en mi ubicación GPS"
          >
            <span className="material-symbols-outlined select-none text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              my_location
            </span>
          </button>

          {/* Ver todos los avistamientos */}
          <button 
            onClick={handleFitAllSightings}
            className="w-11 h-11 bg-white rounded-full shadow-[0_8px_24px_rgba(49,99,66,0.2)] flex items-center justify-center text-on-surface-variant hover:text-[#0284c7] transition-colors active:scale-95 cursor-pointer border-none"
            title="Ver todos los avistamientos"
          >
            <span className="material-symbols-outlined select-none text-[22px]">
              zoom_out_map
            </span>
          </button>
        </div>

        {/* Feedback Micro-Toast notification */}
        <AnimatePresence>
          {msgToast && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute left-1/2 -translate-x-1/2 bottom-[15%] md:bottom-[4%] z-30 bg-black/85 text-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg text-[10px] font-bold text-center uppercase tracking-wide flex items-center gap-1.5 pointer-events-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{msgToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Floating card */}
        {activeSighting && (
          <div 
            onClick={() => onSelectAnimal(activeSighting.animalId)}
            className="absolute bottom-[4%] left-4 right-16 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_32px_rgba(49,99,66,0.14)] p-3 border border-[#4a7c59]/20 transform transition-all duration-300 cursor-pointer overflow-hidden max-w-sm hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-container border border-surface-container-high shadow-xs">
                <img 
                  alt={activeSighting.animalName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  src={activeSighting.photos[0] || (activeAnimal ? activeAnimal.imageUrl : '') || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=200'} 
                />
              </div>

              <div className="flex-grow min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-0.5 min-w-0">
                  <h2 className="font-display font-black text-xs text-on-surface truncate pr-2 leading-tight">
                    {activeSighting.animalName}
                  </h2>
                  <span className="material-symbols-outlined text-outline-variant text-[18px] shrink-0">
                    chevron_right
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-on-surface-variant/85 font-sans text-[10px] mb-0.5 min-w-0 truncate">
                  <span className="material-symbols-outlined text-[12px] shrink-0">calendar_today</span>
                  <span className="truncate">{activeSighting.timestamp} • {activeSighting.time}</span>
                </div>
                
                <div className="flex items-center gap-1 text-primary font-sans text-[10px] min-w-0 truncate">
                  <span className="material-symbols-outlined text-[12px] shrink-0">pin_drop</span>
                  <span className="truncate italic font-bold">{activeSighting.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
