import type { ReactNode } from 'react'
import { classColor } from '@/lib/classColors'

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / 5) * i - Math.PI / 2
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`
  }).join(' ')
}

function gearPoints(cx: number, cy: number, outer: number, inner: number, teeth: number): string {
  const step = (Math.PI * 2) / teeth
  return Array.from({ length: teeth }, (_, i) => {
    const a = step * i
    return [
      [inner, a - step * 0.3],
      [outer, a - step * 0.18],
      [outer, a + step * 0.18],
      [inner, a + step * 0.3],
    ]
      .map(([r, angle]) => `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`)
      .join(' ')
  }).join(' ')
}

/** Эмблемы классов в системе координат 64×64, рисуются белым поверх цветного круга. */
const emblems: Record<string, (color: string) => ReactNode> = {
  // Бард — лютня и нота
  '1': (color) => (
    <>
      <line x1="34" y1="32" x2="46" y2="20" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <line x1="45" y1="18" x2="50" y2="13" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="27" cy="39" rx="15" ry="11" transform="rotate(-45 27 39)" fill="white" />
      <circle cx="29" cy="37" r="3.5" fill={color} />
      <line x1="20" y1="46" x2="47" y2="19" stroke={color} strokeWidth="1" />
      <line x1="18" y1="44" x2="22" y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="24" r="3.5" fill="white" />
      <path d="M19.5 24 V12 Q23 13 25 17" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  // Мастер-изобретатель — шестерня и молоток
  '2': (color) => (
    <>
      <polygon points={gearPoints(25, 39, 15, 11.5, 8)} fill="white" />
      <circle cx="25" cy="39" r="11.5" fill="white" />
      <circle cx="25" cy="39" r="4.5" fill={color} />
      <g transform="translate(42 24) rotate(45)" fill="white" stroke={color} strokeWidth="2">
        <rect x="-3" y="-6" width="6" height="24" rx="3" />
        <rect x="-10" y="-14" width="20" height="9" rx="2" />
      </g>
    </>
  ),
  // Алхимик — колба с зельем и пузырьки
  '3': (color) => (
    <>
      <path d="M27 17 H37 V27 L47 44 Q50 50 44 50 H20 Q14 50 17 44 L27 27 Z" fill="white" />
      <path d="M22.5 37 H41.5 L44.5 43 Q47 47.5 42.5 47.5 H21.5 Q17 47.5 19.5 43 Z" fill={color} opacity="0.55" />
      <line x1="25" y1="17" x2="39" y2="17" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42" cy="12" r="2.5" fill="white" />
      <circle cx="47" cy="7.5" r="1.8" fill="white" />
      <circle cx="30" cy="42" r="1.8" fill="white" />
      <circle cx="36" cy="44" r="1.3" fill="white" />
    </>
  ),
  // Целитель — сердце с крестом
  '4': (color) => (
    <>
      <path d="M32 51 C14 39 11 27 17.5 20.5 C23.5 14.5 30 17 32 22 C34 17 40.5 14.5 46.5 20.5 C53 27 50 39 32 51 Z" fill="white" />
      <line x1="32" y1="25" x2="32" y2="39" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="25" y1="32" x2="39" y2="32" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
    </>
  ),
  // Странник-воин — посох странника и меч крест-накрест
  '5': (color) => (
    <>
      <g transform="rotate(-45 32 32)">
        <line x1="32" y1="14" x2="32" y2="55" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M32 14 Q32 8 37 9 Q40 10 38 13" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <g transform="rotate(45 32 32)">
        <path d="M28.5 13 L32 7 L35.5 13 V38 H28.5 Z" fill="white" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="32" y1="14" x2="32" y2="35" stroke={color} strokeWidth="1" opacity="0.5" />
        <rect x="22" y="38" width="20" height="4.5" rx="2.25" fill="white" stroke={color} strokeWidth="1.5" />
        <rect x="30" y="42.5" width="4" height="8" fill="white" />
        <circle cx="32" cy="52.5" r="3" fill="white" />
      </g>
    </>
  ),
  // Хранитель свитков — свиток с записями
  '6': (color) => (
    <>
      <rect x="19" y="16" width="26" height="32" fill="white" />
      <rect x="15" y="11" width="34" height="8" rx="4" fill="white" stroke={color} strokeWidth="1.5" />
      <rect x="15" y="45" width="34" height="8" rx="4" fill="white" stroke={color} strokeWidth="1.5" />
      <g stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <line x1="24" y1="25" x2="40" y2="25" />
        <line x1="24" y1="30" x2="40" y2="30" />
        <line x1="24" y1="35" x2="40" y2="35" />
        <line x1="24" y1="40" x2="34" y2="40" />
      </g>
    </>
  ),
  // Друид — лист с прожилками
  '7': (color) => (
    <>
      <line x1="32" y1="46" x2="32" y2="56" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 9 C49 18 51 37 32 51 C13 37 15 18 32 9 Z" fill="white" />
      <g stroke={color} strokeWidth="2" strokeLinecap="round">
        <line x1="32" y1="17" x2="32" y2="47" />
        <line x1="32" y1="27" x2="38" y2="22" />
        <line x1="32" y1="27" x2="26" y2="22" />
        <line x1="32" y1="35" x2="40" y2="29" />
        <line x1="32" y1="35" x2="24" y2="29" />
        <line x1="32" y1="42" x2="38" y2="38" />
        <line x1="32" y1="42" x2="26" y2="38" />
      </g>
    </>
  ),
  // Командир — знамя со звездой
  '8': (color) => (
    <>
      <line x1="21" y1="14" x2="21" y2="54" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="21" cy="11.5" r="3" fill="white" />
      <path d="M23 16 H49 L43 25.5 L49 35 H23 Z" fill="white" />
      <polygon points={starPoints(34, 25.5, 6, 2.6)} fill={color} />
    </>
  ),
}

interface Props {
  scaleId: string
  /** Имя персонажа для скринридеров; пустая строка — иконка декоративная. */
  label: string
  className?: string
}

export function ClassIcon({ scaleId, label, className }: Props) {
  const color = classColor(scaleId)
  return (
    <svg
      viewBox="0 0 64 64"
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <circle cx="32" cy="32" r="32" fill={color} />
      <circle cx="32" cy="32" r="29" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      {emblems[scaleId]?.(color) ?? (
        <text x="32" y="41" textAnchor="middle" fontSize="26" fontWeight="700" fill="white">
          {label.charAt(0)}
        </text>
      )}
    </svg>
  )
}
