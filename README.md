# pierrelaub.de

Persönliche Website und Blog von Pierre Laub – gebaut mit Astro, Vue und Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build) 5.16+
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 3.4+
- **Interaktive Komponenten**: [Vue 3](https://vuejs.org) 3.5+
- **Content**: Markdown-basierte Blog-Artikel mit Content Collections
- **Deployment**: Static Site Generation (SSG)

## 📁 Projektstruktur

```text
/
├── public/               # Statische Assets (Bilder, Fonts, Uploads)
├── src/
│   ├── components/      # Astro & Vue Komponenten
│   │   └── pace-rechner/  # Triathlon Pace-Rechner App
│   ├── content/         # Content Collections
│   │   └── blog/        # Blog-Artikel (Markdown)
│   ├── layouts/         # Layout-Templates
│   ├── pages/           # Seiten & Routen
│   │   └── blog/        # Dynamische Blog-Routen
│   └── styles/          # Globale Styles
├── astro.config.mjs     # Astro-Konfiguration
└── tailwind.config.mjs  # Tailwind-Konfiguration
```

## 🛠️ Befehle

Alle Befehle werden im Projektverzeichnis ausgeführt:

| Befehl              | Aktion                                         |
| :------------------ | :--------------------------------------------- |
| `npm install`       | Installiert Abhängigkeiten                     |
| `npm run dev`       | Startet Dev-Server auf `localhost:4321`        |
| `npm run build`     | Baut die Produktions-Website nach `./dist/`    |
| `npm run preview`   | Vorschau des Production-Builds                 |
| `npm run astro ...` | Führt Astro CLI-Befehle aus                    |

## 🌟 Features

- **Blog**: Markdown-basierte Artikel zu Webentwicklung, Triathlon und mehr
- **Pace-Rechner**: Interaktive Vue-App zur Berechnung von Trainingsgeschwindigkeiten
- **Responsive Design**: Optimiert für alle Bildschirmgrößen
- **Dark Mode**: Theme-Umschaltung mit persistenter Speicherung
- **Performance**: Optimierte Bilder und statisches HTML für schnelle Ladezeiten

## 📝 Lizenz

© Pierre Laub – Alle Rechte vorbehalten.
