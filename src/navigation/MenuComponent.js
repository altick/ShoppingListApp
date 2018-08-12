import { DrawerItems, SafeAreaView } from 'react-navigation';
import { StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { Text } from 'native-base';

const MenuComponent = (props) => (
    <ScrollView>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <Text>Menu</Text>
        <DrawerItems {...props} />
      </SafeAreaView>
    </ScrollView>
  );
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MenuComponent;