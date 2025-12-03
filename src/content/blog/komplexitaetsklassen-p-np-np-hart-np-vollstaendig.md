---
title: 'Komplexitätsklassen - P, NP, NP-hart, NP-vollständig'
description: 'In der theoretischen Informatik kann man Probleme in Komplexitätsklassen aufteilen. Da man in der Vorlesung nur P, NP, NP-hart und NP-vollständig kennen lernt, '
pubDate: 2015-10-10
categories: ["Studium","Theoretische Informatik"]
author: 'Pierre'
---

In der theoretischen Informatik kann man Probleme in Komplexitätsklassen aufteilen. Da man in der Vorlesung nur P, NP, NP-hart und NP-vollständig kennen lernt, beschränke ich diesen Beitrag auch auf diese Klassen. Hier findet man eine Übersicht über die weiteren Klassen [Link](https://de.wikipedia.org/wiki/Liste_von_Komplexitätsklassen). Für den Anfang reichen diese jedoch ;)

## Einleitung

Probleme sind in diesem Fall Aufgaben, die ein Rechner löschen kann, z.B. Berechnungen. Die meisten Berechnungen hat ein moderner Rechner in Millisekunden erledigt. Es gibt jedoch auch Probleme die tatsächlich niemals von einem Computer gelöst werden können, z.B. [das Halteproblem](https://pierre.run/2015/10/das-halteproblem/). Dann gibt es Probleme die so schwierig werden, dass ein normaler Rechner sie niemals in annehmbarer Zeit lösen kann. Zum Lösen eines Problems benutzt man die Turingmaschine bzw. entwirft einen Algorithmus der es lösen kann. Wenn man eine Turingmaschine bauen kann, ist das Problem schon mal lösbar auf jeden Fall.

## P

Zur Komplexitätsklasse P gehören alle Probleme die in **p**olynomieller Zeit lösbar sind. Kann man eine Deterministische Turingmaschine bauen die das Problem löst, ist es also in P. Eine Deterministische TM kann alles was ein moderner Rechner auch kann.

![Komplexitätsklasse NP](/uploads/2015/10/p-e1444466499466.jpg)

Komplexitätsklasse P

## NP

Zur Komplexitätsklasse NP gehören alle Probleme aus P plus weitere Probleme die nicht in polynomieller Zeit zu lösen sind. NP Probleme kann man nur mit einer Nichtdeterministischen Turingmaschine in annehmbarer Zeit lösen. Eine Nichtdeterministische Turingmaschine "rät" eine mögliche Lösung für das Problem und zum Überprüfen der Lösung benötigt man nur noch polynomiellen Zeitaufwand. Da ein Computer nur deterministisch arbeiten kann und eine Turingmaschine nur theoretisch existiert hat man nicht viel gewonnen. Es ist jedoch noch nicht bewiesen, dass P ≠ NP gilt. Das bedeutet, es könnte sein dass man einen Algorithmus für ein NP Problem schreiben kann, was aber noch keiner geschafft hat.

[![Komplexitätsklasse NP](/uploads/2015/10/np-e1444466567843.jpg)](/uploads/2015/10/np-e1444466567843.jpg)

Komplexitätsklasse NP

## NP-hart

Ein Problem das NP-hart ist, entweder so schwer, dass man es garnicht lösen kann oder es ist eines der schwierigsten Probleme in NP.  Wenn es in NP liegt, bedeutet das, dass man alle anderen Probleme aus NP in polynomieller Zeit auf das NP-harte Problem reduzieren kann. Beispiel: das Halteproblem ist NP-hart, da man es garnicht lösen kann. Es liegt also außerhalb von NP.

[![Komplexitätsklasse NP-hart](/uploads/2015/10/np-hart-e1444466697851.jpg)](/uploads/2015/10/np-hart-e1444466697851.jpg)

Komplexitätsklasse NP-hart

# NP-vollständig

Ein NP-hartes Problem, dass zusätzlich in NP liegt, wird NP-vollständig genannt. Wie schon erwähnt ist lassen sich alle anderen Probleme darauf reduzieren. Beispiel dafür ist SAT (Erfüllbarkeitsproblem)

[![Komplexitätsklasse NP-vollständig](/uploads/2015/10/np-voll-e1444466744990.jpg)](/uploads/2015/10/np-voll-e1444466744990.jpg)

Komplexitätsklasse NP-vollständig

,