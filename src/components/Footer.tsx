import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="px-4 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-[9px] font-sans font-bold tracking-editorial text-text-bone/30 uppercase text-center md:text-left">
        © 2026 JUAN MORENO <span className="mx-2 opacity-30">/</span> BUILT WITH PURPOSE <span className="mx-2 opacity-30">/</span> FROM CARABOBO, VEN
      </div>
      
      <motion.div 
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-4"
      >
        <span className="w-1 h-1 rounded-full bg-text-bone/60" />
        <span className="font-serif italic text-xs tracking-widest text-text-bone/60 uppercase">Despliegue En Verano</span>
      </motion.div>
    </footer>
  );
}
