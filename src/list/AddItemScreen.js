import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import ListContext, { ListService, List } from './ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, Form, Right, Item } from 'native-base';
import LoginContext, { LoginService, User } from '../login/LoginContext';

import { Input } from 'react-native-elements'

type Props = {
    listService: ListService,
    loginService: LoginService
}

class AddItemScreen extends React.Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            text: ''
        }
    }

    async componentDidMount() {
        setTimeout(() => {
            this.itemNameInput.focus();
        }, 500);
    }

    componentDidUpdate(prevProps, prevState) {
        // Previous SomeContext value is prevProps.someValue
        // New SomeContext value is this.props.someValue
    }

    async saveItem() {
        console.info('save the list');

        if(!this.state.itemName || this.state.itemName.length == 0) {
            return this.itemNameInput.shake();
        }

        // let user: User = await this.props.loginService.getUser();
        // let list: List = {
        //     author: user.id,
        //     name: this.state.itemName
        // }

        // await this.props.listService.addList(user, list);

        this.navigateBack();
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
                        <Title>Add Item to { list.name }</Title>
                    </Body>
                    <Right>
                        <Button transparent light onPress={ () => this.saveItem() }>
                            <Text><Icon name='check' type="MaterialCommunityIcons" />Save</Text>
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                    <Text>{this.state.itemName}</Text>
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