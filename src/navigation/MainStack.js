// @flow

import { createStackNavigator } from 'react-navigation';
import Startup from '../Startup';
import LoginScreenWithContext from '../login/screens/LoginScreen';
import ListsScreenWithContext from '../list/screens/ListsScreen';
import AddListScreenWithContext from '../list/screens/AddListScreen';
import ListScreenWithContext from '../list/screens/ListScreen';
import AddItemScreenWithContext from '../list/screens/AddItemScreen';

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
    List: {
        screen: ListScreenWithContext
    },
    AddList: {
        screen: AddListScreenWithContext
    },
    AddItem: {
        screen: AddItemScreenWithContext
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