# ShopingListApp

A simple shopping list app based on React Native and Firebase. The app uses the realtime database to enable sharing the shopping lists and get instant updates on added items.

Based on https://github.com/invertase/react-native-firebase-starter

# Setup

Android:
* Copy your google-services.json into /android/app/ folder
* Generate the signign key (On Windows `keytool` must be run from `C:\Program Files\Java\jdkx.x.x_x\bin`, use `cd $env:JAVA_HOME/bin`)
```
$ keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
*more info here: https://facebook.github.io/react-native/docs/signed-apk-android.html*
* For the release create file /android/local.properties and fill in the signing parameters:
```
keystore.file=<my-key-store>.keystore
keystore.alias=<my-alias>
keystore.storePassword=<password>
keystore.keyPassword=<password>
```
  
  

*Note*

!!! make sure your google-services.json is generated for the correct bundle ID !!!!
