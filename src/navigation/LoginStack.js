// @flow

import { createStackNavigator } from 'react-navigation';
import LoginScreenWithContext from '../login/screens/LoginScreen';

const LoginStack = createStackNavigator({
    Login: {
        screen: LoginScreenWithContext
    }
},
{
  initialRouteName: 'Login',
  headerMode: 'none'
});

export default LoginStack;