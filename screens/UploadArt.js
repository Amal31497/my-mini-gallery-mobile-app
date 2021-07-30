import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Button, Input, ImageBackground } from 'react-native-elements';
import { Entypo, AntDesign, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { useArtContext } from '../utils/GlobalState';
import { UPDATE_ALL_ART } from "../utils/actions";
import { createArt, addNewArtToUser } from "../utils/API";
import uuid from "react-uuid";
import * as ImagePicker from 'expo-image-picker';
import { RNS3 } from 'react-native-s3-upload';
import axios from "axios";


import threeD from '../assets/genres/3d.jpg';
import AnimeManga from '../assets/genres/AnimeManga.jpg';
import crafts from '../assets/genres/crafts.jpg';
import comics from '../assets/genres/comics.jpg';
import customization from '../assets/genres/customization.jpg';
import cosplay from '../assets/genres/cosplay.jpg';
import digital from '../assets/genres/digital.jpg';
import fantasy from '../assets/genres/fantasy.jpg';
import fanart from '../assets/genres/fanart.jpg';
import photoManipulation from '../assets/genres/photomanipulation.jpg';
import photography from '../assets/genres/photography.jpg';
import traditional from '../assets/genres/traditional.jpg';



const UploadArt = ({ navigation }) => {
    const [state, dispatch] = useArtContext();
    const [config, setConfig] = useState({});

    const [title, setTitle] = useState();
    const [tags, setTags] = useState();
    const [description, setDescription] = useState();
    const [genreInput, setGenreInput] = useState();

    const [readyImage, setReadyImage] = useState("");
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [widthRatio, setWidthRatio] = useState();
    const [heightRatio, setHeightRatio] = useState();

    const [imageLoading, setImageLoading] = useState(false);

    const genres = [
        {
            title: "3D",
            image: threeD
        },
        {
            title: "Anime and Manga",
            image: AnimeManga
        },
        {
            title: "Artisan Craft",
            image: crafts
        },
        {
            title: "Comic",
            imagfe: comics
        },
        {
            title: "Digital Art",
            image: digital
        },
        {
            title: "Traditional Art",
            image: traditional
        },
        {
            title: "Customization",
            image: customization
        },
        {
            title: "Cosplay",
            image: cosplay
        },
        {
            title: "Fantasy",
            image: fantasy
        },
        {
            title: "Fan Art",
            image: fanart
        },
        {
            title: "Photo Manipulation",
            image: photoManipulation
        },
        {
            title: "Photography",
            image: photography
        }
    ]

    const checkoutProfile = (event) => {
        event.preventDefault();

        navigation.replace("Profile")
    }

    const checkoutHome = (event) => {
        event.preventDefault();

        navigation.replace("Home")
    }

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


    const pickImage = () => {

        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
            .then(result => {
                setImageLoading(true);
                setWidth(result.width)
                setHeight(result.height)
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

        const art = {
            src: readyImage,
            title: title,
            description: description,
            tags: tags.split(","),
            genre: genreInput,
            width: width,
            height: height,
            widthRatio: widthRatio,
            heightRatio: heightRatio,
            date: Date.now(),
            user: state.user.user_id,
            userInfo: {
                username:state.userInfo.username,
                firstName:state.userInfo.firstName,
                avatar: state.userInfo.avatar||null,
            }
        }

        if (readyImage) {
            createArt(art)
                .then(response => {
                    if (state.user.user_id) {
                        addNewArtToUser(state.user.user_id, { _id: response.data._id })
                            .then(response => {
                                navigation.replace("Home")
                            })
                            .catch(error => console.log(error))
                    }
                })
                .catch(error => console.log(error))
        }

    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView>

                {imageLoading === true ?
                    <ActivityIndicator size="large" color="white" style={styles.activityIndicator} />
                    :
                    readyImage.length > 0 ?
                        <>
                            <Image style={{ height: 250, width: 250, marginLeft: "auto", marginRight: "auto" }} source={{ uri: readyImage }} />
                            <Text style={{ color: "white", marginLeft: "auto", marginRight: "auto" }}>{width} x {height}</Text>
                        </>
                        :
                        <Button
                            icon={<AntDesign name="clouduploado" size={130} color="white" />}
                            buttonStyle={{ backgroundColor: "transparent", height: 250 }}
                            onPress={pickImage}
                        />
                }
                
                <Input
                    style={styles.inputField}
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    label="Art title"
                />
                <Input
                    style={styles.inputField}
                    value={tags}
                    onChangeText={(text) => setTags(text)}
                    label="Tags"
                />
                <Input
                    style={styles.inputField}
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    label="Description"
                />

                <Text style={{ color: "grey", alignSelf: "center", marginBottom: 20, fontSize: 18 }}>Select Genre</Text>
                <ScrollView style={styles.imageWrapper} horizontal={true}>
                    {genres.map(genre => {
                        return (
                            <Button 
                                key={genre.title} 
                                title={genre.title} 
                                buttonStyle={genre.title === genreInput ? styles.genreButtonSelected : styles.genreButton} 
                                titleStyle={genre.title === genreInput ? styles.genreButtonTitleSelected : styles.genreButtonTitleStyle}  
                                onPress={() => setGenreInput(genre.title)}
                            />
                        )
                    })}
                </ScrollView>

                <Button onPress={handleFormSubmit} title="Submit Art" buttonStyle={{width:"80%", marginLeft:"auto", marginRight:"auto"}} />

                <View style={{height:200}} />
            </ScrollView>
            <View style={styles.footer}>
                <Entypo name="home" size={30} color="white" onPress={checkoutHome} />
                <Ionicons name="add-circle-outline" size={30} color="white" />
                <Ionicons name="person" size={30} color="white" onPress={checkoutProfile} />
            </View>
        </KeyboardAvoidingView>
    )
}

export default UploadArt;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },

    genreModal:{
        backgroundColor: "black", height: "65%", marginTop: "auto"
    },

    modalOverlay:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    imageWrapper: {
        height: 80,
        width: "94%",
        marginLeft: "auto",
        marginRight: "auto",
    },

    genreButton: {
        backgroundColor: "white",
        borderColor: "black",
        borderRadius: 8,
        borderWidth: 2,
        marginLeft: 9
    },

    genreButtonSelected: {
        backgroundColor: "black",
        borderColor: "white",
        borderRadius: 8,
        borderWidth: 2,
        marginLeft: 9
    },

    genreButtonTitleSelected: {
        color: "white",
        fontSize: 14,
        fontWeight: "800"
    },

    genreButtonTitleStyle: {
        color: "black",
        fontSize: 14,
        fontWeight: "800"
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: 82,
        padding: 5,
        borderTopColor: "white",
        borderTopWidth: 0.17
    },

    inputField:{
        color:"white"
    }
})