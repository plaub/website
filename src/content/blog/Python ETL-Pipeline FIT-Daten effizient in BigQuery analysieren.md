---
title: "Python ETL-Pipeline: FIT-Daten effizient in BigQuery analysieren"
description: "Erfahre, wie du mit einer Python ETL-Pipeline deine FIT-Sportdaten effizient in Google BigQuery lädst und analysierst."
date: 2025-12-06
categories: ["Data Analytics", "Google Cloud", "Python"]
author: "Pierre"
pubDate: 2025-12-06
---

# Python ETL-Pipeline: FIT-Daten effizient in BigQuery analysieren
## Die Herausforderung: Vom Datenfriedhof zum Data Warehouse
Wer regelmäßig Sport treibt und verschiedene Geräte nutzt (Garmin, Wahoo, Zwift), kennt das Problem: Die Daten liegen verstreut in proprietären Clouds oder lokal als undurchsichtige `.fit`-Dateien herum. Für eine echte Langzeitanalyse – abseits der Standard-Dashboards der Hersteller – ist eine zentrale, SQL-fähige Datenbank unerlässlich.
Mein Ziel war es, über 2.000 historische Dateien sowie neue Aktivitäten vollautomatisiert in **Google BigQuery** zu laden, ohne dabei die Grenzen des **Google Cloud Free Tiers** zu sprengen oder Daten-Duplikate zu erzeugen.
## Die Architektur
Die Lösung basiert auf einer Python-ETL-Pipeline, die speziell auf Robustheit und Kosteneffizienz im Cloud-Umfeld optimiert wurde. Die Kernpunkte der Architektur sind Idempotenz, Datenbank-Optimierung und automatisiertes Error-Handling.
### 1. Datenintegrität durch Idempotenz
Die größte technische Hürde bei File-basierten Pipelines ist die **Idempotenz**: Das System muss beliebig oft ausgeführt werden können, ohne das Ergebnis zu verfälschen (z.B. durch doppelte Einträge bei Neustarts).
Meine Python-Lösung löst dies durch **SHA-256 Hashing**:
*   **Rekursive Extraktion:** Das Skript scannt den Input-Ordner und entpackt automatisch verschachtelte Archive (`.zip`, `.tar`, `.gz`).
*   **Hash-Check:** Jede FIT-Datei wird gehasht. Dieser Hash wird gegen die Datenbank geprüft. Existiert er bereits, wird die Datei übersprungen ("Short-Circuiting").
*   **Transaktionale Verarbeitung:** Erst wenn alle Datenpunkte erfolgreich geparsed und validiert sind, erfolgt der Upload.
Dies garantiert absolute Datenkonsistenz, selbst wenn ein Batch-Lauf mitten in der Verarbeitung abbricht.
### 2. Der ETL-Prozess im Detail
Die Pipeline folgt einem klassischen Extract-Transform-Load Ansatz:
1.  **Extract:** Ein Wrapper um die `fitparse`-Bibliothek extrahiert Rohdaten.
2.  **Transform:**
    *   Konvertierung von GPS-Koordinaten (Semicircles in Decimal Degrees).
    *   Normalisierung von Zeitstempeln.
    *   Trennung in `Sessions` (Metadaten) und `Details` (Zeitreihen).
3.  **Load:** Upload via Google BigQuery Client Library.
4.  **Archive:** Erfolgreich verarbeitete Dateien wandern automatisch in `processed/`, fehlerhafte in `failed/`.
### 3. BigQuery Optimierung für Performance & Kosten
Bei Millionen von Datenpunkten (jede Sekunde Training erzeugt einen Datensatz mit GPS, Herzfrequenz, Watt etc.) sind „Full Table Scans“ teuer und langsam. Das BigQuery-Schema wurde daher gezielt optimiert:
*   **Partitionierung nach Zeit:** Die Tabellen sind nach dem `TIMESTAMP` partitioniert. Abfragen, die z.B. nur das Jahr 2024 betreffen, scannen physikalisch nur die relevanten Partitionen.
*   **Clustering:** Innerhalb der Partitionen sind die Daten nach `Manufacturer` und `Sport` sortiert. Filter wie `WHERE Sport = 'Cycling'` greifen so extrem schnell, da BigQuery irrelevante Blöcke überspringen kann.
**Datenmodell:**
*   **Sessions-Tabelle:** Eine Zeile pro Training (Dauer, Avg Power, TSS, Kalorien).
*   **Details-Tabelle:** Millionen Zeilen für Sekunde-für-Sekunde Analysen (GPS, Herzfrequenz, Watt, Höhe).
## Fazit
Dieses Projekt zeigt, wie man mit einer sauber strukturierten Python-Architektur auch große Mengen an Binärdaten effizient verarbeiten kann. Der Schlüssel liegt in der intelligenten Vorverarbeitung (Hashing zur Duplikatvermeidung) und der Nutzung nativer Cloud-Features (Partitionierung), um das System performant und im Free Tier kostenneutral zu halten.
Der Source Code ist modular aufgebaut und lässt sich leicht auf andere Datenformate oder Ziele anpassen. Den vollständigen Code findest du auf GitHub: <a href="https://github.com/plaub/FIT-to-BigQuery-ETL" target="_blank">FIT-to-BigQuery-ETL</a>.