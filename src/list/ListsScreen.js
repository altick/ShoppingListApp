import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListContext from './ListContext';

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

    render() {
        const {  } = this.props;
        
        return (
            <View>
                <Text>Hello</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    
});

let ListsScreenWithContext = props => (
    <ListContext.Consumer>
        {listService => (
            <ListsScreen { ...props } listService={ listService } ></ListsScreen>
        ) }
    </ListContext.Consumer>
);

export default ListsScreenWithContext;