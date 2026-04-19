# VapeTrip

Готовый адаптивный сайт для вейп-шопа с:

- каталогом товаров
- поиском и фильтрами
- карточкой товара
- корзиной
- админ-панелью
- локальным хранением данных
- отправкой заказов через Netlify Functions
- поддержкой Telegram и Google Sheets

## Структура проекта

- `index.html` — основная разметка сайта
- `style.css` — стили сайта
- `script.js` — логика каталога, корзины, фильтров и админки
- `images/` — логотип и общие изображения
- `product-images/` — фото товаров
- `netlify/functions/order.js` — серверная функция отправки заказа
- `netlify/functions/admin-auth.js` — серверная функция проверки пароля админки
- `netlify.toml` — конфигурация Netlify
- `.env.example` — шаблон переменных окружения
- `NETLIFY-CHECKLIST.md` — пошаговый деплой на Netlify

## Что умеет сайт

- Показывает каталог товаров
- Открывает модальное окно товара с галереей фото
- Добавляет товары в корзину с анимацией
- Сохраняет адрес и контакт покупателя
- Проверяет минимальную сумму заказа 500 ₽
- Даёт редактировать каталог через админ-панель
- Позволяет удалять товары
- Ведёт локальный CSV-отчёт

## Где редактировать товары

Демо-товары находятся в `script.js` в массиве `defaultProducts`.

У каждого товара есть поля:

- `name`
- `category`
- `categoryLabel`
- `subcategory`
- `subcategoryLabel`
- `price`
- `stock`
- `description`
- `image`
- `gallery`

Пример:

```js
{
  id: crypto.randomUUID(),
  name: "VapeTrip Mini Air",
  category: "pod-systems",
  categoryLabel: "Под-системы",
  subcategory: "under-50",
  subcategoryLabel: "до 50 ватт",
  price: 2390,
  stock: 12,
  description: "Описание товара",
  image: "product-images/pod-mini.svg",
  gallery: [
    "product-images/pod-mini.svg",
    "product-images/pod-plus.svg"
  ]
}
```

## Как добавлять фото товара

### Основное фото

Указывается в поле:

```js
image: "product-images/my-product.jpg"
```

### Дополнительные фото в карточке товара

Указываются в массиве:

```js
gallery: [
  "product-images/my-product-1.jpg",
  "product-images/my-product-2.jpg",
  "product-images/my-product-3.jpg"
]
```

Когда пользователь нажимает на товар, изображения из `gallery` показываются в модальном окне.

## Как добавить новый товар через админку

В админ-панели можно:

- указать название
- указать категорию
- указать подкатегорию
- указать цену
- указать остаток
- указать путь к основному фото
- указать дополнительные фото через запятую
- указать описание

Пример для поля дополнительных фото:

```text
product-images/item-1.jpg, product-images/item-2.jpg, product-images/item-3.jpg
```

## Как работает админка

Админ-панель открывается через кнопку `Служебный доступ`.

Внутри можно:

- менять цену
- менять остаток
- менять описание
- добавлять товар
- удалять товар
- выгружать CSV-отчёт

## Хранение данных

Сайт хранит локальные данные в `localStorage`:

- товары
- корзину
- тему
- адрес
- контакт
- отчёты

## Telegram и Google Sheets

В продакшене отправка идёт через Netlify Functions, а не напрямую из браузера.

Используются переменные окружения:

- `ADMIN_PANEL_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_CUSTOM_MESSAGE`
- `GOOGLE_APPS_SCRIPT_URL`

Смотри:

- `.env.example`
- `NETLIFY-CHECKLIST.md`

## Деплой на Netlify

Коротко:

1. Загрузи проект в GitHub.
2. Подключи репозиторий в Netlify.
3. Добавь Environment Variables.
4. Сделай deploy.

Подробно:

- смотри `NETLIFY-CHECKLIST.md`

## Важно по безопасности

- Не храни реальные токены в `script.js`
- Не коммить реальные секреты в GitHub
- Если Telegram токен уже попадал в код, перевыпусти его через `@BotFather`

## Локальный запуск

Если нужен локальный запуск через Netlify Dev:

```bash
npm install -g netlify-cli
netlify dev
```

Или просто открой `index.html`, если не тестируешь серверные функции.
