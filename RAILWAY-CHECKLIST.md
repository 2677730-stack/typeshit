# Railway Checklist For VapeTrip

## 1. Что должно быть в проекте

- `index.html`
- `style.css`
- `script.js`
- `server.js`
- `package.json`
- `.env.example`
- `GOOGLE-APPS-SCRIPT.gs`

## 2. Подготовь Google Sheets

Создай таблицу с листами:

- `Products`
- `Orders`

### Заголовки листа Products

```text
active | id | name | category | categoryLabel | subcategory | subcategoryLabel | price | stock | description | image | gallery
```

### Заголовки листа Orders

Можно не создавать вручную, Apps Script создаст их сам.

## 3. Подключи Apps Script

- Открой Google Sheets
- `Расширения` -> `Apps Script`
- Вставь код из `GOOGLE-APPS-SCRIPT.gs`
- Нажми `Deploy` -> `New deployment`
- Тип: `Web app`
- Доступ: `Anyone`
- Получи ссылку вида `https://script.google.com/macros/s/.../exec`

## 4. Подготовь Railway

- Залей проект в GitHub
- Открой Railway
- `New Project` -> `Deploy from GitHub repo`
- Выбери репозиторий

## 5. Переменные окружения Railway

Добавь в сервис Railway:

- `GOOGLE_APPS_SCRIPT_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_CUSTOM_MESSAGE`
- `PORT`

## 6. Команда запуска

Railway возьмёт её из `package.json`:

```text
npm start
```

## 7. После деплоя

Проверь:

- загрузку каталога
- открытие карточек товара
- отправку заказа
- сообщение в Telegram
- запись заказа в лист `Orders`
