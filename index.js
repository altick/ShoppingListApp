import { AppRegistry } from 'react-native';
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])

import App from './App';
AppRegistry.registerComponent('ShoppingList', () => App);
