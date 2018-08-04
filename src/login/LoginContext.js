// @flow

import { AsyncStorage } from 'react-native';
import { createServiceContext, ServiceComponent } from '../utils/ServiceComponent';
import firebase from 'react-native-firebase';

export type User = {
    id: string,
    username: string
}

class LoginService extends ServiceComponent {

    constructor() {
        super({
            user: null
        });
    }

    validateUser = async () => {
        let data = await AsyncStorage.getItem('auth:current-user');
    
        let currentUser = JSON.parse(data);

        if(!currentUser) {
            return false;
        }

        this.setState({
            user: currentUser,
            test: 'success'
        });
        return true;
    }

    loginUser = async (username, password) => {
        console.info(' login user ' + username);
        console.info('Authenticating ... ' + username);

        let userCred = await firebase.auth().signInAndRetrieveDataWithEmailAndPassword(username, password);

        let user: User = {
            id: userCred.user.uid,
            username: userCred.user.displayName || userCred.user.email
        }
    
        await AsyncStorage.setItem('auth:current-user', JSON.stringify(user));

        console.info('success');

        this.setState({
            user: user,
            test: 'success'
        });
    }

    logoutUser = async () => {
        console.info('logout user');

        await firebase.auth().signOut();
    
        await AsyncStorage.removeItem('auth:current-user');
    }

}

let LoginContext = createServiceContext(new LoginService());
export default LoginContext;