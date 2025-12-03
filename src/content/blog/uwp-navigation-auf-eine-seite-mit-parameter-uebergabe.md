---
title: 'UWP - Navigation auf eine Seite mit Parameter Übergabe'
description: 'Wenn man in einer Universal Windows Plattform App zu einer anderen Seite Navigieren will oder diese in einem Frame laden will, wie ich in diesem Beispiel zeige,'
pubDate: 2015-10-10
categories: ["Apps","Programmierung","UWP"]
author: 'Pierre'
---

Wenn man in einer Universal Windows Plattform App zu einer anderen Seite Navigieren will oder diese in einem Frame laden will, wie ich in diesem Beispiel zeige, möchte man meistens irgendwelche Parameter mitgeben.

`Object[] parameters = new Object[2];   parameters[0] = frame;   parameters[1] = "Irgend ein String";   frame.Navigate(typeof(App_Pages.Search), parameters);`

Hier wird an die Seite Search.xaml ein Objekt Array mit dem Frame "frame", in dem auch navigiert wird, und einem String für die Suche, übergeben.

Um die Parameter wieder auszulesen, überschreibt man die Methode OnNavigatedTo auf der entsprechenden Seite.

`protected override void OnNavigatedTo(NavigationEventArgs e)   {   Object[] passedParameter = e.Parameter as Object[];   Frame mainFrame = passedParameter[0] as Frame;   String s = passedParameter[1] as String;   }`

,