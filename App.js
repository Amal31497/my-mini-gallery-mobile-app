import React, { useEffect } from 'react';
import { StyleSheet, Text, View  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import UpdateProfileScreen from "./screens/UpdateProfileScreen";

import { ArtProvider, useArtContext } from "./utils/GlobalState";
import { authenticatedUser } from './utils/API';
import { LOGIN } from './utils/actions';



// Check if user is logged in or not
function WatchAuthenticatedUser() {
  // eslint-disable-next-line no-unused-vars
  const [state, dispatch] = useArtContext();
  console.log(state)
  useEffect(() => {
    authenticatedUser()
      .then(response => {
        if (response.data) {
          console.log(response.data)
          dispatch({
            type: LOGIN,
            user: response.data.user_id
          });
        }
      })
      .catch(err => console.error(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return <></>;
}


const Stack = createStackNavigator()

const globalScreenOptions = {
  headerStyle: { backgroundColor: 'rgb(53,58,63)' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white'
}

export default function App() {
  
  return (
    <ArtProvider>
      <NavigationContainer>
        <WatchAuthenticatedUser />
        <Stack.Navigator screenOptions={globalScreenOptions}>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Signup' component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Update Profile" component={UpdateProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ArtProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
