---
title: 'Einen Blog als Single Page Web App mit AngularJS und WordPress Teil 2'
description: 'Heute erweitern wir die App um eine Ladeanimation, damit der Bildschirm nicht so lange leer bleibt und die Deteilansicht der Beiträge. Zunächst jedoch formatier'
pubDate: 2015-02-25
categories: ["Allgemein","Apps","Programmierung","Web"]
author: 'Pierre'
---

Heute erweitern wir die App um eine Ladeanimation, damit der Bildschirm nicht so lange leer bleibt und die Deteilansicht der Beiträge. Zunächst jedoch formatieren wir das Datum richtig.

# Wordpress Datum mit Angularjs

Mit der [Filterfunktion "date"](https://docs.angularjs.org/api/ng/filter/date) von Angularjs können wir das Datum, das von der JSON API in ISO 8601 Format kommt, in einem gewünschten Format anzeigen lassen. Dazu brauchen wir jedoch die Millisekunden die zwischen dem Datum und einem bestimmten Zeitpunkt liegen. Mit der Javascript Funktion Date.parse() geht das ganz einfach, aber funktioniert nur im Google Chrome, alle anderen Browser zeigen dann NaN an. Wir müssen das Datum also erst etwas umformatieren, damit auch jeder Browser das gleiche Ergebnis liefert. Wir erweitern also die controllers.js um die folgende Funktion ([Erklärung gibt es hier](//craiccomputing.blogspot.de/2010/11/javascript-dateparse-browser.html)) die uns in jedem Browser die gleichen Millisekunden liefert: \[code lang="js"\] function getMilli(date\_str) { var iso8601\_regex = /(\\d{4})\[\\/-\](\\d{2})\[\\/-\](\\d{2})/; var match = iso8601\_regex.exec(date\_str); var date = new Date(match\[1\], match\[2\] - 1, match\[3\]); var milliseconds = Date.parse(date); milliseconds = Date.UTC(match\[1\], match\[2\] - 1, match\[3\], 0, 0, 0); return milliseconds; } \[/code\] Danach erweitern wir die Posts.getPosts().success( ... ) Funktion. Zu jedem Blog Post rufen wir unsere Funktion getMilli( ... ) mit dem entsprechenden Datum als Parameter auf, erweitern das Posts-Objekt um ein weiteres Feld "datum" und speichern dort die zurückgegebenen Millisekunden. \[code lang="js"\] Posts.getPosts().success(function (response) { $scope.posts = response.posts; for (var i = 0; i < response.posts.length; i++) { $scope.posts\[i\].datum = getMilli(response.posts\[i\].date); } }); \[/code\] Nun können wir im blog-list.html Template das Datum in Form von Tag.Monat.Jahr anzeigen lassen. \[code lang="html"\]

Veröffentlicht am {{post.datum | date: 'dd.MM.yyyy'}}  

\[/code\]

# Ladeanimation mit Angularjs

Es gibt verschiedene Methoden eine Ladeanimation mit Angular zu realisieren. Ich benutze hier die wohl simpleste Methode. Wir erweitern wieder unseren "PostsListCtrl" indem wir auf dem Scope die Variable "loading" auf true setzen, bevor die Blog Posts angefordert werden. Die Funktion finally wird von Angular nach getPosts ausgeführt. Dort setzen wir "loading" einfach wieder auf false. \[code lang="js"\] $scope.loading = true; Posts.getPosts().success(function (response) { $scope.posts = response.posts; ... }).finally(function () { $scope.loading = false; }); \[/code\] Nun können wir in der post-list.html ein Bild mit dem [ngShow](https://code.angularjs.org/1.3.8/docs/api/ng/directive/ngShow) Attribut, das unsere Variable "loading" als Wert erhält, einfügen. Somit wird es nur angezeigt während die Blog Posts noch geladen werden. \[code lang="html"\] img/477.GIF ... \[/code\] Gleichzeitig soll das article Element erst angezeigt werden, wenn "loading" auf false steht. Deshalb fügen wir auch dort ngShow ein, allerdings mit der negierten Variable "loading". \[code lang="html"\] ...

... \[/code\] Die GIF Datei ([Download](/uploads/2015/02/477.gif)) muss also im Ordner "img" liegen.

# Detailansicht eines Beitrages

Damit wir einen Blog Post auch einzeln betrachten können und dazu auch eine eigene URL haben, müssen wir die Dateien app.js, services.js, controllers.js und blog-list.html erweitern und ein neues Template blog-detail.html erstellen.

## app.js

Wir müssen also eine neue Route anlegen. Wenn ".../blog/:slug" aufgerufen wird, soll das blog-detail.html Template geladen und der Controller PostDetailCtrl benutzt werden. :slug ist eine Variable wie man gleich noch sieht (der Titel eines Posts ohne leerzeichen und so weiter, so dass man ihn als url verwenden kann) \[code lang="js"\] 'use strict'; /\* App Module \*/ var thisiswebBlog = angular.module('thisiswebBlog', \[ 'ngRoute', 'ngSanitize', 'thisiswebBlogControllers', 'thisiswebBlogServices' \]); thisiswebBlog.config(\['$routeProvider', function($routeProvider) { $routeProvider. when('/blog', { templateUrl: 'partials/blog-list.html', controller: 'PostsListCtrl' }). when('/blog/:slug', { templateUrl: 'partials/blog-detail.html', controller: 'PostDetailCtrl' }). otherwise({ redirectTo: '/blog' }); }\]); \[/code\]

## services.js

Wir erweitern unsere Service Factory um eine Funktion getPostsBySlug die als Parameter "slug" erhält und über die JSON API den passenden Post liefert. \[code lang="js"\] 'use strict'; /\* Services \*/ var thisiswebBlogServices = angular.module('thisiswebBlogServices', \[\]); thisiswebBlogServices.factory('Posts', function ($http) { var thisisweb = {}; thisisweb.getPosts = function() { return $http({ method: 'JSONP', url: 'http://thisisweb.de/wordpress/api/get\_posts/?callback=JSON\_CALLBACK&count=100', headers: { 'Accept': 'application/json, text/javascript', 'Content-Type': 'application/json; charset=utf-8' } }); } thisisweb.getPostbySlug = function (slug) { return $http({ method: 'JSONP', url: 'http://thisisweb.de/wordpress/api/get\_post/?callback=JSON\_CALLBACK&slug="' + slug + '"', headers: { 'Accept': 'application/json, text/javascript', 'Content-Type': 'application/json; charset=utf-8' } }); } return thisisweb; }); \[/code\]

## controllers.js

Nun erstellen wir den neuen Controller "PostDetailCtrl" der fast das gleiche macht wie der "PostListCtrl", nämlich die Funktion getPostsBySlug aus der Service Factory mit dem richtigen slug als Parameter aufrufen und das Resultat auf dem Scope speichern. \[code lang="js"\] 'use strict'; /\* Controllers \*/ var thisiswebBlogControllers = angular.module('thisiswebBlogControllers', \[\]); thisiswebBlogControllers.controller('PostsListCtrl', \['$scope', 'Posts', function ($scope, Posts) { $scope.loading = true; Posts.getPosts().success(function (response) { $scope.posts = response.posts; for (var i = 0; i < response.posts.length; i++) { $scope.posts\[i\].datum = getMilli(response.posts\[i\].date); } }).finally(function () { $scope.loading = false; }); }\]); thisiswebBlogControllers.controller('PostDetailCtrl', \['$scope', '$routeParams', 'Posts', function ($scope, $routeParams, Posts) { $scope.loading = true; $scope.slug = $routeParams.slug; Posts.getPostbySlug($scope.slug).success(function (response) { $scope.post = response.post; var post = response.post; $scope.post.datum = getMilli(post.date); }).finally(function () { // called no matter success or failure $scope.loading = false; }); }\]); function getMilli(date\_str) { //http://craiccomputing.blogspot.de/2010/11/javascript-dateparse-browser.html var iso8601\_regex = /(\\d{4})\[\\/-\](\\d{2})\[\\/-\](\\d{2})/; var match = iso8601\_regex.exec(date\_str); var date = new Date(match\[1\], match\[2\] - 1, match\[3\]); var milliseconds = Date.parse(date); milliseconds = Date.UTC(match\[1\], match\[2\] - 1, match\[3\], 0, 0, 0); return milliseconds; } \[/code\]

## blog-list.html

Im blog-list.html Template wird aus dem Titelbild und dem Titel ein Link gemacht, mit der Variable slug aus dem post Objekt. Somit wird die Variable einfach an die URL gehängt, der Router in der app.js registriert dies und kümmert sich darum, dass das richtige Template geladen wird. Gleichzeitig wird der passende Controller aktiviert, der sich um die benötigten Daten kümmert. \[code lang="html"\] 

# 

\[/code\]
