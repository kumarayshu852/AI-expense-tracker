import { motion } from 'framer-motion'
import { Sparkles, User } from 'lucide-react'

const ChatBubble = ({ role, content }) => {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? 'bg-gradient-to-r from-primary to-accent-cyan text-white rounded-tr-sm'
            : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm'
        }`}
      >
        {content}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-[var(--text-secondary)]" />
        </div>
      )}
    </motion.div>
  )
}

export default ChatBubble