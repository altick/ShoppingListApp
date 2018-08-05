// @flow

import { AsyncStorage } from 'react-native';
import { createServiceContext, ServiceComponent } from '../utils/ServiceComponent';
import firebase, { RNFirebase } from 'react-native-firebase';

export type User = {
    uid: string,
    email: string,
    username: string,
    createdAt: Date,
    sharedLists: Array<string>
}

export type SignupUser = {
    email: string,
    password: string
}

export class LoginService extends ServiceComponent {

    constructor() {
        super({
            user: null
        });
    }

    validateUser = async () => {
        let currentUser = await this.getUser();

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

        await this._loginUser(userCred);
    }

    _loginUser = async(userCred: RNFirebase.UserCredential) => {
        let user: User = await this.loadUser(userCred.user.uid);
    
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

    signupUser = async (user: SignupUser) => {
        let userCred = await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(user.email, user.password);

        let tasks = [
            this._saveUser(userCred.user),
            userCred.user.sendEmailVerification(),
            this._loginUser(userCred)
        ];
        await Promise.all(tasks);
    }

    _saveUser = async (user: RNFirebase.User) => {

        let userData: User = {
            uid: user.uid,
            email: user.email,
            username: user.displayName || user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sharedLists: []
        }

        let ref = await firebase.firestore().collection('users').add(userData);
    }

    loadUser = async (uid: string) => {
        let ref = firebase.firestore().collection('users').where('uid', '==', uid).limit(1);

        let result = await ref.get();

        if(result.empty) {
            throw new Error('User not found');
        }

        let user = result.docs[0].data();
        return user;
    }

    getUser = async () => {
        let data = await AsyncStorage.getItem('auth:current-user');
    
        let currentUser = JSON.parse(data);
        return currentUser;
    }

}

let LoginContext = createServiceContext(new LoginService());
export default LoginContext;