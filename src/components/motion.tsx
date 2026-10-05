import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'
export const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }
export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
type P = { children: ReactNode; className?: string }
export const Reveal = ({ children, className }: P) => <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>{children}</motion.div>
/** Staggered container. `now` = animate on mount (for content at the top of the page); otherwise on scroll into view. */
export const StaggerGrid = ({ children, className, now }: P & { now?: boolean }) =>
  now ? <motion.div className={className} variants={stagger} initial="hidden" animate="show">{children}</motion.div>
      : <motion.div className={className} variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>{children}</motion.div>
export const Item = ({ children, className }: P) => <motion.div className={className} variants={fadeUp}>{children}</motion.div>
