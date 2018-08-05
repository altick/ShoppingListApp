// @flow

import { createStackNavigator } from 'react-navigation';
import Startup from '../Startup';
import LoginScreenWithContext from '../login/screens/LoginScreen';
import ListsScreenWithContext from '../list/screens/ListsScreen';
import AddListScreenWithContext from '../list/screens/AddListScreen';
import AddItemScreenWithContext from '../list/screens/AddItemScreen';
import ShareListScreenWithContext from '../list/screens/ShareListScreen';
import ItemsScreenWithContext from '../list/screens/ItemsScreen';

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
    Items: {
        screen: ItemsScreenWithContext
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