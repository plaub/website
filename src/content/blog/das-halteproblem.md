---
title: 'Das Halteproblem'
description: 'Das Halteproblem beschreibt ein Thema aus der theoretischen Informatik. Es geht dabei um die Frage, ob es einen Algorithmus gibt, der für einen beliebigen Algor'
pubDate: 2015-10-06
categories: ["Studium","Theoretische Informatik"]
author: 'Pierre'
---

Das Halteproblem beschreibt ein Thema aus der theoretischen Informatik. Es geht dabei um die Frage, ob es einen Algorithmus gibt, der für einen beliebigen Algorithmus mit einer beliebigen Eingabe, entscheidet, ob er zu einem Ende kommt, oder nicht. Anders ausgedrückt: Gibt es ein Programm, das als Eingabe ein anderes Programm + Eingabe erhält und als Ausgabe liefert, ob das Programm hält oder nicht. Noch anders ausgedrückt: Falls das Halteproblem entscheidbar ist, gibt es eine Turingmaschine, die für jede Turingmaschine auf der Welt und irgendeiner Eingabe, als Ausgabe 1 oder 0 für "hält" oder "hält nicht" liefert. Leider ist das Halteproblem nicht entscheidbar, den Beweis dafür versuche ich gleich verständlich rüberzubringen. Aus der Tatsache, dass es nicht entscheidbar ist, folgt eigentlich nur die Tatsache, dass es Probleme gibt, die ein Computer nicht lösen kann, egal wie schnell der Prozessor ist oder so. (Entscheidbar bedeutet so viel wie Berechenbar)

## Der Beweis

Der klassische Beweis für die Nicht-Entscheidbarkeit des Halteproblems, ist ein Beweis durch Widerspruch. Wer die mathematisch korrekte Version sehen will muss sich ein Buch oder Wikipedia vornehmen, ich versuche es einfacher aber auch halbwegs richtig zu erklären.

1.  Wir nehmen einfach mal an, das Halteproblem sei entscheidbar.
2.  Dann gäbe es also eine Turingmaschine M die als Eingabe P und E erhält. Als Ausgabe liefert sie immer das richtige Ergebnis (ja oder nein)
3.  Um M zu überprüfen bauen wir eine weitere Turingmaschine M' die als Eingabe U erhält. Dann ruft sie M mit der Eingabe U, U auf. Wenn M ja liefert, geht M' in eine Endlosschleife. Wenn M nein liefert, liefert M' ja als Ergebnis.
4.  M' wird nun mit M' als Eingabe gestartet. M entscheidet im ersten Schritt ob M' mit M' hält. Falls ja -> Endlosschleife, falls nein -> Hält M'

Und da ist auch der Wiederspruch. M sagt, M' hält, geht aber in die Endlosschleife danach, also hält M' ja doch nicht. Klingt komisch, ist aber so. Als Pseudocode sieht es etwa so aus: `M' ( U ) { wenn M(U, U) = ja dann Endlosschleife sonst return Ja }` Und hier noch ein schönes Bild:     [![halteproblem](/uploads/2015/10/halteproblem.jpg)](/uploads/2015/10/halteproblem.jpg)

Da man nun ein Problem hat, von dem man weiß, dass es nicht entscheidbar ist, kann man damit für andere Probleme zeigen ob sie entscheidbar sind. Z.B. Mit Reduktion, mehr dazu vielleicht in einem weiteren Beitrag.

### Weiter führende Links bzw. Quellen:

[http://www.herr-rau.de/wordpress/2013/04/das-halteproblem.htm](http://www.herr-rau.de/wordpress/2013/04/das-halteproblem.htm) [http://youtu.be/92WHN-pAFCs](http://youtu.be/92WHN-pAFCs),