// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListContext, { ShoppingList } from './ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, ListItem, List } from 'native-base';
import LoginContext, { User } from '../login/LoginContext';


type Props = {
    listService: ListService,
    loginService: LoginService
}

class ListsScreen extends React.Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            lists: []
        }
    }

    async componentDidMount() {
        this.loadLists();
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

        let user: User = await this.props.loginService.getUser();

        let subscription = this.props.listService.getLists(user, (snapshot) => {
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
        this.state.listsSubscription = subscription;
    }

    unsubscribeLists() {
        if(this.state.listsSubscription) {
            this.state.listsSubscription();
            this.state.listsSubscription = null;
        }
    }

    onAddList() {
        console.info('Add list');

        this.props.navigation.push('AddList');
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
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        <List>
                            { this.state.lists.map(list => (
                                    <ListItem key={list.id}>
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