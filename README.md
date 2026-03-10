# ErtenApp

Ертеңгі жоспарлар мен оқиғаларды басқаруға арналған кинематографиялық, қараңғы стильдегі жеке жоспарлаушы.

## Как открыть приложение

### 1. Установите зависимости

В терминале (Terminal, iTerm или встроенный в Cursor) перейдите в папку проекта и выполните:

```bash
cd /Users/aqsuek/Documents/tomorrows-script
npm install
```

Если команда `npm` не найдена, установите [Node.js](https://nodejs.org/) (LTS).

### 2. Настройте Supabase (чтобы сохранялись задачи и фото)

1. Создайте проект на [supabase.com](https://supabase.com).
2. В разделе **SQL Editor** выполните содержимое файла `supabase/migrations/001_initial.sql`.
3. Скопируйте `.env.local.example` в `.env.local` и подставьте свои данные:

```
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-key
```

(URL и ключ берутся в настройках проекта Supabase → API.)

### 3. Запустите приложение

```bash
npm run dev
```

Откройте в браузере: **http://localhost:3000**

---

Без шага 2 приложение тоже запустится, но при первом заходе на страницу появится ошибка из-за отсутствия переменных Supabase. Создайте `.env.local` и перезапустите `npm run dev`.

---

## Деплой на Vercel

### 1. Подключите репозиторий (рекомендуется)

1. Залейте проект в [GitHub](https://github.com) (если ещё не залит).
2. Зайдите на [vercel.com](https://vercel.com), войдите через GitHub.
3. **Add New → Project**, выберите репозиторий `tomorrows-script`.
4. В настройках проекта добавьте переменные окружения:
   - `NEXT_PUBLIC_SUPABASE_URL` — URL вашего Supabase-проекта
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon (public) ключ из Supabase → Settings → API
5. Нажмите **Deploy**. После сборки приложение откроется по ссылке вида `https://ваш-проект.vercel.app`.

### 2. Деплой через Vercel CLI

```bash
npm i -g vercel
cd /Users/aqsuek/Documents/tomorrows-script
vercel
```

При первом запуске войдите в аккаунт и укажите проект. Затем в [Vercel Dashboard](https://vercel.com/dashboard) → проект → **Settings → Environment Variables** добавьте `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
