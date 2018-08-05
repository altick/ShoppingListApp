// @flow

import { createStackNavigator } from 'react-navigation';
import Startup from '../Startup';
import LoginScreenWithContext from '../login/screens/LoginScreen';
import ListsScreenWithContext from '../list/screens/ListsScreen';
import AddListScreenWithContext from '../list/screens/AddListScreen';
import ListScreenWithContext from '../list/screens/ListScreen';
import AddItemScreenWithContext from '../list/screens/AddItemScreen';
import ShareListScreenWithContext from '../list/screens/ShareListScreen';

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
    },
    ShareList: {
        screen: ShareListScreenWithContext
    }
},
{
  initialRouteName: 'Startup',
  headerMode: 'none'
});

export default MainStack;