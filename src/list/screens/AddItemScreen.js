import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import ListContext, { ListService, List, ProductItem } from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, Form, Right, Item } from 'native-base';
import LoginContext, { LoginService, User } from '../../login/LoginContext';

import { Input } from 'react-native-elements'

type Props = {
    listService: ListService,
    loginService: LoginService
}

class AddItemScreen extends React.Component<Props> {

    constructor(props) {
        super(props);

        const item = this.props.navigation.getParam('item');
        const mode = item != null
            ? 'edit'
            : 'add';

        this.state = {
            mode,
            item,
            list: this.props.navigation.getParam('list'),
            itemName: item ? item.name : ''
        }
    }

    async componentDidMount() {
        setTimeout(() => {
            this.itemNameInput.focus();
        }, 200);
    }

    componentDidUpdate(prevProps, prevState) {
        // Previous SomeContext value is prevProps.someValue
        // New SomeContext value is this.props.someValue
    }

    async saveItem() {
        const { mode, item, itemName } = this.state;
        console.info('save the list');

        if(!itemName || itemName.length == 0) {
            return this.itemNameInput.shake();
        }

        console.info(JSON.stringify(item));


        switch(mode) {
            case 'add':
                let list = this.props.navigation.getParam('list');
                let user: User = this.props.loginService.user;
                let newItem: ProductItem = {
                    author: user.id,
                    name: itemName
                }
        
                await this.props.listService.addItem(user, list, newItem);
                break;
            case 'edit':
                await this.props.listService.updateItem(item.id, { 
                    name: itemName
                });
                break;
        }

        this.navigateBack();
    }

    navigateBack() {
        this.props.navigation.pop()
    }

    render() {
        const { navigation } = this.props;
        const { mode, list, item } = this.state;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={ () => this.navigateBack() }>
                            <Icon name='arrow-left' type="MaterialCommunityIcons" />
                        </Button>
                    </Left>
                    <Body>
                        { mode == 'edit' 
                            ? <Title>Edit '{ item.name }'</Title>
                            : <Title>Add Item to '{ list.name }'</Title>
                        }
                    </Body>
                    <Right>
                        <Button transparent onPress={ () => this.saveItem() }>
                            <Text style={  Platform.OS == 'android' ? { color: 'white' } : {}  }>Save</Text><Icon name='check' type="MaterialCommunityIcons" />
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        <Input 
                            ref={ input => this.itemNameInput = input }
                            value={ this.state.itemName } 
                            onChangeText={(itemName) => this.setState({ itemName })}
                            placeholder="What to buy?" />
                    </Content>
                </View>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    
});

let AddItemScreenWithContext = props => (
    <LoginContext.Consumer>
        {loginService => (
            <ListContext.Consumer>
                {listService => (
                    <AddItemScreen { ...props } 
                        loginService={ loginService }
                        listService={ listService } 
                    ></AddItemScreen>
                ) }
            </ListContext.Consumer>
        ) }
    </LoginContext.Consumer>
);

export default AddItemScreenWithContext;