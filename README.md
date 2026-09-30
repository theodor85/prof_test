# prof_test

Профориентационный тест для детей 9 и 12 лет. TypeScript, React 19, Vite, Tailwind CSS v4, pnpm.

## Команды

```bash
pnpm install   # установка зависимостей
pnpm dev       # dev-сервер
pnpm build     # проверка типов + production-сборка в dist/
pnpm preview   # просмотр production-сборки
pnpm lint      # oxlint
```

## Структура

```
src/
  main.tsx            точка входа
  App.tsx             переключение экранов
  index.css           Tailwind и тема (@theme)
  data/data.json      данные теста
  lib/test.ts         типы, разбиение на пары, подсчёт очков, определение класса
  lib/classColors.ts  цвета классов
  lib/history.ts      история пройденных тестов в IndexedDB
  components/         иконки классов, список пройденных тестов
  screens/            экраны: старт, пары, результат
```

Импорт из `src` — через алиас `@/`.

## Вёрстка

Mobile first: стили без префикса — для телефонов, `sm:` / `md:` / `lg:` — для экранов шире.
Учтены safe-area отступы (`viewport-fit=cover`) и тёмная тема по системной настройке.
