// @flow

import { createStackNavigator } from 'react-navigation';
import Startup from '../Startup';
import LoginScreenWithContext from '../login/LoginScreen';
import ListsScreenWithContext from '../list/ListsScreen';
import AddListScreenWithContext from '../list/AddListScreen';
import ListScreenWithContext from '../list/ListScreen';
import AddItemScreenWithContext from '../list/AddItemScreen';

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