// @flow

import { AsyncStorage } from 'react-native';
import { createServiceContext, ServiceComponent } from '../utils/ServiceComponent';
import firebase from 'react-native-firebase';
import { User } from '../login/LoginContext';

export type ShoppingList = {
    name: string,
    author: string,
}

export type ProductItem = {
    name: string,
    author: string,
    checked: boolean
}

const initialState = {
    text: 'Hello'
}

export class ListService extends ServiceComponent {

    constructor() {
        super(initialState);
    }

    getLists = async (user, onSnapshot) => {

        let query = firebase.firestore().collection('lists')
            .orderBy('name');

        let subscription = query.onSnapshot(snapshot => {
            onSnapshot(snapshot);
        });
        
        return subscription;
    }

    addList = async (user: User, list: ShoppingList) => {
        console.info('Saving list for ' + user.username);
    
        list = {
            ... list,
            author: user.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        let db = firebase.firestore();
    
        await db.collection('lists').add(list);
    }

    addItem = async (user: User, listId: string, item: ProductItem) => {
        console.info('Saving item for ' + user.username);
    
        item = {
            ... item,
            author: user.id,
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

}

let ListContext = createServiceContext(new ListService());
export default ListContext;