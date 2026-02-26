# Blog Adaptive Layout — Context & Changelog

> **Безопасно удалить**: этот файл — только документация, не импортируется и не используется в проекте.
> Можно удалить в любой момент без последствий для сборки.

## Общее описание

Системная адаптивная верстка для legacy blog-страницы (`/blog`). Цель — привести layout к логике нового сайта, **не ломая desktop**.

### Брейкпоинты (desktop-first, max-width)

| Token | max-width |
|-------|-----------|
| 3xl   | 1919px    |
| 2xl   | 1599px    |
| xl    | 1279px    |
| lt    | 1127px    |
| lg    | 1023px    |
| md    | 767px     |
| sm    | 639px     |
| xs    | 413px     |

### Ключевое архитектурное решение (md и ниже)

На `lg` sidebar (рубрики) использует `position: relative` + `top` для визуального смещения.
На `md` и ниже sidebar переключается на `position: absolute` — не занимает место в потоке. Flex-контейнер в layout получил `md:relative` как positioned ancestor. Грид карточек использует `md:pt-[80px]` чтобы оставить место для абсолютно спозиционированных рубрик.

---

## Затронутые файлы и что изменено

### 1. `next.config.js` (строка ~642)

**Что**: Исправлен WASM-путь для Windows.
**Было**: `filePath.split('/').pop()`
**Стало**: `filePath.split(/[\\/]/).pop()`
**Зачем**: На Windows `filePath` содержит `\`, split по `/` не работал → Build Error.

---

### 2. `src/components/pages/blog/blog-header/blog-header.jsx`

**Контейнер header (line 11)**:
```
'relative mb-12 flex w-full items-end justify-between gap-5 lg:mb-2 md:mb-8 sm:flex-col sm:items-start sm:gap-5'
```
- `lg:mb-2` — минимальный margin после header на lg (было mb-10), уменьшает зазор рубрики→карточки
- `md:mb-8` — восстанавливает отступ на md
- `sm:flex-col sm:items-start sm:gap-5` — на sm и ниже иконки встают под заголовок с 20px gap
- Убраны `md:flex-col md:items-start md:justify-start md:gap-0` — на md иконки в линию с заголовком

**Заголовок H1 (line 19)**:
```
'max-w-[540px] text-[56px] leading-dense tracking-tighter lt:text-[48px] lg:text-[40px] md:text-[32px] sm:text-[28px]'
```
- `lt:text-[48px]` — 48px на lt
- `lg:text-[40px]` — 40px на lg
- `md:text-[32px]` — 32px на md
- `sm:text-[28px]` — 28px на sm

**Перенос заголовка**: Всегда 2 строки ("What we're shipping." / "What you're building."):
```jsx
<span className="whitespace-nowrap">What we're shipping.</span>
<br />
<span className="whitespace-nowrap">What you're building.</span>
```
Ранее `<br>` скрывался на md (`md:hidden`), а spans имели `md:whitespace-normal`. Теперь перенос и nowrap работают на всех разрешениях.

**Иконки (line 32)**:
```
'mb-2.5 flex items-center gap-x-4 lg:mb-14 md:mb-0 sm:mb-0'
```
- `lg:mb-14` — компенсация для абсолютного поиска на lg
- `md:mb-0` — обнуление на md (иконки в линию)
- `sm:mb-0` — обнуление на sm (иконки стекаются вертикально)

---

### 3. `src/components/pages/blog/sidebar/sidebar.jsx`

**aside (line 15)**:
```
'relative z-10 mt-[283px] lt:mt-[267px] flex w-[288px] shrink-0 flex-col gap-y-10
 xl:w-[202px]
 lg:top-[188px] lg:mb-10 lg:mt-0 lg:min-h-fit lg:w-full
 md:absolute md:left-0 md:right-0 md:top-[188px] md:mt-0 md:mb-0
 sm:top-[220px]'
