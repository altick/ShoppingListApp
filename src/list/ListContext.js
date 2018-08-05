// @flow

import { AsyncStorage } from 'react-native';
import { createServiceContext, ServiceComponent } from '../utils/ServiceComponent';
import firebase from 'react-native-firebase';
import { User } from '../login/LoginContext';

export type ShoppingList = {
    name: string,
    author: {
        uid: string,
        username: string
    }
}

export type ProductItem = {
    name: string,
    checked: boolean,
    author: {
        uid: string,
        username: string
    }
}

const initialState = {
    text: 'Hello'
}

export class ListService extends ServiceComponent {

    constructor() {
        super(initialState);
    }

    getLists = async (user: User, onSnapshot) => {
        const uid = user.uid;
        let query = firebase.firestore().collection('lists')
            .where('author.uid', '==', uid)
            .orderBy('name');

        let subscription = query.onSnapshot(snapshot => {
            onSnapshot(snapshot);
            subscription();
        });

        // return subscription;

        // let snapshot = await query.get();
        // console.info('get ok');
        // onSnapshot(snapshot);
    }

    addList = async (user: User, list: ShoppingList) => {
        console.info('Saving list for ' + user.username);
    
        list = {
            ... list,
            author: { uid: user.uid, username: user.username },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        let db = firebase.firestore();
    
        await db.collection('lists').add(list);
    }

    addItem = async (user: User, listId: string, item: ProductItem) => {
        console.info('Saving item for ' + user.username);
    
        item = {
            ... item,
            author: { uid: user.uid, username: user.username },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        let db = firebase.firestore();
    
        await db.collection('lists').doc(listId).collection('items').add(item);
    }

    getItems = async (user, listId, onSnapshot) => {

        let query = firebase.firestore().collection('lists').doc(listId).collection('items')
            .orderBy('name');

        let subscription = query.onSnapshot(snapshot => {
            onSnapshot(snapshot);
        });
        
        return subscription;
    }

    updateItem = async (user, listId, itemId, item) => {
        let ref = firebase.firestore().collection('lists').doc(listId).collection('items').doc(itemId);

        await ref.update(item);
    }

    shareList = async (user, listId, email) => {
        let ref = firebase.firestore().collection('users').where('username', 'eq', email);

        console.info(ref);
    }

}

let ListContext = createServiceContext(new ListService());
export default ListContext;