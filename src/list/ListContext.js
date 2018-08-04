// @flow

import { AsyncStorage } from 'react-native';
import { createServiceContext, ServiceComponent } from '../utils/ServiceComponent';
import firebase from 'react-native-firebase';
import { User } from '../login/LoginContext';

type List = {
    name: string,
    author: string,

}

const initialState = {
    text: 'Hello'
}

class ListService extends ServiceComponent {

    constructor() {
        super(initialState);
    }

    getLists = async (user) => {


        
        return true;
    }

    addList = async (user: User, list: List) => {
        console.info('Saving list for ' + user.username);
    
        list = {
            ... list,
            author: user.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        let db = firebase.firestore();
    
        await db.collection('lists').add(list);
    }

}

let ListContext = createServiceContext(new ListService());
export default ListContext;