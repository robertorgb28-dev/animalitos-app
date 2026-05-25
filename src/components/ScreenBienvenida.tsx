import { motion } from 'motion/react';

interface ScreenBienvenidaProps {
  onStart: () => void;
}

export default function ScreenBienvenida({ onStart }: ScreenBienvenidaProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#f3f7f4] via-[#ecf3ee] to-[#e4ede6] py-10 px-4">
      
      {/* Visual Organic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#4a7c59]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#3b6046]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[5%] w-[30vh] h-[30vh] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center text-center">
        
        {/* Animated Brand Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-2.5 mb-2 select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#4a7c59] text-white flex items-center justify-center shadow-lg shadow-[#4a7c59]/20">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              nature
            </span>
          </div>
          <span className="font-display text-lg font-black tracking-tight text-[#2d4b36] uppercase">Animlist</span>
        </motion.div>

        {/* Narrative Section */}
        <div className="mb-8 select-none">
          <motion.h1 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="font-display text-3xl md:text-[38px] font-black text-[#1e3325] leading-tight tracking-tight mb-4"
          >
            Registra los animales<br />que ves a tu alrededor
          </motion.h1>
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="font-sans text-sm md:text-base text-[#445b4c] leading-relaxed max-w-md mx-auto px-2"
          >
            Guarda tus avistamientos, añade fotos, registra la ubicación y crea tu propia colección de animales.
          </motion.p>
        </div>

        {/* Floating Composition Illustration ( naturaleza, mapa y fotos) */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-sm h-[290px] mb-10 flex items-center justify-center"
        >
          {/* Central Nature Backdrop Icon */}
          <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-[#4a7c59]/10 to-[#81b29a]/15 flex items-center justify-center border-2 border-white/60 shadow-[inset_0_4px_12px_rgba(74,124,89,0.05)]">
            <span className="material-symbols-outlined text-[90px] text-[#4a7c59]/25 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              forest
            </span>
          </div>

          {/* Floating Card 1: Bird */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[8%] left-[2%] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_10px_25px_rgba(49,99,66,0.08)] border border-[#4a7c59]/10 flex items-center gap-3 max-w-[190px] text-left select-none"
          >
            <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                flutter_dash
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-extrabold text-[#1d2d23] text-xs truncate">Gorrión registrado</p>
              <p className="font-sans text-[10px] text-[#6b8574] truncate">Canal de avistamientos</p>
            </div>
            <span className="material-symbols-outlined text-emerald-500 text-base font-black">
              check_circle
            </span>
          </motion.div>

          {/* Floating Card 2: GPS Pin on Map */}
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[48%] right-[-1%] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_10px_25px_rgba(49,99,66,0.08)] border border-[#4a7c59]/10 flex items-center gap-3 max-w-[190px] text-left select-none"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                my_location
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-extrabold text-[#1d2d23] text-xs truncate">Pin en el mapa</p>
              <p className="font-sans text-[10px] text-[#6b8574] truncate">Región Local</p>
            </div>
          </motion.div>

          {/* Floating Card 3: Camera */}
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[4%] left-[10%] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_10px_25px_rgba(49,99,66,0.08)] border border-[#4a7c59]/10 flex items-center gap-3 max-w-[190px] text-left select-none"
          >
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                photo_camera
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-extrabold text-[#1d2d23] text-xs truncate">Foto guardada</p>
              <p className="font-sans text-[10px] text-[#6b8574]">Carpeta de campo</p>
            </div>
          </motion.div>

          {/* Multi-category Quick badges floating */}
          <div className="absolute top-[8%] right-[8%] w-10 h-10 rounded-full bg-amber-100 text-amber-800 border-2 border-white shadow-md flex items-center justify-center opacity-85 hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
          </div>

          <div className="absolute bottom-[24%] right-[10%] w-9 h-9 rounded-full bg-blue-100 text-blue-800 border-2 border-white shadow-md flex items-center justify-center opacity-80 hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-base">map</span>
          </div>
        </motion.div>

        {/* Onboarding Actions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-xs flex flex-col gap-4"
        >
          {/* Start Button */}
          <button 
            id="btn-start"
            onClick={onStart}
            className="w-full bg-[#4a7c59] text-white font-display font-semibold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-[#4a7c59]/20 hover:bg-[#3d6549] hover:shadow-xl hover:shadow-[#4a7c59]/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group border-none leading-none urgent-start"
          >
            <span>Empezar</span>
            <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform text-lg">
              arrow_forward
            </span>
          </button>

          {/* Local Information Guard Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 px-4 text-[#5e7766] select-none">
            <span className="material-symbols-outlined text-sm shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <p className="font-sans text-[10px] leading-snug font-medium text-[#5a6f62]">
              Tus datos se guardan de forma local en este dispositivo.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
