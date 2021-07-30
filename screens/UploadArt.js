import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Image, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Entypo, AntDesign, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";

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
    const [title, setTitle] = useState();
    const [tags, setTags] = useState();
    const [description, setDescription] = useState();

    const [selectGenreModal, setSelectGenreModal] = useState(false);

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

    return (
        <View style={styles.container}>
            <Button 
                icon={<AntDesign name="clouduploado" size={130} color="white" />}
                buttonStyle={{backgroundColor:"transparent", height:250}}
            />
            <Input
                value={title}
                onChangeText={(text) => setTitle(text)}
                label="Art title"
                style={styles.imageUploadInputInfo}
            /> 
            <Input
                value={tags}
                onChangeText={(text) => setTags(text)}
                label="Tags"
                style={styles.imageUploadInputInfo}
            /> 
            <Input
                value={description}
                onChangeText={(text) => setDescription(text)}
                label="Description"
                style={styles.imageUploadInputInfo}
            /> 

            <Button title="Select Genre" onPress={() => setSelectGenreModal(true)} />


            <Modal
                animationType="slide"
                transparent={true}
                visible={selectGenreModal}
            >

                <TouchableWithoutFeedback onPress={() => setSelectGenreModal(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={styles.genreModal}>
                    <ScrollView>
                        <View style={styles.imageWrapper}>
                            {genres.map(genre => {
                                return(
                                    <Image style={styles.image} source={{ uri: genre.image }} />
                                )
                                
                            })}
                        </View>
                        
                        {/* <Button onPress={() => setSelectGenreModal(false)} title="Close" style={{ justifyContent: "center", alignItems: "center", marginTop: 300 }} /> */}
                    </ScrollView>
                </View>
                
            </Modal>

            <View style={styles.footer}>
                <Entypo name="home" size={30} color="white" onPress={checkoutHome} />
                <Ionicons name="add-circle-outline" size={30} color="white" />
                <Ionicons name="person" size={30} color="white" onPress={checkoutProfile} />
            </View>
        </View>
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
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        width: 330,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 50
    },

    image: {
        height: 150,
        width: 150,
        margin: 5
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: 48,
        padding: 5,
        borderTopColor: "white",
        borderTopWidth: 0.17
    }

})