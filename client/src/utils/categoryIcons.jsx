import {
  UtensilsCrossed, Car, ShoppingBag, Lightbulb, Clapperboard,
  HeartPulse, BookOpen, Plane, TrendingUp, Wallet, Package,
  Carrot, HandCoins, Sparkles, Star, Coffee, Music, Gift,
  Home, Dumbbell, Shirt, Scissors, Dog, Baby, Gamepad2,
  Camera, Bike, Bus, Train, Fuel, Pizza, Apple,
} from 'lucide-react'

// Icon name (string) se actual component return karta hai — dynamic rendering ke liye
export const iconComponents = {
  UtensilsCrossed, Car, ShoppingBag, Lightbulb, Clapperboard,
  HeartPulse, BookOpen, Plane, TrendingUp, Wallet, Package,
  Carrot, HandCoins, Sparkles, Star, Coffee, Music, Gift,
  Home, Dumbbell, Shirt, Scissors, Dog, Baby, Gamepad2,
  Camera, Bike, Bus, Train, Fuel, Pizza, Apple,
}

// User category banate waqt icon choose kar sake — yeh list form mein dikhegi
export const availableIcons = [
  'UtensilsCrossed', 'Carrot', 'Pizza', 'Apple', 'Coffee',
  'Car', 'Bike', 'Bus', 'Train', 'Fuel', 'Plane',
  'ShoppingBag', 'Shirt', 'Scissors', 'Gift',
  'Lightbulb', 'Home',
  'Clapperboard', 'Music', 'Gamepad2', 'Camera',
  'HeartPulse', 'Dumbbell',
  'BookOpen', 'Star',
  'TrendingUp', 'HandCoins', 'Wallet',
  'Sparkles', 'Dog', 'Baby',
  'Package',
]

// Default categories ka static icon+color map (fast rendering ke liye — API call nahi karna)
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

// Category name se icon+color return karta hai
// Custom categories ke liye icon string + hex color use karta hai
export const getCategoryIcon = (category, customIcon, customColor) => {
  if (categoryIconMap[category]) return categoryIconMap[category]

  // Custom category — icon string se component dhundho
  const IconComponent = iconComponents[customIcon] || Package
  return {
    icon: IconComponent,
    color: 'text-[var(--text-primary)]',
    bg: 'bg-[var(--border)]/40',
    customColor,
  }
}