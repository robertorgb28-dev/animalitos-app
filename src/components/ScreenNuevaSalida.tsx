import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Outing } from '../types';

interface ScreenNuevaSalidaProps {
  onStart: (data: {
    location: string;
    context: Outing['context'];
    notes: string;
    latitude?: number;
    longitude?: number;
    locationSource?: 'GPS' | 'manual';
  }) => void;
  onBack: () => void;
}

export default function ScreenNuevaSalida({ onStart, onBack }: ScreenNuevaSalidaProps) {
  const [location, setLocation] = useState('');
  const [context, setContext] = useState<Outing['context']>('Andando');
  const [notes, setNotes] = useState('');

  // Location Selector states
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [coordSource, setCoordSource] = useState<'GPS' | 'manual' | null>(null);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const mapPickerContainerRef = useRef<HTMLDivElement>(null);
  const pickerMapRef = useRef<any>(null);
  const pickerMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapPickerOpen) return;
    const L = (window as any).L;
    if (!L || !mapPickerContainerRef.current) return;

    if (pickerMapRef.current) {
      pickerMapRef.current.remove();
    }

    const initialCenter: [number, number] = coords 
      ? [coords.latitude, coords.longitude] 
      : [40.416775, -3.703790]; // Default to Madrid center

    const map = L.map(mapPickerContainerRef.current, {
      center: initialCenter,
      zoom: coords ? 14 : 6,
      zoomControl: true,
    });
    pickerMapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const updateMarker = (lat: number, lng: number) => {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const iconHtml = `
          <div class="flex items-center justify-center relative w-8 h-8 rounded-full border-2 border-white shadow-md bg-[#4a7c59] text-white">
            <span class="material-symbols-outlined" style="font-size: 16px;">pin_drop</span>
          </div>
        `;
        const markerIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        pickerMarkerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      }
      setCoords({ latitude: lat, longitude: lng });
      setCoordSource('manual');
    };

    if (coords) {
      updateMarker(coords.latitude, coords.longitude);
    }

    map.on('click', (e: any) => {
      updateMarker(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (pickerMapRef.current) {
        pickerMapRef.current.remove();
        pickerMarkerRef.current = null;
        pickerMapRef.current = null;
      }
    };
  }, [mapPickerOpen]);

  const handleUseGPS = () => {
    setGpsLoading(true);
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('La geolocalización no está soportada en este entorno.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setCoordSource('GPS');
        setGpsLoading(false);
        setMapPickerOpen(false);

        // Fetch reverse geocode name from OSM Nomination lookup
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              const nameParts = data.display_name.split(',');
              const shortName = nameParts.slice(0, 3).join(',').trim();
              setLocation(shortName);
            }
          })
          .catch(() => {
            // Silence lookup failures while keeping coords
          });
      },
      (error) => {
        console.error(error);
        setGpsError('Permiso denegado de GPS o error de geolocalización.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Auto-generate date and time
  const defaultDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const defaultTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  }) + ' hrs';

  const contextsList: { value: Outing['context']; label: string; icon: string }[] = [
    { value: 'Andando', label: 'A pie', icon: 'directions_walk' },
    { value: 'En el campo', label: 'En el campo', icon: 'terrain' },
    { value: 'En parque', label: 'En parque', icon: 'park' },
    { value: 'En río o lago', label: 'Río o Lago', icon: 'water' },
    { value: 'En playa', label: 'En la playa', icon: 'beach_access' },
    { value: 'En ciudad', label: 'En la ciudad', icon: 'location_city' },
    { value: 'En coche', label: 'En coche', icon: 'directions_car' },
    { value: 'En bici', label: 'En bici', icon: 'directions_bike' },
    { value: 'En moto', label: 'En moto', icon: 'motorcycle' },
    { value: 'Otro', label: 'Otro tipo', icon: 'more_horiz' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      location: location.trim() || 'Entorno Natural',
      context,
      notes: notes.trim(),
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      locationSource: coordSource || undefined
    });
  };

  return (
    <div className="bg-[#fbfcfa] min-h-screen pb-20 font-sans text-on-background">
      {/* Top Header */}
      <header className="w-full bg-white/95 sticky top-0 z-40 px-4 py-4 border-b border-surface-container-high/60 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-all active:scale-95 text-on-surface cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-display font-bold text-lg text-primary">Nueva Salida de Campo</h1>
        <div className="w-10"></div>
      </header>

      {/* Form Content */}
      <main className="max-w-xl mx-auto p-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(49,99,66,0.05)] border border-surface-container/30"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Automatic Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-container/40">
                <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-1">Fecha</p>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                  <span>{defaultDate}</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-container/40">
                <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-1">Hora inicio</p>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-primary text-base">schedule</span>
                  <span>{defaultTime}</span>
                </div>
              </div>
            </div>

            {/* Location & GPS Capture Panel */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Ubicación / Lugar del avistamiento
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80">
                    location_on
                  </span>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Parque de Doñana, Campo de golf..."
                    className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-on-surface focus:outline-none transition-all placeholder:text-on-surface-variant/60"
                  />
                </div>
              </div>

              {/* GPS Actions & manual picker triggers */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={gpsLoading}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none border border-none cursor-pointer ${
                    coordSource === 'GPS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#eaf2ed] text-[#4a7c59] hover:bg-[#d0e3d6]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-base ${gpsLoading ? 'animate-spin' : ''}`}>
                    {gpsLoading ? 'sync' : 'my_location'}
                  </span>
                  <span>{gpsLoading ? 'Obteniendo...' : coordSource === 'GPS' ? 'GPS Capturado' : 'Mi ubicación'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMapPickerOpen(!mapPickerOpen)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none border border-none cursor-pointer ${
                    mapPickerOpen || coordSource === 'manual'
                      ? 'bg-primary text-white hover:opacity-95'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">map</span>
                  <span>Elegir en el mapa</span>
                </button>

                {coords && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoords(null);
                      setCoordSource(null);
                      setMapPickerOpen(false);
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all select-none border border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">location_off</span>
                    <span>Omitir ubicación</span>
                  </button>
                )}
              </div>

              {/* GPS Error Banners */}
              {gpsError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                  <span className="material-symbols-outlined text-base">error_outline</span>
                  <span>{gpsError}</span>
                </div>
              )}

              {/* Captured coordinates metadata visualization badge */}
              {coords && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold leading-relaxed animate-fade-in">
                  <span className="material-symbols-outlined text-base text-emerald-600">bookmark_added</span>
                  <div>
                    <span className="block font-bold">Ubicación capturada con éxito:</span>
                    <span className="block font-mono text-[10px] text-emerald-700 font-normal">
                      Latitud: {coords.latitude.toFixed(6)}, Longitud: {coords.longitude.toFixed(6)} ({coordSource === 'GPS' ? 'GPS de alta precisión' : 'Pin manual en mapa'})
                    </span>
                  </div>
                </div>
              )}

              {/* Mappicker Container frame inside standard block */}
              {mapPickerOpen && (
                <div className="relative border border-[#4a7c59]/20 rounded-2xl p-3 bg-surface-container-lowest shadow-inner space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#4a7c59] flex items-center gap-1 leading-none">
                    <span className="material-symbols-outlined text-xs">info</span>
                    <span>Toca en cualquier parte del mapa para fijar tu pin</span>
                  </p>
                  <div 
                    ref={mapPickerContainerRef} 
                    className="w-full h-52 rounded-xl border border-surface-container-high overflow-hidden" 
                    style={{ position: 'relative', zIndex: 1 }}
                  />
                </div>
              )}
            </div>

            {/* Context (Optional) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Contexto / Medio de transporte
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 select-none">
                {contextsList.map((item) => {
                  const isSelected = context === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setContext(item.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 text-center cursor-pointer ${
                        isSelected
                          ? 'bg-primary-container border-primary text-on-primary-container shadow-xs font-bold'
                          : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/80'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-2xl mb-1.5"
                        style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        {item.icon}
                      </span>
                      <span className="text-[11px] leading-tight font-display tracking-tight break-all truncate w-full">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-1.5">
              <label htmlFor="notes" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Nota general del cuaderno de campo
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. El día está soleado, soplaba poco viento. Voy con prismáticos buscando avifauna..."
                className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 text-sm font-medium text-on-surface focus:outline-none transition-all placeholder:text-on-surface-variant/60 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#4a7c59] hover:bg-[#3d664a] text-white py-4 px-5 rounded-2xl font-display font-bold text-sm uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(74,124,89,0.25)] hover:shadow-[0_8px_24px_rgba(74,124,89,0.35)] active:scale-98 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <span>Empezar a añadir animales</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
