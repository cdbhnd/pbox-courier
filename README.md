# pbox-courier

Pbox-frontend app is hybrid mobile app built on following technologies:

* Cordova - https://cordova.apache.org/
* Ionic (v1) - http://ionicframework.com/
* Javascript (Angular v1) - https://angularjs.org/
* Html 5 - http://www.w3schools.com/html/html5_intro.asp
* CSS3 - http://www.w3schools.com/css/css3_intro.asp 

## Install Cordova
$ sudo npm install -g cordova

## Install IONIC
$ sudo npm install -g ionic

## Run as Webserver
$ gulp --%environment%
$ ionic serve

## Install sass linter
https://www.npmjs.com/package/sass-lint
(config file is added at project root level .sass-lint.yml)
VSC sass lint plugin  - > https://marketplace.visualstudio.com/items?itemName=glen-84.sass-lint

## Run as Android app
Prerequisites
* Android SDK (Android Studio)
* Virtualization enabled

$ ionic platform add android
$ ionic build android
$ ionic emulate android

*Note:* If you connect android device yo ucan run the app on the device by running:
$ ionic run android (instead of emulate)

## Run as Android app
Prerequisites
* Mac OsX
* XCode

$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios

## Publish an app on App Stor or Google Play (v1)
https://ionicframework.com/docs/guide/publishing.html 


