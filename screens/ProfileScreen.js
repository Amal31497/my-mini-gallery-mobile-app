import React, {useEffect, useState, useLayoutEffect} from "react";
import { StyleSheet, Text, View, Image, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Entypo, AntDesign, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { useArtContext } from '../utils/GlobalState';
import Moment from 'react-moment';

// import ArtInfoTabView from "./HomeBottomConsoleTabViews/ArtInfoTabView";
// import CommentTabView from "./HomeBottomConsoleTabViews/CommentTabView";
// import MoreTabView from "./HomeBottomConsoleTabViews/MoreTabView";
// import ReportTabView from "./HomeBottomConsoleTabViews/ReportTabView";

const ProfileScreen = ({navigation}) => {
    const [state, dispatch] = useArtContext();
    const [galleryState, setGalleryState] = useState("gallery");
    const [images, setImages] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [leftSideModal, setLeftSideModal] = useState(false);

    useEffect(() => {
        if (state.userInfo) {
            let profileArt = [];
            let profileFavorites = [];

            state.allArt.forEach(art => {

                if (state.userInfo.art.includes(art._id)) {
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

                if (state.userInfo.favorites.includes(art._id)) {
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

            })
            setImages(profileArt);
            setFavorites(profileFavorites);
        }

    },[state.userInfo])

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
                        {leftSideModal === true ?
                            <AntDesign onPress={() => setLeftSideModal(false)} name="close" size={32} color="white" style={{ marginLeft: 30 }} />
                            :
                            <Entypo onPress={() => setLeftSideModal(true)} name="menu" size={32} color="white" style={{ marginLeft: 30 }} />
                        }
                    </View>
                )
            }
        })
    },[navigation, leftSideModal])

    const checkoutHome = (event) => {
        event.preventDefault();
        setLeftSideModal(false);
        navigation.replace("Home")
    }

    const checkoutUploadArt = (event) => {
        event.preventDefault();
        setLeftSideModal(false);
        navigation.replace("Upload Art")
    }

    return(
        <View style={styles.container}>
            <ScrollView>

                <View style={styles.avatarWrapper}>
                    {state.userInfo.avatar ?
                        <Image source={{ uri: state.userInfo.avatar.avatarSrc }} style={styles.Avatar} />
                        :
                        <Image source={{ uri: "../assets/artist.jpg" }} style={styles.Avatar} />
                    }
                </View>
                <View style={styles.artistTextInfoWrapper}>
                    {state.user.user_id.length > 0 ?
                        <View style={{flexDirection:"row", alignSelf:"center"}}>
                            <Button title="Update" buttonStyle={{ backgroundColor: "transparent", marginBottom: 10 }} titleStyle={{ color: "#007FFF" }} onPress={() => {navigation.navigate("Update Profile")}} />
                            <Button title="Delete" buttonStyle={{ backgroundColor: "transparent", marginBottom: 10 }} titleStyle={{ color: "#ff6961" }} />
                        </View>
                        :
                        <View>
                            <Button title="Log In to Update" />
                        </View>
                    }
                    {state.userInfo ? <Text style={styles.artistTextInfo}>{state.userInfo.firstName}</Text> : null}
                    {state.userInfo ? <Text style={styles.artistTextInfo}>{state.userInfo.username}</Text> : null}
                    {state.userInfo ? <Text style={styles.artistTextInfo}>
                        User since <Moment element={Text} format="MMMM-DD/YYYY">{state.userInfo.date}</Moment>
                    </Text> : null}
                </View>
                <View style={styles.artistDescriptionTextWrapper}>
                    {state.userInfo ? <Text style={styles.artistDescriptionText}>
                        {state.userInfo.description}
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
                    {
                        galleryState === "gallery" && images.map(image => {
                            return (
                                <View key={image.key}>
                                    <Image source={{ uri: image.src }} style={{ height: 100, width: 100, margin: 5 }} />
                                </View>
                            )
                        })
                    }
                    {
                        galleryState === "favorites" && favorites.map(image => {
                            return (
                                <View key={image.key}>
                                    <Image source={{ uri: image.src }} style={{ height: 100, width: 100, margin: 5 }} />
                                </View>
                            )
                        })
                    }
                </View>
                {/* Left side modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={leftSideModal}
                >
                    <TouchableWithoutFeedback onPress={() => setLeftSideModal(false)}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>

                    <View style={styles.leftModalWrapper}>
                        <Text style={{ color: "white", fontSize: 21, marginTop: 30 }}>Welcome {state.userInfo.username}</Text>
                        <Button onPress={checkoutHome} icon={<Entypo name="home" size={36} color="black" />} buttonStyle={{ backgrounColor: "transparent", marginTop: 20, height: 60, width: 60, borderRadius: "50%" }} />
                        <Button onPress={checkoutUploadArt} icon={<AntDesign name="clouduploado" size={36} color="black" />} buttonStyle={{ backgrounColor: "transparent", marginTop: 20, height: 60, width: 60, borderRadius: "50%" }} />
                    </View>
                </Modal>
            </ScrollView>


            <View style={styles.footer}>
                <Entypo name="home" size={30} color="white" onPress={checkoutHome} />
                <Ionicons name="add-circle-outline" size={30} color="white" onPress={checkoutUploadArt}/>
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
    },

    leftModalWrapper: {
        backgroundColor: "rgb(52,58,63)", height: "79.5%", width: "35%", marginRight: 20, marginTop: 89, alignItems: "center", alignSelf: "flex-start"
    },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }

})