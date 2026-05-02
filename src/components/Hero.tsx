import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="px-4 md:px-12 pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-4xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-sans text-[10px] font-bold tracking-editorial text-text-bone/30 block mb-8 uppercase">
            [ Project Status / 00 ]
          </span>
          
          <h1 className="font-serif italic font-light text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight max-w-2xl">
            Desarrollando elegancia <br /> 
            <span className="text-text-bone/40 not-italic block mt-1">digital con propósito.</span>
          </h1>

          <div className="mt-16 flex items-end gap-6">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "circInOut", delay: 0.5 }}
              className="h-[1px] w-24 bg-accent-gray origin-left"
            />
            <span className="font-serif italic text-lg opacity-40">Próximamente</span>
          </div>
        </motion.div>
      </div>

      {/* Creative Ghost Text */}
      <motion.div 
        initial={{ opacity: 0, rotate: 90, x: 100 }}
        animate={{ opacity: 0.05, rotate: 90, x: 0 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <span className="font-serif text-[180px] font-bold whitespace-nowrap">2026_EST</span>
      </motion.div>
    </section>
  );
}
