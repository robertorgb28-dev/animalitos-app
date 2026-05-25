import React, { useState } from 'react';
import { AnimalCategory } from '../types';

interface AnimalImageProps {
  imageUrl?: string;
  imageVerified?: boolean;
  category: AnimalCategory;
  name: string;
  className?: string;
  iconSize?: string;
}

export const CATEGORY_STYLES: Record<
  AnimalCategory,
  { bg: string; text: string; border: string; icon: string }
> = {
  Aves: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: 'flutter_dash',
  },
  Mamíferos: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'pets',
  },
  Reptiles: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    icon: 'healing',
  },
  Anfibios: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: 'water_drop',
  },
  Peces: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'scuba_diving',
  },
  Insectos: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: 'bug_report',
  },
  Arácnidos: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: 'wifi_channel',
  },
  Moluscos: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: 'brightness_low',
  },
  Crustáceos: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    icon: 'waves',
  },
  Otros: {
    bg: 'bg-stone-50',
    text: 'text-stone-700',
    border: 'border-stone-200',
    icon: 'category',
  },
};

export default function AnimalImage({
  imageUrl,
  imageVerified = false,
  category,
  name,
  className = 'w-full h-full object-cover',
  iconSize = 'text-2xl',
}: AnimalImageProps) {
  const [hasError, setHasError] = useState(false);
  const styles = CATEGORY_STYLES[category] || CATEGORY_STYLES['Otros'];
  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : '?';

  // Instant verification for user custom uploads or explicitly verified catalogue artwork
  const isReallyVerified = 
    imageVerified || 
    (imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') || imageUrl.startsWith('/')));

  if (imageUrl && isReallyVerified && !hasError) {
    return (
      <img
        alt={name}
        className={className}
        referrerPolicy="no-referrer"
        src={imageUrl}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-2 border ${styles.bg} ${styles.text} ${styles.border} transition-all select-none`}
    >
      <span className={`material-symbols-outlined ${iconSize} opacity-90 mb-0.5`} style={{ fontVariationSettings: "'FILL' 0" }}>
        {styles.icon}
      </span>
      <span className="font-display font-extrabold text-[11px] uppercase tracking-wider">
        {firstLetter}
      </span>
    </div>
  );
}
