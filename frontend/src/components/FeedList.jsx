import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import GlassCard from './GlassCard';

const FeedList = ({ posts = [], onLike, onComment }) => {
  const [comments, setComments] = useState({});

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.06 }}
          >
            <GlassCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{post.author?.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">{post.author?.role}</p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                  {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white/80">{post.content}</p>
              <div className="mt-4 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onLike?.(post)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
                >
                  <Heart className="h-4 w-4 text-rose-400" /> {post.likes?.length || 0}
                </motion.button>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  <MessageCircle className="h-4 w-4 text-giit-purpleLight" /> {post.comments?.length || 0}
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {(post.comments || []).map((comment) => (
                  <motion.div
                    key={comment._id || comment.content}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-white">{comment.user?.name || 'Learner'}</p>
                    <p className="text-sm text-white/65">{comment.content}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <input
                  value={comments[post._id] || ''}
                  onChange={(e) => setComments((prev) => ({ ...prev, [post._id]: e.target.value }))}
                  placeholder="Leave an encouraging comment..."
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const content = comments[post._id]?.trim();
                    if (!content) return;
                    onComment?.(post, content);
                    setComments((prev) => ({ ...prev, [post._id]: '' }));
                  }}
                  className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-giit-purple to-giit-orange text-white"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FeedList;
