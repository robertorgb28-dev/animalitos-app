import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Outing, INITIAL_ANIMALS } from '../types';
import AnimalImage from './AnimalImage';

interface ScreenResumenSalidaProps {
  outing: Partial<Outing>;
  onSave?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  readOnly?: boolean;
}

export default function ScreenResumenSalida({
  outing,
  onSave,
  onEdit,
  onClose,
  readOnly = false,
}: ScreenResumenSalidaProps) {
  const [showShareAlert, setShowShareAlert] = useState(false);

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

  const activeIcon = contextIcons[outing.context || ''] || 'location_on';

  const totalIndividualCount = outing.animals
    ? outing.animals.reduce((tot, a) => tot + a.count, 0)
    : 0;
  const distinctSpeciesCount = outing.animals ? outing.animals.length : 0;

  const handleShare = () => {
    // Show premium share success pop toast!
    setShowShareAlert(true);
    setTimeout(() => setShowShareAlert(false), 3000);
  };

  return (
    <div className="bg-[#fbfcfa] min-h-screen pb-24 font-sans text-on-background relative">
      {/* Header element */}
      <header className="w-full bg-white px-4 py-4 border-b border-surface-container-high/60 flex items-center justify-between shadow-xs sticky top-0 z-40">
        <button
          onClick={readOnly ? onClose : onEdit}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-all active:scale-95 text-on-surface cursor-pointer"
        >
          <span className="material-symbols-outlined">
            {readOnly ? 'arrow_back' : 'chevron_left'}
          </span>
        </button>
        <h1 className="font-display font-bold text-lg text-primary">
          {readOnly ? 'Detalles de la Salida' : 'Resumen del avistamiento'}
        </h1>
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container text-primary transition-all active:scale-95 cursor-pointer"
          aria-label="Compartir"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      {/* Main viewport */}
      <main className="max-w-xl mx-auto p-5 space-y-5">
        
        {/* Decorative Success banner for finishing a new record */}
        {!readOnly && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center select-none"
          >
            <span className="material-symbols-outlined text-[36px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <h2 className="font-display font-bold text-base text-primary mt-1">¡Salida de campo completada!</h2>
            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
              Revisa los detalles antes de archivarla en tu cuaderno histórico de avistamientos.
            </p>
          </motion.div>
        )}

        {/* Core Session Backdrop panel */}
        <section className="bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(49,99,66,0.04)] border border-surface-container-high/60 space-y-5">
          {/* Main Info Columns */}
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                Lugar de campo
              </p>
              <h2 className="font-display font-bold text-lg text-on-surface leading-snug">
                {outing.location || 'Entorno Natural'}
              </h2>
            </div>
            {/* Context tag badge */}
            <div className="bg-[#e4ece7] border border-[#a0cfae]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-primary font-bold">
              <span className="material-symbols-outlined text-base">{activeIcon}</span>
              <span>{outing.context}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-dashed border-surface-container">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Fecha y Hora</p>
              <p className="text-xs font-bold text-on-surface mt-0.5">{outing.date} a las {outing.time}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Totales de Salida</p>
              <p className="text-xs font-bold text-[#4a7c59] mt-0.5">
                {distinctSpeciesCount} especies ({totalIndividualCount} ejemp.)
              </p>
            </div>
          </div>

          {/* General Notes Field */}
          {outing.notes && (
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/60 space-y-1">
              <span className="text-[10px] font-bold tracking-wider text-[#4a7c59] uppercase block select-none">
                Anotaciones generales del cuaderno
              </span>
              <p className="text-xs text-on-surface-variant/90 leading-relaxed font-medium italic">
                "{outing.notes}"
              </p>
            </div>
          )}
        </section>

        {/* Checklist of Seen Species Cards */}
        <section className="space-y-3">
          <h3 className="font-display text-sm font-bold text-on-surface-variant uppercase tracking-wider px-1">
            Especies avistadas
          </h3>

          <div className="space-y-3">
            {outing.animals && outing.animals.map((item) => {
              const originalAnimal = INITIAL_ANIMALS.find(a => a.id === item.animalId);
              return (
                <div
                  key={item.animalId}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-surface-container-high/60 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-surface-container-high/40 bg-surface-container">
                      <AnimalImage
                        imageUrl={item.photo || item.imageUrl}
                        imageVerified={originalAnimal?.imageVerified}
                        category={item.type}
                        name={item.animalName}
                      />
                    </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <h4 className="font-display font-bold text-sm text-on-surface truncate">
                        {item.animalName}
                      </h4>
                      <span className="bg-[#4a7c59]/10 text-primary border border-primary/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
                        Visto x{item.count}
                      </span>
                    </div>
                    <p className="text-[11px] italic text-on-surface-variant/80 truncate">
                      {item.scientificName}
                    </p>
                    <span className="inline-block bg-[#f3f6f4] text-primary text-[9px] font-bold px-2 py-0.5 rounded-md mt-1 font-sans">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Draw extra specs if custom notes/specific variables were typed */}
                {(item.notes || item.time) && (
                  <div className="bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface-variant space-y-1 border border-surface-container-high/40">
                    {item.time && (
                      <p className="text-[10px] text-on-surface-variant/75 font-sans">
                        <strong className="text-on-surface font-semibold">Hora de observación:</strong> {item.time}
                      </p>
                    )}
                    {item.notes && (
                      <p className="italic font-medium leading-relaxed">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )})}
          </div>
        </section>
      </main>

      {/* Floating Bottom action row */}
      <footer className="fixed bottom-0 inset-x-0 bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.06)] border-t border-surface-container-high/60 py-4 px-5 z-40 select-none">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          {readOnly ? (
            <button
              onClick={onClose}
              className="w-full bg-[#4a7c59] hover:bg-[#3d664a] text-white py-3.5 px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-none text-center"
            >
              Cerrar detalles
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 bg-surface-container-medium hover:bg-surface-container-highest text-on-surface py-3.5 px-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border-none flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Editar</span>
              </button>

              <button
                type="button"
                onClick={onSave}
                className="flex-[2] bg-[#4a7c59] hover:bg-[#3d664a] text-white py-3.5 px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(74,124,89,0.2)] hover:shadow-[0_8px_20px_rgba(74,124,89,0.3)] transition-all active:scale-95 cursor-pointer border-none flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  save
                </span>
                <span>Guardar y Cerrar</span>
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Share Toast pop confirmation */}
      <AnimatePresence>
        {showShareAlert && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-[100px] left-5 right-5 z-55 bg-[#1e2922] text-[#e8f5e9] px-4 py-3.5 rounded-2xl shadow-lg border border-primary/20 text-xs font-semibold flex items-center gap-2.5 max-w-sm mx-auto justify-center select-none"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span>Resumen copiado para compartir con otros naturalistas</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
