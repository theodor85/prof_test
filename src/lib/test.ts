import data from '@/data/data.json'

export type Age = 'adults' | '12years' | '9years'

export const ageLabels: Record<Age, string> = {
  adults: 'Взрослые',
  '12years': '12 лет',
  '9years': '9 лет',
}

/** Тексты интерфейса, зависящие от возраста: ребёнку пишем на «ты», взрослому — на «вы». */
export interface Wording {
  question: string
  result: string
  yourClass: string
}

export function wording(age: Age): Wording {
  return age === 'adults'
    ? { question: 'Что вам больше нравится?', result: 'Ваш результат', yourClass: 'Ваш класс' }
    : { question: 'Что тебе больше нравится?', result: 'Твой результат', yourClass: 'Твой класс' }
}

export interface Variant {
  description: string
  scale: string
}

export interface Scale {
  id: string
  name: string
  character: string
  description: string
  /** Чем заняться: показывается на экране результата в раскрывающемся блоке. */
  recommended_activities: string
}

export interface TestData {
  variants: Variant[]
  scales: Scale[]
}

export type Pair = [Variant, Variant]

export interface Result {
  scales: { scale: string; score: number }[]
}

export function loadTestData(age: Age): TestData {
  return (data as Record<Age, TestData>)[age]
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Случайно разбивает варианты на пары так, что каждый вариант используется один раз
 * и в паре нет двух вариантов одной шкалы.
 *
 * Первый элемент пары всегда берётся из шкалы с наибольшим остатком: так разбиение
 * не заходит в тупик, пока ни одна шкала не занимает больше половины вариантов.
 * Если число вариантов нечётное, последний вариант остаётся без пары.
 */
export function makePairs(variants: Variant[]): Pair[] {
  const byScale = new Map<string, Variant[]>()
  for (const v of shuffle(variants)) {
    byScale.set(v.scale, [...(byScale.get(v.scale) ?? []), v])
  }

  const pairs: Pair[] = []
  while (true) {
    const groups = [...byScale.values()].filter((g) => g.length > 0)
    if (groups.length < 2) break

    const maxLength = Math.max(...groups.map((g) => g.length))
    const first = randomItem(groups.filter((g) => g.length === maxLength))
    const second = randomItem(groups.filter((g) => g !== first))
    const a = first.pop()!
    const b = second.splice(Math.floor(Math.random() * second.length), 1)[0]
    pairs.push(Math.random() < 0.5 ? [a, b] : [b, a])
  }

  return shuffle(pairs)
}

export function emptyResult(scales: Scale[]): Result {
  return { scales: scales.map((s) => ({ scale: s.id, score: 0 })) }
}

export function addPoint(result: Result, scale: string): Result {
  return {
    scales: result.scales.map((s) => (s.scale === scale ? { ...s, score: s.score + 1 } : s)),
  }
}

export type ClassVerdict =
  /** Лидер оторвался от второго места на 2 очка и больше. */
  | { kind: 'single'; main: string }
  /** Лидер опережает второе место на 1 очко: все шкалы со вторым результатом — подклассы. */
  | { kind: 'withSubclasses'; main: string; subclasses: string[] }
  /** Несколько шкал делят первое место, подклассы не учитываются. */
  | { kind: 'tie'; mains: string[] }

/** Определяет класс ребёнка по очкам. Порядок шкал с равными очками сохраняется как в result. */
export function classify(result: Result): ClassVerdict {
  const sorted = [...result.scales].sort((a, b) => b.score - a.score)
  const top = sorted[0].score
  const leaders = sorted.filter((s) => s.score === top)
  if (leaders.length > 1) return { kind: 'tie', mains: leaders.map((s) => s.scale) }

  const second = sorted[1]?.score
  if (second === undefined || top - second >= 2) return { kind: 'single', main: sorted[0].scale }

  return {
    kind: 'withSubclasses',
    main: sorted[0].scale,
    subclasses: sorted.filter((s) => s.score === second).map((s) => s.scale),
  }
}
