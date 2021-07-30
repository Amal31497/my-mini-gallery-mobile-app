import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, Modal, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useArtContext } from '../utils/GlobalState';
import { updateUser  } from "../utils/API";
import uuid from "react-uuid";
import * as ImagePicker from 'expo-image-picker';
import { RNS3 } from 'react-native-s3-upload';
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";


const UpdateProfileScreen = ({navigation}) => {
    const [state,dispatch] = useArtContext();

    const [config, setConfig] = useState({});

    const [readyImage, setReadyImage] = useState("");
    const [widthRatio, setWidthRatio] = useState();
    const [heightRatio, setHeightRatio] = useState();
    const [firstName, setFirstName] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [description, setDescription] = useState();

    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();

        axios.get('https://my-mini-gallery.herokuapp.com/getconfig')
            .then(response => {
                setConfig({
                    bucketName: "myminigallery",
                    region: "us-east-2",
                    accessKeyId: response.data.accessKey,
                    secretAccessKey: response.data.secretAccessKEY
                })
            })
            .catch(error => alert(error))
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Profile"
        })
    },[navigation])

    const pickImage = () => {

            ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            .then(result => {
                setImageLoading(true);
                if (result.width > result.height) {
                    setWidthRatio(result.width / result.height);
                    setHeightRatio(1);
                } else {
                    setHeightRatio(result.height / result.width);
                    setWidthRatio(1);
                }

                const file = {
                    uri: result.uri,
                    name: `phone-image-upload-${JSON.stringify(uuid())}`,
                    type: "image/png"
                }

                const options = {
                    bucket: config.bucketName,
                    region: config.region,
                    accessKey: config.accessKeyId,
                    secretKey: config.secretAccessKey,
                    successActionStatus: 201
                }

                RNS3.put(file, options)
                    .then(response => {
                        setReadyImage(response.body.postResponse.location);
                        setImageLoading(false);
                    })
                    .catch(error => alert(error))
            })
            .catch(error => alert(error))
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        updateUser(state.user.user_id, {
            firstName: firstName,
            username: username,
            email: email,
            description: description ? description : null,
            avatar: {
                avatarSrc: readyImage ? readyImage : state.userInfo.avatar.avatarSrc,
                avatarWidthRatio: widthRatio ? widthRatio : state.userInfo.avatar.avatarWidthRatio,
                avatarHeightRatio: heightRatio ? heightRatio : state.userInfo.avatar.avatarHeightRatio,
            }
        })
            .then(response => {
                alert("Your profile was successfuly updated!");
                navigation.goBack();
            })
            .catch((error) => {
                alert(error.errorMessage);
            });
    };

    return (
        <ScrollView style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <View style={styles.avatarWrapper}>
                    {imageLoading === true ?
                        <ActivityIndicator size="large" color="white" style={styles.activityIndicator} />
                        :
                        readyImage.length > 0 ?
                            <Image source={{ uri: readyImage }} style={styles.Avatar} />
                            :
                            state.userInfo.avatar ?
                                <Image source={{ uri: state.userInfo.avatar.avatarSrc }} style={styles.Avatar} />
                                :
                                <Image source={{ uri: "../assets/artist.jpg" }} style={styles.Avatar} />
                    }
                    <Button onPress={pickImage} title="Update Avatar" buttonStyle={{backgroundColor:"white", height:30, padding:0, borderColor:"black", borderWidth:2}} titleStyle={{color:"black", fontSize:15, fontWeight:"700"}} />
                </View>

                <View style={styles.artistTextInfoWrapper}>

                    {state.userInfo ? 
                        <Input 
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)} 
                            label="full name" 
                            style={styles.artistTextInfo} 
                            defaultValue={state.userInfo.firstName} 
                        /> 
                        : 
                    null}

                    {state.userInfo ? 
                        <Input 
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            label="username" 
                            style={styles.artistTextInfo} 
                            defaultValue={state.userInfo.username} 
                        /> 
                        : 
                    null}

                    {state.userInfo ? 
                        <Input 
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            label="email" 
                            style={styles.artistTextInfo} 
                            defaultValue={state.userInfo.email} 
                        /> 
                        : 
                    null}

                </View>

                <View style={styles.artistDescriptionTextWrapper}>

                    {state.userInfo ? 
                        <Input 
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                            label="description" 
                            style={styles.artistDescriptionText} 
                            defaultValue={state.userInfo.description} 
                        /> 
                        : 
                    null}

                    {state.userInfo ? <Button title="Update" onPress={handleFormSubmit} raised /> : null}
                </View>
            </KeyboardAvoidingView>

            <View style={{ height: 100 }} />
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
    },

    activityIndicator:{
        height:100
    }
})