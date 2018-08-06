# ShopingListApp

A simple shopping list app based on React Native and Firebase. The app uses the realtime database to enable sharing the shopping lists and get instant updates on added items.

Based on https://github.com/invertase/react-native-firebase-starter

# Setup

Android:
* Copy your google-services.json into /android/app/ folder
* For the release create file /android/local.properties and fill in the signing parameters:
```
keystore.file=<my-key-store>.keystore
keystore.alias=<my-alias>
keystore.storePassword=<password>
keystore.keyPassword=<password>
```
  
  

*Note*

!!! make sure your google-services.json is generated for the correct bundle ID !!!!
