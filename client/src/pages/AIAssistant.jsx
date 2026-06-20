import { useEffect, useRef, useState } from 'react'
import { Sparkles, Loader2, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatBubble from '../components/ai/ChatBubble'
import ChatInput from '../components/ai/ChatInput'
import { chatWithAI, getAIInsights, getChatHistory, clearChatHistory } from '../services/aiService'

const suggestedQuestions = [
  'Where am I overspending?',
  'How can I save more money?',
  'Analyze my spending this month',
  'Create a budget for ₹20,000 income',
]

const welcomeMessage = { role: 'ai', content: "Hi! Main tumhara AI Finance Assistant hoon. Apne expenses, budget ya savings ke baare mein kuch bhi pucho!" }

const AIAssistant = () => {
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const [insights, setInsights] = useState('')
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(true)
  const scrollRef = useRef(null)

  // Purani chat history load karo
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getChatHistory()
        const savedMessages = res.data.data.messages
        if (savedMessages.length > 0) {
          setMessages(savedMessages.map((m) => ({ role: m.role, content: m.content })))
        } else {
          setMessages([welcomeMessage])
        }
      } catch (err) {
        console.error('History fetch error:', err)
        setMessages([welcomeMessage])
      } finally {
        setHistoryLoading(false)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await getAIInsights()
        setInsights(res.data.data.insights)
      } catch (err) {
        console.error('Insights fetch error:', err)
      } finally {
        setInsightsLoading(false)
      }
    }
    fetchInsights()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setSending(true)
    try {
      const res = await chatWithAI(text)
      setMessages((prev) => [...prev, { role: 'ai', content: res.data.data.reply }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear your entire chat history?')) return
    try {
      await clearChatHistory()
      setMessages([welcomeMessage])
    } catch (err) {
      console.error('Clear chat error:', err)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
      {/* Chat Section */}
      <div className="lg:col-span-2 flex flex-col bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-[var(--text-primary)] font-semibold text-sm">AI Assistant</h2>
          <span className="text-[var(--text-secondary)] text-xs bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full ml-2">Groq Powered</span>

          <button
            onClick={handleClearChat}
            className="ml-auto flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-red-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </button>
        </div>

        {historyLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm pl-11">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Analyzing your finances...
              </div>
            )}
          </div>
        )}

        {/* Suggested questions — only show jab koi user message nahi hai */}
        {!historyLoading && messages.length <= 1 && (
          <div className="px-5 pb-2 flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-xs text-[var(--text-secondary)] border border-[var(--border)] rounded-full px-3 py-1.5 hover:border-primary hover:text-primary transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-[var(--border)]">
          <ChatInput onSend={handleSend} disabled={sending} />
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Smart Insights
        </h3>

        {insightsLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--text-secondary)] text-sm whitespace-pre-wrap leading-relaxed"
          >
            {insights || 'Add some expenses and let AI generate insights for you.'}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AIAssistant