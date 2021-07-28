import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, Modal, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useArtContext } from '../utils/GlobalState';
import { getArtist,  } from "../utils/API";
import { ScrollView } from "react-native-gesture-handler";

const UpdateProfileScreen = ({navigation}) => {
    const [state,dispatch] = useArtContext();
    const [artist, setArtist] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Profile"
        })
    },[navigation])

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <View style={styles.avatarWrapper}>
                    {state.userInfo.avatar ?
                        <Image source={{ uri: state.userInfo.avatar.avatarSrc }} style={styles.Avatar} />
                        :
                        <Image source={{ uri: "../assets/artist.jpg" }} style={styles.Avatar} />
                    }
                </View>

                <View style={styles.artistTextInfoWrapper}>
                    {state.userInfo ? <Input label="full name" style={styles.artistTextInfo} defaultValue={state.userInfo.firstName} /> : null}
                    {state.userInfo ? <Input label="username" style={styles.artistTextInfo} defaultValue={state.userInfo.username} /> : null}
                </View>

                <View style={styles.artistDescriptionTextWrapper}>
                    {state.userInfo ? <Input label="description" style={styles.artistDescriptionText} defaultValue={state.userInfo.description} /> : null}

                    {state.userInfo ? <Button title="Update" raised /> : null}
                </View>
            </KeyboardAvoidingView>

            <View style={{ height: 240 }} />
        </ScrollView>
    )
}

export default UpdateProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },

    avatarWrapper: {
        marginTop: 40,
        marginLeft: "auto",
        marginRight: "auto"
    },

    Avatar: {
        width: 200,
        height: 200
    },

    artistTextInfoWrapper: {
        flex: 1,
        alignSelf: "center",
        width:"80%",
        marginTop: 20,
        marginBottom: 20
    },

    artistTextInfo: {
        color: "white",
        alignSelf: "center",
        fontWeight: "600"
    },

    artistDescriptionTextWrapper:{
        height:"60%",
        width:"80%",
        alignSelf: "center",
        flexWrap:"wrap"
    },  

    artistDescriptionText: {
        color: "white",
        marginTop:10,
        paddingLeft: 15,
        paddingRight: 15,
        height:140,
        borderColor:"grey",
        borderWidth:1
    }
})