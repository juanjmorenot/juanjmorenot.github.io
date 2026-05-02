import { motion } from 'motion/react';

export default function Manifesto() {
  return (
    <section className="px-4 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12 border-editorial">
      <div className="md:col-span-12">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-2xl md:text-4xl lg:text-5xl font-serif font-light leading-[1.3] text-text-bone/90"
        >
          "En la intersección entre la <span className="italic">estructura lógica</span> y la estética refinada. 
          Construyendo una experiencia visual que prioriza la 
          tipografía, el rendimiento y la <span className="italic">atención al detalle</span>."
        </motion.p>
      </div>
    </section>
  );
}
