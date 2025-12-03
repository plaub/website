---
title: "Von WordPress zu Astro – Warum und wie ich meine Seite migriert habe"
description: "Ein persönlicher Erfahrungsbericht über meinen Wechsel von WordPress zu Astro – inklusive Blog-Migration."
date: 2025-12-03
categories:
  ["Astro", "Webentwicklung", "Performance", "JavaScript", "Migration"]
author: "Pierre"
pubDate: 2025-12-03
---

## 🚀 Von WordPress zu Astro – Warum und wie ich meine Seite migriert habe

Die letzten Jahre lief meine persönliche Website auf einem **WordPress-Stack** mit LAMP-Architektur (Linux, Apache, MySQL, PHP). Die Wahl erschien zunächst logisch: etabliertes CMS, umfangreiches Plugin-Ökosystem, große Community. Doch mit der Zeit offenbarten sich fundamentale architektonische Nachteile:

- **Performance-Overhead** durch serverseitiges Rendering bei jedem Request
- **Datenbank-Bottleneck** bei jeder Page-Load
- **Developer Experience** aufwändig moderne Frontend-Technologien zu integrieren

Die Lösung: Migration zu einem **modernen Static Site Generator** mit **Astro**.

---

### 💡 Warum Astro?

Astro ist ein moderner Static Site Generator, der auf dem Konzept der **Partial Hydration** basiert:
**Ship less JavaScript to the client.**

Im Gegensatz zu klassischen SPAs (React, Vue) oder Server-Side-Rendered-Frameworks wird der Output als statisches HTML generiert. JavaScript wird nur dort geladen, wo es tatsächlich benötigt wird – durch **Islands Architecture**.

#### Technische Vorteile:

- ⚡️ **Zero JavaScript by default** – HTML/CSS first approach
- 🏗️ **Islands Architecture** – komponentenbasierte Hydration on-demand
- 📦 **Framework-agnostic** – React, Vue, Svelte, Solid parallel nutzbar
- � **Vite-powered** – HMR (Hot Module Replacement) und optimierte Build-Pipeline
- 📊 **Content Collections API** – typsicheres Content Management mit Zod-Schema-Validierung
- 🌐 **SSG + SSR Hybrid** – statische Generation kombinierbar mit Server-Side-Rendering
- 🎯 **Optimierte Bundle-Sizes** – automatisches Code-Splitting und Tree-Shaking

#### Performance-Metriken:

```
WordPress (mit Caching):
- First Contentful Paint: ~1.2s
- Time to Interactive: ~3.5s
- Total Bundle Size: ~450KB

Astro (Static):
- First Contentful Paint: ~0.3s
- Time to Interactive: ~0.4s
- Total Bundle Size: ~12KB
```

Die Zahlen sprechen für sich.

---

### 🔁 Migration: Blogposts & Medien

Die Migration erforderte einen strukturierten Data-Pipeline-Ansatz zur Extraktion und Transformation der WordPress-Daten.

#### Content-Migration

WordPress exportiert Inhalte im **WordPress eXtended RSS (WXR)** Format – eine XML-Struktur mit proprietären Namespaces. Der Migrationsprozess:

1. **Export & Parsing**

   ```bash
   # WordPress XML Export
   wp export --dir=./export --user=admin

   # XML zu JSON Transformation
   xmlstarlet sel -t -m "//item" \
     -v "title" -o "|" \
     -v "pubDate" -o "|" \
     -v "content:encoded" \
     export.xml > posts.csv
   ```

2. **Content Transformation**

   - WordPress HTML → Markdown via `turndown.js`
   - Shortcodes extrahieren und in Astro-Komponenten konvertieren
   - Frontmatter-Schema mit Zod validieren:

   ```typescript
   const blogSchema = z.object({
     title: z.string(),
     description: z.string(),
     pubDate: z.date(),
     categories: z.array(z.string()),
     author: z.string(),
   });
   ```

3. **Asset-Rewriting**
   - Image-URLs von WordPress-Struktur (`/wp-content/uploads/YYYY/MM/`)
   - Nach Astro-Struktur (`/public/uploads/YYYY/MM/`)
   - Regex-basiertes URL-Rewriting im Markdown-Content

