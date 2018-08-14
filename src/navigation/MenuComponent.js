// @flow

import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text, List, ListItem, Container, Image, Left, Icon, Content, H1 } from 'native-base';
import commonColor from '../../native-base-theme/variables/commonColor';
import LoginContext from '../login/LoginContext';

type Props = {
  navigation: any,
  loginService: LoginService
}

class MenuComponent extends React.Component<Props> {

  constructor(props) {
    super(props);
  }

  async onLogout() {
    await this.props.loginService.logoutUser();

    this.navigate('LoginStack');
}

  navigate(route: string) {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate(route);
  }

  renderMenuItem(title: string, icon: any, action: () => any) {
    return (
      <ListItem
        button
        noBorder
        onPress={ action }
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
             { this.renderMenuItem('My Shopping Lists', { name: 'shopping', type: 'MaterialCommunityIcons' }, () => this.navigate('Lists') ) }
             { this.renderMenuItem('Logout', { name: 'logout', type: 'MaterialCommunityIcons' }, () => this.onLogout() ) }
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

export default MenuComponentWithContext = (props: any) => (
  <LoginContext.Consumer>
    { loginService => (
        <MenuComponent { ...props } loginService={ loginService }></MenuComponent>
    ) }
  </LoginContext.Consumer>
);