```

**Ключевые изменения**:
- `md:absolute md:left-0 md:right-0` — на md sidebar абсолютный, не занимает место в потоке
- `md:top-[188px]` — позиция рубрик на md (между поиском и карточками)
- `md:mt-0 md:mb-0` — обнуление margins при absolute
- `sm:top-[220px]` — на sm рубрики ниже (header выше из-за стекания иконок)
- `lg:top-[188px]` — оставлен без изменений (relative позиционирование на lg)

**Было**: `md:top-[150px] md:mb-9` (relative позиционирование, рубрики налезали на header)

---

### 4. `src/app/blog/(index)/layout.jsx`

**Flex-контейнер (line 19)**:
```
'flex gap-16 xl:gap-3.5 xl:pl-0 lg:flex-col lg:gap-0 md:relative'
```
- Добавлен `md:relative` — positioned ancestor для абсолютного sidebar

**API protection (lines 7-14)**: `try/catch` вокруг `getAllCategories()`, чтобы 504 от API не ронял всю страницу.

---

### 5. `src/app/blog/(index)/page.jsx`

**Header className (line 22)**:
```
'border-b border-gray-new-20 pb-12 lg:-top-[68px] md:top-0 md:border-b-0 md:pb-0'
```
- `md:top-0` — обнуление negative top на md (не нужен при absolute sidebar)
- `md:border-b-0 md:pb-0` — убран дивайдер и padding под ним на md и ниже

**Search className (line 29)**:
```
'right-full mr-16 top-[208px] lt:top-[192px] xl:mr-3.5 lg:right-0 lg:mr-0 lg:top-[12px] md:!static md:!right-auto md:!top-auto md:mt-4'
```
- `md:!static` — поиск в обычном потоке (не абсолютный) на md
- `md:mt-4` — 16px gap от header

**Grid className (line 32)**:
```
'grid grid-cols-2 gap-x-16 xl:gap-x-5 md:grid-cols-1 md:pt-[80px]'
```
- `md:pt-[80px]` — пространство для абсолютно позиционированных рубрик

**Фильтрация постов (line 17)**: `.filter(Boolean)` для защиты от undefined в массиве.

**Первые карточки (line 36)**: `lg:!pt-0 lg:!border-t-0 md:!pt-0 md:!border-t-0` — убирает лишний верхний padding и border у первых двух карточек.

---

### 6. `src/app/blog/(index)/category/[slug]/page.jsx`

Зеркальные изменения `page.jsx`:
- Header className → `md:top-0 md:border-b-0 md:pb-0`
- Search className → `md:!static md:!right-auto md:!top-auto md:mt-4`
- Grid → `md:pt-[80px]`
- `.filter(Boolean)` на posts

---

### 7. `src/components/pages/blog/blog-post-card/blog-post-card.jsx`

- Полноразмерные карточки: `object-contain` вместо `object-cover` (предотвращает кроп)
- Hover-zoom только на featured: `withImageHover && !fullSize`
- Текстовый блок: `min-w-0` предотвращает overflow, `basis-[58%] max-w-[684px] pr-20 lt:max-w-none lt:pr-8 lg:pr-0`
- Excerpt: `lg:text-base md:text-base` (минимум 16px)

---

### 8. `src/components/pages/blog/blog-grid-item/blog-grid-item.jsx`

- Убраны nth-child хаки, упрощено до `'py-10 last:pb-0 md:py-6'`

---

### 9. `src/components/pages/blog/blog-nav-link/blog-nav-link.jsx`

- Убрана зеленая точка активного состояния
- Активный стиль: `text-gray-new-90 lg:border-green-45`

---

### 10. `src/styles/search.css`

- `xl:w-[202px] xl:pr-10` — ширина поиска на xl совпадает с sidebar, текст не кропится
- `lg:w-[288px] lg:pr-36` — ширина поиска на lg
- `md:w-full md:text-base` — full-width на md

---

## Визуальная иерархия по брейкпоинтам

### Desktop (>1023px) — не изменён
Sidebar слева, контент справа. Заголовок 56px (lt: 48px). Поиск абсолютно позиционирован рядом с sidebar.

### lg (768-1023px)
- Flex-col: sidebar наверху, контент ниже
- Sidebar: `relative + top-[188px]` — визуально после header
- Заголовок 40px, иконки справа в линию
- Поиск абсолютно позиционирован (`lg:top-[12px]`)
- Дивайдер (border-b) — есть
- `lg:mb-2` — минимальный margin после header

### md (640-767px)
- Sidebar: `absolute + top-[188px]` — не занимает flow space
- Layout flex-контейнер: `md:relative`
- Заголовок 32px, иконки справа в линию
- Поиск статичный, full-width (`md:!static md:mt-4`)
- Дивайдер — убран (`md:border-b-0 md:pb-0`)
- Grid: `md:pt-[80px]` для пространства под рубрики
- Порядок: Заголовок+Иконки → Поиск → Рубрики → Карточки

### sm (≤639px)
- Sidebar: `absolute + top-[220px]`
- Заголовок 28px, 2 строки
- Иконки под заголовком (`sm:flex-col sm:gap-5`)
- Поиск статичный, full-width
- Порядок: Заголовок → Иконки → Поиск → Рубрики → Карточки

---

## Исправленные ошибки

1. **WASM Build Error** (`next.config.js`): `filePath.split('/')` → `filePath.split(/[\\/]/)` для Windows
2. **TypeError: Cannot read 'slug' of undefined** (`page.jsx`): `.filter(Boolean)` на posts
3. **504 API crash** (`layout.jsx`): `try/catch` вокруг `getAllCategories()`
