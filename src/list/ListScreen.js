// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListContext, { ShoppingList, ProductItem } from './ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, ListItem, List } from 'native-base';
import LoginContext, { User } from '../login/LoginContext';


type Props = {
    listService: ListService,
    loginService: LoginService
}

class ListScreen extends React.Component<Props> {

    itemsSubscription = null;

    constructor(props) {
        super(props);

        this.state = {
            items: []
        }
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
        this.unsubscribeItems();

        let list = this.props.navigation.getParam('list');
        let user: User = await this.props.loginService.getUser();

        let subscription = await this.props.listService.getItems(user, list.id, (snapshot) => {
            let items = [];
            snapshot.forEach(doc => {
                let item: ProductItem = { ...doc.data(), id: doc.id };
                console.info(JSON.stringify(item));
                items.push(item);
            });

            this.setState({
                items: items
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

        this.props.navigation.push('AddItem', { list: this.props.navigation.getParam('list') });
    }

    navigateBack() {
        this.props.navigation.popToTop()
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
                    <Body>
                        <Title>{ list.name }</Title>
                    </Body>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        <List>
                            { this.state.items.map(item => (
                                    <ListItem key={item.id} button={true} onPress={ () => {} } >
                                        <Text>{ item.name }</Text>
                                    </ListItem> 
                                ))
                            }
                        </List>
                    </Content>
                    <Fab
                        containerStyle={{ }}
                        style={{ backgroundColor: '#5067FF' }}
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

let ListScreenWithContext = props => (
    <LoginContext.Consumer>
        {loginService => (
            <ListContext.Consumer>
                {listService => (
                    <ListScreen { ...props } 
                        loginService={ loginService }
                        listService={ listService } 
                    ></ListScreen>
                ) }
            </ListContext.Consumer>
        ) }
    </LoginContext.Consumer>
);

export default ListScreenWithContext;