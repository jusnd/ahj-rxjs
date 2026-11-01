[![Deploy to GitHub Pages](https://github.com/jusnd/ahj-rxjs/actions/workflows/deploy.yml/badge.svg)](https://github.com/jusnd/ahj-rxjs/actions/workflows/deploy.yml)

# Polling — ДЗ «11. RxJS»

Виджет непрочитанных сообщений: клиент на **RxJS** периодически опрашивает REST-сервер
и добавляет новые сообщения в таблицу сверху.
Проект курса «Продвинутый JavaScript» (Нетология).

**GitHub Pages:** https://jusnd.github.io/ahj-rxjs/

## Функциональность

- **Серверная часть** (`backend/`): Express-сервер с REST endpoint `GET /messages/unread`,
  возвращающим непрочитанные сообщения. Данные генерируются библиотекой `@faker-js/faker`:
  случайные отправители, темы, тексты, `id` (uuid) и метки времени.
  Формат ответа:

  ```json
  {
    "status": "ok",
    "timestamp": 1553400000,
    "messages": [
      {
        "id": "<uuid>",
        "from": "anya@ivanova",
        "subject": "Hello from Anya",
        "body": "Long message body here",
        "received": 1553108200
      }
    ]
  }
  ```

- **Клиентская часть** (`src/`): виджет подписывается на поток обновлений, построенный на RxJS:
  - `interval(3000)` + `startWith(0)` — первый запрос сразу, далее опрос каждые 3 секунды;
  - `switchMap` + `ajax.getJSON(...)` — запросы к `/messages/unread`, устаревший запрос отменяется;
  - сообщения извлекаются из свойства `messages` ответа;
  - `catchError` — любая ошибка (сервер недоступен или код ответа не 200) преобразуется
    в пустой массив, т.е. трактуется как отсутствие новых сообщений, опрос продолжается;
  - новые сообщения добавляются **сверху** таблицы, предыдущие не удаляются;
  - `subject` длиннее 15 символов сокращается до 15 символов с многоточием (полный текст — в подсказке);
  - `received` переводится из unix-timestamp в формат `ЧЧ:ММ ДД.ММ.ГГГГ`;
  - индикатор в шапке виджета показывает состояние связи с сервером (online / offline).

## Технологии

- RxJS 7 (`interval`, `startWith`, `switchMap`, `catchError`, `ajax.getJSON`)
- Express 4 + @faker-js/faker — демо-сервер
- Webpack 5 (сборка JS и CSS, Babel)
- Jest — тесты утилит форматирования
- GitHub Actions — автоматическая сборка и деплой на GitHub Pages (`.github/workflows/deploy.yml`)

## Как запустить локально

Требования: **Node.js 18+** и npm.

```bash
# 1. Клонировать репозиторий
git clone https://github.com/jusnd/ahj-rxjs.git
cd ahj-rxjs
```

Дальше нужны **два терминала** — для backend и для frontend:

```bash
# Терминал 1: backend на http://localhost:3000
cd backend
npm install
npm start

# Терминал 2: frontend на http://localhost:8080
npm install
npm run dev
```

Откройте http://localhost:8080 — виджет начнёт опрашивать сервер каждые 3 секунды.
Чтобы увидеть обработку ошибок, остановите backend (`Ctrl+C`): индикатор в шапке
переключится на `offline`, а опрос продолжится; после перезапуска сервера
сообщения снова начнут приходить.

Другие команды:

```bash
npm test        # запустить тесты утилит
npm run build   # собрать продакшн-версию в папку dist/
```

По умолчанию фронтенд обращается к `http://localhost:3000`. Другой адрес сервера
можно задать переменной окружения `SERVER_URL` при сборке:

```bash
SERVER_URL=https://your-backend.example.com npm run build
```

## Деплой

- **Frontend**: собирается и публикуется на GitHub Pages автоматически при пуше в `main`
  (GitHub Actions). Адрес backend'а для продакшн-сборки задаётся переменной `SERVER_URL`
  в *Settings → Secrets and variables → Actions → Variables*.
- **Backend**: деплоится как отдельный Web Service (например, на Render или Vercel):
  корневая папка — `backend/`, команда сборки — `npm install`, команда запуска — `npm start`,
  порт берётся из переменной окружения `PORT`.
