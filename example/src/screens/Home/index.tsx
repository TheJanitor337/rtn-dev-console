import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { type NavigationProp } from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NavigationProp<any, any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="SSH Login"
          onPress={() => navigation.navigate('SSHLogin')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="About" onPress={() => navigation.navigate('About')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

export default HomeScreen;
