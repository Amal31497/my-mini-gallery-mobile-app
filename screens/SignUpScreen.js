import React, { useLayoutEffect, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Image } from 'react-native-elements';
const SignUpScreen = ({ navigation }) => {

    const userNameRef = useRef();
    const firstNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle:"Login"
        })
    },[navigation])

    return(
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.inputContainer}>
                <View style={styles.inputContainer}>
                    <Text h4 style={{color:"white", marginBottom:30}}>Welcome To Your Online Art Community!</Text>
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="username"
                        autoFocus type="text"
                        ref={userNameRef}
                    />
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="full name"
                        ref={firstNameRef}
                    />
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="email"
                        ref={emailRef}
                    />
                    <Input
                        style={styles.inputContainerElement}
                        placeholder="password"
                        secureTextEntry type="password"
                        ref={passwordRef}
                    />
                    <Button title="Signup" style={styles.button} />
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