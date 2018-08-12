// @flow

import { AsyncStorage } from 'react-native';
import { createServiceContext, ServiceComponent } from '../utils/ServiceComponent';
import firebase from 'react-native-firebase';
import { User } from '../login/LoginContext';

import { Subject, Observable } from 'rx';

export type ShoppingList = {
    id?: string,
    name: string,
    isShared?: boolean,
    refId?: string,
    deleted: boolean,
    author: {
        uid: string,
        username: string
    }
}

export type ProductItem = {
    id?: string,
    name: string,
    checked: boolean,
    deleted: boolean,
    author: {
        uid: string,
        username: string
    }
}

const initialState = {
    text: 'Hello'
}

const getListsCollectionRef = () => {
    return firebase.firestore()
        .collection('lists');
}

const getItemsCollectionRef = () => {
    return firebase.firestore()
        .collection('items');
}

const getListRef = (list) => {
    return getListsCollectionRef().doc(list.id);
}

function getListId(list) {
    let listId = list.isShared
        ? list.refId
        : list.id;
    return listId;
}

export class ListService extends ServiceComponent {

    listsSubscriptions = [];
    itemsSubscriptions = [];

    constructor() {
        super(initialState);
    }

    unsubscribeLists = () => {
        this.listsSubscriptions.forEach(s => s() );
        this.listsSubscriptions = [];
    };

    getLists = (user: User) => {
        let ownLists$ = new Subject();
        let ownListsQuery = getListsCollectionRef(user.uid)
            .where('ownerUid', '==', user.uid)
            .where('deleted', '==', false);

        let sharedLists$ = new Subject();
        let sharedListsQuery = getListsCollectionRef(user.uid)
            .where('sharedWith.uids.' + user.uid, '==', true)
            .where('deleted', '==', false);

        let ownListsSubscription = ownListsQuery.onSnapshot(snapshot => {
            let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) );
            ownLists$.onNext(data);
        });
        this.listsSubscriptions.push(ownListsSubscription);

        let sharedListsSubscription = sharedListsQuery.onSnapshot(snapshot => {
            let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) );
            sharedLists$.onNext(data);
        });
        this.listsSubscriptions.push(sharedListsSubscription);

        let combined$ = Observable.combineLatest(ownLists$, sharedLists$).switchMap(lists => {
            let [ownLists, sharedLists] = lists;
            let combined = [
                ...ownLists,
                ...sharedLists
            ];

            combined.sort((a, b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            return Observable.of(combined);
        });

        return combined$;
    }

    addList = async (user: User, list: ShoppingList) => {
        console.info('Saving list for ' + user.username);
    
        list = {
            ... list,
            ownerUid: user.uid,
            deleted: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if(!list.isShared) {
            list.author = { uid: user.uid, username: user.username };
        }
    
        await getListsCollectionRef().add(list);
    }

    deleteList = async(list: ShoppingList) => {
        console.info('Deleting list ' + list.id);

        await getListRef(list).update({ deleted: true });

        // TODO remove all shared lists
    }

    addItem = async (user: User, list: ShoppingList, item: ProductItem) => {
        console.info('Saving item for ' + user.username);
    
        item = {
            ... item,
            ownerUid: user.uid,
            listId: getListId(list),
            deleted: false,
            author: { uid: user.uid, username: user.username },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
    
        await getItemsCollectionRef().add(item);
    }

    unsubscribeItems = () => {
        this.itemsSubscriptions.forEach(s => s() );
        this.itemsSubscriptions = [];
    };

    getItems = (list) => {
        let listId = getListId(list);

        let items$ = new Subject();

        let query = getItemsCollectionRef()
            .where('listId', '==', listId)
            .where('deleted', '==', false);

        let subscription = query.onSnapshot(snapshot => {
            let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) );

            let items = this._sortItems(data);

            items$.onNext(items);
        });
        this.itemsSubscriptions.push(subscription);
        
        return items$.asObservable();
    }

    getAllItems = (list) => {

    }

    _sortItems = (items) => {
        items = items.sort((a, b) => {
            return sortByName(a, b);
        });

        function sortByName(a, b) {
            if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        }

        function sortByPriority(a, b) {
            if(!a.priority) return 1;
            if(a.priroty) return -1;
            return 0;
        } 

        items = items.sort((a, b) => {
            if(a.priority == b.priority) return 0;
            if(a.priority) return -1; 
            if(!a.priority) return 1; 
        });

        items = items.sort((a, b) => {
            if(!a.checked && !b.checked) return 0;
            if(a.checked && b.checked) return sortByName(a, b);
            if(!a.checked) return -1;
        });

        return items;
    }

    updateItem = async (itemId, item) => {
        let ref = getItemsCollectionRef().doc(itemId);

        await ref.update(item);
    }

    deleteItem = async (itemId) => {
        let ref = getItemsCollectionRef().doc(itemId);

        await ref.update({ deleted: true });
    }

    shareList = async (user, list, email) => {
        let db = firebase.firestore();
        let ref = db.collection('users').where('email', '==', email);
        let result = await ref.get();

        if(result.empty) {
            throw new Error('User with this email not found!');
        }

        let userToShareWith: User = result.docs[0].data();

        // get the data of the original list
        let listRef = getListRef(list);
        let listData = await listRef.get();
        // add the target user to the map
        await listRef.set({ 
            ...(listData.data()),
            sharedWith: {
                uids: {
                    [userToShareWith.uid]: true
                },
                users: {
                    [userToShareWith.uid]: {
                        uid: userToShareWith.uid,
                        username: userToShareWith.username,
                        email: userToShareWith.email
                    }
                }
            }
        });

        // let sharedList: ShoppingList = {
        //     ...list,
        //     isShared: true,
        //     refId: list.id
        // };

        // await this.addList(userToShareWith, sharedList);
    }

}

let ListContext = createServiceContext(new ListService());
export default ListContext;