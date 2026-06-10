import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardSidebar = ({ items = [], role = 'student' }) => (
  <aside className="glass-card sticky top-4 h-[calc(100vh-2rem)] rounded-[32px] p-4">
    <div className="mb-8 rounded-3xl bg-gradient-to-br from-giit-purpleDeep to-giit-black p-5">
      <p className="text-xs uppercase tracking-[0.32em] text-white/50">GIIT {role}</p>
      <h2 className="mt-2 text-2xl font-black text-white">Portal</h2>
    </div>
    <nav className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={item.to}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, type: 'spring', stiffness: 160 }}
        >
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-giit-purple/30 to-giit-orange/15 text-white shadow-glow'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-10 w-10 place-items-center rounded-2xl border ${
                    isActive ? 'border-giit-purpleLight bg-giit-purpleLight/20' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
                {isActive ? <span className="ml-auto h-2 w-2 rounded-full bg-giit-purpleLight shadow-[0_0_18px_rgba(139,92,246,0.8)]" /> : null}
              </>
            )}
          </NavLink>
        </motion.div>
      ))}
    </nav>
  </aside>
);

export default DashboardSidebar;
