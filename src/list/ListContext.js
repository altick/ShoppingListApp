// @flow

import { AsyncStorage } from 'react-native';
import { createServiceContext, ServiceComponent } from '../utils/ServiceComponent';
import firebase from 'react-native-firebase';
import { User } from '../login/LoginContext';

export type ShoppingList = {
    id?: string,
    name: string,
    isShared?: boolean,
    refId?: string,
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

const getListsCollectionRef = (uid) => {
    return firebase.firestore()
        .collection('users')
        .doc(uid)
        .collection('lists');
}

const getListRef = (user, list) => {
    let userRef: User = list.isShared
        ? list.author
        : user;

    let listId = list.isShared
        ? list.refId
        : list.id;

    return getListsCollectionRef(userRef.uid).doc(listId);
}

export class ListService extends ServiceComponent {

    constructor() {
        super(initialState);
    }

    getLists = async (user: User, onSnapshot) => {
        let query = getListsCollectionRef(user.uid);

        let subscription = query.onSnapshot(snapshot => {
            onSnapshot(snapshot);
        });

        return subscription;
    }

    addList = async (user: User, list: ShoppingList) => {
        console.info('Saving list for ' + user.username);
    
        list = {
            ... list,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if(!list.isShared) {
            list.author = { uid: user.uid, username: user.username };
        }
    
        await getListsCollectionRef(user.uid).add(list);
    }

    addItem = async (user: User, list: ShoppingList, item: ProductItem) => {
        console.info('Saving item for ' + user.username);
    
        item = {
            ... item,
            author: { uid: user.uid, username: user.username },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
    
        await getListRef(user, list).collection('items').add(item);
    }

    getItems = async (user, list, onSnapshot) => {

        let query = getListRef(user, list).collection('items')
            .orderBy('name');

        let subscription = query.onSnapshot(snapshot => {
            onSnapshot(snapshot);
        });
        
        return subscription;
    }

    updateItem = async (user, list, itemId, item) => {
        let ref = getListRef(user, list).collection('items').doc(itemId);

        await ref.update(item);
    }

    shareList = async (user, list, email) => {
        let db = firebase.firestore();
        let ref = db.collection('users').where('email', '==', email);
        let result = await ref.get();

        if(result.empty) {
            throw new Error('User with this email not found!');
        }

        let userToShareWith: User = result.docs[0].data();

        let listRef: ShoppingList = {
            ...list,
            isShared: true,
            refId: list.id
        };

        await this.addList(userToShareWith, listRef);
    }

}

let ListContext = createServiceContext(new ListService());
export default ListContext;