import { AnimatePresence, motion } from 'framer-motion'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useServerStatus } from '../../context/ServerStatusContext'

const ServerStatusBanner = () => {
  const { isServerDown, checking, checkNow } = useServerStatus()

  return (
    <AnimatePresence>
      {isServerDown && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white px-4 py-2.5 flex items-center justify-center gap-3 text-sm shadow-lg"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Unable to connect to the server. Data will not sync until connection is restored</span>
          <button
            onClick={checkNow}
            disabled={checking}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-md px-2.5 py-1 transition disabled:opacity-60 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ServerStatusBanner