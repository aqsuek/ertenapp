# Vercel мен GitHub қалай қосу керек

## 1. GitHub-та репозиторий бар екенін тексеріңіз

Жобаңыз GitHub-та болуы керек. Егер әлі жібермеген болсаңыз:

```bash
git remote add origin https://github.com/USERNAME/tomorrows-script.git
git push -u origin main
```

(USERNAME орнына өз GitHub логиніңізді жазыңыз.)

---

## 2. Vercel-ге кіру

1. [vercel.com](https://vercel.com) сайтына өтіңіз
2. **Sign Up** немесе **Log In** басыңыз
3. **Continue with GitHub** таңдаңыз — GitHub аккаунтыңызбен кіріңіз

---

## 3. Жаңа жоба қосу (Import)

1. Vercel dashboard-та **Add New…** → **Project** басыңыз
2. **Import Git Repository** бөлімінде GitHub репозиторийлеріңіз тізімі шығады
3. **tomorrows-script** репозиторийін тауып **Import** басыңыз

Егер репозиторий көрінбесе:
- **Adjust GitHub App Permissions** басып, Vercel-ге репозиторийлерге қол жеткізу рұқсатын беріңіз

---

## 4. Build настройкалары

Next.js жобасы үшін Vercel әдетте автоматты таниды:

- **Framework Preset:** Next.js
- **Build Command:** `next build` (әдепкі)
- **Output Directory:** `.next` (әдепкі)
- **Install Command:** `npm install` (әдепкі)

Өзгерту қажет болмаса **Deploy** басыңыз.

---

## 5. Deploy

**Deploy** басқаннан кейін Vercel:

- кодты GitHub-тан алады
- `npm install` және `next build` орындайды
- сайтты интернетке шығарады

Әр `main` (немесе таңдаған branch) тармағына push жасағанда жаңа deploy автоматты іске қосылады.

---

## Қысқаша

| Қадам | Іс-әрекет |
|--------|------------|
| 1 | GitHub-та репо бар екенін тексеру |
| 2 | vercel.com → Continue with GitHub |
| 3 | Add New → Project → tomorrows-script → Import |
| 4 | Deploy басу |

Сұрақ болса жазыңыз.
