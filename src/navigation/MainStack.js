// @flow

import { StackNavigator } from 'react-navigation';
import ListsScreenWithContext from '../list/screens/ListsScreen';
import AddListScreenWithContext from '../list/screens/AddListScreen';
import AddItemScreenWithContext from '../list/screens/AddItemScreen';
import ShareListScreenWithContext from '../list/screens/ShareListScreen';
import ItemsScreenWithContext from '../list/screens/ItemsScreen';

const MainStack = StackNavigator({
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
  initialRouteName: 'Lists',
  headerMode: 'none'
});

export default MainStack;