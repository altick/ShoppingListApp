// @flow

import { createStackNavigator } from 'react-navigation';
import Startup from '../Startup';
import LoginScreenWithContext from '../login/LoginScreen';
import ListsScreenWithContext from '../list/ListsScreen';

const MainStack = createStackNavigator({
    Startup: {
        screen: Startup
    },
    Login: {
        screen: LoginScreenWithContext
    },
    Lists: {
        screen: ListsScreenWithContext
    }
    // Feed: {
    //     screen: FeedPageWithContext
    // }
},
{
  initialRouteName: 'Startup',
  headerMode: 'none'
});

export default MainStack;