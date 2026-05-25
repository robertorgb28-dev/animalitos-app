import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Animal, Sighting } from '../types';

interface ModalNuevoAvistamientoProps {
  animal: Animal | null;
  onClose: () => void;
  onSave: (sightingData: Partial<Sighting>) => void;
  onSaveQuickSeen: (animalId: string) => void;
  animalsCatalog: Animal[];
}

export default function ModalNuevoAvistamiento({
  animal,
  onClose,
  onSave,
  onSaveQuickSeen,
  animalsCatalog,
}: ModalNuevoAvistamientoProps) {
  // If animal is null, let user select from catalog! This makes the FAB (+) from homepage fully functional.
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(animal);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [locationText, setLocationText] = useState('Parque del Retiro, Sendero Norte');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [selectedContext, setSelectedContext] = useState<'Andando' | 'Coche' | 'Moto' | 'Bici' | 'Otro'>('Andando');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined coordinates based on context selection for the map
  const contextCoords = {
    'Andando': { top: '65%', left: '60%' },
    'Coche': { top: '20%', left: '75%' },
    'Moto': { top: '55%', left: '25%' },
    'Bici': { top: '40%', left: '50%' },
    'Otro': { top: '15%', left: '80%' }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const handleImportPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = () => {
    if (!selectedAnimal) return;
    
    // Save full sighting
    const hoursStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hrs';
    
    onSave({
      animalId: selectedAnimal.id,
      animalName: selectedAnimal.name,
      location: locationText,
      timestamp: 'Hoy',
      time: hoursStr,
      context: selectedContext,
      notes: additionalNotes,
      photos: photoUrl ? [photoUrl] : [],
      coords: contextCoords[selectedContext]
    });
  };

  const handleQuickSave = () => {
    if (!selectedAnimal) return;
    onSaveQuickSeen(selectedAnimal.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      
      {/* Container Card */}
      <motion.div 
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="w-full max-w-[480px] max-h-[92vh] rounded-[24px] overflow-hidden flex flex-col relative shadow-[0_16px_48px_rgba(49,99,66,0.22)] bg-white border border-surface-container-high/60"
      >
        
        {/* Header (Sticky at top of modal) */}
        <header className="px-5 py-4 flex justify-between items-center border-b border-surface-container-high/60 bg-surface-container-lowest shrink-0">
          <div className="min-w-0 flex-1">
            <span className="font-display font-bold text-[10px] text-primary uppercase tracking-wider block">
              Nuevo avistamiento
            </span>
            {selectedAnimal ? (
              <h1 className="font-display text-lg sm:text-xl font-bold text-on-surface truncate mt-0.5">
                {selectedAnimal.name}
              </h1>
            ) : (
              <div className="mt-1">
                <select 
                  onChange={(e) => {
                    const selectedObj = animalsCatalog.find(a => a.id === e.target.value);
                    if (selectedObj) setSelectedAnimal(selectedObj);
                  }}
                  className="font-display text-base font-bold bg-transparent text-on-surface focus:outline-none border-b border-primary/40 focus:border-primary py-0.5 cursor-pointer max-w-full truncate"
                  defaultValue=""
                >
                  <option value="" disabled>Seleccionar especie...</option>
                  {animalsCatalog.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface-variant cursor-pointer ml-3 shrink-0"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* Input Form Fields (Scrollable area) */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5 no-scrollbar min-h-0 bg-surface-container-lowest/40">
          
          {/* Photo upload area */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-wider text-on-surface-variant/80 uppercase px-0.5">
              Foto de la observación
            </span>
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleImportPhotoClick}
              className={`w-full aspect-[16/10] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed relative overflow-hidden transition-all group cursor-pointer ${
                photoUrl 
                  ? 'border-solid border-primary bg-surface-container' 
                  : dragActive 
                    ? 'border-primary bg-primary-container/10 scale-101' 
                    : 'border-outline-variant hover:border-primary bg-surface-container-low/60 hover:bg-surface-container-low'
              }`}
            >
              {photoUrl ? (
                <>
                  <img 
                    alt="Evidencia fotográfica" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    src={photoUrl} 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none">
                    <span className="material-symbols-outlined text-3xl">photo_camera</span>
                    <span className="text-xs font-semibold uppercase">Reemplazar foto</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-3xl text-primary/70 mb-1">
                    add_photo_alternate
                  </span>
                  <p className="font-sans text-xs font-semibold text-on-surface-variant">Suelte una foto aquí o haga clic</p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">JPG, PNG o foto de cámara móvil</p>
                </>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Location Area Section */}
          <section className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-wider text-on-surface-variant/80 flex items-center gap-1 uppercase px-0.5">
              <span className="material-symbols-outlined text-[15px]">location_on</span>
              ¿Dónde lo has visto?
            </label>

            <div className="relative w-full h-[120px] rounded-2xl overflow-hidden bg-surface-container border border-surface-container-high shadow-xs select-none">
              <img 
                alt="Mini mapa de ubicación" 
                className="w-full h-full object-cover opacity-85 mix-blend-multiply" 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFbyGiDHnhpImJm087ysif-89FvNG5k8-1vAP-UpOLTScJJWSDfTGYH-XJF0xmc5WpPD0wo5UKNaKDu-oWJNJ2M7AxeG8demLVPkXzoA5ykwv4m_Y2HFyt_XikRaS98YurAVPWHnujVGg25r1HMvDRUiuqc8lpzugLsYLm2cP_Oe8k2WWbiaWdpfbtLez0npp3vNKxd6O30Dbumk9MKHmPneoe3krbplLE2qhvtxIxttK9xh-5p61xgAV1Fa3LXAenz4l4L9tlSBE" 
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-color" />
              
              {/* Dynamic pulse marker preview based on active coordinate context */}
              <div 
                style={{
                  top: contextCoords[selectedContext]?.top || '50%',
                  left: contextCoords[selectedContext]?.left || '50%'
                }}
                className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 animate-pulse"
              />

              <div className="absolute inset-x-2 bottom-2">
                <div className="w-full bg-white/95 backdrop-blur-md rounded-xl py-2 px-3 flex items-center justify-between border border-surface-container-high/60 shadow-sm min-w-0">
                  {isEditingLocation ? (
                    <input
                      type="text"
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      onBlur={() => setIsEditingLocation(false)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingLocation(false); }}
                      className="font-sans text-xs text-on-surface bg-transparent focus:outline-none border-b border-primary flex-1 mr-2"
                      autoFocus
                    />
                  ) : (
                    <span className="font-sans text-xs font-semibold text-on-surface truncate mr-2">
                      {locationText}
                    </span>
                  )}
                  
                  <button 
                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                    className="text-primary font-display font-bold text-[10px] tracking-wider uppercase shrink-0 hover:opacity-85 p-1 cursor-pointer"
                  >
                    {isEditingLocation ? 'OK' : 'EDITAR'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Context Selector card loops */}
          <section className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-wider text-on-surface-variant/80 uppercase px-0.5">
              Cómo ha sido el encuentro
            </span>
            
            <div className="flex gap-2 overflow-x-auto pb-1.5 -mx-1 px-1 no-scrollbar select-none">
              {[
                { type: 'Andando', icon: 'directions_walk', label: 'Caminando' },
                { type: 'Coche', icon: 'directions_car', label: 'En coche' },
                { type: 'Moto', icon: 'two_wheeler', label: 'En moto' },
                { type: 'Bici', icon: 'pedal_bike', label: 'En bicicleta' },
                { type: 'Otro', icon: 'more_horiz', label: 'Otro' }
              ].map((opt) => {
                const isSelected = selectedContext === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedContext(opt.type as any)}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 rounded-xl p-2 w-[74px] border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-primary border-primary text-on-primary shadow-xs' 
                        : 'bg-white border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span 
                      className="material-symbols-outlined text-[18px]" 
                      style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {opt.icon}
                    </span>
                    <span className="font-display font-semibold text-[9px] select-none tracking-tight">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Notes area field text */}
          <section className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-wider text-on-surface-variant/80 flex items-center gap-1 uppercase px-0.5" htmlFor="txt-notes-modal">
              <span className="material-symbols-outlined text-[15px]">edit_note</span>
              Notas de campo (Opcional)
            </label>
            <textarea 
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full bg-white border border-outline-variant/50 rounded-xl p-3 font-sans text-xs text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none placeholder:text-on-surface-variant/50 focus:outline-none" 
              id="txt-notes-modal" 
              placeholder="Ej: ¿Qué estaba haciendo? ¿Hacía sol o llovía? Comportamiento de la especie..." 
              rows={3}
            />
          </section>
        </div>

        {/* Sticky footer action triggers (Sticky at bottom of modal) */}
        <div className="p-4 bg-surface-container-lowest border-t border-surface-container-high/60 flex flex-col gap-2 shrink-0">
          <button 
            onClick={handleFormSubmit}
            disabled={!selectedAnimal}
            className="w-full bg-[#4a7c59] disabled:opacity-50 text-white font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#3d664a] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border-none"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            Guardar Registro Completo
          </button>
          
          <button 
            onClick={handleQuickSave}
            disabled={!selectedAnimal}
            className="w-full bg-transparent text-[#4a7c59] disabled:opacity-50 font-display font-semibold text-xs py-2.5 rounded-xl border border-[#4a7c59]/30 hover:bg-primary-container/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            Guardar solo como visto
          </button>
        </div>

      </motion.div>
    </div>
  );
}
