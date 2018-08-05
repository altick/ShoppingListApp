// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListContext, { ShoppingList, ProductItem } from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, ListItem, List, CheckBox, Right } from 'native-base';
import LoginContext, { User } from '../../login/LoginContext';


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

        this.state = {
            items: [],
            user: this.props.loginService.user,
            list: this.props.navigation.getParam('list')
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

        let subscription = await this.props.listService.getItems(this.state.user, this.state.list, (snapshot) => {
            let items = [];
            snapshot.forEach(doc => {
                let item: ProductItem = { ...itemDefaults, ...doc.data(), id: doc.id };
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
                    <Right>
                        <Button transparent onPress={ () => this.onShareList() }>
                            <Icon name='share' type="Ionicons" />
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        <List>
                            { this.state.items.map(item => (
                                    <ListItem key={item.id} button={true} onPress={ () => this.onItemClick(item) } >
                                        <CheckBox checked={item.checked} onPress={ () => this.onItemClick(item) } />
                                        <Body>
                                            <Text>{ item.name }</Text>
                                        </Body>
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