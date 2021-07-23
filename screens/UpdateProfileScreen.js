import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useArtContext } from '../utils/GlobalState';
import { getArtist,  } from "../utils/API";

const UpdateProfileScreen = ({navigation}) => {
    const [state,dispatch] = useArtContext();
    const [artist, setArtist] = useState();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Profile"
        })
    },[navigation])

    useEffect(() => {
        getArtist(state.user)
            .then(response => {
                setArtist(response.data)
            })
            .catch(error => alert("Something went wrong!"))
    },[])

    return(
        <View style={styles.container}>

            <View style={styles.avatarWrapper}>
                {artist && artist.avatar ?
                    <Image source={{ uri: artist.avatar.avatarSrc }} style={styles.Avatar} />
                    :
                    <Image source={{ uri: "../assets/artist.jpg" }} style={styles.Avatar} />
                }
            </View>

            <View style={styles.artistTextInfoWrapper}>
                {artist ? <Input label="full name" style={styles.artistTextInfo} defaultValue={artist.firstName} /> : null}
                {artist ? <Input label="username" style={styles.artistTextInfo} defaultValue={artist.username} /> : null}
            </View>

            <View style={styles.artistDescriptionTextWrapper}>
                {artist ? <Input label="description" style={styles.artistDescriptionText}  defaultValue={artist.description} /> : null}
            
                <Button title="Update" raised />
            </View>
            
            

        </View>
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
        marginBottom: 5,
        fontWeight: "600"
    },

    artistDescriptionTextWrapper:{
        height:"40%",
        width:"80%",
        alignSelf: "center",
        flexWrap:"wrap"
    },  

    artistDescriptionText: {
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
        height:100,
        borderColor:"grey",
        borderWidth:2
    }
})