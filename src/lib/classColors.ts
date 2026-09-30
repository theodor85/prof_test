/** Цвет класса по id шкалы. Используется для фона иконки и столбца диаграммы. */
export const classColors: Record<string, string> = {
  '1': '#7c3aed',
  '2': '#ea580c',
  '3': '#0891b2',
  '4': '#db2777',
  '5': '#dc2626',
  '6': '#92400e',
  '7': '#16a34a',
  '8': '#1d4ed8',
}

const fallbackColor = '#525252'

export function classColor(scaleId: string): string {
  return classColors[scaleId] ?? fallbackColor
}
