import { Fragment } from 'react'
import { ClassIcon } from '@/components/ClassIcon'
import { classColor } from '@/lib/classColors'
import { classify, type Result, type Scale } from '@/lib/test'

interface Props {
  scales: Scale[]
  result: Result
  /** Подзаголовок под «Твой результат», например дата прохождения. */
  subtitle?: string
  backLabel: string
  onBack: () => void
}

interface ShownClass {
  scale: Scale
  isSubclass: boolean
}

export function ResultScreen({ scales, result, subtitle, backLabel, onBack }: Props) {
  const scaleById = (id: string): Scale =>
    scales.find((s) => s.id === id) ?? { id, name: id, character: id, description: '' }

  const verdict = classify(result)
  const shown: ShownClass[] =
    verdict.kind === 'tie'
      ? verdict.mains.map((id) => ({ scale: scaleById(id), isSubclass: false }))
      : [
          { scale: scaleById(verdict.main), isSubclass: false },
          ...(verdict.kind === 'withSubclasses' ? verdict.subclasses : []).map((id) => ({
            scale: scaleById(id),
            isSubclass: true,
          })),
        ]
  const mains = shown.filter((c) => !c.isSubclass)
  const subclasses = shown.filter((c) => c.isSubclass)

  const rows = result.scales
    .map(({ scale, score }) => ({ scale: scaleById(scale), score }))
    .sort((a, b) => b.score - a.score)
  const maxScore = Math.max(1, ...rows.map((r) => r.score))

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Твой результат</h1>
        {subtitle && <p className="mt-1 text-neutral-600 dark:text-neutral-400">{subtitle}</p>}
      </div>

      <section className="space-y-6">
        <h2 className="text-center text-xl font-semibold">
          Твой класс — {mains.map((c) => c.scale.character).join(' или ')}
        </h2>

        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-6">
            {mains.map(({ scale }, i) => (
              <Fragment key={scale.id}>
                {i > 0 && <span className="text-lg font-semibold text-neutral-500">или</span>}
                <figure className="flex w-32 flex-col items-center gap-2 text-center">
                  <ClassIcon scaleId={scale.id} label={scale.character} className="size-28 drop-shadow-md" />
                  <figcaption className="leading-tight font-semibold">{scale.character}</figcaption>
                </figure>
              </Fragment>
            ))}
          </div>

          {subclasses.length > 0 && (
            <div className="flex flex-wrap items-start justify-center gap-4">
              {subclasses.map(({ scale }) => (
                <figure key={scale.id} className="flex w-24 flex-col items-center gap-1.5 text-center">
                  <ClassIcon scaleId={scale.id} label={scale.character} className="size-16 drop-shadow" />
                  <figcaption className="text-sm leading-tight font-medium">
                    {scale.character}
                    <span className="block text-xs font-normal text-neutral-500">подкласс</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        <ul className="space-y-3">
          {shown.map(({ scale, isSubclass }) => (
            <li
              key={scale.id}
              className="rounded-xl border-l-4 bg-neutral-50 px-4 py-3 dark:bg-neutral-900"
              style={{ borderColor: classColor(scale.id) }}
            >
              <p className="font-semibold">
                {scale.character}
                {isSubclass && <span className="ml-2 text-sm font-normal text-neutral-500">подкласс</span>}
              </p>
              <p className="mt-1 text-neutral-700 dark:text-neutral-300">{scale.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-center text-xl font-semibold">Детальные результаты</h2>
        <ul className="space-y-3">
          {rows.map(({ scale, score }) => (
            <li key={scale.id} className="grid grid-cols-[8.5rem_1fr] items-center gap-3 sm:grid-cols-[12rem_1fr]">
              <span className="flex items-center justify-end gap-2 text-right text-sm leading-tight font-medium sm:text-base">
                {scale.character}
                <ClassIcon scaleId={scale.id} label="" className="size-6 shrink-0" />
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-7 rounded-r-md"
                  style={{
                    width: `calc((100% - 2rem) * ${score / maxScore})`,
                    backgroundColor: classColor(scale.id),
                  }}
                />
                <span className="text-sm font-semibold tabular-nums">{score}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={onBack}
        className="mx-auto mt-auto w-full rounded-xl bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700 sm:w-auto"
      >
        {backLabel}
      </button>
    </div>
  )
}
