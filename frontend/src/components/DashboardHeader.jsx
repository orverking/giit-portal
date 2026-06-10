import { motion } from 'framer-motion';
import NotificationBell from './NotificationBell';

const DashboardHeader = ({ title, subtitle, user, notifications, onReadNotification }) => (
  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs uppercase tracking-[0.32em] text-giit-orange"
      >
        Welcome back
      </motion.p>
      <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">{title}</h1>
      <p className="mt-2 text-white/65">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3">
      <NotificationBell notifications={notifications} onRead={onReadNotification} />
      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
        {user?.name || 'GIIT Learner'}
      </div>
    </div>
  </div>
);

export default DashboardHeader;
