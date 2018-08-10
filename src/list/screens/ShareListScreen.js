import React from 'react';
import { Platform, StyleSheet, Text, View, ListView } from 'react-native';
import ListContext, { ListService, ProductItem } from '../ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab, Form, Right, Item, List, ListItem } from 'native-base';
import LoginContext, { LoginService } from '../../login/LoginContext';

import type { User } from '../../login/LoginContext';

import { Input } from 'react-native-elements'
import { getUsernameFromEmail } from '../../utils/helpers';

type Props = {
    listService: ListService,
    loginService: LoginService
}

class ShareListScreen extends React.Component<Props> {

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        const list = this.props.navigation.getParam('list');

        this.state = {
            items: [],
            user: this.props.loginService.user,
            list: list,
            sharedWith: list.sharedWith 
                ? Object.keys(list.sharedWith).map(key => list.sharedWith[key])
                : []
        };
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
        await this.props.listService.shareList(this.state.user, this.state.list, this.state.emailToAdd);

        this.navigateBack();
    }


    navigateBack() {
        this.props.navigation.pop()
    }

    render() {        
        const { list, sharedWith } = this.state;

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
                        <Button transparent onPress={ () => this.save() }>
                            <Text style={  Platform.OS == 'android' ? { color: 'white' } : {}  }>Save</Text><Icon name='check' type="MaterialCommunityIcons" />
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
                        <Text>Shared with:</Text>
                        { sharedWith.map(user => (
                            <Text>{ getUsernameFromEmail(user.username) }</Text>
                        )) }
                        <List
                            dataSource={ this.ds.cloneWithRows(sharedWith) }
                            renderRow={ user => 
                                <ListItem icon key={ user.uid } style={ { paddingLeft: 10 } }>
                                    <Left>
                                        <Icon name="user" type="Entypo" style={ { color: commonColor.brandPrimary } } />
                                    </Left>
                                    <Body>
                                        <Text>{ getUsernameFromEmail(user.username) }</Text>
                                    </Body>
                                </ListItem>
                            }
                            disableLeftSwipe={true}
                            disableRightSwipe={true}
                        />
                        
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