import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ListContext from './ListContext';

class AddListScreen extends React.Component {

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

let AddListScreenWithContext = props => (
    <ListContext.Consumer>
        {listService => (
            <AddListScreen { ...props } listService={ listService } ></AddListScreen>
        ) }
    </ListContext.Consumer>
);

export default AddListScreenWithContext;