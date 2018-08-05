import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import ListContext, { ListService, List, ProductItem } from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, Form, Right, Item } from 'native-base';
import LoginContext, { LoginService, User } from '../../login/LoginContext';

import { Input } from 'react-native-elements'

type Props = {
    listService: ListService,
    loginService: LoginService
}

class ShareListScreen extends React.Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            user: this.props.loginService.user,
            list: this.props.navigation.getParam('list')
        }
    }

    async componentDidMount() {
        // setTimeout(() => {
        //     this.itemNameInput.focus();
        // }, 200);
    }

    componentDidUpdate(prevProps, prevState) {
        // Previous SomeContext value is prevProps.someValue
        // New SomeContext value is this.props.someValue
    }

    async save() {
        await this.props.listService.shareList(this.state.user, this.state.list.id, this.state.emailToAdd);
    }


    navigateBack() {
        this.props.navigation.pop()
    }

    render() {
        const { } = this.props;
        
        const list = this.state.list;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={ () => this.navigateBack() }>
                            <Icon name='arrow-left' type="MaterialCommunityIcons" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Share { list.name }</Title>
                    </Body>
                    <Right>
                        <Button transparent light onPress={ () => this.save() }>
                            <Text><Icon name='check' type="MaterialCommunityIcons" />Save</Text>
                        </Button>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    <Content>
                        <Input 
                            ref={ input => this.emailToAddInput = input }
                            value={ this.state.emailToAdd } 
                            onChangeText={(emailToAdd) => this.setState({ emailToAdd })}
                            placeholder="Enter someone's email" />
                    </Content>
                </View>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    
});

let ShareListScreenWithContext = props => (
    <LoginContext.Consumer>
        {loginService => (
            <ListContext.Consumer>
                {listService => (
                    <ShareListScreen { ...props } 
                        loginService={ loginService }
                        listService={ listService } 
                    ></ShareListScreen>
                ) }
            </ListContext.Consumer>
        ) }
    </LoginContext.Consumer>
);

export default ShareListScreenWithContext;