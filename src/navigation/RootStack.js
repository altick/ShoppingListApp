// @flow

import { createStackNavigator } from 'react-navigation';
import LoginStack from './LoginStack';
import MainStack from './MainStack';
import Startup from '../Startup';
import MenuDrawer from './MenuDrawer';

const RootStack = createStackNavigator({
    Startup: {
        screen: Startup
    },
    LoginStack: {
        screen: LoginStack
    },
    MainStack: {
        screen: MenuDrawer
    }
},
{
  initialRouteName: 'Startup',
  headerMode: 'none'
});

export default RootStack;