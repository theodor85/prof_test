import { useState } from 'react'
import { formatDateTime, type HistoryRecord, saveRecord } from '@/lib/history'
import { type Age, ageLabels, loadTestData, makePairs, type Pair, type Result, type Scale } from '@/lib/test'
import { QuizScreen } from '@/screens/QuizScreen'
import { ResultScreen } from '@/screens/ResultScreen'
import { StartScreen } from '@/screens/StartScreen'

type Screen =
  | { name: 'start' }
  | { name: 'quiz'; age: Age; scales: Scale[]; pairs: Pair[] }
  /** record задан, если результат открыт из списка пройденных тестов. */
  | { name: 'result'; age: Age; scales: Scale[]; result: Result; record?: HistoryRecord }

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })
  const goToStart = () => setScreen({ name: 'start' })

  const start = (age: Age) => {
    const { variants, scales } = loadTestData(age)
    setScreen({ name: 'quiz', age, scales, pairs: makePairs(variants) })
  }

  const finish = (age: Age, scales: Scale[], result: Result) => {
    saveRecord({ createdAt: new Date(), age, result }).catch((error: unknown) =>
      console.error('Не удалось сохранить результат', error),
    )
    setScreen({ name: 'result', age, scales, result })
  }

  const openRecord = (record: HistoryRecord) => {
    setScreen({ name: 'result', age: record.age, scales: loadTestData(record.age).scales, result: record.result, record })
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
      {screen.name === 'start' && <StartScreen onSelect={start} onOpenRecord={openRecord} />}
      {screen.name === 'quiz' && (
        <QuizScreen
          age={screen.age}
          scales={screen.scales}
          pairs={screen.pairs}
          onExit={goToStart}
          onFinish={(result) => finish(screen.age, screen.scales, result)}
        />
      )}
      {screen.name === 'result' && (
        <ResultScreen
          age={screen.age}
          scales={screen.scales}
          result={screen.result}
          subtitle={
            screen.record && `${ageLabels[screen.record.age]} · ${formatDateTime(screen.record.createdAt)}`
          }
          backLabel={screen.record ? 'К списку' : 'Пройти заново'}
          onBack={goToStart}
        />
      )}
    </main>
  )
}
