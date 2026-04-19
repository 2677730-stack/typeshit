# Netlify Checklist For VapeTrip

## 1. Подготовка проекта

- Убедись, что в проекте есть файлы `index.html`, `style.css`, `script.js`
- Убедись, что папка `netlify/functions` существует
- Убедись, что в проекте есть `netlify.toml`

## 2. Загрузка в GitHub

- Создай новый репозиторий на GitHub
- Загрузи туда весь проект целиком
- Не добавляй реальные секреты в `script.js`
- Файл `.env.example` можно оставить в репозитории как шаблон

## 3. Создание сайта в Netlify

- Зайди в Netlify
- Нажми `Add new site`
- Нажми `Import an existing project`
- Выбери GitHub
- Выбери свой репозиторий

## 4. Настройки билда

- `Build command`: оставить пустым
- `Publish directory`: `.`

Netlify возьмёт настройки функций из `netlify.toml`

## 5. Добавление Environment Variables

Открой:

- `Site configuration`
- `Environment variables`

Добавь переменные:

- `ADMIN_PANEL_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_CUSTOM_MESSAGE`
- `GOOGLE_APPS_SCRIPT_URL`

Значения смотри в файле `.env.example`

## 6. Первый деплой

- Нажми `Deploy site`
- Дождись завершения деплоя

## 7. После деплоя

- Открой сайт
- Проверь открытие каталога
- Проверь корзину
- Проверь вход в админку
- Проверь отправку заказа

## 8. Если меняешь секреты

- Измени значения в `Environment variables` в Netlify
- Сделай `Redeploy`

## 9. Важно

- Если Telegram токен когда-либо попадал в открытый код, перевыпусти его через `@BotFather`
- Пароль админки тоже храни только в Netlify environment variables
