import React, { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image } from 'react-native-elements';
import { signup } from '../utils/API';
import { useArtContext } from '../utils/GlobalState';
import { LOGIN } from '../utils/actions';
import axios from 'axios';

const SignUpScreen = ({ navigation }) => {

    const [state,dispatch] = useArtContext();
    const [signUpSuccess, setSignUpSuccess] = useState();
    const [username, setUserName] = useState("");
    const [firstname, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle:"Login"
        })
    },[navigation])


    const handleSignup = (event) => {
        event.preventDefault();
        axios.post('https://my-mini-gallery.herokuapp.com/api/user/', {
            username: username,
            firstName: firstname,
            email: email,
            password: password,
            date: Date.now()
        })
            .then(response => {
                dispatch({
                    type: LOGIN,
                    user: response.data.user.user_id
                });
                alert("Sign up successful!")
                navigation.replace("Home")
            })
            .catch(error => alert(error))
    }
    // console.log(state)
    return(
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.inputContainer}>
                <View style={styles.inputContainer}>
                    <Text h4 style={{color:"white", marginBottom:10}}>Welcome To Your Online Art Community!</Text>
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="username"
                        autoFocus type="text"
                        value={username}
                        onChangeText={(text) => setUserName(text)}
                    />
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="full name"
                        value={firstname}
                        onChangeText={(text) => setFirstName(text)}
                    />
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="password"
                        secureTextEntry type="password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <Button title="Signup" style={styles.button} onPress={handleSignup} />
                </View>
            </View>
            <View style={{height:80}} />
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "black"
    },

    inputContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300
    },

    inputContainerElement: {
        color: "white"
    },

    button: {
        width: 280,
        marginTop: 10
    }
})