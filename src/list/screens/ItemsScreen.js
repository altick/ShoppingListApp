// @flow

import React from 'react';
import { StyleSheet, Text, View, ListView, Alert } from 'react-native';
import ListContext from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, ListItem, List, CheckBox, Right, Spinner } from 'native-base';
import LoginContext, { User } from '../../login/LoginContext';

import type { ShoppingList, ProductItem } from '../ListContext';

import commonColor from '../../../native-base-theme/variables/commonColor';
import { getUsernameFromEmail } from '../../utils/helpers';


type Props = {
    listService: ListService,
    loginService: LoginService
}

const itemDefaults: ProductItem = {
    name: '',
    checked: false,
    author: null
}

class ItemsScreen extends React.Component<Props> {

    itemsSubscription = null;

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        let list: ShoppingList = this.props.navigation.getParam('list');
        this.state = {
            isLoading: false,
            items: [],
            user: this.props.loginService.user,
            list: list,
            isOwnList: !list.isShared,
            isSharedList: list.isShared
        };
    }

    async componentDidMount() {
        this.loadItems();
    }

    componentWillUnmount() {
        this.unsubscribeItems();
    }
    
    componentDidUpdate(prevProps, prevState) {
        // Previous SomeContext value is prevProps.someValue
        // New SomeContext value is this.props.someValue
    }

    async loadItems() {
        this.setState({ isLoading: true });

        this.unsubscribeItems();

        let subscription = await this.props.listService.getItems(this.state.user, this.state.list, (snapshot) => {
            let items = [];
            snapshot.forEach(doc => {
                let item: ProductItem = { ...itemDefaults, ...doc.data(), id: doc.id };
                console.info(JSON.stringify(item));
                items.push(item);
            });

            items.sort((a, b) => {
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });

            items.sort((a, b) => {
                if(a.checked == b.checked) return 0;
                if(a.checked) return 1;
                if(!a.checked) return -1;
            });

            this.setState({
                items: items,
                isLoading: false
            });
        });
        this.itemsSubscription = subscription;
    }

    unsubscribeItems() {
        if(this.itemsSubscription) {
            this.itemsSubscription();
            this.itemsSubscription = null;
        }
    }

    onAddItem() {
        console.info('Add item');

        this.props.navigation.push('AddItem', { list: this.state.list });
    }

    navigateBack() {
        this.props.navigation.popToTop()
    }

    async onItemClick(item: ProductItem) {
        console.info('Item ' + item.name);

        item.checked = !item.checked;

        let user: User = this.state.user;

        this.props.listService.updateItem(user, this.state.list, item.id, item);

        this.forceUpdate();
    }

    async onShareList() {
        console.info('Share this list');

        this.props.navigation.push('ShareList', { list: this.state.list });
    }

    async onDeleteItemClick(item) {
        console.info('Delete item: ' + item.id);

        Alert.alert(
            `Delete item "${item.name}" `,
            'Are you sure you want to delete this item?',
            [
              {text: 'Yes', onPress: () => this.deleteItem(item) },
              {text: 'No', onPress: () => console.log('Dismissed')},
            ],
            { cancelable: false }
          );

    }

    async deleteItem(item) {
        await this.props.listService.deleteItem(this.state.user, this.state.list, item.id);
    }

    closeRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
    }

    render() {
        const { navigation } = this.props;
        
        const list = navigation.getParam('list');

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={ () => this.navigateBack() }>
                            <Icon name='arrow-left' type="MaterialCommunityIcons" />
                        </Button>
                    </Left>
                    <Body style={ { flex: 1, flexDirection: 'row', alignContent: 'center' } }>
                        <Icon name="receipt" type="MaterialCommunityIcons" style={ { color: 'white', marginRight: 10 } } />
                        <Title>{ list.name }</Title>
                    </Body>
                    <Right>
                        { this.state.isOwnList && (
                            <Button transparent onPress={ () => this.onShareList() }>
                                <Icon name='share' type="Ionicons" />
                            </Button>
                        )}
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        { this.state.isLoading && <Spinner /> }
                        <List
                            dataSource={ this.ds.cloneWithRows(this.state.items) }
                            renderRow={ item =>
                                <ListItem icon key={item.id} button={true} onPress={ () => this.onItemClick(item) } >
                                    <Left><CheckBox checked={item.checked} onPress={ () => this.onItemClick(item) } /></Left>
                                    <Body style={ { marginLeft: 10 } }>
                                        <Text style={ { fontWeight: 'bold' } }>{ item.name }</Text>
                                        { (item.author.uid != this.state.user.uid) && (
                                            <Text note style={ { fontSize: 11 } }>By { getUsernameFromEmail(item.author.username) }</Text>
                                        ) }
                                    </Body>
                                </ListItem> 
                            }
                            closeOnRowBeginSwipe={true}
                            disableLeftSwipe={true}
                            leftOpenValue={75}
                            renderLeftHiddenRow={(item, secId, rowId, rowMap) => (
                                <Button full danger onPress={ () => { 
                                        this.closeRow(secId, rowId, rowMap);
                                        this.onDeleteItemClick(item);
                                    } }>
                                    <Icon active name="trash" />
                                </Button> 
                            )}
                        />
                    </Content>
                    <Fab
                        containerStyle={{ }}
                        style={{ backgroundColor: commonColor.brandPrimary }}
                        position="bottomRight"
                        onPress={() => this.onAddItem() }>
                        <Icon name="add" />
                    </Fab>
                </View>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    
});

let ItemsScreenWithContext = props => (
    <LoginContext.Consumer>
        {loginService => (
            <ListContext.Consumer>
                {listService => (
                    <ItemsScreen { ...props } 
                        loginService={ loginService }
                        listService={ listService } 
                    ></ItemsScreen>
                ) }
            </ListContext.Consumer>
        ) }
    </LoginContext.Consumer>
);

export default ItemsScreenWithContext;