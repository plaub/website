---
title: 'Exception Handling (Ausnahmebehandlung) - Eine Einführung'
description: 'In diesem Beitrag gehe ich auf das Thema Exception Handling (Ausnahmebehandlung) ein. Ohne speziell auf eine bestimmte Programmiersprache einzugehen, versuche i'
pubDate: 2014-09-05
categories: ["Programmierung","Web"]
author: 'Pierre'
---

In diesem Beitrag gehe ich auf das Thema Exception Handling (Ausnahmebehandlung) ein. Ohne speziell auf eine bestimmte Programmiersprache einzugehen, versuche ich allgemein zu erklären was sich hinter dem Begriff verbirgt und wie man es am besten anwendet.

## Bedeutung

Wie der Name schon sagt, behandelt man eine Ausnahme bzw. einen Fehler. Dabei geht es nicht um Fehler die der Compiler schon erkennt, sondern um Fehler die eventuell erst zur Laufzeit auftreten, die man aber vorhersehen und somit auch behandeln kann. Mögliche Fehler sind z.B.:

-   Division durch 0
-   Bereichüberschreitung / -unterschreitung
-   Ungültige Adresse
-   Verbindungsfehler

Man hat also die Möglichkeit, bei einem auftretenden Fehler, einen Programmteil auszuführen, der den Fehler behebt oder an eine aufrufende Stelle weiterreicht. Beispiel: Der Benutzer wird zur Eingabe von 2 Zahlen aufgefordert (Programmteil: Eingabe). Danach wird in einer Methode Zahl a durch Zahl b dividiert (Programmteil: Verarbeitung). Bei erfolgreicher Division wird das Ergebnis zurückgegeben. Wenn Zahl b = 0 ist, gibt es einen Fehler, welcher direkt in der Methode behandelt werden kann, z.B. durch eine Fehlermeldung auf dem Bildschirm oder zurückgegeben werden kann, so dass er bei der Eingabe behandelt werden kann, z.B. durch eine erneute Aufforderung an den Benutzer eine gültige Zahl einzugeben.

## Anwendung

Das behandeln von Fehlern in einem Programm ist nicht besonders schwierig. Hier sieht man das Grundgerüst: try { ANWEISUNGSBLOCK } catch (AUSNAHME) { ANWEISUNGSBLOCK }

-   Try-Block: Hier kommt der normale Code rein, den man auch sonst schreiben würde. In dem Try-Block wird einfach versucht, das Programm so auszuführen wie es vorgesehen ist. Kommt es dann eventuell zu einem Fehler, wird dieser "geworfen". Ohne Try-Block würde das Programm wahrscheinlich abstürzen. Da wir aber nur mal versucht haben, den Code auszuführen, haben wir die Möglichkeit den Fehler irgendwo abzufangen und einen Programmabsturz zu verhindern. Try bedeutet also: Mach einfach mal, wenn was schlimmes passiert, überlegen wir uns was.
-   Catch-Block: Hier wird die Ausnahme behandelt. In den runden Klammern hinter "catch" steht die genaue Bezeichnung des Fehlers, z.B. DivisionDurchNullException. In dem Block kann man dann einen alternativen Anweisungsblock ausführen, den Fehler behandeln, eine Fehlermeldung ausgeben und das Programm beenden, oder was auch immer an dieser Stelle sinnvoll ist. Catch bedeutet also: Wenn ein bestimmter Fehler auftritt, wird hier beschlossen was damit gemacht wird. Es können auch mehrere Fehler abgefangen werden, durch mehrere Catch-Blöcke hintereinander. Man kann in EINEM einzigen Catch-Block auch ALLE Fehler abfangen die jemals auftreten können, was man aber nicht tun sollte, mehr dazu im nächsten Abschnitt.
-   Throw-Anweisung: Mit throw wirft man die Ausnahme bzw. Exception weiter. Der normale Programmablauf wird an dieser Stelle unterbrochen und die Exception wird an die aufrufende Programmstelle "geworfen", wo sie dann gecatcht werden könnte. Simples Beispiel: if ( b = 0 ) { throw new DivisionDurchNullException("Division durch 0"); } else {  return (a / b) ; }

## Best Practices

