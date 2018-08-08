import firebase, { RNFirebase } from 'react-native-firebase';
import { LoginService } from './LoginContext';

jest.mock('react-native-firebase', () => {
    return {
        auth: jest.fn(() => {
            return {
                hasPermission: jest.fn(() => Promise.resolve(true)),
                subscribeToTopic: jest.fn(),
                unsubscribeFromTopic: jest.fn(),
                requestPermission: jest.fn(() => Promise.resolve(true)),
                getToken: jest.fn(() => Promise.resolve('RN-Firebase-Token')),
                signInAndRetrieveDataWithEmailAndPassword: jest.fn((username, password) => ({ 'user': { 'uid': 'testuid', 'email': username, 'displayName': username }}) )
            }
        }),
        firestore: jest.fn(() => {
            return {
                onNotification: jest.fn(),
                onNotificationDisplayed: jest.fn()
            }
        })
    }
});

let svc = null;

beforeEach(() => {
    svc = new LoginService();
});

it('test', async () => {
    await svc.loginUser('username', 'password');
});