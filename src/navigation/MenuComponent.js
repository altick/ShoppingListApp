// @flow

import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, List, ListItem, Container, Image, Left, Icon, Content, H1 } from 'native-base';
import commonColor from '../../native-base-theme/variables/commonColor';

export default class MenuComponent extends React.Component {

  navigate(route: string) {
    this.props.navigation.navigate(route);
    this.props.navigation.closeDrawer();
  }

  renderMenuItem(title: string, icon: any, route: string) {
    return (
      <ListItem
        button
        noBorder
        onPress={() => this.navigate(route) }
      >
        <Left>
          <Icon
            active
            { ...icon }
            style={{ color: "#777", fontSize: 26, width: 30 }}
          />
          <Text style={styles.text}>
            {title}
          </Text>
        </Left>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <View style={ styles.header } >
            <H1 style={ styles.headerTitle }>Shopping list for us</H1>
          </View>
          <List>
             { this.renderMenuItem('My Shopping Lists', { name: 'shopping', type: 'MaterialCommunityIcons' }, 'Lists') }
          </List>
        </Content>
      </Container>
    );
  }

}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
      height: 56,
      padding: 12,
      backgroundColor: commonColor.brandPrimary
    },
    headerTitle: {
      color: 'white'
    },
    text: {
      
    }
});