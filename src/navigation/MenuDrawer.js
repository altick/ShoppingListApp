// @flow

import { createDrawerNavigator } from 'react-navigation';
import MenuComponentWithContext from './MenuComponent';
import MainStack from './MainStack';

const MenuDrawer = createDrawerNavigator({
    MainStack: {
        screen: MainStack
    }
}, {
    initialRouteName: "MainStack",
    // drawerWidth: 70,
    // drawerPosition: 'left',
    contentComponent: MenuComponentWithContext,
    headerMode: 'float',
    navigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: '#4C3E54'},
        title: 'Welcome!',
        headerTintColor: 'white',
    })
});

export default MenuDrawer;