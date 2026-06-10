import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

const NotificationBell = ({ notifications = [], onRead }) => {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        animate={unread ? { rotate: [0, -8, 8, -6, 6, 0] } : { rotate: 0 }}
        transition={unread ? { repeat: Infinity, repeatDelay: 4, duration: 0.8 } : { duration: 0.2 }}
        onClick={() => setOpen((prev) => !prev)}
        className="relative grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-white"
      >
        <Bell className="h-5 w-5" />
        {unread ? (
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="absolute -right-1 -top-1 rounded-full bg-giit-orange px-2 py-0.5 text-[10px] font-bold"
          >
            {unread}
          </motion.span>
        ) : null}
      </motion.button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute right-0 z-50 mt-3 w-[360px] rounded-3xl border border-white/10 bg-[#0b0b10]/95 p-4 shadow-glow backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-bold text-white">Notifications</h4>
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">Live</span>
            </div>
            <div className="max-h-80 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
              {notifications.length ? (
                notifications.map((notification) => (
                  <motion.button
                    key={notification._id}
                    whileHover={{ x: 4 }}
                    onClick={() => onRead?.(notification)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left ${
                      notification.read ? 'border-white/8 bg-white/3' : 'border-giit-purpleLight/20 bg-giit-purpleLight/10'
                    }`}
                  >
                    <p className="font-semibold text-white">{notification.title}</p>
                    <p className="mt-1 text-sm text-white/65">{notification.message}</p>
                  </motion.button>
                ))
              ) : (
                <p className="text-sm text-white/55">No notifications yet — your next milestone is coming soon.</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
