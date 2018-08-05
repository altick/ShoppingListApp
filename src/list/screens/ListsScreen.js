// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListContext, { ShoppingList } from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Right, Fab, ListItem, List } from 'native-base';
import LoginContext, { User } from '../../login/LoginContext';

type Props = {
    listService: ListService,
    loginService: LoginService
}

class ListsScreen extends React.Component<Props> {

    listsSubscription = null;

    constructor(props) {
        super(props);

        this.state = {
            lists: []
        }

        willFocus = this.props.navigation.addListener(
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

        let user: User = this.props.loginService.user;

        let subscription = await this.props.listService.getLists(user, (snapshot) => {
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

    render() {
        const {  } = this.props;
        
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='menu' />
                        </Button>
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
                        <List>
                            { this.state.lists.map(list => (
                                    <ListItem key={list.id} button={true} onPress={ () => this.onGotoList(list) } >
                                        <Text>{ list.name }</Text>
                                    </ListItem> 
                                ))
                            }
                        </List>
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

let ListsScreenWithContext = props => (
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