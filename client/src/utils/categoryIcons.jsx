import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Lightbulb,
  Clapperboard,
  HeartPulse,
  BookOpen,
  Plane,
  TrendingUp,
  Wallet,
  Package,
  Carrot,
  HandCoins,
  Sparkles,
} from 'lucide-react'

// Har category ke liye icon + color — ek hi jagah se manage hota hai
export const categoryIconMap = {
  'Food & Dining': { icon: UtensilsCrossed, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  'Groceries': { icon: Carrot, color: 'text-lime-400', bg: 'bg-lime-500/10' },
  'Transport': { icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  'Shopping': { icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  'Bills & Utilities': { icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  'Entertainment': { icon: Clapperboard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  'Health': { icon: HeartPulse, color: 'text-red-400', bg: 'bg-red-500/10' },
  'Education': { icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  'Travel': { icon: Plane, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  'Investment': { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
  'Loans & Lending': { icon: HandCoins, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'Personal & Lifestyle': { icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
  'Income': { icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'Others': { icon: Package, color: 'text-gray-400', bg: 'bg-gray-500/10' },
}

export const getCategoryIcon = (category) => categoryIconMap[category] || categoryIconMap['Others']