import React from 'react';
import { StyleSheet, Text, View  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

const Stack = createStackNavigator()

const globalScreenOptions = {
  headerStyle: { backgroundColor: 'rgb(53,58,63)' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white'
}

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
