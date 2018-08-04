// @flow

import { createStackNavigator } from 'react-navigation';
import Startup from '../Startup';
import LoginScreenWithContext from '../login/LoginScreen';
import ListsScreenWithContext from '../list/ListsScreen';
import AddListScreenWithContext from '../list/AddListScreen';

const MainStack = createStackNavigator({
    Startup: {
        screen: Startup
    },
    Login: {
        screen: LoginScreenWithContext
    },
    Lists: {
        screen: ListsScreenWithContext
    },
    AddList: {
        screen: AddListScreenWithContext
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