import { motion } from 'motion/react';

export default function SocialLinks() {
  const links = [
    { label: 'GitHub', url: 'https://github.com/juanjmorenot', id: '01' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/juanjmorenot', id: '02' },
    { label: 'Read.cv', url: 'https://read.cv/juanjmorenot', id: '03' },
  ];

  return (
    <section className="px-4 md:px-12 py-24 md:py-32 border-editorial flex flex-col md:flex-row justify-between items-start gap-12">
      <div className="flex flex-col gap-6 w-full max-w-lg">
        <span className="font-sans text-[10px] font-bold tracking-editorial text-text-bone/30 uppercase mb-4">Conectividad</span>
        {links.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group flex justify-between items-baseline border-b border-accent-gray hover:border-text-bone/40 pb-4 transition-all duration-500 ease-out"
          >
            <span className="text-2xl md:text-3xl font-serif italic text-text-bone/60 group-hover:text-text-bone transition-colors">{link.label}</span>
            <span className="font-sans text-[9px] font-bold text-text-bone/20 group-hover:text-text-bone/80 tracking-widest">[{link.id}]</span>
          </motion.a>
        ))}
      </div>

       <div className="hidden lg:block self-end">
        <p className="font-serif text-sm italic text-text-bone/40 max-w-[200px] text-right">
          Para consultas directas, <br /> por favor utiliza las redes oficiales.
        </p>
      </div>
    </section>
  );
}
