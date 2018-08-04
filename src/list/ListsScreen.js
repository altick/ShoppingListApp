import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListContext from './ListContext';
import { Container, Header, Content, Button, Body, Title, Icon, Left, Fab } from 'native-base';
import LoginContext from '../login/LoginContext';

class ListsScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        
    }
    
    componentDidUpdate(prevProps, prevState) {
        // Previous SomeContext value is prevProps.someValue
        // New SomeContext value is this.props.someValue
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
                        <Text>Hello world!</Text>
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