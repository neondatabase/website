# Воспроизведение проблемы с главной страницы

## Шаги для воспроизведения локально:

### Вариант 1: Production Build

```bash
# 1. Создайте production build
npm run build

# 2. Запустите production server
npm start

# 3. Откройте http://localhost:3000
# 4. Попробуйте кликнуть на ссылки в футере
```

### Вариант 2: С установленной cookie

```bash
# 1. Откройте DevTools -> Application -> Cookies
# 2. Добавьте cookie: neon_login_indicator=true
# 3. Перезагрузите главную страницу
# 4. Попробуйте навигацию
```

### Вариант 3: Vercel Preview

```bash
# Создайте preview deployment на Vercel
vercel --prod
```

## Проблема

В `src/middleware.js` используются server actions внутри middleware:
- `checkCookie` (строка 71)
- `getReferer` (строка 74)

Server actions не должны вызываться из middleware на Edge Runtime.

## Решение

Middleware должен напрямую использовать `req.cookies` и `req.headers` вместо server actions.

