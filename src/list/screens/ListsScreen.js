// @flow

import React from 'react';
import { StyleSheet, Text, View, ListView } from 'react-native';
import ListContext, { ListService } from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Right, Fab, ListItem, List } from 'native-base';
import LoginContext, { LoginService } from '../../login/LoginContext';

import type { ShoppingList } from '../ListContext';
import type { User } from '../../login/LoginContext';


type Props = {
    navigation: any,
    listService: ListService,
    loginService: LoginService
}

type State = {
    lists: Array<ShoppingList>
}

class ListsScreen extends React.Component<Props, State> {

    listsSubscription = null;

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            user: this.props.loginService.user,
            lists: []
        };

        let willFocus = this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.onFocus();
            }
        );
    }

    async componentDidMount() {
        console.info('lists mount');
        this.loadLists();
    }

    onFocus() {

    }

    componentWillUnmount() {
        this.unsubscribeLists();
    }
    
    componentDidUpdate(prevProps, prevState) {
        // Previous SomeContext value is prevProps.someValue
        // New SomeContext value is this.props.someValue
    }

    async loadLists() {
        this.unsubscribeLists();

        let subscription = await this.props.listService.getLists(this.state.user, (snapshot) => {
            let lists = [];
            snapshot.forEach(doc => {
                let list: ShoppingList = { ...doc.data(), id: doc.id };
                console.info(JSON.stringify(list));
                lists.push(list);
            });

            this.setState({
                lists: lists
            });
        });

        this.listsSubscription = subscription;
    }

    unsubscribeLists() {
        if(this.listsSubscription) {
            this.listsSubscription();
            this.listsSubscription = null;
        }
    }

    onAddList() {
        console.info('Add list');

        this.props.navigation.push('AddList');
    }

    onGotoList(list) {
        console.info(list.name);
       
        this.props.navigation.push('Items',{ list: list });
    }

    async onLogout() {
        await this.props.loginService.logoutUser();

        this.props.navigation.replace('Login');
    }

    async onDeleteListClick(list) {
        console.info('Delete list: ' + list.id);

        this.props.listService.deleteList(this.state.user, list)
    }

    onShareListClick(list) {
        this.props.navigation.push('ShareList', { list: list });
    }

    closeRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        {/* <Button transparent>
                            <Icon name='menu' />
                        </Button> */}
                        <Icon name="checklist" type="Octicons" />
                    </Left>
                    <Body>
                        <Title>Shopping Lists</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={ () => this.onLogout() }>
                            <Icon name='logout' type="MaterialCommunityIcons" />
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        <List
                            // https://docs.nativebase.io/Components.html#swipeable-multi-def-headref
                            dataSource={ this.ds.cloneWithRows(this.state.lists) }
                            renderRow={ list =>
                                <ListItem key={list.id} button={true} onPress={ () => this.onGotoList(list) } >
                                    <Body>
                                        <Text style={ { fontWeight: 'bold' } }>{ list.name }</Text>
                                        { list.isShared && (
                                            <Text note style={ { fontSize: 11 } }>{ list.author.username }</Text>
                                        ) }
                                    </Body>
                                    { list.isShared && (
                                        <Right>
                                            <Icon name="slideshare" type="Entypo" />
                                        </Right>
                                    ) }
                                </ListItem> 
                            }
                            closeOnRowBeginSwipe={true}
                            rightOpenValue={-75}
                            renderRightHiddenRow={(data, secId, rowId, rowMap) => (
                                <Button full danger onPress={ () => { 
                                        this.closeRow(secId, rowId, rowMap);
                                        this.onDeleteListClick(data);
                                    } }>
                                    <Icon active name="trash" />
                                </Button> 
                            )}
                            leftOpenValue={75}
                            renderLeftHiddenRow={(data, secId, rowId, rowMap) => (
                                <Button full success onPress={ () => {
                                        this.closeRow(secId, rowId, rowMap);
                                        this.onShareListClick(data);
                                    } }>
                                    <Icon active name="share" />
                                </Button> 
                            )}
                        />
                    </Content>
                    <Fab
                        containerStyle={{ }}
                        style={{ backgroundColor: '#5067FF' }}
                        position="bottomRight"
                        onPress={() => this.onAddList() }>
                        <Icon name="add" />
                    </Fab>
                </View>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    
});

let ListsScreenWithContext = (props: any) => (
    <LoginContext.Consumer>
        {loginService => (
            <ListContext.Consumer>
                {listService => (
                    <ListsScreen { ...props } 
                        loginService={ loginService }
                        listService={ listService } 
                    ></ListsScreen>
                ) }
            </ListContext.Consumer>
        ) }
    </LoginContext.Consumer>
);

export default ListsScreenWithContext;