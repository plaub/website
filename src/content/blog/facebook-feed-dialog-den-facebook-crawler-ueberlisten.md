---
title: 'Facebook Feed-Dialog - Den Facebook-Crawler überlisten'
description: 'Seit dem 17.07.2017 hat Facebook den Feed-Dialog um einige Parameter beraubt. Somit ist es nun nicht mehr möglich, ein `picture`, `name` oder `description` als '
pubDate: 2017-07-28
categories: ["Programmierung","Web"]
author: 'Pierre'
---

Seit dem 17.07.2017 hat Facebook den Feed-Dialog um einige Parameter beraubt. Somit ist es nun nicht mehr möglich, ein `picture`, `name` oder `description` als Parameter mitzugeben, welche dann in dem Facebook Post angezeigt werden. Stattdessen nimmt sich der Facebook-Crawler die Informationen von der Seite, welche man Teilen möchte. Macht ja auch Sinn soweit, denn somit stellt Facebook sicher, dass man auch das bekommt, was man erwartet wenn man auf einen Link klickt, der durch ein Bild, Titel und Beschreibung, einen Inhalt vermuten lässt. \[caption id="attachment\_776" align="alignnone" width="1404"\]![](/uploads/2017/07/Screen-Shot-2017-07-28-at-10.55.28.png "Screenshot: https://developers.facebook.com/docs/sharing/reference/feed-dialog") Screenshot: https://developers.facebook.com/docs/sharing/reference/feed-dialog\[/caption\]

## Beispiel

Man entwickelt eine Webanwendung, z.B. ein Online-Quiz und möchte dem Benutzer die Möglichkeit geben, sein Ergebnis zu teilen. Kein Problem bisher. Einfach das Ergebnisbild, Ergebnis usw. als Url-Parameter an den Feed-Dialog übergeben und fertig. Einen Link zu der Seite, auf der sich das Quiz befindet konnte man auch mitschicken. Nun kann man nur noch einen Link mitschicken, wie bereits erwähnt. Also passiert folgendes: alle Infos werden von der Seite genommen, auf der das Quiz eingebunden ist, Titel, Beschreibung, Bild usw. In der Developer Dokumentation findet man leider keine Lösung.

## Den Facebook-Crawler überlisten

Um mit dem Feed-Dialog trotzdem teilen zu können, was man möchte, muss man einen kleinen Umweg einbauen. Zunächst benötigt man auf dem eigenen Server eine Seite, an die man die gewohnten Parameter wie z.B. die Image-Url oder Titel übergeben kann. Unabhängig von der Programmiersprache, in diesem Fall PHP, muss man Serverseitig ein Paar Meta-Tags für den Facebook-Crawler setzen:

 
 
 
 

Des weiteren benötigt man ein kleines JavaScript, welches die Weiterleitung zum eigentlichen Link durchführt:

  window.parent.location.href = "<?php print $\_REQUEST\['shareUrl'\] ?>";

Nun kann man den Feed-Dialog mit der Url der erstellten Seite und den Parametern die im Code verwendet werden als `link` parameter aufrufen. Der Crawler landet auf der eigenen Seite, liest im head als erstes die Parameter aus und verwendet diese. JavaScript führt er nicht aus, deswegen ist die Weiterleitung für den Crawler egal. Wird der Inhalt nun auf Facebook geteilt, gelangen die Facebooknutzer natürlich zuerst auf der eigenen Seite. Dort wird dann aber sofort der JavaScript Code vom Browser ausgeführt und man landet dort, von wo aus das Quiz Ergebnis ursprünglich geteilt wurde :)  ,