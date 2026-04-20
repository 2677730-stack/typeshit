# Netlify Checklist For VapeTrip

## 1. Что нужно в проекте

Используются файлы:

- `index.html`
- `style.css`
- `script.js`
- `netlify.toml`
- `netlify/functions/products.js`
- `netlify/functions/order.js`
- `GOOGLE-APPS-SCRIPT.gs`
- `.env.example`

## 2. Подготовь Google Sheets

Создай Google Таблицу с листами:

- `Products`
- `Orders`

### Заголовки листа Products

```text
active | id | name | category | categoryLabel | subcategory | subcategoryLabel | price | stock | description | image | gallery
```

## 3. Подключи Google Apps Script

- Открой таблицу
- `Расширения` -> `Apps Script`
- Вставь код из `GOOGLE-APPS-SCRIPT.gs`
- `Deploy` -> `New deployment`
- Тип: `Web app`
- Доступ: `Anyone`
- Скопируй ссылку `https://script.google.com/macros/s/.../exec`

## 4. Загрузка в GitHub

- Загрузи весь проект в GitHub
- Реальные секреты в код не вставляй

## 5. Импорт в Netlify

По официальной схеме Netlify:

- `Add new project`
- `Import an existing project`
- выбери GitHub
- выбери репозиторий

Источник: https://docs.netlify.com/start/quickstarts/deploy-from-repository/

## 6. Build settings

- `Build command`: оставить пустым
- `Publish directory`: `.`

Функции Netlify подтянутся из `netlify/functions`, а путь к ним задаётся в `netlify.toml`.

## 7. Environment Variables в Netlify

Открой:

- `Site configuration`
- `Environment variables`

Добавь:

- `GOOGLE_APPS_SCRIPT_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_CUSTOM_MESSAGE`

Важно: переменные должны быть доступны для Functions runtime. Источник: https://docs.netlify.com/build/functions/environment-variables/

## 8. Первый deploy

- нажми `Deploy site`
- дождись завершения

## 9. Что проверить после deploy

- каталог загрузился
- карточка товара открывается
- корзина работает
- заказ отправляется
- заказ пришёл в Telegram
- заказ появился в листе `Orders`
