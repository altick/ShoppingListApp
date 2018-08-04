// @flow

import * as React from 'react';
import LoginContext from './login/LoginContext';
import { StyleSheet, View, Text } from 'react-native';
import ListContext from './list/ListContext';

class StartupComponent extends React.Component {

    async componentDidMount() {
      let status = await this.props.loginService.validateUser();
      if(status) {
        this.props.navigation.replace('Lists');
      } else {
        this.props.navigation.replace('Login');
      }
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
        { loginService => (
        <ListContext.Consumer>
          { listState => (
              <StartupComponent { ...props } 
                loginService={ loginService } 
                listService={ listState } 
              ></StartupComponent>
          )}
        </ListContext.Consumer>
        )}
    </LoginContext.Consumer>
);