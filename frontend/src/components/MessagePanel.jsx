import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import GlassCard from './GlassCard';

const MessagePanel = ({ conversations = [], activeMessages = [], onSelect, onSend, typingText = '' }) => {
  const [draft, setDraft] = useState('');
  const [selectedKey, setSelectedKey] = useState(conversations[0]?.conversationKey || null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.conversationKey === selectedKey) || conversations[0],
    [conversations, selectedKey]
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <GlassCard className="max-h-[620px] overflow-hidden p-3">
        <div className="space-y-2 overflow-y-auto scrollbar-thin pr-1">
          {conversations.map((conversation, index) => (
            <motion.button
              key={conversation.conversationKey}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedKey(conversation.conversationKey);
                onSelect?.(conversation);
              }}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selectedKey === conversation.conversationKey
                  ? 'border-giit-purpleLight bg-giit-purpleLight/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{conversation.participant?.name}</p>
                  <p className="text-sm text-white/55">{conversation.latestMessage?.content}</p>
                </div>
                {conversation.unreadCount ? (
                  <motion.span
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                    className="rounded-full bg-giit-orange px-2.5 py-1 text-xs font-bold text-white"
                  >
                    {conversation.unreadCount}
                  </motion.span>
                ) : null}
              </div>
            </motion.button>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="flex h-[620px] flex-col overflow-hidden p-4">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white">{selectedConversation?.participant?.name || 'Choose a conversation'}</h3>
          <p className="text-sm text-white/55">Typing indicator and unread badges are fully animated.</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto py-4 scrollbar-thin">
          <AnimatePresence>
            {activeMessages.map((message) => {
              const outgoing = message.sender?._id !== selectedConversation?.participant?._id;
              return (
                <motion.div
                  key={message._id || message.createdAt || message.content}
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${outgoing ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-[24px] px-4 py-3 text-sm ${
                      outgoing
                        ? 'bg-gradient-to-r from-giit-purple to-giit-purpleLight text-white'
                        : 'bg-white/8 text-white/80'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {typingText ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/6 px-3 py-2 text-white/60">
              <span>{typingText}</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: dot * 0.15 }}
                    className="h-1.5 w-1.5 rounded-full bg-white/70"
                  />
                ))}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex gap-3 pt-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Send a supportive message..."
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white outline-none placeholder:text-white/35"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!draft.trim() || !selectedConversation) return;
              onSend?.(selectedConversation, draft.trim());
              setDraft('');
            }}
            className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-giit-purple to-giit-orange text-white"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );
};

export default MessagePanel;
