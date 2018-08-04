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

class AddListScreen extends React.Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            text: ''
        }
    }

    async componentDidMount() {
        setTimeout(() => {
            this.listNameInput.focus();
        }, 500);
    }

    componentDidUpdate(prevProps, prevState) {
        // Previous SomeContext value is prevProps.someValue
        // New SomeContext value is this.props.someValue
    }

    async saveList() {
        console.info('save the list');

        if(!this.state.listName || this.state.listName.length == 0) {
            return this.listNameInput.shake();
        }

        let user: User = await this.props.loginService.getUser();
        let list: List = {
            author: user.id,
            name: this.state.listName
        }

        await this.props.listService.addList(user, list);

        this.navigateBack();
    }

    navigateBack() {
        this.props.navigation.pop()
    }

    render() {
        const { text } = this.props;
        
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={ () => this.navigateBack() }>
                            <Icon name='arrow-left' type="MaterialCommunityIcons" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Add Shopping List</Title>
                    </Body>
                    <Right>
                        <Button transparent light onPress={ () => this.saveList() }>
                            <Text><Icon name='check' type="MaterialCommunityIcons" />Save</Text>
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        <Input 
                            ref={ input => this.listNameInput = input }
                            value={ this.state.listName } 
                            onChangeText={(listName) => this.setState({ listName })}
                            placeholder="Name of the shopping list" />
                    </Content>
                </View>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    
});

let AddListScreenWithContext = props => (
    <LoginContext.Consumer>
        {loginService => (
            <ListContext.Consumer>
                {listService => (
                    <AddListScreen { ...props } 
                        loginService={ loginService }
                        listService={ listService } 
                    ></AddListScreen>
                ) }
            </ListContext.Consumer>
        ) }
    </LoginContext.Consumer>
);

export default AddListScreenWithContext;