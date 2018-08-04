// @flow

import * as React from 'react';
import LoginContext from './login/LoginContext';
import { StyleSheet, View, Text } from 'react-native';

class StartupComponent extends React.Component {

    async componentDidMount() {
      // let status = await this.props.actions.validateUser();
      // if(status) {
      //   this.props.navigation.replace('Feed');
      // } else {
        this.props.navigation.replace('Login');
      // }
    }
  
    render() {
      
      return (
        <View style={ styles.container }>
          <Text>Starting up...</Text>
        </View>
      )
    }

  }

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
  
export default Startup = props => (
    <LoginContext.Consumer>
      {loginState => (
          <StartupComponent {...props} {...loginState} ></StartupComponent>
      )}
    </LoginContext.Consumer>
);