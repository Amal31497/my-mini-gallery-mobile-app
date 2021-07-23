import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image } from 'react-native-elements';
import logo from '../assets/logo.png';
import { useArtContext } from '../utils/GlobalState';
import { LOGIN } from "../utils/actions";
import { login } from "../utils/API";
import AsyncStorage from '@react-native-async-storage/async-storage';

const  LoginScreen = ({ navigation }) => {

    const [state,dispatch] = useArtContext();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    console.log(state)

    useEffect(() => {
        if (state.user.length > 0) {
            navigation.replace("Home")
        }
    },[state.user])

    const handleLogIn = (event) => {
        event.preventDefault();
        login({
            username: username,
            password: password
        })
        .then(response => {
            if(response){
                console.log(response.data);
                dispatch({
                    type: LOGIN,
                    user: response.data.user.user_id
                })

                navigation.replace("Home")
            }
        })
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.inputContainer}>
                <Image style={styles.logo} source={logo} />
                <Input 
                    style={styles.inputContainerElement} 
                    placeholder="username" 
                    value={username}
                    onChangeText={(text) => setUserName(text)}
                />
                <Input 
                    style={styles.inputContainerElement} 
                    placeholder="password" 
                    secureTextEntry type="password" 
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <View style={styles.buttonGroup}>
                    <Button style={styles.button} title="Login" onPress={handleLogIn} />
                    <Button onPress={() => {navigation.navigate("Signup")}} style={styles.button} title="Register" type="outline" />
                </View>
            </View>
            <View style={{height:30}} />
        </KeyboardAvoidingView>
        
    );
}

export default LoginScreen;

const styles = StyleSheet.create({

    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor:"black"
    },

    inputContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width:300,
        marginBottom:40
    },

    inputContainerElement:{
        color:"white"
    },

    button: {
        width: 280,
        marginTop: 10
    },

    buttonGroup:{
        marginTop:10
    },

    logo:{
        width:75,
        height:75,
        marginBottom:50
    }
})