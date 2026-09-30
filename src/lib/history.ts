import type { Age, Result } from '@/lib/test'

export interface HistoryRecord {
  id: number
  createdAt: Date
  age: Age
  result: Result
}

const DB_NAME = 'prof_test'
const DB_VERSION = 1
const STORE = 'results'

let dbPromise: Promise<IDBDatabase> | undefined

/** Одно соединение на всё приложение: транзакции выполняются в порядке создания. */
function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return dbPromise
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = action(db.transaction(STORE, mode).objectStore(STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveRecord(record: Omit<HistoryRecord, 'id'>): Promise<HistoryRecord> {
  const id = await run('readwrite', (store) => store.add(record))
  return { ...record, id: id as number }
}

/** Все сохранённые результаты, новые сверху. */
export async function listRecords(): Promise<HistoryRecord[]> {
  const records = await run<HistoryRecord[]>('readonly', (store) => store.getAll())
  return records.reverse()
}

export async function deleteRecord(id: number): Promise<void> {
  await run('readwrite', (store) => store.delete(id))
}

const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date)
}
