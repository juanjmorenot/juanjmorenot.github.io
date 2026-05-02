import { motion } from 'motion/react';
import { useMemo } from 'react';

export default function Header() {
  const dateStr = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  }, []);

  return (
    <header className="border-editorial flex justify-between items-center px-4 md:px-12 py-6">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-sm font-serif italic tracking-wide text-text-bone"
      >
        Juan Moreno <span className="font-sans text-[9px] font-bold tracking-editorial opacity-30 uppercase">/ FED</span>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-[9px] font-sans font-bold tracking-editorial text-text-bone/40 uppercase"
      >
        Carabobo, Ven <span className="mx-3 opacity-30">—</span> {dateStr}
      </motion.div>
    </header>
  );
}
