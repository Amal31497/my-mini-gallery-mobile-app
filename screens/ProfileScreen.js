import React, {useEffect, useState, useLayoutEffect} from "react";
import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Entypo, AntDesign, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { useArtContext } from '../utils/GlobalState';
import { getArtist, getAllArt } from "../utils/API";
import Moment from 'react-moment';

// import ArtInfoTabView from "./HomeBottomConsoleTabViews/ArtInfoTabView";
// import CommentTabView from "./HomeBottomConsoleTabViews/CommentTabView";
// import MoreTabView from "./HomeBottomConsoleTabViews/MoreTabView";
// import ReportTabView from "./HomeBottomConsoleTabViews/ReportTabView";

const ProfileScreen = ({navigation}) => {
    const [state, dispatch] = useArtContext();
    const [artist, setArtist] = useState();
    const [galleryState, setGalleryState] = useState("gallery");
    const [images, setImages] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {

        if (state.user.length > 0) {
            getArtist(state.user)
                .then(response => {
                    setArtist(response.data)
                })
                .catch(error => alert("Something went wrong!"))
        }

        setTimeout(() => {
            if (artist) {
                getAllArt()
                    .then(res => {
                        let profileArt = [];
                        let profileFavorites = [];
                        if (res) {
                            res.data.forEach((art) => {
                                if (artist.art.includes(art._id)) {
                                    profileArt.push({
                                        key: art._id,
                                        id: art._id,
                                        title: art.title,
                                        description: art.description,
                                        comments: art.comments,
                                        genre: art.genre,
                                        user: art.user,
                                        src: art.src,
                                        height: art.height,
                                        width: art.width,
                                        heightRatio: art.heightRatio,
                                        widthRatio: art.widthRatio
                                    });
                                }

                                if (artist.favorites.includes(art._id)) {
                                    profileFavorites.push({
                                        key: art._id,
                                        id: art._id,
                                        title: art.title,
                                        description: art.description,
                                        comments: art.comments,
                                        genre: art.genre,
                                        user: art.user,
                                        src: art.src,
                                        height: art.height,
                                        width: art.width,
                                        heightRatio: art.heightRatio,
                                        widthRatio: art.widthRatio
                                    });
                                }
                            });
                            setImages(profileArt);
                            setFavorites(profileFavorites);
                        }
                    })
                    .catch((error) => alert("Something went wrong!"));
            }
        }, 1000)

        

    }, [images, favorites, artist])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: "rgb(53,58,63)" },
            headerTitleStyle: { color: "white" },
            headerRight: () => {
                return (
                    <View>
                        <AntDesign name="logout" size={24} color="white" style={{marginRight:20}} />
                    </View>
                )
            },
            headerLeft: () => {
                return (
                    <View>
                        <Entypo name="menu" size={32} color="white" style={{ marginLeft: 30 }} />
                    </View>
                )
            }
        })
    },[navigation])

    const checkoutHome = (event) => {
        event.preventDefault();

        navigation.replace("Home")
    }

    return(
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.avatarWrapper}>
                    {artist && artist.avatar ?
                        <Image source={{ uri: artist.avatar.avatarSrc }} style={styles.Avatar} />
                        :
                        <Image source={{ uri: "../assets/artist.jpg" }} style={styles.Avatar} />
                    }
                </View>
                <View style={styles.artistTextInfoWrapper}>
                    {state.user.length > 0 ?
                        <View style={{flexDirection:"row", alignSelf:"center"}}>
                            <Button title="Update" buttonStyle={{ backgroundColor: "transparent", marginBottom: 10 }} titleStyle={{ color: "#007FFF" }} onPress={() => {navigation.navigate("Update Profile")}} />
                            <Button title="Delete" buttonStyle={{ backgroundColor: "transparent", marginBottom: 10 }} titleStyle={{ color: "#ff6961" }} />
                        </View>
                        :
                        <View>
                            <Button title="Log In" />
                            <Text>{" "} to update</Text>
                        </View>
                    }
                    {artist ? <Text style={styles.artistTextInfo}>{artist.firstName}</Text> : null}
                    {artist ? <Text style={styles.artistTextInfo}>{artist.username}</Text> : null}
                    {artist ? <Text style={styles.artistTextInfo}>
                        User since <Moment element={Text} format="MMMM-DD/YYYY">{artist.date}</Moment>
                    </Text> : null}
                </View>
                <View style={styles.artistDescriptionTextWrapper}>
                    {artist ? <Text style={styles.artistDescriptionText}>
                        {artist.description}
                    </Text> : null}
                </View>

                <View style={styles.artistButtonGroup}>
                    <Button 
                        title="Your Gallery" 
                        type="outline" 
                        onPress={() => setGalleryState("gallery")}
                        buttonStyle={{borderColor:"black"}}
                        titleStyle={galleryState === "gallery" ? styles.selectedGalleryButtonTitle : styles.unSelectedGalleryButtonTitle}
                    />
                    <Button 
                        title="Your Favorites" 
                        type="outline" 
                        onPress={() => setGalleryState("favorites")}
                        titleStyle={galleryState === "favorites" ? styles.selectedGalleryButtonTitle : styles.unSelectedGalleryButtonTitle} 
                        buttonStyle={{ borderColor: "black" }}
                    />
                </View>

                <View style={styles.imageWrapper}>
                    {galleryState === "gallery" ?
                        images.map(image => {
                            return (
                                <View key={image.key}>
                                    <Image source={{ uri: image.src }} style={{ height: 100, width: 100, margin: 5 }} />
                                </View>
                            )
                        })
                        :
                        favorites.map(image => {
                            return (
                                <View key={image._id}>
                                    <Image source={{ uri: image.src }} style={{ height: 100, width: 100, margin: 5 }} />
                                </View>
                            )
                        })
                    }
                </View>
                
            </ScrollView>

            <View style={styles.footer}>
                <Entypo name="home" size={30} color="white" onPress={checkoutHome} />
                <Ionicons name="add-circle-outline" size={30} color="white" />
                <Ionicons name="person" size={30} color="white" />
            </View>
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"black"
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: 48,
        paddingTop: 5,
        marginBottom:30,
        borderTopColor: "white",
        borderTopWidth: 0.17
    },

    avatarWrapper:{
        marginTop: 40,
        marginLeft:"auto",
        marginRight:"auto"
    },

    Avatar:{
        width:200,
        height:200
    },

    artistTextInfoWrapper:{
        flex:1,
        alignSelf:"center",
        marginTop:20,
        marginBottom:20
    },

    artistTextInfo:{
        color:"white",
        alignSelf:"center",
        marginBottom:5,
        fontWeight:"600"
    },

    artistDescriptionText:{
        color:"white",
        paddingLeft:15,
        paddingRight:15
    },

    artistButtonGroup:{
        flexDirection:"row",
        marginTop:30,
        justifyContent:"space-evenly"
    },

    selectedGalleryButtonTitle:{
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor: "white",
        color:"black",
        fontWeight:"800"
    },

    unSelectedGalleryButtonTitle:{
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "black",
        color: "white",
        fontWeight: "800"
    },

    imageWrapper: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        width: 330,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom:30
    }

})