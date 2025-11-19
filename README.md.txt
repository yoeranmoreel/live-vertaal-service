# 🌍 Live Vertaal Service

Real-time vertaling voor oudercontacten - overbruggen van taalbarrières in het onderwijs.

## 📋 Overzicht

Live Vertaal Service maakt het mogelijk voor leerkrachten om oudercontacten te voeren waarbij ouders die geen Nederlands spreken real-time vertalingen ontvangen in hun eigen taal. De app ondersteunt 30+ talen met focus op de meest voorkomende migrantentalen in Nederland.

**Ontwikkeld door:** Yoeran Moreel  
**Voor:** Inclusief onderwijs en betere ouderbetrokkenheid

## ✨ Features

### Voor Leerkrachten:
- 🎤 **Spraakherkenning** - Automatische transcriptie van gesprekken
- 📊 **Live statistieken** - Zie hoeveel ouders aanwezig zijn en welke talen gekozen zijn
- 📱 **QR-code** - Eenvoudig delen van sessies
- 📄 **Automatische PDF** - Download transcript na afloop
- 🔒 **AVG-vriendelijk** - Geen persoonlijke data opgeslagen

### Voor Ouders:
- 🌐 **30+ talen** - Kies uit Nederlands, Engels, Arabisch, Pools, Bulgaars, Roemeens, Turks, Oekraïens en meer
- ⚡ **Real-time vertaling** - Onmiddellijke vertaling terwijl leerkracht spreekt
- 🔊 **Text-to-speech** - Hoor de vertaling uitgesproken
- 📥 **PDF download** - Download gesprek in eigen taal
- 🚫 **Geen registratie** - Direct deelnemen met sessiecode

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **UI:** Tailwind CSS + Shadcn/UI
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Vertaling:** Google Translate API (gratis 500k karakters/maand)
- **Spraak:** Web Speech API (Chrome/Edge/Safari)
- **PWA:** Installeerbaar op telefoon en Chromebook

## 🚀 Installatie

### 1. Clone de repository
```bash
git clone https://github.com/jouw-username/live-vertaal-service.git
cd live-vertaal-service
```

### 2. Installeer dependencies
```bash
npm install
```

### 3. Configureer environment variables
```bash
# Kopieer .env.example naar .env
cp .env.example .env

# Vul je Google Apps Script URL in
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### 4. Backend setup (Google Sheets + Apps Script)
Zie de complete guide in `docs/BACKEND_SETUP.md` voor:
- Google Sheets database aanmaken
- Apps Script API deployen
- API URL verkrijgen

### 5. Start development server
```bash
npm run dev
```

### 6. Build voor productie
```bash
npm run build
```

## 📱 Deployment naar GitHub Pages

### 1. Update vite.config.js
```javascript
export default defineConfig({
  base: '/live-vertaal-service/', // Vervang met je repo naam
  // ... rest van config
})
```

### 2. Deploy
```bash
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

### 3. GitHub Pages instellen
1. Ga naar Settings → Pages
2. Source: Deploy from branch
3. Branch: `gh-pages` → `/` (root)
4. Save

Je app is nu live op: `https://jouw-username.github.io/live-vertaal-service/`

## 🔧 Voor Collega's: Eigen Versie Maken

### Stap 1: Fork de repository
Klik op "Fork" rechtsboven in GitHub

### Stap 2: Maak je eigen Google Sheets backend
1. Ga naar [sheets.google.com](https://sheets.google.com)
2. Volg de backend setup guide (zie `docs/BACKEND_SETUP.md`)
3. Deploy je eigen Apps Script web app
4. Kopieer je eigen API URL

### Stap 3: Configureer je fork
```bash
# Clone je fork
git clone https://github.com/jouw-username/live-vertaal-service.git

# Maak .env file
cp .env.example .env

# Vul JOUW API URL in
VITE_API_URL=https://script.google.com/macros/s/JOUW_ID/exec
```

### Stap 4: Deploy
```bash
npm install
npm run build
# Deploy naar GitHub Pages (zie hierboven)
```

Nu heb je je eigen onafhankelijke versie! 🎉

## 📊 Privacy & AVG

Deze app is **volledig AVG-compliant**:
- ✅ Geen persoonlijke gegevens van ouders opgeslagen
- ✅ Alleen anonieme statistieken (taal + aantal)
- ✅ Sessie ID's verdwijnen na tab sluiten
- ✅ Leerkracht auth via localStorage (lokaal)
- ✅ Google Sheets data kan door school beheerd worden

## 🌍 Ondersteunde Talen

**Prioriteit (meest gebruikt in Rotterdam/Spijkenisse):**
- 🇳🇱 Nederlands
- 🇬🇧 Engels
- 🇸🇦 Arabisch (Marokko, Syrië, Irak)
- 🇵🇱 Pools
- 🇧🇬 Bulgaars
- 🇷🇴 Roemeens
- 🇹🇷 Turks
- 🇺🇦 Oekraïens

**Overige 20+ talen:**
Frans, Duits, Spaans, Italiaans, Portugees, Russisch, Chinees, Japans, Koreaans, Hindi, Urdu, Perzisch, Hebreeuws, Thai, Vietnamees, Indonesisch, Zweeds, Deens, Noors, Fins, Grieks, Tsjechisch, Hongaars, Servisch, Kroatisch

## 📖 Documentatie

- [Backend Setup Guide](docs/BACKEND_SETUP.md) - Complete setup instructies
- [API Reference](docs/API.md) - Apps Script API endpoints
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Veelvoorkomende problemen

## 🤝 Bijdragen

Verbeteringen en suggesties zijn welkom! Open een issue of pull request.

## 📄 Licentie

MIT License - Vrij te gebruiken voor onderwijsdoeleinden

## 👨‍💻 Contact

**Yoeran Moreel**  
Ontwikkeld met ❤️ voor inclusief onderwijs

---

**Let op:** Deze app gebruikt gratis Google services (Sheets + Translate API). Bij intensief gebruik kunnen kosten ontstaan. Monitor je gebruik via Google Cloud Console.