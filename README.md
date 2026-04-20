# VapeTrip

VapeTrip теперь настроен под Netlify.

Схема работы:

- товары хранятся в Google Sheets
- Google Apps Script отдаёт каталог и принимает заказы
- Netlify Functions скрывают Telegram token и обращаются к Apps Script
- сайт как статический фронтенд получает товары через `/.netlify/functions/products`

## Основные файлы

- `index.html` — разметка сайта
- `style.css` — стили
- `script.js` — логика каталога и корзины
- `netlify.toml` — конфигурация Netlify
- `netlify/functions/products.js` — загрузка каталога из Google Sheets
- `netlify/functions/order.js` — отправка заказа в Telegram и Google Sheets
- `GOOGLE-APPS-SCRIPT.gs` — код для Google Apps Script
- `.env.example` — шаблон env переменных
- `NETLIFY-CHECKLIST.md` — пошаговый deploy на Netlify

## Как работают товары

Сайт делает запрос:

- `GET /.netlify/functions/products`

Эта функция получает данные из Google Apps Script и возвращает JSON каталога.

## Как отправляется заказ

Сайт делает запрос:

- `POST /.netlify/functions/order`

Функция:

- отправляет заказ в Telegram
- записывает заказ в Google Sheets

## Структура Google Sheets

### Лист `Products`

Заголовки:

```text
active | id | name | category | categoryLabel | subcategory | subcategoryLabel | price | stock | description | image | gallery
```

### Что писать в колонках

- `active` — `TRUE` или `FALSE`
- `id` — уникальный id, например `pod-mini-air`
- `name` — название товара
- `category` — системное имя категории
- `categoryLabel` — подпись категории
- `subcategory` — системное имя подкатегории
- `subcategoryLabel` — подпись подкатегории
- `price` — цена числом
- `stock` — остаток
- `description` — описание
- `image` — основная картинка
- `gallery` — дополнительные картинки через запятую

## Как загружать фото в таблицу

Самый удобный вариант для этого проекта:

1. Загружаешь фото в папку `product-images/`
2. В таблице вставляешь пути к ним

Пример:

```text
image = product-images/item-main.jpg
gallery = product-images/item-1.jpg, product-images/item-2.jpg, product-images/item-3.jpg
```

Можно и прямые URL:

```text
image = https://example.com/item-main.jpg
gallery = https://example.com/1.jpg, https://example.com/2.jpg
```

## Где менять текст про доставку

Ищи в `index.html` элемент:

- `id="deliveryInfoText"`

Сейчас там текст:

```text
Есть доставка до метро и самовывоз.
```

## Какие переменные нужны в Netlify

Смотри `.env.example`

Нужны:

- `GOOGLE_APPS_SCRIPT_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_CUSTOM_MESSAGE`

## Где настраивать Netlify

Подробно:

- смотри `NETLIFY-CHECKLIST.md`

## Важно

- переменные из `netlify.toml` недоступны Netlify Functions runtime, поэтому секреты задаются только в UI Netlify environment variables
- если Telegram token уже светился публично, перевыпусти его через `@BotFather`
- В проекте используется только Netlify-сценарий deploy
