// @flow

import * as React from 'react';
import { createStackNavigator } from 'react-navigation';
import Startup from '../Startup';

const MainStack = createStackNavigator({
    Startup: {
        screen: Startup
    },
    // Login: {
    //     screen: LoginScreenWithContext //LoginPageWithContext
    // },
    // Feed: {
    //     screen: FeedPageWithContext
    // }
},
{
  initialRouteName: 'Startup',
  headerMode: 'none'
});

export default MainStack;