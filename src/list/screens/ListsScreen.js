// @flow

import React from 'react';

import { StyleSheet, Text, View, ListView } from 'react-native';
import ListContext, { ListService } from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Right, Fab, ListItem, List, Spinner } from 'native-base';
import Image from 'react-native-remote-svg'
import LoginContext, { LoginService } from '../../login/LoginContext';

import type { ShoppingList } from '../ListContext';
import type { User } from '../../login/LoginContext';

import commonColor from '../../../native-base-theme/variables/commonColor';

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
            isLoading: false,
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
        this.setState({ isLoading: true });

        this.unsubscribeLists();

        let subscription = await this.props.listService.getLists(this.state.user, (snapshot) => {
            let lists = [];
            snapshot.forEach(doc => {
                let list: ShoppingList = { ...doc.data(), id: doc.id };
                console.info(JSON.stringify(list));
                lists.push(list);
            });

            this.setState({
                lists: lists,
                isLoading: false
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
                            <Image
                                source={ require('../../../assets/images/logo.svg') }
                                style={{ width: 42, height: 42 }}
                            />
                        </Left>
                        <Body>
                            <Title>My Shopping Lists</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={ () => this.onLogout() }>
                                <Icon name='logout' type="MaterialCommunityIcons" />
                            </Button>
                        </Right>
                    </Header>
                    <View style={{ flex: 1 }}>
                        <Content>
                            { this.state.isLoading && <Spinner /> }
                            <List
                                // https://docs.nativebase.io/Components.html#swipeable-multi-def-headref
                                dataSource={ this.ds.cloneWithRows(this.state.lists) }
                                renderRow={ list =>
                                    <ListItem style={ { paddingLeft: 10 } } icon key={list.id} button={true} onPress={ () => this.onGotoList(list) } >
                                        <Left>
                                            <Icon name="receipt" type="MaterialCommunityIcons" style={ { color: commonColor.brandPrimary } } />
                                        </Left>
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
                            style={{ backgroundColor: commonColor.brandPrimary }}
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