---
title: 'Einen Blog als Single Page Web App mit AngularJS und WordPress Teil 1'
description: 'Single Page Web Apps sind moderne Webseiten, bei denen der Inhalt nicht, wie bei einer herkömmlichen Seite, durch einen Seitenwechsel dargestellt wird, sondern '
pubDate: 2015-02-24
categories: ["Apps","Programmierung","Web"]
author: 'Pierre'
---

Single Page Web Apps sind moderne Webseiten, bei denen der Inhalt nicht, wie bei einer herkömmlichen Seite, durch einen Seitenwechsel dargestellt wird, sondern dynamisch geladen und an der entsprechenden Stelle durch HTML Templates eingebunden wird. AngularJS ist ein Javascript Framework das sich hervorragend dafür eignet einen Blog, oder auch was anderes, als Web App zu programmieren. WordPress bietet durch Jetpack von Haus aus eine Schnittstelle von der man alle nötigen Daten abrufen kann. Ich nutze jedoch ein anderes Plugin ([JSON API](https://wordpress.org/plugins/json-api/)), da dieses umfangreicher ist. ![angularjs](/uploads/2015/02/angularjs.png) 

## Teil 1: Abrufen und anzeigen der Blogposts

Wir beginnen mit der index.html. Hier binden wir die nötigen Angular Dateien ein und starten unsere App. Das [ngApp](https://code.angularjs.org/1.3.8/docs/api/ng/directive/ngApp) Attribut im Body Element signalisiert Angular, dass ab hier die App initialisiert werden soll, der Wert "thisiswebBlog" ist der Name des Modules das wir in der app.js anlegen. [ngView](https://code.angularjs.org/1.3.8/docs/api/ngRoute/directive/ngView) definiert den Bereich in dem später die weiteren Templates geladen werden. **index.html** \[code lang="html"\]  Angular Wordpress Blog

\[/code\] Die Datei app.js muss in dem Ordner "js" erstellt werden. Dort wird zunächst unser Angular Modul "thisiswebBlog" mit den Abhängigkeiten [ngRoute](https://code.angularjs.org/1.3.8/docs/api/ngRoute), [ngSanitize](https://code.angularjs.org/1.3.8/docs/api/ngSanitize) und unseren eigenen Controllern "thisiswebBlogControllers" und "thisiswebBlogServices" erstellt. Danach werden die Routen konfiguriert. Das bedeutet, wir legen fest, welches Template und welcher Controler verwendet werden soll, wenn eine bestimmte URL aufgerufen wird. [Mehr dazu kann man hier nachlesen.](https://code.angularjs.org/1.3.8/docs/api/ngRoute/provider/$routeProvider) **app.js** \[code lang="js"\] 'use strict'; /\* App Module \*/ var thisiswebBlog = angular.module('thisiswebBlog', \[ 'ngRoute', 'ngSanitize', 'thisiswebBlogControllers', 'thisiswebBlogServices' \]); thisiswebBlog.config(\['$routeProvider', function($routeProvider) { $routeProvider. when('/blog', { templateUrl: 'partials/blog-list.html', controller: 'PostsListCtrl' }). otherwise({ redirectTo: '/blog' }); }\]); \[/code\] Als nächstes erstellen wir eine Service Factory in der Datei services.js die auch im Ordner "js" sein muss. Was das ist, kann man [hier](https://angularjs.de/buch/services) nachlesen. Wir geben der Factory den Namen "Posts", über den wir später darauf zugrifen können und eine Funktion mit dem [$http](https://code.angularjs.org/1.3.8/docs/api/ng/service/$http) Service als Parameter. In der Methode "getPosts" nutzen wir den $http Service, der für uns ein JSONP Objekt von der angegebenen url: 'http://thisisweb.de/wordpress/api/get\_posts/?callback=JSON\_CALLBACK&count=100' anfordert (Die letzten 100 Blogposts von dem Wordpress Blog, falls es so viele gibt.) **services.js** \[code lang="js"\] 'use strict'; /\* Services \*/ var thisiswebBlogServices = angular.module('thisiswebBlogServices', \[\]); thisiswebBlogServices.factory('Posts', function ($http) { var thisisweb = {}; thisisweb.getPosts = function() { return $http({ method: 'JSONP', url: 'http://thisisweb.de/wordpress/api/get\_posts/?callback=JSON\_CALLBACK&count=100', headers: { 'Accept': 'application/json, text/javascript', 'Content-Type': 'application/json; charset=utf-8' } }); } return thisisweb; }); \[/code\] Jetzt benötigen wir noch unseren Controller "PostsListCtrl". Dazu erstellen wir die Datei controllers.js im Ordner "js". Zunächst erstellen wir das Modul "thisiswebBlogControllers" das wir in der app.js schon bekannt gemacht haben. Dann rufen wir die Funktion "thisiswebBlogControllers.controller" mit dem entsprechenden Namen "PostsListCtrl" und den weiteren Parametern "[$scope](https://code.angularjs.org/1.3.8/docs/guide/scope)", "Posts" (unsere Factory) und einer Funktion (in der wir unseren Code schreiben) auf, wodurch unser Controller registriert wird. In unserem Controller rufen wir die Funktion "getPosts" auf. Wenn diese erfolgreich war, weisen wir der Variable $scope.posts das posts-Objekt (alle Blogposts) zu, so dass wir aus dem HTML Template später darauf zugreifen können. **controllers.js** \[code lang="js"\] 'use strict'; /\* Controllers \*/ var thisiswebBlogControllers = angular.module('thisiswebBlogControllers', \[\]); thisiswebBlogControllers.controller('PostsListCtrl', \['$scope', 'Posts', function ($scope, Posts) { Posts.getPosts().success(function (response) { $scope.posts = response.posts; }); }\]); \[/code\] Nun benötigen wir nur noch das blog-list.html Template, das wir im Ordner "partials" anlegen. Dort durchlaufen wir mit [ngRepeat](https://code.angularjs.org/1.3.8/docs/api/ng/directive/ngRepeat) alle Posts. Mit den Klammern {{ }} kann man eine Variable im HTML benutzen, z.B. {{post.id}}. Für den Text und den Titel müssen wir ngBindHtml nutzen, da Wordpress den Text mit HTML Elementen speichert. ngBindHtml rendert dies dann auch als HTML, ansonsten würden die HTML Elemente sichtbar sein. Desweiteren sollte man bei Bildern oder Links ngSrc oder ngHref Direktiven nutzen, da es sonst zu Fehlern kommen kann. blog-list.html \[code lang="html"\]

Veröffentlicht am {{post.date}}  
{{cat.title}}

\[/code\] Jetzt sollte die Anwendung funktionieren und schon mal die Blog Beiträge auflisten.

## Wie es weiter geht

Im nächsten Teil formatieren wir das Datum und erstellen ein neues Template für die Detail-Ansicht eines Beitrages. Danach kommen weitere Funktionen wie

-   Suche
-   Filtern nach Kategorien
-   Anzeigen der Seiten
-   Styling der Seite
-   Kommentare
-   und so weiter

,