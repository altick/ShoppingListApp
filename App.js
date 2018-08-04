import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import firebase from 'react-native-firebase';

import MainStack from './src/navigation/MainStack';
import LoginContext from './src/login/LoginContext';
import ListContext from './src/list/ListContext';

export default class Root extends React.Component {
  render() {
    return (
      <LoginContext.Provider>
        <ListContext.Provider>
          <MainStack />
        </ListContext.Provider>
      </LoginContext.Provider>
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