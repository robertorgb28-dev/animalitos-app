import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Animal, Sighting, Sighting as SightingType } from '../types';

interface ScreenPerfilProps {
  animals: Animal[];
  sightings: Sighting[];
  onNavigate: (screen: 'bienvenida' | 'inicio' | 'lista' | 'detalle' | 'coleccion' | 'mapa' | 'perfil') => void;
  onResetData: () => void;
  onToggleSidebar: () => void;
}

export default function ScreenPerfil({
  animals,
  sightings,
  onNavigate,
  onResetData,
  onToggleSidebar,
}: ScreenPerfilProps) {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Load name and avatar from local storage
  const [profilePic, setProfilePic] = useState<string>(() => {
    return localStorage.getItem('animlist_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('animlist_user_name') || 'Explorador Local';
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [msgToast, setMsgToast] = useState<string | null>(null);

  // States for Security Reset verification modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const showToast = (msg: string) => {
    setMsgToast(msg);
    setTimeout(() => {
      setMsgToast(null);
    }, 4500);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('animlist_user_name', tempName.trim());
      setIsEditingName(false);
      showToast('Alias de explorador guardado con éxito.');
    }
  };

  const handleExportData = () => {
    try {
      const animalsData = localStorage.getItem('animlist_animals_state') || '[]';
      const outingsData = localStorage.getItem('animlist_outings_state') || '[]';
      const userNameData = localStorage.getItem('animlist_user_name') || 'Explorador Local';
      const userAvatarData = localStorage.getItem('animlist_user_avatar') || '';

      const payload = {
        app: 'AnimList',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        userName: userNameData,
        userAvatar: userAvatarData,
        animals: JSON.parse(animalsData),
        outings: JSON.parse(outingsData),
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `animlist_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Copia de seguridad exportada correctamente.');
    } catch (err) {
      showToast('Error al exportar los datos: ' + err);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.animals) && Array.isArray(parsed.outings)) {
          localStorage.setItem('animlist_animals_state', JSON.stringify(parsed.animals));
          localStorage.setItem('animlist_outings_state', JSON.stringify(parsed.outings));
          if (parsed.userName) {
            localStorage.setItem('animlist_user_name', parsed.userName);
          }
          if (parsed.userAvatar) {
            localStorage.setItem('animlist_user_avatar', parsed.userAvatar);
          }
          showToast('¡Datos personales importados con éxito! El cuaderno se reiniciará ahora.');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showToast('El archivo JSON no contiene el formato de cuaderno de AnimList válido.');
        }
      } catch (err) {
        showToast('Error al leer el archivo JSON: ' + err);
      }
    };
    reader.readAsText(file);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Str = event.target?.result as string;
        setProfilePic(base64Str);
        localStorage.setItem('animlist_user_avatar', base64Str);
        showToast('Avatar de explorador actualizado correctamente.');
      };
      reader.readAsDataURL(file);
    }
  };

  const executeCompleteReset = () => {
    if (confirmText.trim() === 'BORRAR') {
      setIsResetModalOpen(false);
      onResetData();
      showToast('La base de datos y su historial han sido eliminados.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Stats calculation
  const distinctSpeciesSeen = animals.filter(a => a.seenCount > 0).length;
  const totalSightingsCount = sightings.length;

  // Real-time photo counting across captured observations
  const totalPhotosCount = useMemo(() => {
    return sightings.reduce((count, s) => {
      const sightingsPhotos = s.photos ? s.photos.filter((p: string) => !!p) : [];
      return count + sightingsPhotos.length;
    }, 0);
  }, [sightings]);

  // Real-time map pins counter (sightings containing custom active latitude/longitude map markers)
  const totalMapPinsCount = useMemo(() => {
    return sightings.filter(s => s.latitude !== undefined && s.longitude !== undefined).length;
  }, [sightings]);

  // Determine favorite category dynamically
  const favoriteCategory = useMemo(() => {
    const tally: Record<string, number> = {};
    animals.forEach(a => {
      if (a.seenCount > 0) {
        tally[a.type] = (tally[a.type] || 0) + a.seenCount;
      }
    });
    let maxType = 'Ninguna';
    let maxCount = 0;
    Object.entries(tally).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    });
    return maxType;
  }, [animals]);

  return (
    <div className="bg-[#fbfcfa] text-on-background font-sans min-h-screen pb-32">
      
      {/* TopAppBar */}
      <header className="w-full top-0 sticky bg-white/95 backdrop-blur-md z-45 flex justify-between items-center px-4 py-3.5 border-b border-surface-container-high/60 shadow-xs">
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleSidebar}
            aria-label="Abrir menú" 
            className="text-primary hover:bg-surface-container-low transition-colors active:scale-95 duration-150 p-2.5 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <span className="font-display text-xl font-bold text-primary tracking-tight">Mi Perfil</span>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Profile Body Containers */}
      <main className="px-4 pt-6 flex flex-col gap-6 max-w-xl mx-auto w-full">
        
        {/* Profile Card Header Block with Alias Editing */}
        <section className="bg-white rounded-3xl p-6 border border-surface-container-high/60 shadow-xs flex flex-col items-center gap-4 relative">
          
          {/* Circular Avatar Creator */}
          <div 
            onClick={() => profileInputRef.current?.click()}
            className="relative group cursor-pointer overflow-hidden rounded-full shadow-md border-4 border-white h-28 w-28 shrink-0 bg-neutral-100"
          >
            <img 
              alt="Avatar del Explorador" 
              className="w-full h-full object-cover group-hover:scale-105 duration-300 transition-transform" 
              referrerPolicy="no-referrer"
              src={profilePic} 
            />
            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                photo_camera
              </span>
            </div>
            
            <input 
              type="file" 
              ref={profileInputRef} 
              onChange={handleProfilePicChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="text-center w-full max-w-xs">
            {isEditingName ? (
              <div className="flex items-center gap-1.5 justify-center w-full">
                <input 
                  type="text"
                  maxLength={18}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-neutral-50 border border-primary/40 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-primary text-center flex-grow max-w-[200px]"
                  placeholder="Tu alias..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                  }}
                />
                <button 
                  onClick={handleSaveName}
                  className="bg-[#4a7c59] hover:bg-[#3d6549] text-white p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">done</span>
                </button>
                <button 
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(false);
                  }}
                  className="bg-neutral-200 text-on-surface hover:bg-neutral-300 p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="font-display text-xl md:text-2xl font-black text-on-surface leading-tight capitalize truncate max-w-[220px]">
                  {userName}
                </h2>
                <button 
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(true);
                  }}
                  className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-md"
                  title="Editar alias"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_square</span>
                </button>
              </div>
            )}
            
            <p className="font-sans text-[10px] text-on-surface-variant/80 mt-1 uppercase tracking-widest font-bold">
              Cuaderno de Campo Local • PWA de Investigación
            </p>
          </div>
        </section>

        {/* Private Local Info Box (Satisfies Requirements on Not Requiring Accounts) */}
        <section className="bg-gradient-to-r from-emerald-50 to-green-50/20 border border-emerald-100 rounded-3xl p-5 select-none flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-emerald-950">Privacidad y Almacenamiento Local</h3>
            <p className="font-sans text-xs text-emerald-800/85 mt-1 leading-relaxed">
              Puedes usar esta aplicación con total libertad sin crear cuentas. Los registros de avistamientos, coordenadas satélite e imágenes de naturaleza se guardan exclusivamente en tu dispositivo, garantizando tu absoluta confidencialidad de exploración.
            </p>
          </div>
        </section>

        {/* Real Dynamic statistics Bento grid */}
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-bold text-[#4a7c59] uppercase tracking-wider px-1">Tus Estadísticas Reales</h3>
          <div className="grid grid-cols-2 gap-3.5">
            
            {/* Card 1: Especies distintas vistas */}
            <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-surface-container-high/60 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[#4a7c59] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pets
                </span>
                <span className="text-[9px] font-black text-on-surface-variant/80 uppercase tracking-wide">Especies</span>
              </div>
              <div className="mt-4">
                <p className="font-display text-24px font-black text-[#1e3325] leading-none mb-1">{distinctSpeciesSeen}</p>
                <p className="text-[10px] font-semibold text-on-surface-variant leading-none">Descubiertas</p>
              </div>
            </div>

            {/* Card 2: Avistamientos registrados */}
            <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-surface-container-high/60 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[#4a7c59] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  visibility
                </span>
                <span className="text-[9px] font-black text-on-surface-variant/80 uppercase tracking-wide">Reportes</span>
              </div>
              <div className="mt-4">
                <p className="font-display text-24px font-black text-[#1e3325] leading-none mb-1">{totalSightingsCount}</p>
                <p className="text-[10px] font-semibold text-on-surface-variant leading-none">Guardados</p>
              </div>
            </div>

            {/* Card 3: Fotos de campo guardadas */}
            <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-surface-container-high/60 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[#4a7c59] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  photo_camera
                </span>
                <span className="text-[9px] font-black text-on-surface-variant/80 uppercase tracking-wide">Fotos</span>
              </div>
              <div className="mt-4">
                <p className="font-display text-24px font-black text-[#1e3325] leading-none mb-1">{totalPhotosCount}</p>
                <p className="text-[10px] font-semibold text-on-surface-variant leading-none">Vinculadas</p>
              </div>
            </div>

            {/* Card 4: Pines de Localización en mapa */}
            <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-surface-container-high/60 shadow-xs">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[#4a7c59] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pin_drop
                </span>
                <span className="text-[9px] font-black text-on-surface-variant/80 uppercase tracking-wide">Mapa</span>
              </div>
              <div className="mt-4">
                <p className="font-display text-24px font-black text-[#1e3325] leading-none mb-1">{totalMapPinsCount}</p>
                <p className="text-[10px] font-semibold text-on-surface-variant leading-none">Pines activos</p>
              </div>
            </div>
            
          </div>

          {distinctSpeciesSeen > 0 && (
            <div className="bg-[#e4ece7]/50 rounded-2xl px-5 py-3 border border-[#4a7c59]/10 mt-1 flex items-center justify-between text-xs select-none">
              <span className="font-sans font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                Categoría favorita de exploración:
              </span>
              <span className="bg-[#4a7c59]/10 text-[#4a7c59] font-black tracking-wide px-2.5 py-1 rounded-xl uppercase tracking-tight text-[10px]">
                {favoriteCategory}
              </span>
            </div>
          )}
        </section>

        {/* Global Settings & Local Data Area */}
        <section className="flex flex-col gap-1 select-none">
          <h3 className="font-display text-sm font-bold text-on-surface-variant uppercase tracking-wider px-1 mb-2">Ajustes y Gestión</h3>
          
          <div className="bg-white rounded-3xl p-3 border border-surface-container-high/60 shadow-xs flex flex-col gap-1 w-full">
            
            {/* Export data */}
            <button 
              onClick={handleExportData}
              className="flex items-center gap-4.5 p-3 rounded-2xl hover:bg-neutral-50 transition-colors w-full text-left cursor-pointer group"
            >
              <div className="bg-[#eaf2ed] p-2.5 rounded-xl text-[#316342] group-hover:bg-[#d0e3d6] transition-colors">
                <span className="material-symbols-outlined text-[20px]">download</span>
              </div>
              <div className="flex-grow min-w-0">
                <span className="font-sans text-xs font-black text-on-surface uppercase tracking-wider block">Exportar mis datos</span>
                <span className="font-sans text-[11px] text-on-surface-variant block mt-0.5">Generar un archivo de respaldo local comprimido .JSON</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
            
            <div className="h-px bg-surface-variant/40 mx-4" />

            {/* Import data */}
            <button 
              onClick={() => importInputRef.current?.click()}
              className="flex items-center gap-4.5 p-3 rounded-2xl hover:bg-neutral-50 transition-colors w-full text-left cursor-pointer group"
            >
              <input 
                type="file" 
                ref={importInputRef} 
                onChange={handleImportData} 
                accept=".json" 
                className="hidden" 
              />
              <div className="bg-[#eaf2ed] p-2.5 rounded-xl text-[#316342] group-hover:bg-[#d0e3d6] transition-colors">
                <span className="material-symbols-outlined text-[20px]">upload</span>
              </div>
              <div className="flex-grow min-w-0">
                <span className="font-sans text-xs font-black text-on-surface uppercase tracking-wider block">Importar mis datos</span>
                <span className="font-sans text-[11px] text-on-surface-variant block mt-0.5">Restaurar cuaderno desde una copia de seguridad</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
            
            <div className="h-px bg-surface-variant/40 mx-4" />

            {/* Cloud backup disabled segment placeholder */}
            <div 
              className="flex items-center gap-4.5 p-3 rounded-2xl w-full text-left opacity-60 relative group"
            >
              <div className="bg-neutral-100 p-2.5 rounded-xl text-neutral-500">
                <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-black text-neutral-600 uppercase tracking-wider block">Respaldo en la nube</span>
                  <span className="bg-neutral-200 text-neutral-700 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded leading-none">
                    Próximamente
                  </span>
                </div>
                <span className="font-sans text-[11px] text-neutral-500 block mt-0.5">Sincroniza tus registros en múltiples terminales</span>
              </div>
              <span className="material-symbols-outlined text-neutral-400">lock</span>
            </div>

          </div>
        </section>

        {/* Danger zone separated properly from common metrics */}
        <section className="flex flex-col gap-3">
          <h3 className="font-display text-sm font-bold text-rose-700 uppercase tracking-wider px-1">Zona de Peligro</h3>
          
          <div className="bg-rose-50/20 border border-rose-100 rounded-3xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-start gap-3 w-full">
              <div className="bg-rose-50 p-2 rounded-xl text-rose-700 shrink-0">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div>
                <h4 className="font-display text-xs font-black text-rose-900 uppercase tracking-widest mt-0.5">Limpieza Absoluta de Datos</h4>
                <p className="font-sans text-[11px] text-rose-800 leading-relaxed mt-1">
                  Esta acción eliminará de forma irreversible todo tu historial de explorador, avistamientos guardados, fotos, ubicaciones y álbum de colecciones de este dispositivo.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setConfirmText('');
                setIsResetModalOpen(true);
              }}
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-display text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-2xl shadow-xs transition-all text-center cursor-pointer border-none"
            >
              Borrar todos los datos
            </button>
          </div>
        </section>

      </main>

      {/* Security reset confirmation modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Glass Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
            />

            {/* Modal Sheet panel */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 border border-rose-100 shadow-2xl flex flex-col gap-4 text-center"
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  delete_forever
                </span>
              </div>

              <div>
                <h3 className="font-display text-base font-black text-rose-950 uppercase tracking-wide">
                  ¿Confirmar borrado completo?
                </h3>
                <p className="font-sans text-xs text-rose-800/90 leading-relaxed mt-2.5 px-1 bg-rose-50/50 p-3.5 rounded-xl border border-rose-100/40">
                  Vas a eliminar todos tus avistamientos, fotos, historial, colección y ubicaciones guardadas. <strong>Esta acción no se puede deshacer.</strong>
                </p>
              </div>

              <div className="text-left bg-neutral-50 border border-neutral-200/60 p-3 rounded-2xl flex flex-col gap-2 mt-1">
                <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider leading-none">
                  Escribe <strong className="text-rose-700 font-extrabold">BORRAR</strong> para desbloquear la acción:
                </label>
                <input 
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="bg-white border text-sm text-center font-black uppercase text-rose-700 border-neutral-300 rounded-xl py-2 px-3 focus:outline-none focus:border-rose-500"
                  placeholder="Escribe BORRAR..."
                />
              </div>

              <div className="flex gap-2.5 mt-2">
                <button 
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-on-surface font-display text-xs font-bold uppercase tracking-wider py-3 rounded-2xl transition-all cursor-pointer border-none"
                >
                  Cancelar
                </button>
                <button 
                  disabled={confirmText.trim() !== 'BORRAR'}
                  onClick={executeCompleteReset}
                  className={`flex-1 font-display text-xs font-bold uppercase tracking-wider py-3 rounded-2xl transition-all select-none border-none cursor-pointer ${
                    confirmText.trim() === 'BORRAR'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Sí, borrar todo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Temporary feedback toast notification bar */}
      <AnimatePresence>
        {msgToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-[#1e2d21] text-white/95 px-5 py-3 rounded-full shadow-xl text-[10.5px] font-bold tracking-wide flex items-center gap-2 pointer-events-none uppercase border border-white/5 select-none text-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{msgToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