Die einfache Anwendung dieses mächtigen Werkzeuges erfordert trotzdem ein paar Kenntnisse und Erfahrung als Programmierer. Die Entscheidung, wann man einen Fehler wirft, abfängt oder alles selbst prüft, ist nicht immer ganz trivial. Ein Beispiel von Microsoft ([http://msdn.microsoft.com/en-us/library/seyhszts%28v=vs.110%29.aspx](http://msdn.microsoft.com/en-us/library/seyhszts%28v=vs.110%29.aspx)): Ohne Exception Handling:

if (conn.State != ConnectionState.Closed)
{
    conn.Close();
}

Mit Exception Handling:

try
{
    conn.Close();
}
catch (InvalidOperationException ex)
{
    Console.WriteLine(ex.GetType().FullName);
    Console.WriteLine(ex.Message);
}

Welche Methode benutzt man nun? Laut dem MSDN: Es kommt darauf an, wie oft man mit dem Fehler rechnet.

-   Mit Exception Handling: Man weiß, dass es selten zu dem Fehler kommt. Deshalb ist ein Try-Block sinvoller, es wird weniger Code ausgeführt und bei einer Ausnahme weiß man, dass ein schwerwiegender Fehler vorliegt.
-   Ohne Exception Handling: Man weiß, dass es an dieser Stelle sehr oft zu der Ausnahme kommt, deshalb prüft man von Hand, wodurch etwas mehr Code ausgeführt wird.

### Strukturierte Ausnahmebehandlung

Ein sauber strukturiertes Programm zu entwickeln, in dem man sich auch nach 2 Monaten noch zurechtfindet und erweiterbar bzw. wartbar ist, ist eine Kunst. Eine strukturierte Fehlerbehandlung ist ein Teil von einem guten Programm. Manchmal ist es an einer Stelle im Programm notwendig zu wissen, ob eine Methode erfolgreich ausgeführt wurde oder nicht. Man kann die Methode so entwickeln, dass sie einen Wert zurück gibt, der "Erfolg" oder "Kein Erfolg" anzeigt. Man kann aber auch in der Methode mittels Exception Handling einen Fehler bei "Kein Erfolg" werfen lassen. Somit muss man an der entsprechenden Stelle nicht prüfen was vorliegt, sondern nur den Fehler catchen, bei "Kein Erfolg". Ein weiterer Vorteil von Exception Handling gegenüber der "Rückgabewert Methode" ist, dass Exceptions nicht ignoriert werden können. Den Rückgabewert einer Methode kann man in einer Variablen speichern und vergessen. Eine geworfene Exception jedoch wird solange weiter geworfen, bis sie gecatcht wird oder am Startpunkt des Programmes ankommt und dort eventuell einen Absturz auslöst. Fehlerbehandlung fördert also die Stabilität des Programmes.

### Mehrere Fehler einfangen

Können mehrere Fehler auftreten, verwendet man mehrere Catch-Blöcke hintereinander. Jeder einzelne behandelt dann eine bestimmte Ausnahme. Bei der Reihenfolge muss man von "ganz speziell" zu "allgemein" vorgehen. Das bedeutet: als erstes fängt man den Fehler "DivisionDurchNullException", da dieser wohl am häufigsten vorkommt. Als nächstes fängt man z.B. den Fehler "FehlerhafteEingabeException", falls der Benutzer einen Buchstaben eingetippt hat. Danach fängt man "DivisionsFehlerException" ab, in der dann alle weiteren möglichen Fälle enthalten sind. Kurz gesagt: Die Catch Anweisung so genau wie möglich definieren und niemals die Mutter aller Exceptions ("Exception") abfangen, da diese alle erdenklichen Fehler beinhaltet. Man kann das Exception Handling Konzept auch missbrauchen, indem man z.B. throw zum weiterreichen eines Rückgabewertes benutzt, was man natürlich nicht tun sollte. Ich hoffe als Einführung in das Thema genügt dieser Beitrag erst mal. Wer tiefer einsteigen möchte findet hier weitere Informationen:

-   [http://msdn.microsoft.com/en-us/library/ms229014%28v=vs.110%29.aspx](http://msdn.microsoft.com/en-us/library/ms229014%28v=vs.110%29.aspx)
-   [http://de.wikipedia.org/wiki/Ausnahmebehandlung](http://de.wikipedia.org/wiki/Ausnahmebehandlung)
-   [http://www.javaworld.com/article/2075476/core-javaxceptional-practices--part-1/core-java/exceptional-practices--part-1.html](http://www.javaworld.com/article/2075476/core-javaxceptional-practices--part-1/core-java/exceptional-practices--part-1.html)

,