import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function App() {
  const dateStr = useMemo(() => {
    try {
      return new Date().toLocaleDateString('es-VE', {
        month: 'short',
        year: 'numeric'
      }).toUpperCase();
    } catch (e) {
      return "MAYO 2026";
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-carbon selection:bg-bone selection:text-carbon">
      <div className="grain" />
      
      <div className="mx-4 md:mx-20 min-h-screen border-x border-gray-dark relative z-10 flex flex-col">
        
        {/* Header */}
        <header className="border-b border-gray-dark px-6 md:px-12 py-8 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg italic font-light text-bone"
          >
            Juan Moreno <span className="font-sans text-[8px] font-bold tracking-[0.2em] opacity-30 uppercase ml-3">/ Carabobo</span>
          </motion.div>
          
          <div className="font-sans text-[8px] font-bold tracking-[0.2em] opacity-30 uppercase text-right text-bone">
            VALENCIA, VEN <span className="hidden md:inline mx-4 opacity-50">—</span> {dateStr}
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 md:px-12 pt-32 pb-24 border-b border-gray-dark">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="font-sans text-[9px] font-bold tracking-[0.3em] opacity-20 uppercase block mb-10 text-bone text-balance">
              [ Próximo Despliegue / Portafolio 26 ]
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl italic font-light leading-[0.8] tracking-tight max-w-3xl text-bone">
              Desarrollando elegancia <br />
              <span className="not-italic opacity-40 block mt-3 text-3xl md:text-5xl lg:text-6xl">digital con propósito.</span>
            </h1>

            <div className="mt-20 flex items-center gap-8">
              <motion.div 
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-[1px] w-24 bg-gray-dark" 
              />
              <span className="italic text-xl opacity-30 text-bone">Valencia, Venezuela</span>
            </div>
          </motion.div>
        </section>

        {/* Core Message */}
        <section className="px-6 md:px-12 py-32 md:py-48 border-b border-gray-dark">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-5xl font-light leading-[1.2] max-w-5xl text-bone"
          >
            "En la intersección entre la <span className="italic">estructura lógica</span> y la estética refinada. 
            Construyendo una experiencia visual que prioriza la 
            tipografía y la <span className="italic">atención obsesiva</span> al detalle."
          </motion.p>
        </section>

        {/* Links Grid */}
        <section className="px-6 md:px-12 py-32 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <span className="font-sans text-[9px] font-bold tracking-[0.3em] opacity-20 uppercase text-bone">Conectividad Digital</span>
            
            <a href="https://github.com/juanjmorenot" target="_blank" rel="noopener noreferrer" className="group flex justify-between items-baseline border-b border-gray-dark hover:border-bone/20 pb-6 transition-all duration-500">
              <span className="text-3xl md:text-4xl italic opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-bone">GitHub</span>
              <span className="font-sans text-[8px] font-bold opacity-20 group-hover:opacity-100 transition-opacity text-bone">[01]</span>
            </a>

            <a href="https://linkedin.com/in/juanjmorenot" target="_blank" rel="noopener noreferrer" className="group flex justify-between items-baseline border-b border-gray-dark hover:border-bone/20 pb-6 transition-all duration-500">
              <span className="text-3xl md:text-4xl italic opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-bone">LinkedIn</span>
              <span className="font-sans text-[8px] font-bold opacity-20 group-hover:opacity-100 transition-opacity text-bone">[02]</span>
            </a>
          </div>

          <div className="flex flex-col justify-end items-end text-right">
             <p className="text-sm italic opacity-40 max-w-[220px] text-bone">
               Diseñando desde el estado Carabobo para el mundo. Próximamente disponible.
             </p>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="mt-auto border-t border-gray-dark px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-sans text-[8px] font-bold tracking-[0.2em] opacity-30 uppercase text-bone">
            © 2026 JUAN MORENO / TODO BAJO CONTROL
          </div>
          <div className="flex items-center gap-4">
             <motion.div 
               animate={{ opacity: [0.1, 0.4, 0.1] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="w-1.5 h-1.5 rounded-full bg-bone" 
             />
             <span className="italic font-bold text-xs tracking-widest uppercase opacity-40 text-bone">Despliegue Programado</span>
          </div>
        </footer>
      </div>
    </main>
  );
}



