import { motion } from 'framer-motion';

const SectionHeader = ({ eyebrow, title, description, align = 'left' }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
    className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
  >
    {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-giit-orange">{eyebrow}</p>}
    <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
    {description && <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">{description}</p>}
  </motion.div>
);

export default SectionHeader;
