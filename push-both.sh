#!/bin/bash
# Ертенәппті ertenapp және ertenapp-2rav реполарына жібереді (Vercel екеуін де қарайды)
set -e
cd "$(dirname "$0")"
echo "→ origin (ertenapp) жіберілуде..."
git push -u origin main
echo "→ v2 (ertenapp-2rav) жіберілуде..."
git push v2 main
echo "Дайын. Vercel жаңа deploy жасайды."
