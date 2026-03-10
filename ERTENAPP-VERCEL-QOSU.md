# Ертенәппті ertenapp-2rav Vercel жобасына қосу

## 1-нұсқа: GitHub арқылы (ең оңай)

Егер **ertenapp-2rav** қазір бір GitHub репозиторийге қосылған болса:

1. Осы жобаның коды сол репозиторийда болуы керек. Яғни:
   - Бұл папкадағы кодты сол репоға push жасаңыз.
   - Немесе Vercel-де репоны осы жобаның репосына өзгертіңіз.

**Бұл папканы сол репоға жіберу (мысалы репо аты `ertenapp-2rav` болса):**

```bash
cd /Users/aqsuek/Documents/tomorrows-script

# Егер әлі remote қосылмаған болса (бірінші рет):
git remote add origin https://github.com/aqsuek/ertenapp-2rav.git

# Немесе егер репо аты басқа болса (мысалы tomorrows-script):
# git remote add origin https://github.com/aqsuek/tomorrows-script.git

git add .
git commit -m "ErtenApp code"
git push -u origin main
```

Push кейін Vercel өзі жаңа deploy жасайды — ертенәпп сол жобада шығады.

---

## 2-нұсқа: Vercel-ге басқа репоны қосу

Егер ertenapp-2rav қазір **басқа** репозиторийге қосылған болса, ал ертенәпп коды **басқа** репода (мысалы `tomorrows-script`) болса:

1. Vercel Dashboard → **ertenapp-2rav** жобасын ашыңыз.
2. **Settings** → **Git** бөліміне өтіңіз.
3. **Disconnect** басып, қазіргі репоны ажыратыңыз.
4. **Connect Git Repository** басып, ертенәпп коды тұрған репоны (мысалы `tomorrows-script`) таңдап қосыңыз.
5. Кейін сол репоның `main` тармағына push жасағанда ertenapp-2rav жаңартылады.

---

## 3-нұсқа: Vercel CLI арқылы осы папканы жобаға байлау

Бұл компьютердегі осы папканы тікелей **ertenapp-2rav** жобасына байлап, одан кейін `vercel --prod` деп deploy жасауға болады:

```bash
cd /Users/aqsuek/Documents/tomorrows-script
npx vercel link
```

Сұрақтар шыққанда:
- **Set up and deploy?** — Yes
- **Which scope?** — өз аккаунтыңызды таңдаңыз
- **Link to existing project?** — **Yes**
- **What’s the name of your existing project?** — `ertenapp-2rav` жазыңыз

Кейін production-ға шығару үшін:

```bash
npx vercel --prod
```

---

## 4. Екі репоға бір командамен жіберу (дайын скрипт)

Егер Vercel-де **ertenapp-2rav** жобасы `ertenapp-2rav` репосына қосылған болса, осы жобада екі remote орнатылды:
- `origin` → ertenapp
- `v2` → ertenapp-2rav

Терминалда мынаны орындаңыз (GitHub-қа кірген болуыңыз керек):

```bash
cd /Users/aqsuek/Documents/tomorrows-script
./push-both.sh
```

Немесе қолмен:
```bash
git push -u origin main
git push v2 main
```

---

## Қорытынды

| Қалай қосу керек | Іс-әрекет |
|-------------------|------------|
| Код сол репода | Осы папкадан `git push origin main` жасаңыз |
| Екі репоға | `./push-both.sh` немесе `git push origin main && git push v2 main` |
| Репо басқа | Vercel → Settings → Git → басқа репоны қосыңыз |
| Тікелей осы папкадан | `npx vercel link` → `ertenapp-2rav` таңдаңыз → `npx vercel --prod` |

Supabase қолдансаңыз, Vercel жобасында **Settings → Environment Variables** бөлімінде `NEXT_PUBLIC_SUPABASE_URL` және `NEXT_PUBLIC_SUPABASE_ANON_KEY` қосуды ұмытпаңыз.
