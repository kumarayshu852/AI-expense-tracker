import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim() || disabled) return
    onSend(message.trim())
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything about your finances..."
        disabled={disabled}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={disabled || !message.trim()}
        className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-accent-cyan flex items-center justify-center disabled:opacity-50 shrink-0"
      >
        {disabled ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
      </motion.button>
    </form>
  )
}

export default ChatInput