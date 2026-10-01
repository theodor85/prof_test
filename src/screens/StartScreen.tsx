import { HistoryList } from '@/components/HistoryList'
import type { HistoryRecord } from '@/lib/history'
import { type Age, ageLabels } from '@/lib/test'

const ages: Age[] = ['adults', '12years', '9years']

interface Props {
  onSelect: (age: Age) => void
  onOpenRecord: (record: HistoryRecord) => void
}

export function StartScreen({ onSelect, onOpenRecord }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-8 sm:flex-row sm:gap-10">
        {ages.map((age) => (
          <button
            key={age}
            type="button"
            onClick={() => onSelect(age)}
            className="flex size-40 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white shadow-lg transition hover:bg-brand-700 active:scale-95 sm:size-48 sm:text-3xl"
          >
            {ageLabels[age]}
          </button>
        ))}
      </div>

      <HistoryList onOpen={onOpenRecord} />
    </div>
  )
}
