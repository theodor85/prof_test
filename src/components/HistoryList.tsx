import { useEffect, useState } from 'react'
import { ClassIcon } from '@/components/ClassIcon'
import { deleteRecord, formatDateTime, type HistoryRecord, listRecords } from '@/lib/history'
import { ageLabels, classify, loadTestData } from '@/lib/test'

interface Props {
  onOpen: (record: HistoryRecord) => void
}

export function HistoryList({ onOpen }: Props) {
  const [records, setRecords] = useState<HistoryRecord[]>([])

  useEffect(() => {
    listRecords()
      .then(setRecords)
      .catch((error: unknown) => console.error('Не удалось загрузить историю', error))
  }, [])

  const remove = async (record: HistoryRecord) => {
    if (!window.confirm(`Удалить результат от ${formatDateTime(record.createdAt)}?`)) return
    try {
      await deleteRecord(record.id)
      setRecords((current) => current.filter((r) => r.id !== record.id))
    } catch (error) {
      console.error('Не удалось удалить результат', error)
    }
  }

  if (records.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Пройденные тесты</h2>
      <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {records.map((record) => (
          <li key={record.id} className="flex items-center">
            <button
              type="button"
              onClick={() => onOpen(record)}
              className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <span className="text-sm tabular-nums">{formatDateTime(record.createdAt)}</span>
              <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-neutral-800 dark:text-brand-100">
                {ageLabels[record.age]}
              </span>
              <RecordIcons record={record} />
            </button>
            <button
              type="button"
              onClick={() => void remove(record)}
              aria-label="Удалить результат"
              className="flex size-12 shrink-0 items-center justify-center text-2xl text-neutral-400 transition-colors hover:text-red-600"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Иконки класса: основной крупнее, подклассы мельче; при ничьей все крупные. */
function RecordIcons({ record }: { record: HistoryRecord }) {
  const { scales } = loadTestData(record.age)
  const character = (id: string) => scales.find((s) => s.id === id)?.character ?? id

  const verdict = classify(record.result)
  const mains = verdict.kind === 'tie' ? verdict.mains : [verdict.main]
  const subclasses = verdict.kind === 'withSubclasses' ? verdict.subclasses : []

  return (
    <span className="ml-auto flex shrink-0 items-center gap-1">
      {mains.map((id) => (
        <IconWithTooltip key={id} scaleId={id} label={character(id)} className="size-8" />
      ))}
      {subclasses.map((id) => (
        <IconWithTooltip key={id} scaleId={id} label={`${character(id)} (подкласс)`} className="size-5" />
      ))}
    </span>
  )
}

/**
 * Тултип с именем класса при наведении мышью. group-hover в Tailwind v4 срабатывает
 * только при @media (hover: hover), поэтому на сенсорных экранах тултипа нет.
 */
function IconWithTooltip({ scaleId, label, className }: { scaleId: string; label: string; className: string }) {
  return (
    <span className="group relative flex">
      <ClassIcon scaleId={scaleId} label={label} className={className} />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {label}
      </span>
    </span>
  )
}
