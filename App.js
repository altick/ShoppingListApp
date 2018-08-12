import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { StyleProvider, Root  } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

import RootStack from './src/navigation/RootStack';
import LoginContext from './src/login/LoginContext';
import ListContext from './src/list/ListContext';

import firebase from 'react-native-firebase';
const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

const unitId = __DEV__
  ? 'ca-app-pub-3940256099942544/6300978111'
  : 'ca-app-pub-5617894997883575/5545752566';
if(__DEV__) {
  request.addTestDevice().build();
} else {
  // request targeting
}

export default class AppRoot extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <LoginContext.Provider>
          <ListContext.Provider>
            <LoginContext.Consumer>
              {loginService => (
                <Root style={ { flex: 1 } }>
                  <RootStack />
                  { (loginService.user && !loginService.user.adFree) && (
                    <Banner
                      size={"SMART_BANNER"}
                      unitId={unitId}
                      request={request.build()}
                      onAdLoaded={() => {
                        console.log('Advert loaded');
                      }}
                    />
                  )}
                </Root>
              )}
            </LoginContext.Consumer>
          </ListContext.Provider>
        </LoginContext.Provider>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});