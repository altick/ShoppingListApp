import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';

import MainStack from './src/navigation/MainStack';
import LoginContext from './src/login/LoginContext';
import ListContext from './src/list/ListContext';

export default class Root extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <LoginContext.Provider>
          <ListContext.Provider>
            <MainStack />
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