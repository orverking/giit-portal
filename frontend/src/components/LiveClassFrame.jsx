import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RemoteLottie from './RemoteLottie';
import { animationUrls } from '../constants/animations';

const LiveClassFrame = ({ url, title }) => {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 1800);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/40 shadow-glow">
      <AnimatePresence mode="wait">
        {entering ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid min-h-[520px] place-items-center bg-giit-black"
          >
            <div className="text-center">
              <RemoteLottie url={animationUrls.classroom} fallback="🎓" className="mx-auto h-40 w-40" />
              <h3 className="mt-4 text-2xl font-black text-white">Entering classroom</h3>
              <p className="mt-2 text-white/60">Preparing your live learning space...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[520px]">
            <iframe src={url} title={title} className="min-h-[520px] w-full" allow="camera; microphone; fullscreen; display-capture" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveClassFrame;
