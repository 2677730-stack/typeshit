# VapeTrip

VapeTrip теперь работает по схеме:

- товары хранятся в Google Sheets
- Google Apps Script отдаёт каталог и принимает заказы
- Railway поднимает Node.js сервер
- Railway скрывает Telegram token и другие секреты в environment variables

## Основные файлы

- `index.html` — разметка сайта
- `style.css` — стили
- `script.js` — клиентская логика каталога, корзины и фильтров
- `server.js` — сервер Railway
- `GOOGLE-APPS-SCRIPT.gs` — код для Google Apps Script
- `.env.example` — шаблон env переменных
- `RAILWAY-CHECKLIST.md` — пошаговый деплой

## Как теперь работают товары

Сайт больше не берёт каталог из встроенной админки.

Он делает запрос:

- `GET /api/products`

Сервер Railway берёт данные из `GOOGLE_APPS_SCRIPT_URL` и отдаёт их на сайт.

## Структура Google Sheets

### Лист `Products`

Заголовки:

```text
active | id | name | category | categoryLabel | subcategory | subcategoryLabel | price | stock | description | image | gallery
```

### Что писать в колонках

- `active` — `TRUE` или `FALSE`
- `id` — любой уникальный id, например `pod-mini-air`
- `name` — название товара
- `category` — системное имя категории
- `categoryLabel` — название категории для сайта
- `subcategory` — системное имя подкатегории
- `subcategoryLabel` — название подкатегории для сайта
- `price` — цена числом
- `stock` — остаток
- `description` — описание товара
- `image` — путь к основной картинке
- `gallery` — дополнительные картинки через запятую

## Как загружать фото для товаров

### Вариант 1. Хранить фото прямо в проекте

Загрузи картинки в папку:

- `product-images/`

И в таблице указывай так:

```text
image = product-images/item-main.jpg
gallery = product-images/item-1.jpg, product-images/item-2.jpg, product-images/item-3.jpg
```

Это самый удобный вариант для твоего проекта.

### Вариант 2. Использовать внешние ссылки

Можно вставлять прямые URL:

```text
image = https://example.com/item-main.jpg
gallery = https://example.com/1.jpg, https://example.com/2.jpg
```

## Как отправляется заказ

Сайт отправляет заказ на:

- `POST /api/order`

Сервер Railway:

- отправляет заказ в Telegram
- записывает заказ в Google Sheets через Apps Script

## Какие переменные нужны в Railway

Смотри `.env.example`

Нужны:

- `GOOGLE_APPS_SCRIPT_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_CUSTOM_MESSAGE`
- `PORT`

## Где менять текст про доставку

Текст корзины:

- ищи в `index.html` элемент с `id="deliveryInfoText"`

Сейчас там написано:

```text
Есть доставка до метро и самовывоз.
```

## Тема сайта

По умолчанию включена тёмная тема.
Светлая включается только после выбора пользователем.

## Деплой

Полная инструкция:

- смотри `RAILWAY-CHECKLIST.md`