#### Media-Pipeline

Assets wurden durch einen automatisierten Download-Prozess migriert:

```javascript
// Pseudo-Code: Asset Migration Script
const downloadAssets = async (posts) => {
  for (const post of posts) {
    const imageUrls = extractImageUrls(post.content);
    for (const url of imageUrls) {
      const localPath = transformToLocalPath(url);
      await downloadFile(url, `./public${localPath}`);
      post.content = post.content.replace(url, localPath);
    }
  }
};
```

**Ergebnis:**

- Blog-Posts erfolgreich migriert
- ~500 Assets (Images, PDFs) strukturiert in `public/uploads/`
- Saubere Git-Historie durch atomic commits pro Post

---

### 🧱 Architektur der neuen Seite

Die Astro-Anwendung folgt einem **File-based Routing** Pattern mit klarer Separation of Concerns:

```
src/
├── pages/              # File-based Routing (SSG)
│   ├── index.astro     # Homepage
│   ├── blog.astro      # Blog-Listing mit Pagination
│   └── blog/
│       └── [...slug].astro  # Dynamic Route für Posts
├── content/            # Content Collections (Type-safe)
│   ├── config.ts       # Zod-Schema Definitionen
│   └── blog/           # Markdown/MDX Posts
├── components/         # Wiederverwendbare UI-Komponenten
│   ├── Header.astro
│   ├── Footer.astro
│   └── BlogCard.astro
├── layouts/            # Layout-Templates
│   └── Layout.astro    # Base Layout mit SEO-Meta
└── styles/             # Global Styles (CSS)
    └── global.css
```

#### Content Collections API

Typsichere Content-Verwaltung durch Astro's Content Collections:

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    categories: z.array(z.string()),
    author: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

#### Dynamic Routing

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
```

**Build-Output:** Jeder Post wird zu einer statischen HTML-Datei pre-rendered.

---

### 🧠 Technischer Vergleich: WordPress vs. Astro

| Kategorie                | WordPress (LAMP)                               | Astro (SSG + CDN)                  |
| ------------------------ | ---------------------------------------------- | ---------------------------------- |
| **Architecture**         | Monolithic CMS (PHP + MySQL)                   | JAMstack (Static + Optional API)   |
| **Rendering**            | Server-Side bei jedem Request                  | Pre-rendered at Build-Time         |
| **Performance**          | ⚠️ Abhängig von Caching-Strategie              | ⭐ Sub-100ms durch Edge-Caching    |
| **JavaScript Payload**   | ~450KB (Theme + Plugins)                       | ~12KB (nur wo nötig)               |
| **Time to Interactive**  | 2-4s (je nach Hosting)                         | ~0.4s (statisches HTML)            |
| **Wartung**              | Core-Updates, Plugin-Conflicts, DB-Maintenance | `npm update` + Git-basiert         |
| **Skalierung**           | Vertikal (besserer Server) + Caching           | Horizontal (globales CDN)          |
| **Developer Experience** | PHP-Templates, WordPress-APIs                  | Modern TypeScript, Component-based |
| **Content Workflow**     | Admin-Panel (DB-basiert)                       | Markdown + Git (Version Control)   |

#### Performance-Audit (Lighthouse Score)

```
WordPress (optimiert):
- Performance: 65-75
- Best Practices: 70-80
- SEO: 85-95

Astro (out-of-the-box):
- Performance: 98-100
- Best Practices: 100
- SEO: 100
```

**Ergebnis:** Die Architektur-Entscheidung für Astro führt zu signifikanten Verbesserungen in allen relevanten Metriken – ohne manuelles Performance-Tuning.

---

### � Technische Ressourcen

- [Astro Documentation](https://docs.astro.build)
- [Islands Architecture Pattern](https://jasonformat.com/islands-architecture/)
- [Content Collections API](https://docs.astro.build/en/guides/content-collections/)
- [Performance Best Practices](https://web.dev/vitals/)

📬 **Fragen zur Migration oder technische Details?**  
Gerne via [GitHub](https://github.com/plaub) oder LinkedIn.

**Ship fast. Ship static.** ⚡�
