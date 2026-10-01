import { useState } from 'react'
import { type Age, addPoint, emptyResult, type Pair, type Result, type Scale, type Variant, wording } from '@/lib/test'

interface Props {
  age: Age
  scales: Scale[]
  pairs: Pair[]
  onExit: () => void
  onFinish: (result: Result) => void
}

export function QuizScreen({ age, scales, pairs, onExit, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<Result>(() => emptyResult(scales))

  const choose = (variant: Variant) => {
    const next = addPoint(result, variant.scale)
    if (index + 1 < pairs.length) {
      setResult(next)
      setIndex(index + 1)
    } else {
      onFinish(next)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-2 pb-4 sm:px-4 sm:pb-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onExit}
          className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
        >
          ← На старт
        </button>
        <span className="ml-auto text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
          {index + 1} из {pairs.length}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-[width]"
          style={{ width: `${(index / pairs.length) * 100}%` }}
        />
      </div>

      {/* Вопрос и кнопки не растягиваются на всю высоту, а стоят по центру свободного места */}
      <div className="flex flex-1 flex-col justify-center gap-6">
        <h1 className="text-center text-xl font-semibold sm:text-2xl">{wording(age).question}</h1>

        {/* key сбрасывает фокус и hover-состояние кнопок при смене пары */}
        <div key={index} className="flex flex-col gap-4 sm:flex-row">
          {pairs[index].map((variant) => (
            <button
              key={variant.description}
              type="button"
              onClick={() => choose(variant)}
              className="flex min-h-36 items-center justify-center rounded-2xl border-2 border-brand-100 bg-brand-50 p-6 text-center text-lg font-medium text-neutral-900 transition hover:border-brand-500 active:scale-[0.98] sm:min-h-48 sm:flex-1 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-brand-500"
            >
              {variant.description}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
