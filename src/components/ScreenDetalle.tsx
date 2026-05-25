import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Animal, Sighting } from '../types';
import AnimalImage from './AnimalImage';

interface ScreenDetalleProps {
  animal: Animal;
  sightings: Sighting[];
  onBack: () => void;
  onOpenAddModal: (animal: Animal) => void;
  onAddPhotoToGallery: (animalId: string, photoUrl: string) => void;
}

export default function ScreenDetalle({
  animal,
  sightings,
  onBack,
  onOpenAddModal,
  onAddPhotoToGallery,
}: ScreenDetalleProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Filter sightings belonging to this animal
  const animalSightings = sightings.filter(s => s.animalId === animal.id);

  // Default fallbacks for galleries in case empty
  const galleryPhotos = animal.gallery.length > 0 
    ? animal.gallery 
    : [animal.imageUrl].filter(Boolean);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);
      onAddPhotoToGallery(animal.id, localUrl);
    }
  };

  const onAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Drag-and-drop support
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
      const localUrl = URL.createObjectURL(file);
      onAddPhotoToGallery(animal.id, localUrl);
    }
  };

  return (
    <div className="bg-background text-on-background antialiased pb-32 min-h-screen">
      
      {/* Top Navigation Bar */}
      <header className="w-full top-0 sticky z-40 bg-white/95 backdrop-blur-md flex justify-between items-center px-4 py-3 border-b border-surface-container-high/60 shadow-xs">
        <button 
          onClick={onBack}
          aria-label="Volver atrás" 
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-all active:scale-95 duration-200 cursor-pointer text-on-surface"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-display text-base font-bold text-primary tracking-tight">Ficha de especie</span>
        <div className="w-10"></div> {/* Spacer for balance */}
      </header>

      {/* Main Content Scroll Area */}
      <main className="w-full max-w-2xl mx-auto overflow-x-hidden">
        
        {/* Hero Section Container */}
        <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-surface-container-highest overflow-hidden">
          <AnimalImage
            imageUrl={animal.imageUrl}
            imageVerified={animal.imageVerified}
            category={animal.type}
            name={animal.name}
            className="w-full h-full object-cover"
            iconSize="text-5xl"
          />
          {/* Text Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5">
            <div className="inline-flex items-center gap-1 self-start px-2.5 py-1 bg-[#4a7c59] text-white rounded-full mb-2 shadow-xs select-none">
              <span className="font-display leading-none text-[10px] uppercase tracking-wider font-extrabold">
                {animal.type}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-0.5 drop-shadow-sm">
              {animal.name}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-white/90 italic tracking-wide font-medium">
              {animal.scientificName}
            </p>
          </div>
        </section>

        {/* Info Grid Spacing */}
        <div className="px-4 py-5 space-y-6">
          
          {/* Breve descripción narrativa de campo de types.ts */}
          {animal.description && (
            <section className="bg-surface-container-low/50 border-l-4 border-[#4a7c59] p-4 rounded-r-2xl shadow-xs">
              <h2 className="text-[10px] font-bold tracking-wider text-[#4a7c59] uppercase mb-1 flex items-center gap-1 leading-none select-none">
                <span className="material-symbols-outlined text-[14px]">sticky_note_2</span>
                Cuaderno de apuntes
              </h2>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {animal.description}
              </p>
            </section>
          )}

          {/* Stats Dashboard Grid Siting */}
          <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-3 bg-[#e2e9ec]/40 rounded-xl p-3.5 flex-1 border border-[#b0bfc6]/30 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  fact_check
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider leading-none mb-1">Registro local</p>
                <p className="font-display text-sm font-bold text-on-surface truncate">
                  Visto en campo: {animal.seenCount} {animal.seenCount === 1 ? 'vez' : 'veces'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => onOpenAddModal(animal)}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#4a7c59] text-white rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#3d664a] active:scale-95 shadow-xs flex items-center justify-center gap-2 cursor-pointer border-none whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add_location</span>
              Registrar avistamiento
            </button>
          </section>

          {/* Sighting History Section */}
          <section className="space-y-3.5">
            <h2 className="font-display text-lg font-bold text-on-surface">Historial de avistamientos</h2>
            
            <div className="space-y-3">
              {animalSightings.map((sighting) => (
                <article 
                  key={sighting.id}
                  className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-xs border border-surface-container-high/60 flex flex-col sm:flex-row gap-3.5 transition-all hover:-translate-y-0.5 duration-300"
                >
                  {/* Past Sight map snapshot overlay */}
                  <div className="w-full sm:w-28 h-20 rounded-xl bg-surface-var overflow-hidden shrink-0 border border-surface-container-high relative select-none">
                    <img 
                      alt="Mapa de ubicación" 
                      className="w-full h-full object-cover opacity-80 mix-blend-multiply" 
                      referrerPolicy="no-referrer"
                      src={sighting.mapImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuALqJE6qBywUQPvZGgCf4QTa99anEi55iet5NrvDKPked3vkmTQ_szuDaMo5y6eVKuEPjGSG0HaXUaQCf51Exu1ZL8C5_vv1KHpWEpiXyaiphrWycDCENagvMLpOwAbFcw7HwtjnW8yRxb8N_68zQTi4q7teMHXMitzYT0OY3dBCfbm0LLK0KSBUumjUMPbSHLps0Na9l2rrxUHiJdLrd9sH9Z105ZMHmGh3cv6nAFuQATJTQA-XR6StcVQUltqjnm1vGJvsmZY9DA'} 
                    />
                    <div className="absolute inset-0 bg-primary/5 mix-blend-color" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </div>
                  </div>

                  {/* Sighting Text Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-display font-semibold text-sm text-on-surface truncate">
                          {sighting.location}
                        </h3>
                        <span className="text-[10px] text-on-surface-variant font-bold shrink-0 font-sans tracking-wide uppercase mt-0.5">
                          {sighting.timestamp} • {sighting.time}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 font-sans leading-none">
                        <span className="material-symbols-outlined text-[13px]">motorcycle</span> 
                        Método: {sighting.context || 'Andando'}
                      </p>
                    </div>

                    {sighting.notes && (
                      <p className="text-xs text-on-surface-variant italic mt-2 bg-surface-container-low/40 p-2.5 rounded-lg border-l-2 border-primary/50 font-sans leading-relaxed">
                        "{sighting.notes}"
                      </p>
                    )}
                  </div>
                </article>
              ))}

              {animalSightings.length === 0 && (
                <div className="p-6 text-center bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/60 font-sans flex flex-col items-center justify-center gap-1.5 select-none">
                  <span className="material-symbols-outlined text-outline-variant text-2xl">add_road</span>
                  <p className="text-xs text-on-surface-variant font-semibold">Sin registros de ubicación adicionales</p>
                  <p className="text-[10px] text-on-surface-variant/80">Regístralo ahora para colocar un pin interactivo en tu mapa de campo.</p>
                </div>
              )}
            </div>
          </section>

          {/* User Gallery Photos Grid with Drag & Drop */}
          <section className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg font-bold text-on-surface">Galería fotográfica</h2>
              {galleryPhotos.length > 0 && (
                <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest bg-surface-container px-2.5 py-1 rounded-md">
                  {galleryPhotos.length} {galleryPhotos.length === 1 ? 'Foto' : 'Fotos'}
                </span>
              )}
            </div>

            {/* Hidden Input selector */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryPhotos.map((photo, index) => (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden bg-surface-variant border border-surface-container shadow-xs group relative"
                >
                  <img 
                    alt={`Foto nº${index + 1} de ${animal.name}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                    src={photo} 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent duration-300 transition-colors" />
                </motion.div>
              ))}

              {/* Upload Card container with drag & drop active state */}
              <button 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onAddPhotoClick}
                className={`aspect-square rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center flex-col cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-primary bg-primary-container/10 scale-102 text-primary shadow-inner' 
                    : 'border-outline-variant hover:border-primary hover:bg-surface-container-low text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-1 text-primary/80" style={{ fontVariationSettings: "'FILL' 0" }}>
                  add_photo_alternate
                </span>
                <span className="font-display font-semibold text-[11px] text-center select-none px-2 leading-tight">
                  {dragActive ? 'Suelte aquí' : 'Añadir foto'}
                </span>
                <span className="text-[9px] text-on-surface-variant/70 mt-0.5 select-none hidden sm:inline-block">
                  Arrastra o haz clic
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
